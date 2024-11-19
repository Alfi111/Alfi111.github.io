let tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем приложение

// Проверяем текущую страницу
const currentPage = window.location.pathname;

if (currentPage === '/index.html') {
    // На странице index.html скрываем кнопку "Назад" и активируем крестик (по умолчанию)
    tg.BackButton.hide(); // Скрываем кнопку "Назад", чтобы отображался крестик
    tg.onEvent("backButtonClicked", function() {
        // Поведение кнопки "Назад" на index.html (если потребуется)
        console.log("BackButton clicked on index.html"); 
    });

    // При возвращении на index.html проверяем, есть ли выбранные товары
    document.addEventListener('DOMContentLoaded', () => {
        const totalCount = Array.from(document.querySelectorAll('.item')).reduce((total, currentItem) => {
            const currentCount = parseInt(currentItem.querySelector('#buttonCountNumber')?.textContent) || 0;
            return total + currentCount;
        }, 0);

        if (totalCount > 0) {
            tg.MainButton.setText("В корзину");
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    });
} else {
    // На всех остальных страницах показываем кнопку "Назад"
    tg.BackButton.show();
    tg.onEvent("backButtonClicked", function() {
        window.history.back(); // Возврат на предыдущую страницу
    });

    tg.MainButton.hide(); // Скрываем MainButton по умолчанию
}

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

            // Управляем видимостью MainButton
            if (totalCount > 0) {
                tg.MainButton.setText("В корзину");
                tg.MainButton.show();
            } else {
                tg.MainButton.hide();
            }
        }
    });
});

Telegram.WebApp.onEvent("mainButtonClicked", function() {
    const selectedItems = Array.from(document.querySelectorAll('.item'))
        .map(item => {
            return {
                count: parseInt(item.querySelector('#buttonCountNumber').textContent) || 0,
                itemId: item.dataset.id // Получаем идентификатор товара
            };
        })
        .filter(item => item.count > 0);

    // Формируем URL с параметрами
    const params = new URLSearchParams();
    selectedItems.forEach(item => {
        params.append(item.itemId, item.count);
    });

    // Переход на страницу корзины с параметрами
    window.location.href = `cart.html?${params.toString()}`;
});
