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

    items.forEach(item => {
        const buttonCountNumber = item.querySelector('.buttonCountNumber');
        const btnSelect = item.querySelector('.btn-select');
        const buttonCountPlus = item.querySelector('.plus');
        const buttonCountMinus = item.querySelector('.minus');
        const countButtons = item.querySelector('.count_btn');

        let count = 0;

        // Скрываем элементы управления количеством
        buttonCountPlus.style.display = 'none';
        buttonCountMinus.style.display = 'none';
        countButtons.style.display = 'none';

        // Обработчик для кнопки "Выбрать"
        btnSelect.addEventListener('click', () => {
            count = 1;
            updateItemDisplay();
            updateSelectedItems();
            updateMainButton();
        });

        // Обработчик для кнопки "+"
        buttonCountPlus.addEventListener('click', () => {
            count++;
            updateItemDisplay();
            updateSelectedItems();
            updateMainButton();
        });

        // Обработчик для кнопки "-"
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

        function updateItemDisplay() {
            // Обновляем отображение счетчика
            buttonCountNumber.textContent = count;
            buttonCountNumber.style.display = count > 0 ? 'block' : 'none';
            
            // Управляем видимостью кнопок
            btnSelect.style.display = count === 0 ? 'inline-block' : 'none';
            countButtons.style.display = count > 0 ? 'flex' : 'none';
            buttonCountPlus.style.display = count > 0 ? 'inline-block' : 'none';
            buttonCountMinus.style.display = count > 0 ? 'inline-block' : 'none';
        }

        function updateSelectedItems() {
            const itemId = item.dataset.id;
            const itemName = item.querySelector('.product-name').textContent;
            const itemPrice = parseInt(item.querySelector('.product-price').textContent);
            
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
        const totalCount = selectedItems.reduce((total, item) => total + item.count, 0);
        
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
                const count = parseInt(item.querySelector('.buttonCountNumber').textContent) || 0;
                return {
                    id: item.dataset.id,
                    name: item.querySelector('.product-name').textContent,
                    price: parseInt(item.querySelector('.product-price').textContent),
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
