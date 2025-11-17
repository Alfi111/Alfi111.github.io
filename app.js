let tg = window.Telegram.WebApp;
tg.expand();

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
            color: '#00D200' // Зеленый цвет
        });
    } else {
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
            window.history.back();
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
}

// Логика для страницы товаров
function initProductPage() {
    const items = document.querySelectorAll('.item');
    
    // Загружаем сохраненные товары из localStorage
    loadSavedItems();

    items.forEach((item, index) => {
        // Получаем элементы с учетом дублирующихся ID
        const buttonCountNumber = item.querySelector('#buttonCountNumber');
        const btnSelect = item.querySelector('#btn-select');
        const buttonCountPlus = item.querySelector('#buttonCountPlus');
        const buttonCountMinus = item.querySelector('#buttonCountMinus');
        const countButtons = item.querySelector('.count_btn');

        let count = 0;

        // Загружаем сохраненное количество для этого товара
        const savedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const savedItem = savedItems.find(i => i.id === item.dataset.id);
        if (savedItem) {
            count = savedItem.count;
        }

        // Инициализируем отображение
        updateItemDisplay();

        // Обработчик для кнопки "Выбрать"
        if (btnSelect) {
            btnSelect.addEventListener('click', () => {
                count = 1;
                updateItemDisplay();
                updateSelectedItems();
                updateMainButton();
            });
        }

        // Обработчик для кнопки "+"
        if (buttonCountPlus) {
            buttonCountPlus.addEventListener('click', () => {
                count++;
                updateItemDisplay();
                updateSelectedItems();
                updateMainButton();
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
                updateSelectedItems();
                updateMainButton();
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

        function updateSelectedItems() {
            const itemId = item.dataset.id;
            const itemName = item.querySelector('.product-name').textContent;
            const itemPriceText = item.querySelector('.product-price').textContent;
            const itemPrice = parseInt(itemPriceText.replace(/[^\d]/g, '')); // Убираем все нецифровые символы
            
            // Сохраняем в localStorage
            const savedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const updatedItems = savedItems.filter(i => i.id !== itemId);
            
            if (count > 0) {
                updatedItems.push({
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    count: count
                });
            }
            
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        }
    });

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

    // Функция загрузки сохраненных товаров
    function loadSavedItems() {
        const savedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const items = document.querySelectorAll('.item');
        
        savedItems.forEach(savedItem => {
            const item = Array.from(items).find(i => i.dataset.id === savedItem.id);
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
        
        updateMainButton();
    }

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
            // Сохраняем данные в localStorage для передачи на страницу корзины
            localStorage.setItem('cartItems', JSON.stringify(selectedItems));
            window.location.href = 'cart.html';
        } else {
            tg.showAlert('Выберите хотя бы один товар!');
        }
    }
}

// Логика для страницы корзины
function initCartPage() {
    // Загружаем товары из localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (cartItems.length === 0) {
        // Если корзина пуста, показываем сообщение
        document.body.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--tg-theme-text-color);">Корзина пуста</div>';
        tg.MainButton.hide();
    } else {
        // Показываем товары в корзине
        tg.MainButton.setText("Оплатить");
        tg.MainButton.show();
        
        // Отображаем товары в корзине
        displayCartItems(cartItems);
    }
}

// Функция отображения товаров в корзине
function displayCartItems(cartItems) {
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);
    
    const cartHTML = `
        <div style="padding: 20px;">
            <h2 style="text-align: center; color: var(--tg-theme-text-color);">Ваша корзина</h2>
            <div id="cart-items">
                ${cartItems.map(item => `
                    <div style="border-bottom: 1px solid var(--tg-theme-hint-color); padding: 15px 0;">
                        <div style="font-weight: bold; color: var(--tg-theme-text-color);">${item.name}</div>
                        <div style="color: var(--tg-theme-text-color); margin: 5px 0;">
                            Количество: ${item.count} шт.
                        </div>
                        <div style="color: var(--tg-theme-text-color);">
                            Цена: ${item.price} ₽ × ${item.count} = ${item.price * item.count} ₽
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 20px; padding: 15px; background: var(--tg-theme-secondary-bg-color); border-radius: 10px;">
                <div style="font-weight: bold; font-size: 18px; color: var(--tg-theme-text-color); text-align: center;">
                    Общая сумма: ${totalAmount} ₽
                </div>
            </div>
        </div>
    `;
    
    document.body.innerHTML = cartHTML;
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
