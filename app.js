let tg = window.Telegram.WebApp;
tg.expand();

// Устанавливаем заголовок для страницы корзины
if (window.location.pathname.includes('cart.html')) {
    tg.setHeaderColor('#2481cc');
    tg.MainButton.setParams({
        color: '#2481cc'
    });
}

// Определяем текущую страницу
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    setupTelegramButtons();
    
    if (currentPage === 'index.html') {
        initProductPage();
    } else if (currentPage === 'cart.html') {
        initCartPage();
    }
});

// Настройка Telegram кнопок
function setupTelegramButtons() {
    // Скрываем кнопку "Назад" на главной странице
    if (currentPage === 'index.html') {
        tg.BackButton.hide();
        tg.MainButton.hide();
        
        // Настраиваем зеленую кнопку
        tg.MainButton.setParams({
            color: '#00D200'
        });
    } else if (currentPage === 'cart.html') {
        // Устанавливаем заголовок "Корзина"
        tg.setHeaderColor('#2481cc');
        
        // Показываем кнопку "Назад" в header
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
            window.location.href = 'index.html';
        });
        
        // Настраиваем голубую кнопку оплаты
        tg.MainButton.setParams({
            color: '#2481cc'
        });
    }

    // Обработчик MainButton
    tg.MainButton.onClick(() => {
        if (currentPage === 'index.html') {
            goToCart();
        } else if (currentPage === 'cart.html') {
            processPayment();
        }
    });

    // Обработчик закрытия приложения - только при полном закрытии
    let isAppClosing = false;
    
    tg.onEvent('viewportChanged', (event) => {
        console.log('Viewport changed:', event);
        // Очищаем только при явном закрытии приложения
        if (event.isStateStable && !event.isExpanded) {
            isAppClosing = true;
            setTimeout(() => {
                if (isAppClosing) {
                    localStorage.removeItem('cartItems');
                    console.log('LocalStorage очищен при закрытии приложения');
                }
            }, 1000);
        } else {
            isAppClosing = false;
        }
    });

    // Восстанавливаем флаг при разворачивании
    tg.onEvent('themeChanged', () => {
        isAppClosing = false;
    });
}

// Логика для страницы товаров
function initProductPage() {
    const items = document.querySelectorAll('.item');
    
    // Восстанавливаем состояние из localStorage при загрузке
    restoreCartState();

    items.forEach((item, index) => {
        // Получаем элементы с учетом дублирующихся ID
        const buttonCountNumber = item.querySelector('#buttonCountNumber');
        const btnSelect = item.querySelector('#btn-select');
        const buttonCountPlus = item.querySelector('#buttonCountPlus');
        const buttonCountMinus = item.querySelector('#buttonCountMinus');
        const countButtons = item.querySelector('.count_btn');

        const itemId = item.dataset.id;
        
        // Восстанавливаем количество из localStorage
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const savedItem = savedCartItems.find(i => i.id === itemId);
        let count = savedItem ? savedItem.count : 0;

        // Инициализируем отображение
        updateItemDisplay();

        // Обработчик для кнопки "Выбрать"
        if (btnSelect) {
            btnSelect.addEventListener('click', () => {
                count = 1;
                updateItemDisplay();
                updateMainButton();
                saveCartState();
            });
        }

        // Обработчик для кнопки "+"
        if (buttonCountPlus) {
            buttonCountPlus.addEventListener('click', () => {
                count++;
                updateItemDisplay();
                updateMainButton();
                saveCartState();
            });
        }

        // Обработчик для кнопки "-"
        if (buttonCountMinus) {
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
        }

        function updateItemDisplay() {
            // Обновляем отображение счетчика
            if (buttonCountNumber) {
                buttonCountNumber.textContent = count;
                buttonCountNumber.style.display = count > 0 ? 'block' : 'none';
            }
            
            // Управляем видимостью кнопок
            if (btnSelect) {
                btnSelect.style.display = count === 0 ? 'inline-block' : 'none';
            }
            if (countButtons) {
                countButtons.style.display = count > 0 ? 'block' : 'none';
            }
            if (buttonCountPlus) {
                buttonCountPlus.style.display = count > 0 ? 'inline-block' : 'none';
            }
            if (buttonCountMinus) {
                buttonCountMinus.style.display = count > 0 ? 'inline-block' : 'none';
            }
        }
    });

    updateMainButton();
}

