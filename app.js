// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Настройка под тему
document.documentElement.style.setProperty(
    '--tg-theme-bg-color',
    tg.themeParams.bg_color || '#ffffff'
);
document.documentElement.style.setProperty(
    '--tg-theme-text-color',
    tg.themeParams.text_color || '#000000'
);

// ==== КАТАЛОГ ПК (можно вынести в отдельный JSON) ====
const CATALOG = [
    {
        id: "gaming_pro",
        name: "Gaming Pro X",
        desc: "RTX 4070, i7-13700K, 32GB DDR5, 1TB NVMe",
        price: 185000,
        image: "https://via.placeholder.com/400x200/4a86ff/ffffff?text=Gaming+Pro+X"
    },
    {
        id: "office_basic",
        name: "Office Basic",
        desc: "i5-12400, 16GB DDR4, 512GB SSD, встроенная графика",
        price: 55000,
        image: "https://via.placeholder.com/400x200/2ecc71/ffffff?text=Office+Basic"
    },
    {
        id: "workstation",
        name: "Workstation Ultra",
        desc: "RTX 4090, Ryzen 9 7950X, 64GB DDR5, 2TB NVMe",
        price: 420000,
        image: "https://via.placeholder.com/400x200/e74c3c/ffffff?text=Workstation+Ultra"
    }
];

// ==== РЕНДЕР КАРТОЧЕК ====
const catalogEl = document.getElementById('catalog');

CATALOG.forEach(pc => {
    const card = document.createElement('div');
    card.className = 'pc-card';
    card.innerHTML = `
        <img class="pc-image" src="${pc.image}" alt="${pc.name}">
        <div class="pc-name">${pc.name}</div>
        <div class="pc-desc">${pc.desc}</div>
        <div class="pc-price">${pc.price.toLocaleString('ru-RU')} ₽</div>
        <button class="buy-btn" data-id="${pc.id}">Хочу этот</button>
    `;
    catalogEl.appendChild(card);
});

// ==== ОБРАБОТКА НАЖАТИЯ "ХОЧУ ЭТОТ" ====
catalogEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('.buy-btn');
    if (!btn) return;

    const pcId = btn.dataset.id;
    const pc = CATALOG.find(p => p.id === pcId);

    btn.disabled = true;
    btn.textContent = 'Отправка...';

    try {
        // Отправляем на бэкенд
        const response = await fetch(`${BACKEND_URL}/api/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                initData: tg.initData,  // ВАЖНО: для валидации на бэке
                pc_id: pc.id,
                pc_name: pc.name,
                pc_price: pc.price
            })
        });

        if (!response.ok) throw new Error('Ошибка отправки');

        // Показываем уведомление
        const toast = document.getElementById('toast');
        toast.classList.add('show');

        // Закрываем WebApp через 2 секунды
        setTimeout(() => {
            tg.close();
        }, 2000);

    } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.textContent = 'Хочу этот';
        tg.showAlert('Не удалось отправить заявку. Попробуй ещё раз.');
    }
});

// Заменяем URL бэкенда (в реальном проекте — через переменную окружения)
const BACKEND_URL = 'https://your-backend.railway.app';