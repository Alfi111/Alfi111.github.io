let tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем приложение

// Определяем текущую страницу
const currentPage = window.location.pathname;

// Функция для проверки и управления кнопками
function setupButtons() {
    if (currentPage === '/index.html') {
        // На главной странице показываем кнопку закрытия приложения
        tg.BackButton.hide(); // Скрываем кнопку "Назад"
        tg.MainButton.hide(); // Скрываем MainButton по умолчанию
    } else {
        if (currentPage === '/сфке.html')
        // На всех остальных страницах показываем кнопку "Назад"
        tg.BackButton.show();// Скрываем MainButton по умолчанию
    }

    tg.onEvent("backButtonClicked", () => {
        if (currentPage !== '/index.html') {
            window.history.back(); // Возврат на предыдущую страницу
        }
    });

    // Меняем текст MainButton на странице cart.html
    if (currentPage === '/cart.html') {
        tg.MainButton.setText("Оплатить");
        tg.MainButton.show(); // Показываем MainButton на странице cart.html
    }
}

// Инициализация кнопок при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setupButtons();

    if (currentPage === '/index.html') {
        // Проверяем, есть ли выбранные товары
        const totalCount = Array.from(document.querySelectorAll('.item')).reduce((total, currentItem) => {
            const currentCount = parseInt(currentItem.querySelector('#buttonCountNumber')?.textContent) || 0;
            return total + currentCount;
        }, 0);

        if (totalCount > 0) {
            tg.MainButton.setText("В корзину");
            tg.MainButton.show();
        }
    }
});

// Основная логика работы с товарами
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const buttonCountNumber = item.querySelector('#buttonCountNumber');
        const btnSelect = item.querySelector('#btn-select');
        const buttonCountPlus = item.querySelector('#buttonCountPlus');
        const buttonCountMinus = item.querySelector('#buttonCountMinus');

        let count = 0;

        // Скрываем кнопки + и - по умолчанию
        buttonCountPlus.style.display = 'none';
        buttonCountMinus.style.display = 'none';

        // Обработчик для кнопки "Выбрать"
        btnSelect.addEventListener('click', () => {
            count = 1; // Устанавливаем счетчик на 1
            updateDisplay();
        });

        // Обработчик для кнопки "+"
        buttonCountPlus.addEventListener('click', () => {
            count++; // Увеличиваем счетчик
            updateDisplay();
        });

        // Обработчик для кнопки "-"
        buttonCountMinus.addEventListener('click', () => {
            if (count > 1) {
                count--; // Уменьшаем счетчик, если он больше 1
            } else if (count === 1) {
                count = 0; // Сбрасываем счетчик
            }
            updateDisplay();
        });

        // Функция обновления отображения
        function updateDisplay() {
            buttonCountNumber.textContent = count > 0 ? count : ''; // Обновляем текст счетчика
            buttonCountNumber.style.display = count > 0 ? 'block' : 'none'; // Показываем или скрываем счетчик
            btnSelect.style.display = count === 0 ? 'inline-block' : 'none'; // Показываем кнопку "Выбрать", если счетчик 0
            buttonCountPlus.style.display = count > 0 ? 'inline-block' : 'none'; // Показываем кнопку "+"
            buttonCountMinus.style.display = count > 0 ? 'inline-block' : 'none'; // Показываем кнопку "-"

            // Проверяем общее количество выбранных товаров
            const totalCount = Array.from(items).reduce((total, currentItem) => {
                const currentCount = parseInt(currentItem.querySelector('#buttonCountNumber').textContent) || 0;
                return total + currentCount;
            }, 0);

            // Управляем видимостью MainButton на index.html
            if (currentPage === '/index.html') {
                if (totalCount > 0) {
                    tg.MainButton.setText("В корзину");
                    tg.MainButton.show();
                } else {
                    tg.MainButton.hide();
                }
            }
        }
    });
});

// Обработка нажатия MainButton
Telegram.WebApp.onEvent("mainButtonClicked", () => {
    if (currentPage === '/index.html') {
        // На index.html переход в корзину
        const selectedItems = Array.from(document.querySelectorAll('.item'))
            .map(item => {
                return {
                    count: parseInt(item.querySelector('#buttonCountNumber').textContent) || 0,
                    itemId: item.dataset.id // Получаем идентификатор товара
                };
            })
            .filter(item => item.count > 0);

        const params = new URLSearchParams();
        selectedItems.forEach(item => {
            params.append(item.itemId, item.count);
        });

        window.location.href = `cart.html?${params.toString()}`;
    } else if (currentPage === '/cart.html') {
        // На странице cart.html обработка оплаты
        alert("Переход к оплате!"); // Ваша логика оплаты
    }
});