// Функция обновления главной кнопки
function updateMainButton() {
    const totalCount = Array.from(document.querySelectorAll('.item')).reduce((total, currentItem) => {
        const buttonCountNumber = currentItem.querySelector('#buttonCountNumber');
        const currentCount = buttonCountNumber ? parseInt(buttonCountNumber.textContent) || 0 : 0;
        return total + currentCount;
    }, 0);
    
    if (totalCount > 0) {
        tg.MainButton.setText(`В корзину (${totalCount})`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Функция сохранения состояния корзины
function saveCartState() {
    const selectedItems = Array.from(document.querySelectorAll('.item'))
        .map(item => {
            const buttonCountNumber = item.querySelector('#buttonCountNumber');
            const count = buttonCountNumber ? parseInt(buttonCountNumber.textContent) || 0 : 0;
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
    console.log('Cart saved:', selectedItems);
}

// Функция восстановления состояния корзины
function restoreCartState() {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    console.log('Restoring cart:', savedCartItems);
    
    savedCartItems.forEach(savedItem => {
        const item = document.querySelector(`.item[data-id="${savedItem.id}"]`);
        if (item) {
            const buttonCountNumber = item.querySelector('#buttonCountNumber');
            const btnSelect = item.querySelector('#btn-select');
            const buttonCountPlus = item.querySelector('#buttonCountPlus');
            const buttonCountMinus = item.querySelector('#buttonCountMinus');
            const countButtons = item.querySelector('.count_btn');
            
            if (buttonCountNumber) {
                buttonCountNumber.textContent = savedItem.count;
                buttonCountNumber.style.display = 'block';
            }
            if (btnSelect) {
                btnSelect.style.display = 'none';
            }
            if (countButtons) {
                countButtons.style.display = 'block';
            }
            if (buttonCountPlus) {
                buttonCountPlus.style.display = 'inline-block';
            }
            if (buttonCountMinus) {
                buttonCountMinus.style.display = 'inline-block';
            }
        }
    });
}

// Функция перехода в корзину
function goToCart() {
    const selectedItems = Array.from(document.querySelectorAll('.item'))
        .map(item => {
            const buttonCountNumber = item.querySelector('#buttonCountNumber');
            const count = buttonCountNumber ? parseInt(buttonCountNumber.textContent) || 0 : 0;
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

    if (selectedItems.length > 0) {
        console.log('Going to cart with items:', selectedItems);
        localStorage.setItem('cartItems', JSON.stringify(selectedItems));
        window.location.href = 'cart.html';
    }
}

// Логика для страницы корзины
function initCartPage() {
    console.log('Initializing cart page');
    
    // Устанавливаем заголовок "Корзина"
    tg.setHeaderColor('#2481cc');
    
    // Показываем кнопку "Назад" сразу
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
        window.location.href = 'index.html';
    });

    // Загружаем товары из localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    console.log('Cart items loaded:', cartItems);
    
    if (cartItems.length === 0) {
        // Если корзина пуста, показываем сообщение
        document.body.innerHTML = '<div class="empty-cart" style="text-align: center; padding: 50px 20px; color: var(--tg-theme-text-color);">Корзина пуста</div>';
        tg.MainButton.hide();
    } else {
        // Отображаем товары в корзине
        displayCartItems(cartItems);
        
        // Рассчитываем общую сумму
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);
        
        // Устанавливаем голубую кнопку с общей суммой
        tg.MainButton.setText(`Оплатить ${totalAmount}₽`);
        tg.MainButton.setParams({
            color: '#2481cc'
        });
        tg.MainButton.show();
    }
}

// Функция отображения товаров в корзине
function displayCartItems(cartItems) {
    // Очищаем body и добавляем контейнер
    document.body.innerHTML = '';
    const cartContainer = document.createElement('div');
    cartContainer.style.padding = '20px';
    
    let totalAmount = 0;
    
    // Добавляем заголовок
    const title = document.createElement('h2');
    title.textContent = 'Корзина';
    title.style.cssText = `
        color: var(--tg-theme-text-color);
        margin-bottom: 20px;
        text-align: center;
    `;
    cartContainer.appendChild(title);
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.count;
        totalAmount += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.style.cssText = `
            border-bottom: 1px solid var(--tg-theme-hint-color);
            padding: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        itemElement.innerHTML = `
            <div style="flex: 1;">
                <div style="font-weight: bold; color: var(--tg-theme-text-color);">${item.name}</div>
                <div style="color: var(--tg-theme-hint-color); font-size: 14px;">${item.price}₽ × ${item.count}</div>
            </div>
            <div style="font-weight: bold; color: var(--tg-theme-text-color);">${itemTotal}₽</div>
        `;
        
        cartContainer.appendChild(itemElement);
    });
    
    // Добавляем общую сумму
    const totalElement = document.createElement('div');
    totalElement.style.cssText = `
        margin-top: 20px;
        padding-top: 15px;
        border-top: 2px solid var(--tg-theme-button-color);
        text-align: right;
        font-weight: bold;
        font-size: 18px;
        color: var(--tg-theme-text-color);
    `;
    totalElement.textContent = `Итого: ${totalAmount}₽`;
    
    cartContainer.appendChild(totalElement);
    document.body.appendChild(cartContainer);
}

function processPayment() {
    if (currentPage === 'cart.html') {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);
        
        // Здесь должна быть логика оплаты
        tg.showPopup({
            title: 'Оплата',
            message: `Сумма к оплате: ${totalAmount} руб.`,
            buttons: [
                {id: 'confirm', type: 'ok', text: 'Подтвердить'},
                {id: 'cancel', type: 'cancel', text: 'Отмена'}
            ]
        }, (buttonId) => {
            if (buttonId === 'confirm') {
                // Обработка успешной оплаты
                tg.showAlert('Заказ успешно оформлен!');
                localStorage.removeItem('cartItems');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }
}
