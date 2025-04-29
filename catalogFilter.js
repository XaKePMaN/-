// Прапорець, щоб обробник кліку додався лише один раз
let isCatalogListenerAdded = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Логіка каталогу завантажена! (catalogFilter.js)");

    // --- Необхідні DOM-елементи ---
    const sortSelect = document.getElementById('sort-by');
    const productGrid = document.querySelector('.product-grid');
    const body = document.body;

    // --- Перевірка наявності основних елементів ---
    if (!productGrid || !body || !sortSelect) {
        console.error("Не знайдено один з основних елементів: .product-grid, body або #sort-by. Скрипт не може продовжити роботу на цій сторінці.");
        return; // Зупиняємо виконання, якщо основних елементів немає
    }

    // --- КОНФІГУРАЦІЯ ПАГІНАЦІЇ ---
    const itemsPerPage = 8; // Скільки товарів показувати на сторінці
    const currentPage = parseInt(body.dataset.page, 10) || 1; // Визначаємо поточну сторінку
    console.log("Поточна сторінка:", currentPage);

    // --- ЄДИНЕ ДЖЕРЕЛО ДАНИХ ПРО ВСІ ТОВАРИ ---
    // !!! ЗАПОВНИ ЦЕЙ МАСИВ ВСІМА ТВОЇМИ ТОВАРАМИ !!!
    const allProducts = [
        // Сторінка 1
        { id: "hp1", name: 'Букет "Ніжність"', price: 1200, imgSrc: "images/nijnist.jpg", popular: 5, dateAdded: '2025-04-25' },
        { id: "hp2", name: 'Букет "Весняний настрій"', price: 950, imgSrc: "images/Vesnyaniy_Nastriy.webp", popular: 4, dateAdded: '2025-04-26' },
        { id: "hp3", name: 'Авторський букет "Натхнення"', price: 1800, imgSrc: "images/nathnenna.webp", popular: 6, dateAdded: '2025-04-20' },
        { id: "hp4", name: 'Квіти в коробці "Елегант"', price: 1500, imgSrc: "images/kvityVKorobtsi.webp", popular: 7, dateAdded: '2025-04-27' },
        { id: "hp5", name: 'Букет "Сонячний день"', price: 1100, imgSrc: "images/sona4niyDEN.webp", popular: 3, dateAdded: '2025-04-24' },
        { id: "hp6", name: 'Букет "Легкість"', price: 1350, imgSrc: "images/monobuqetEUSTR.jfif", popular: 5, dateAdded: '2025-04-22' },
        { id: "hp7", name: 'Весільний букет "Мрія"', price: 2500, imgSrc: "images/vesilnyBuqet.jfif", popular: 8, dateAdded: '2025-04-15' },
        { id: "hp8", name: 'Букет "Стильний презент"', price: 1600, imgSrc: "images/MUJITSKIBUQET.jpg", popular: 10, dateAdded: '2025-04-23' },
        // Сторінка 2
        { id: "hp9", name: 'Букет "Ніжний Дотик"', price: 1150, imgSrc: "images/alexey-savchenko-bDQQz_0GLNs-unsplash.jpg", popular: 7, dateAdded: '2025-04-18' },
        { id: "hp10", name: 'Букет "Сонячний Зайчик"', price: 950, imgSrc: "images/amelia-cui-P2qynBU8j4Y-unsplash.jpg", popular: 9, dateAdded: '2025-04-28' },
        { id: "hp11", name: 'Букет "Перше Побачення"', price: 1400, imgSrc: "images/arjun-lama-Cc00J2Xe1dE-unsplash.jpg", popular: 6, dateAdded: '2025-04-19' },
        { id: "hp12", name: 'Букет "Веселка Бажань"', price: 1750, imgSrc: "images/arjun-lama-J181M95wE8Y-unsplash.jpg", popular: 5, dateAdded: '2025-04-17' },
        { id: "hp13", name: 'Букет "Біла Перлина"', price: 1900, imgSrc: "images/bence-balla-schottner-ehGgVnHc-1Q-unsplash.jpg", popular: 8, dateAdded: '2025-04-21' },
        { id: "hp14", name: 'Композиція "Літній Бриз"', price: 1050, imgSrc: "images/brigitte-tohm-0utRJ1mZoZg-unsplash.jpg", popular: 4, dateAdded: '2025-04-16' },
        { id: "hp15", name: 'Букет "Полум\'яне Серце"', price: 2500, imgSrc: "images/dong-cheng-krEjviclb4E-unsplash.jpg", popular: 9, dateAdded: '2025-04-14' },
        { id: "hp16", name: 'Букет "Ранкова Свіжість"', price: 1250, imgSrc: "images/girl-with-red-hat-xPW7_XEZSM4-unsplash.jpg", popular: 6, dateAdded: '2025-04-29' },
        // Сторінка 3
         { id: "hp17", name: 'Композиція "Арт-Мікс Рівне"', price: 2800, imgSrc: "images/lorena-lizeth-gonzalez-briones-PJ7bP56jp4c-unsplash.jpg", popular: 11, dateAdded: '2025-04-13' },
         { id: "hp18", name: 'Букет "Трояндова Мрія"', price: 2950, imgSrc: "images/nadiia-snitsa-UVL0ToTfU2M-unsplash.jpg", popular: 12, dateAdded: '2025-04-12' },
         // ... додай решту товарів, якщо потрібно для сторінки 3 і далі
    ];

    // --- Функція відображення КАРТОК ТОВАРІВ ---
    function displayProducts(productsForPage) {
        productGrid.innerHTML = ''; // Очищуємо перед рендерингом

        if (productsForPage.length === 0) {
            productGrid.innerHTML = '<p>За вибраними критеріями товарів не знайдено.</p>';
            return;
        }

        productsForPage.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            // Додаємо data-атрибути до кнопки
            productCard.innerHTML = `
                <img src="${product.imgSrc}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price} грн</p>
                <button class="add-to-cart-button"
                        data-product-id="${product.id}"
                        data-product-name="${product.name}"
                        data-product-price="${product.price}"
                        data-product-img="${product.imgSrc}">
                    В кошик
                </button>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // --- Основна Функція Сортування та Відображення Поточної Сторінки ---
    function renderCurrentPage(sortByValue = 'popular') {
        console.log(`Рендеринг сторінки ${currentPage}, сортування: ${sortByValue}`);
        let sortedProducts = [...allProducts]; // Копіюємо
        // Логіка сортування
        switch (sortByValue) {
            case 'popular':
                sortedProducts.sort((a, b) => b.popular - a.popular);
                break;
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                sortedProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
        }
        // Логіка пагінації
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsForPage = sortedProducts.slice(startIndex, endIndex);
        console.log(`Товари для сторінки ${currentPage} (${productsForPage.length} шт.):`, productsForPage);
        // Відображення
        displayProducts(productsForPage);
    }

    // --- ОБРОБНИК ПОДІЇ ДЛЯ ФІЛЬТРА СОРТУВАННЯ ---
    sortSelect.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        renderCurrentPage(selectedValue); // Перерендеримо поточну сторінку
    });

    // --- ОБРОБКА КЛІКІВ "В КОШИК" (ДЕЛЕГУВАННЯ ПОДІЙ) ---
    // Додаємо обробник ТІЛЬКИ ЯКЩО він ще не був доданий
    if (!isCatalogListenerAdded) {
         console.log("ДОДАЄМО обробник кліку для .product-grid");
         productGrid.addEventListener('click', (event) => {
             // Перевіряємо, чи клікнули саме на кнопку "В кошик"
             if (event.target.classList.contains('add-to-cart-button')) {
                 console.log(">>> Спрацював обробник ДИНАМІЧНОЇ кнопки (catalogFilter.js)!"); // Лог для дебагу
                 const button = event.target;
                 const productId = button.dataset.productId;
                 const productName = button.dataset.productName;
                 const productPrice = button.dataset.productPrice;
                 const productImg = button.dataset.productImg;

                 // Перевіряємо, чи функція addToCart доступна глобально
                 if (typeof window.addToCart === 'function') {
                     if (productId && productName && productPrice && productImg) {
                         // Викликаємо ГЛОБАЛЬНУ функцію
                         window.addToCart(productId, productName, productPrice, productImg);
                         // Візуальний відгук
                         button.textContent = 'Додано ✔';
                         button.disabled = true;
                         setTimeout(() => {
                             if (button) { // Перевіряємо, чи кнопка ще існує
                                button.textContent = 'В кошик';
                                button.disabled = false;
                             }
                         }, 2000);
                     } else {
                         console.error("Не вдалося отримати дані про товар з data-атрибутів ДИНАМІЧНОЇ кнопки:", button.dataset);
                     }
                 } else {
                     console.error("Функція window.addToCart НЕ доступна з catalogFilter.js.");
                 }
             }
         });
         isCatalogListenerAdded = true; // Позначаємо, що обробник додано
    } else {
         // Цей лог покаже, якщо скрипт намагається додати обробник повторно
         console.warn("Обробник кліку для .product-grid ВЖЕ БУВ ДОДАНИЙ - пропускаємо.");
    }

    // --- ПОЧАТКОВИЙ РЕНДЕРИНГ СТОРІНКИ ---
    // Відображаємо відповідну сторінку з сортуванням за замовчуванням
    renderCurrentPage(sortSelect.value || 'popular'); // Беремо поточне значення фільтра або 'popular'

}); // Кінець DOMContentLoaded