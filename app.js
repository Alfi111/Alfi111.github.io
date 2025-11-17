let tg = window.Telegram.WebApp;
tg.expand();

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Очищаем корзину при запуске (как в Telegram Mini App template)
    if (!sessionStorage.getItem('sessionStarted')) {
        localStorage.removeItem('cartItems');
        sessionStorage.setItem('sessionStarted', 'true');
    }

    setupTelegramButtons();
    initProductPage();
    
    // Показываем главную страницу
    showPage('index');
}

// Настройка Telegram кнопок
function setupTelegramButtons() {
    // Обработчик MainButton
    tg.MainButton.onClick(() => {
        const currentPage = getCurrentPage();
        if (currentPage === 'index') {
            goToCart();
        } else if (currentPage === 'cart') {
            processPayment();
        }
    });

    // Обработчик BackButton
    tg.BackButton.onClick(() => {
        const currentPage = getCurrentPage();
        if (currentPage === 'cart') {
            showPage('index');
        }
    });
}

// Навигация между страницами
function showPage(pageName) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Показываем нужную страницу
    document.getElementById(`page-${pageName}`).style.display = 'block';
    
    // Настраиваем Telegram кнопки для страницы
    setupPageButtons(pageName);
    
    // Обновляем контент страницы если нужно
    if (pageName === 'cart') {
        updateCartPage();
    }
}

function setupPageButtons(pageName) {
    if (pageName === 'index') {
        tg.BackButton.hide();
        updateMainButton();
    } else if (pageName === 'cart') {
        tg.BackButton.show();
        setupCartButton();
    }
}

function getCurrentPage() {
    const indexPage = document.getElementById('page-index');
    return indexPage.style.display !== 'none' ? 'index' : 'cart';
}

// Логика для страницы товаров
function initProductPage() {
    const items = document.querySelectorAll('.item');
    
    // Восстанавливаем состояние из localStorage при загрузке
    restoreCartState();

    items.forEach((item) => {
        const buttonCountNumber = item.querySelector('.buttonCountNumber');
        const btnSelect = item.querySelector('.btn-select');
        const buttonCountPlus = item.querySelector('.plus');
        const buttonCountMinus = item.querySelector('.minus');
        const countButtons = item.querySelector('.count_btn');

        const itemId = item.dataset.id;
        
        // Восстанавливаем количество из localStorage
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const savedItem = savedCartItems.find(i => i.id === itemId);
        let count = savedItem ? savedItem.count : 0;

        // Инициализируем отображение
        updateItemDisplay();

        // Обработчик для кнопки "Выбрать"
        btnSelect.addEventListener('click', () => {
            count = 1;
            updateItemDisplay();
            updateMainButton();
            saveCartState();
        });

        // Обработчик для кнопки "+"
        buttonCountPlus.addEventListener('click', () => {
            count++;
            updateItemDisplay();
            updateMainButton();
            saveCartState();
        });

        // Обработчик для кнопки "-"
        buttonCountMinus.addEventListener('click', () => {
            if (count > 1) {
                count--;
            } else {
                count = 0;
            }
            updateItemDisplay();
            updateMainButton();
            saveCartState();
        });

        function updateItemDisplay() {
            buttonCountNumber.textContent = count;
            buttonCountNumber.style.display = count > 0 ? 'block' : 'none';
            btnSelect.style.display = count === 0 ? 'inline-block' : 'none';
            countButtons.style.display = count > 0 ? 'block' : 'none';
            buttonCountPlus.style.display = count > 0 ? 'inline-block' : 'none';
            buttonCountMinus.style.display = count > 0 ? 'inline-block' : 'none';
        }
    });

    updateMainButton();
}

