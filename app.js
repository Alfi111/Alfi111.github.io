let tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2cab37";

// Отображение кнопки возврата
tg.BackButton.show();

// Обработчик для кнопки возврата
Telegram.WebApp.onEvent("backButtonClicked", function() {
    window.history.back(); // Возврат на предыдущую страницу
});

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
                tg.MainButton.setText("Перейти в корзину");
                tg.MainButton.show();
            } else {
                tg.MainButton.hide();
            }

            if (count > 0) {
                // Плавное увеличение и уменьшение
                buttonCountNumber.style.transition = 'transform 0.1s ease';
                buttonCountNumber.style.transform = 'scale(1.3)'; // Увеличиваем на 20%
                setTimeout(() => {
                    buttonCountNumber.style.transform = 'scale(1)'; // Возвращаем к исходному размеру
                }, 50);
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
