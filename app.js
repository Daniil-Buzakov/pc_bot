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
        name: "Gaming rain",
        desc: "Видеокарта: NVIDIА GеFоrсе RТХ 3060 Тi Gigаbytе АОRUS Еlitе\nПроцессор: АМD Ryzеn 5 3600 \nОЗУ: 16 GВ DDR4 Соrsаir Vеngеаnсе\nМатеринская плата: АSRосk В550 Рhаntоm Gаming 4\nНакопитель:M.2 NVМе SSD АDАТА Lеgеnd 710 512 GВ",
        price: 60000,
        image: "images/Gaming rain.png"
    },
    {
        id: "PC_2",
        name: "White Winter",
        desc: "Видеокарта: GeForce RTX 5060 8 ГБ Dual\nПроцессор: Intel Core i5-14400F\nОЗУ: DDR5 16 GB 5600 МГц\nМатеринская плата: MSI B760 GAMING PLUS\nНакопитель: 512 GB M.2 PCIe",
        price: 110000,
        image: "images/White Winter.png"
    },
    {
        id: "PC_3",
        name: "Black Storm",
        desc: "Видеокарта: GeForce RTX 5050 8 ГБ Dual\nПроцессор: AMD Ryzen 5 5500\nОЗУ: DDR4 16 GB 3200 МГц\nМатеринская плата: MSI B550M PRO-VDH WIFI\nНакопитель: 1000 GB M.2 PCIe",
        price: 106000,
        image: "images/Black Storm.png"
    },
    {
        id: "PC_4",
        name: "Black pearl",
        desc: "Видеокарта: GeForce RTX 3050 6 ГБ Dual\nПроцессор: AMD Ryzen 5 5500\nОЗУ: DDR4 16 GB 3200 МГц\nМатеринская плата: MSI PRO A520M-S\nНакопитель: 512 GB M.2 PCIe",
        price: 83000,
        image: "images/Black pearl.png"
    },
    {
        id: "PC_5",
        name: "Sea wind",
        desc: "Видеокарта: GeForce RTX 5060 Ti INFINITY 3 OC 8 ГБ\nПроцессор: AMD Ryzen 5 7500F\nОЗУ: DDR5 16 GB 5600 МГц\nМатеринская плата: MAXSUN eSport B650M WIFI ICE\nНакопитель: 1000 GB M.2 PCIe",
        price: 146000,
        image: "images/Sea wind.png"
    },
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


