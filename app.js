let tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем приложение

// Определяем текущую страницу
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Функция для проверки и управления кнопками
function setupButtons() {
    if (currentPage === 'index.html') {
        // На главной странице скрываем кнопку "Назад"
        tg.BackButton.hide();
        tg.MainButton.hide(); // Скрываем MainButton по умолчанию
        
        // Настраиваем зеленую кнопку
        tg.MainButton.setParams({
            color: '#00D200' // Зеленый цвет
        });
    } else if (currentPage === 'cart.html') {
        // На странице корзины показываем кнопку "Назад"
        tg.BackButton.show();
        tg.MainButton.setText("Оплатить");
        tg.MainButton.show();
    }

    tg.onEvent("backButtonClicked", () => {
        if (currentPage !== 'index.html') {
            window.history.back(); // Возврат на предыдущую страницу
        }
    });
}

// Основная логика работы с товарами
function initProducts() {
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const buttonCountNumber = item.querySelector('#buttonCountNumber');
        const btnSelect = item.querySelector('#btn-select');
        const buttonCountPlus = item.querySelector('#buttonCountPlus');
        const buttonCountMinus = item.querySelector('#buttonCountMinus');
        const countBtn = item.querySelector('.count_btn');

        let count = 0;

        // Скрываем кнопки + и - по умолчанию
        buttonCountPlus.style.display = 'none';
        buttonCountMinus.style.display = 'none';
        countBtn.style.display = 'none';

        // Обработчик для кнопки "Выбрать"
        btnSelect.addEventListener('click', () => {
            count = 1; // Устанавливаем счетчик на 1
            updateDisplay();
            updateMainButton();
        });

        // Обработчик для кнопки "+"
        buttonCountPlus.addEventListener('click', () => {
            count++; // Увеличиваем счетчик
            updateDisplay();
            updateMainButton();
        });

        // Обработчик для кнопки "-"
        buttonCountMinus.addEventListener('click', () => {
            if (count > 1) {
                count--; // Уменьшаем счетчик, если он больше 1
            } else if (count === 1) {
                count = 0; // Сбрасываем счетчик
            }
            updateDisplay();
            updateMainButton();
        });

        // Функция обновления отображения
        function updateDisplay() {
            buttonCountNumber.textContent = count > 0 ? count : ''; // Обновляем текст счетчика
            buttonCountNumber.style.display = count > 0 ? 'block' : 'none'; // Показываем или скрываем счетчик
            btnSelect.style.display = count === 0 ? 'inline-block' : 'none'; // Показываем кнопку "Выбрать", если счетчик 0
            buttonCountPlus.style.display = count > 0 ? 'inline-block' : 'none'; // Показываем кнопку "+"
            buttonCountMinus.style.display = count > 0 ? 'inline-block' : 'none'; // Показываем кнопку "-"
            countBtn.style.display = count > 0 ? 'block' : 'none'; // Показываем контейнер кнопок
        }
    });
}

// Функция обновления главной кнопки
function updateMainButton() {
    const totalCount = Array.from(document.querySelectorAll('.item')).reduce((total, currentItem) => {
        const buttonCountNumber = currentItem.querySelector('#buttonCountNumber');
        const currentCount = parseInt(buttonCountNumber.textContent) || 0;
        return total + currentCount;
    }, 0);

    if (totalCount > 0) {
        tg.MainButton.setText(`В корзину (${totalCount})`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Функция перехода в корзину
function goToCart() {
    const selectedItems = Array.from(document.querySelectorAll('.item'))
        .map(item => {
            const buttonCountNumber = item.querySelector('#buttonCountNumber');
            const count = parseInt(buttonCountNumber.textContent) || 0;
            return {
                id: item.dataset.id,
                name: item.querySelector('.product-name').textContent,
                price: item.querySelector('.product-price').textContent,
                count: count
            };
        })
        .filter(item => item.count > 0);

    if (selectedItems.length > 0) {
        // Сохраняем данные в localStorage
        localStorage.setItem('cartItems', JSON.stringify(selectedItems));
        // Переходим на страницу корзины
        window.location.href = 'cart.html';
    }
}

// Обработка нажатия MainButton
tg.MainButton.onClick(function() {
    if (currentPage === 'index.html') {
        goToCart();
    } else if (currentPage === 'cart.html') {
        // На странице cart.html обработка оплаты
        alert("Переход к оплате!"); // Ваша логика оплаты
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setupButtons();
    
    if (currentPage === 'index.html') {
        initProducts();
        
        // Проверяем, есть ли выбранные товары при загрузке
        updateMainButton();
    }
});
