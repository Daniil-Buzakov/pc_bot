// ===== Инициализация Telegram WebApp =====
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ===== URL бэкенда =====
const BACKEND_URL = 'https://pcbot-production-7c6d.up.railway.app';

// Настройка под тему
document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');

// ===== КАТАЛОГ =====
const CATALOG = [
    {
        id: "PC_1",
        name: "Gaming rain",
        desc: "Видеокарта: NVIDIА GеFоrсе RТХ 3060 Тi Gigаbytе АОRUS Еlitе\nПроцессор: АМD Ryzеn 5 3600\nОЗУ: 16 GВ DDR4 Соrsаir Vеngеаnсе\nМатеринская плата: АSRосk В550 Рhаntоm Gаming 4\nНакопитель: M.2 NVМе SSD АDАТА Lеgеnd 710 512 GВ",
        price: 60000,
        image: "images/Gaming rain.png",
        cpu: "ryzen5_3600",
        gpu: "rtx3060ti"
    },
    {
        id: "PC_2",
        name: "White Winter",
        desc: "Видеокарта: GeForce RTX 5060 8 ГБ Dual\nПроцессор: Intel Core i5-14400F\nОЗУ: DDR5 16 GB 5600 МГц\nМатеринская плата: MSI B760 GAMING PLUS\nНакопитель: 512 GB M.2 PCIe",
        price: 110000,
        image: "images/White Winter.png",
        cpu: "i5_14400f",
        gpu: "rtx5060"
    },
    {
        id: "PC_3",
        name: "Black Storm",
        desc: "Видеокарта: GeForce RTX 5050 8 ГБ Dual\nПроцессор: AMD Ryzen 5 5500\nОЗУ: DDR4 16 GB 3200 МГц\nМатеринская плата: MSI B550M PRO-VDH WIFI\nНакопитель: 1000 GB M.2 PCIe",
        price: 106000,
        image: "images/Black Storm.png",
        cpu: "ryzen5_5500",
        gpu: "rtx5050"
    },
    {
        id: "PC_4",
        name: "Black pearl",
        desc: "Видеокарта: GeForce RTX 3050 6 ГБ Dual\nПроцессор: AMD Ryzen 5 5500\nОЗУ: DDR4 16 GB 3200 МГц\nМатеринская плата: MSI PRO A520M-S\nНакопитель: 512 GB M.2 PCIe",
        price: 83000,
        image: "images/Black pearl.png",
        cpu: "ryzen5_5500",
        gpu: "rtx3050"
    },
    {
        id: "PC_5",
        name: "Sea wind",
        desc: "Видеокарта: GeForce RTX 5060 Ti INFINITY 3 OC 8 ГБ\nПроцессор: AMD Ryzen 5 7500F\nОЗУ: DDR5 16 GB 5600 МГц\nМатеринская плата: MAXSUN eSport B650M WIFI ICE\nНакопитель: 1000 GB M.2 PCIe",
        price: 146000,
        image: "images/Sea wind.png",
        cpu: "ryzen5_7500f",
        gpu: "rtx5060ti"
    },
];

// ===== ЧЕЛОВЕКОПОНЯТНЫЕ НАЗВАНИЯ ДЛЯ ФИЛЬТРОВ =====
const CPU_NAMES = {
    'ryzen5_3600': 'AMD Ryzen 5 3600',
    'ryzen5_5500': 'AMD Ryzen 5 5500',
    'ryzen5_7500f': 'AMD Ryzen 5 7500F',
    'i5_14400f': 'Intel Core i5-14400F'
};

const GPU_NAMES = {
    'rtx3050': 'RTX 3050',
    'rtx3060ti': 'RTX 3060 Ti',
    'rtx5050': 'RTX 5050',
    'rtx5060': 'RTX 5060',
    'rtx5060ti': 'RTX 5060 Ti'
};

// ===== СОСТОЯНИЕ ФИЛЬТРОВ =====
let activeFilters = {
    cpu: '',
    gpu: ''
};

// ===== ЭЛЕМЕНТЫ =====
const catalogEl = document.getElementById('catalog');
const filterModal = document.getElementById('filterModal');
const filterToggle = document.getElementById('filterToggle');
const filterClose = document.getElementById('filterClose');
const filterCpuSelect = document.getElementById('filterCpu');
const filterGpuSelect = document.getElementById('filterGpu');
const filterReset = document.getElementById('filterReset');
const filterApply = document.getElementById('filterApply');

