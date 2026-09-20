// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Заменяем URL бэкенда (в реальном проекте — через переменную окружения)
const BACKEND_URL = 'https://pcbot-production-7c6d.up.railway.app';

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
        id: "PC_1",
        name: "Gaming light",
        desc: "Видеокарта: NVIDIА GеFоrсе RТХ 3060 Тi Gigаbytе АОRUS Еlitе\nПроцессор: АМD Ryzеn 5 3600 \nОЗУ: 16 GВ DDR4 Соrsаir Vеngеаnсе\nМатеринская плата: АSRосk В550 Рhаntоm Gаming 4\nНакопитель:M.2 NVМе SSD АDАТА Lеgеnd 710 512 GВ",
        price: 58000,
        image: "images/Gaming light2.jpg"
    },
    {
        id: "PC_2",
        name: "White Winter",
        desc: "Видеокарта: Palit GeForce RTX 5060 Dual\nПроцессор: Intel Core i5-14400F\nОЗУ: 16 GB ADATA XPG Lancer White\nМатеринская плата: MSI B760 GAMING PLUS\nНакопитель:M.2 NVМе SSD 500GB ADATA LEGEND 860",
        price: 96500,
        image: "images/White Winter.png"
    },
    {
        id: "PC_3",
        name: "Black Storm",
        desc: "Видеокарта: MSI GeForce RTX 5050 8G SHADOW 2X OC\nПроцессор: AMD Ryzen 5 5500\nОЗУ: DDR4 16 ГБ 3200 МГц Kingston HyperX FURY Black\nМатеринская плата: MSI B550M PRO-VDH WIFI\nНакопитель:M.2 NVМе SSD Kingston 1000 Gb NV3 Blue",
        price: 82000,
        image: "images/Black Storm.png"
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