// Функция обновления главной кнопки
function updateMainButton() {
    const totalCount = Array.from(document.querySelectorAll('.item')).reduce((total, currentItem) => {
        const buttonCountNumber = currentItem.querySelector('.buttonCountNumber');
        const currentCount = parseInt(buttonCountNumber.textContent) || 0;
        return total + currentCount;
    }, 0);
    
    if (totalCount > 0) {
        tg.MainButton.setText(`В корзину (${totalCount})`);
        tg.MainButton.setParams({ color: '#00D200' });
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Настройка кнопки корзины
function setupCartButton() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (cartItems.length > 0) {
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);
        tg.MainButton.setText(`Оплатить ${totalAmount}₽`);
        tg.MainButton.setParams({ color: '#2481cc' });
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Функция сохранения состояния корзины
function saveCartState() {
    const selectedItems = Array.from(document.querySelectorAll('.item'))
        .map(item => {
            const buttonCountNumber = item.querySelector('.buttonCountNumber');
            const count = parseInt(buttonCountNumber.textContent) || 0;
            const itemPriceText = item.querySelector('.product-price').textContent;
            const itemPrice = parseInt(itemPriceText.replace(/[^\d]/g, ''));
            
            return {
                id: item.dataset.id,
                name: item.querySelector('.product-name').textContent,
                price: itemPrice,
                count: count
            };
        })
        .filter(item => item.count > 0);

    localStorage.setItem('cartItems', JSON.stringify(selectedItems));
}

// Функция восстановления состояния корзины
function restoreCartState() {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    savedCartItems.forEach(savedItem => {
        const item = document.querySelector(`.item[data-id="${savedItem.id}"]`);
        if (item) {
            const buttonCountNumber = item.querySelector('.buttonCountNumber');
            const btnSelect = item.querySelector('.btn-select');
            const buttonCountPlus = item.querySelector('.plus');
            const buttonCountMinus = item.querySelector('.minus');
            const countButtons = item.querySelector('.count_btn');
            
            buttonCountNumber.textContent = savedItem.count;
            buttonCountNumber.style.display = 'block';
            btnSelect.style.display = 'none';
            countButtons.style.display = 'block';
            buttonCountPlus.style.display = 'inline-block';
            buttonCountMinus.style.display = 'inline-block';
        }
    });
}

// Функция перехода в корзину
function goToCart() {
    saveCartState();
    showPage('cart');
}

// Обновление страницы корзины
function updateCartPage() {
    const cartContainer = document.getElementById('cart-items');
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
    } else {
        let cartHTML = '';
        
        cartItems.forEach(item => {
            const itemTotal = item.price * item.count;
            
            // Получаем эмодзи и описание для товара
            const itemDetails = getItemDetails(item.id);
            
            cartHTML += `
                <div class="order-item">
                    <div class="order-item-info">
                        <div class="order-item-header">
                            <span class="order-item-emoji">${itemDetails.emoji}</span>
                            <span class="order-item-name">${item.name}</span>
                            <span class="order-item-quantity">${item.count}x</span>
                        </div>
                        <div class="order-item-description">${itemDetails.description}</div>
                    </div>
                    <div class="order-item-price">${itemTotal}₽</div>
                </div>
            `;
        });
        
        cartContainer.innerHTML = cartHTML;
    }
    
    setupCartButton();
}

// Функция для получения деталей товара (эмодзи и описание)
function getItemDetails(itemId) {
    const itemDetails = {
        '1': { emoji: '🍔', description: 'Сочный и вкусный' },
        '2': { emoji: '🍕', description: 'That\'s amore' },
        '3': { emoji: '🍣', description: 'Японское наслаждение' },
        '4': { emoji: '🍱', description: 'Восточная гармония' }
    };
    
    return itemDetails[itemId] || { emoji: '📦', description: 'Товар' };
}

function processPayment() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);
    
    tg.showPopup({
        title: 'Оплата',
        message: `Сумма к оплате: ${totalAmount} руб.`,
        buttons: [
            {id: 'confirm', type: 'ok', text: 'Подтвердить'},
            {id: 'cancel', type: 'cancel', text: 'Отмена'}
        ]
    }, (buttonId) => {
        if (buttonId === 'confirm') {
            tg.showAlert('Заказ успешно оформлен!');
            localStorage.removeItem('cartItems');
            setTimeout(() => {
                showPage('index');
                initProductPage(); // Переинициализируем товары
            }, 2000);
        }
    });
}
