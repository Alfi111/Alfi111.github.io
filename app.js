let tg = window.Telegram.WebApp;
tg.expand();

// Определяем текущую страницу
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    setupTelegramButtons();

    if (currentPage === 'index.html') {
        initProductPage();
    } else if (currentPage === 'cart.html') {
        initCartPage();
    }
});

/* ==============================
   TELEGRAM BUTTONS FIXED
================================ */
function setupTelegramButtons() {

    if (currentPage === 'index.html') {
        tg.BackButton.hide();
        tg.MainButton.hide();

        tg.MainButton.setParams({
            color: '#00D200'
        });

    } else if (currentPage === 'cart.html') {

        tg.setHeaderColor('#2481cc');

        tg.BackButton.show();
        tg.BackButton.onClick(() => {
            window.location.href = 'index.html';
        });

        tg.MainButton.setParams({
            color: '#2481cc'
        });
    }

    // обработчик MainButton
    tg.MainButton.onClick(() => {
        if (currentPage === 'index.html') {
            goToCart();
        } else if (currentPage === 'cart.html') {
            processPayment();
        }
    });

    /* -------------------------
       ОЧИСТКА localStorage ПРАВИЛЬНАЯ
       (Только при реальном закрытии WebApp)
    ---------------------------- */

    tg.onEvent('backButtonClicked', () => {
        if (currentPage === 'index.html') {
            localStorage.removeItem('cartItems');
        }
    });

    // очищаем корзину только при запуске новой сессии WebApp
    if (!sessionStorage.getItem('webapp-session')) {
        localStorage.removeItem('cartItems');
        sessionStorage.setItem('webapp-session', '1');
    }
}

/* ==============================
   INDEX.HTML LOGIC
================================ */
function initProductPage() {
    const items = document.querySelectorAll('.item');

    restoreCartState();
    updateMainButton();

    items.forEach(item => {
        const itemId = item.dataset.id;

        const numberBtn = item.querySelector('#buttonCountNumber');
        const btnSelect = item.querySelector('#btn-select');
        const plusBtn = item.querySelector('#buttonCountPlus');
        const minusBtn = item.querySelector('#buttonCountMinus');
        const countBlock = item.querySelector('.count_btn');

        let count = parseInt(numberBtn.textContent) || 0;

        // --- кнопка "Выбрать"
        btnSelect.addEventListener('click', () => {
            count = 1;
            updateUI();
        });

        // --- "+"
        plusBtn.addEventListener('click', () => {
            count++;
            updateUI();
        });

        // --- "-"
        minusBtn.addEventListener('click', () => {
            if (count > 1) count--;
            else count = 0;
            updateUI();
        });

        function updateUI() {
            numberBtn.textContent = count;

            numberBtn.style.display = count > 0 ? 'block' : 'none';
            btnSelect.style.display = count === 0 ? 'inline-block' : 'none';
            countBlock.style.display = count > 0 ? 'flex' : 'none';

            saveCartState();
            updateMainButton();
        }
    });
}

/* ==============================
   MAIN BUTTON UPDATE
================================ */
function updateMainButton() {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');

    const totalCount = items.reduce((sum, i) => sum + i.count, 0);

    if (totalCount === 0) {
        tg.MainButton.hide();
    } else {
        tg.MainButton.setText(`В корзину (${totalCount})`);
        tg.MainButton.show();
    }
}

/* ==============================
   SAVE / RESTORE CART
================================ */
function saveCartState() {
    const selectedItems = Array.from(document.querySelectorAll('.item'))
        .map(item => {
            const count = parseInt(item.querySelector('#buttonCountNumber').textContent) || 0;
            if (count === 0) return null;

            const price = parseInt(item.querySelector('.product-price').textContent.replace(/[^\d]/g, ''));

            return {
                id: item.dataset.id,
                name: item.querySelector('.product-name').textContent,
                price: price,
                count: count
            };
        })
        .filter(i => i !== null);

    localStorage.setItem('cartItems', JSON.stringify(selectedItems));
}

function restoreCartState() {
    const saved = JSON.parse(localStorage.getItem('cartItems') || '[]');

    saved.forEach(savedItem => {
        const item = document.querySelector(`.item[data-id="${savedItem.id}"]`);
        if (!item) return;

        const numberBtn = item.querySelector('#buttonCountNumber');
        const btnSelect = item.querySelector('#btn-select');
        const countBlock = item.querySelector('.count_btn');

        numberBtn.textContent = savedItem.count;
        numberBtn.style.display = 'block';
        btnSelect.style.display = 'none';
        countBlock.style.display = 'flex';
    });
}

/* ==============================
   CART PAGE LOGIC
================================ */
function goToCart() {
    window.location.href = 'cart.html';
}

function initCartPage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    if (cartItems.length === 0) {
        document.body.innerHTML = '<div style="text-align:center;padding:40px;color:var(--tg-theme-text-color)">Корзина пуста</div>';
        tg.MainButton.hide();
        return;
    }

    displayCartItems(cartItems);

    const totalAmount = cartItems.reduce((sum, i) => sum + i.count * i.price, 0);
    tg.MainButton.setText(`Оплатить ${totalAmount} ₽`);
    tg.MainButton.show();
}

function displayCartItems(items) {
    const container = document.createElement('div');
    container.style.padding = '20px';

    items.forEach(i => {
        const element = document.createElement('div');
        element.style.cssText =
            "border-bottom:1px solid var(--tg-theme-hint-color);padding:15px 0;display:flex;justify-content:space-between;";

        element.innerHTML = `
            <div>
                <div style="font-weight:bold">${i.name}</div>
                <div style="color:var(--tg-theme-hint-color)">${i.price} ₽ × ${i.count}</div>
            </div>
            <div style="font-weight:bold">${i.price * i.count} ₽</div>
        `;

        container.appendChild(element);
    });

    document.body.innerHTML = "";
    document.body.appendChild(container);
}

/* ==============================
   PAYMENT
================================ */
function processPayment() {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.count, 0);

    tg.showPopup({
        title: "Оплата",
        message: `Сумма к оплате: ${totalAmount} ₽`,
        buttons: [
            { id: "confirm", type: "ok", text: "Подтвердить" },
            { id: "cancel", type: "cancel", text: "Отмена" }
        ]
    }, id => {
        if (id === "confirm") {
            tg.showAlert("Оплата прошла успешно 👍");
            localStorage.removeItem('cartItems');
            setTimeout(() => window.location.href = "index.html", 1200);
        }
    });
}
