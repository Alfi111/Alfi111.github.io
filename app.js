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
    let selectedItems = [];

    items.forEach((item, index) => {
        // Получаем элементы с учетом дублирующихся ID
        const buttonCountNumber = item.querySelector('#buttonCountNumber');
        const btnSelect = item.querySelector('#btn-select');
        const buttonCountPlus = item.querySelector('#buttonCountPlus');
        const buttonCountMinus = item.querySelector('#buttonCountMinus');
        const countButtons = item.querySelector('.count_btn');

        let count = 0;

        // Скрываем элементы управления количеством
        if (buttonCountPlus) buttonCountPlus.style.display = 'none';
        if (buttonCountMinus) buttonCountMinus.style.display = 'none';
        if (countButtons) countButtons.style.display = 'none';

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
            
            // Обновляем массив выбранных товаров
            selectedItems = selectedItems.filter(i => i.id !== itemId);
            
            if (count > 0) {
                selectedItems.push({
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    count: count
                });
            }
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
        }
    }
}

// Логика для страницы корзины (заглушка)
function initCartPage() {
    // Загружаем товары из localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (cartItems.length === 0) {
        // Если корзина пуста, показываем сообщение
        document.body.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        tg.MainButton.hide();
    } else {
        // Показываем товары в корзине
        tg.MainButton.setText("Оплатить");
        tg.MainButton.show();
        
        // Здесь можно добавить отображение товаров в корзине
        console.log('Товары в корзине:', cartItems);
    }
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