// ===== ЗАПОЛНЯЕМ СЕЛЕКТЫ УНИКАЛЬНЫМИ ЗНАЧЕНИЯМИ =====
function buildFilterOptions() {
    const uniqueCpus = [...new Set(CATALOG.map(pc => pc.cpu))].sort();
    const uniqueGpus = [...new Set(CATALOG.map(pc => pc.gpu))].sort();

    uniqueCpus.forEach(cpu => {
        const option = document.createElement('option');
        option.value = cpu;
        option.textContent = CPU_NAMES[cpu] || cpu;
        filterCpuSelect.appendChild(option);
    });

    uniqueGpus.forEach(gpu => {
        const option = document.createElement('option');
        option.value = gpu;
        option.textContent = GPU_NAMES[gpu] || gpu;
        filterGpuSelect.appendChild(option);
    });
}

// ===== РЕНДЕР КАТАЛОГА С УЧЁТОМ ФИЛЬТРОВ =====
function renderCatalog() {
    const filtered = CATALOG.filter(pc => {
        const cpuMatch = !activeFilters.cpu || pc.cpu === activeFilters.cpu;
        const gpuMatch = !activeFilters.gpu || pc.gpu === activeFilters.gpu;
        return cpuMatch && gpuMatch;
    });

    catalogEl.innerHTML = '';

    if (filtered.length === 0) {
        catalogEl.innerHTML = '<p class="empty">Ничего не найдено.<br>Попробуй изменить фильтр.</p>';
        return;
    }

    filtered.forEach(pc => {
        const card = document.createElement('div');
        card.className = 'pc-card';
        card.innerHTML = `
            <img class="pc-image" src="${pc.image}" alt="${pc.name}" onerror="this.style.display='none'">
            <div class="pc-name">${pc.name}</div>
            <div class="pc-desc">${pc.desc.replace(/\n/g, '<br>')}</div>
            <div class="pc-price">${pc.price.toLocaleString('ru-RU')} ₽</div>
            <button class="buy-btn" data-id="${pc.id}">Хочу этот</button>
        `;
        catalogEl.appendChild(card);
    });
}

// ===== ОБНОВЛЕНИЕ ИНДИКАТОРА НА КНОПКЕ ФИЛЬТРА =====
function updateFilterBadge() {
    const hasFilter = activeFilters.cpu || activeFilters.gpu;
    filterToggle.classList.toggle('has-filter', !!hasFilter);
}

// ===== ОТКРЫТИЕ / ЗАКРЫТИЕ МОДАЛКИ =====
function openFilterModal() {
    // Синхронизируем селекты с активным состоянием
    filterCpuSelect.value = activeFilters.cpu;
    filterGpuSelect.value = activeFilters.gpu;

    filterModal.classList.add('open');
    tg.expand(); // разворачиваем WebApp, если был свёрнут
}

function closeFilterModal() {
    filterModal.classList.remove('open');
}

// ===== ОБРАБОТЧИКИ =====
filterToggle.addEventListener('click', openFilterModal);
filterClose.addEventListener('click', closeFilterModal);

// Клик по затемнённой области — закрыть
filterModal.addEventListener('click', (e) => {
    if (e.target === filterModal) closeFilterModal();
});

// Применить фильтр
filterApply.addEventListener('click', () => {
    activeFilters.cpu = filterCpuSelect.value;
    activeFilters.gpu = filterGpuSelect.value;

    updateFilterBadge();
    renderCatalog();
    closeFilterModal();
});

// Сбросить фильтр
filterReset.addEventListener('click', () => {
    filterCpuSelect.value = '';
    filterGpuSelect.value = '';
    activeFilters.cpu = '';
    activeFilters.gpu = '';

    updateFilterBadge();
    renderCatalog();
    closeFilterModal();
});

// ===== ОБРАБОТКА "ХОЧУ ЭТОТ" =====
catalogEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('.buy-btn');
    if (!btn) return;

    const pcId = btn.dataset.id;
    const pc = CATALOG.find(p => p.id === pcId);

    btn.disabled = true;
    btn.textContent = 'Отправка...';

    try {
        const response = await fetch(`${BACKEND_URL}/api/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                initData: tg.initData,
                pc_id: pc.id,
                pc_name: pc.name,
                pc_price: pc.price
            })
        });

        if (!response.ok) throw new Error('Ошибка отправки');

        document.getElementById('toast').classList.add('show');
        setTimeout(() => tg.close(), 2000);

    } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.textContent = 'Хочу этот';
        tg.showAlert('Не удалось отправить заявку. Попробуй ещё раз.');
    }
});

// ===== ЗАПУСК =====
buildFilterOptions();
renderCatalog();
