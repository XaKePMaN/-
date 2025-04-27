document.addEventListener('DOMContentLoaded', () => {
   console.log("Сторінка завантажена та готова!");

   // --- Мобільне меню ---
   const menuToggle = document.querySelector('.mobile-menu-toggle');
   const navigation = document.querySelector('.navigation');

   if (menuToggle && navigation) {
       menuToggle.addEventListener('click', () => {
           navigation.classList.toggle('active'); // Додаємо/видаляємо клас 'active'
           // Можна змінити іконку бургер-меню на хрестик
           if (navigation.classList.contains('active')) {
               menuToggle.textContent = '✕';
           } else {
               menuToggle.textContent = '☰';
           }
       });

        // Закриття меню при кліку на посилання (якщо це якірні посилання)
       const navLinks = navigation.querySelectorAll('a');
       navLinks.forEach(link => {
           link.addEventListener('click', () => {
               if (navigation.classList.contains('active')) {
                   navigation.classList.remove('active');
                   menuToggle.textContent = '☰';
               }
           });
       });

        // Закриття меню при кліку поза ним (опціонально)
        document.addEventListener('click', (event) => {
            const isClickInsideNav = navigation.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navigation.classList.contains('active')) {
                navigation.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
   }

   // --- Інтерактив для кнопок "В кошик" ---
   const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
   const cartCountSpan = document.querySelector('.cart-count');
   let cartItemCount = 0; // Початкова кількість товарів у кошику

   if (addToCartButtons.length > 0 && cartCountSpan) {
       addToCartButtons.forEach(button => {
           button.addEventListener('click', () => {
               // Тут буде логіка додавання товару в кошик (наприклад, AJAX запит)
               // Поки що просто імітуємо додавання
               cartItemCount++;
               cartCountSpan.textContent = cartItemCount;
               button.textContent = 'Додано ✔';
               button.disabled = true; // Можна заблокувати кнопку після додавання

               // Повертаємо текст кнопки через деякий час (опціонально)
                setTimeout(() => {
                    button.textContent = 'В кошик';
                    button.disabled = false;
                }, 2000);

               console.log("Товар додано в кошик!");
           });
       });
   }


   // --- Плавний скрол до якорів (приклад) ---
   const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

   smoothScrollLinks.forEach(link => {
       link.addEventListener('click', function (e) {
           e.preventDefault(); // Відміняємо стандартний перехід

           const targetId = this.getAttribute('href');
           const targetElement = document.querySelector(targetId);

           if (targetElement) {
               targetElement.scrollIntoView({
                   behavior: 'smooth', // Плавна прокрутка
                   block: 'start' // До верхньої межі елемента
               });
           }
       });
   });

   // --- Проста анімація появи секцій при скролі (приклад з Intersection Observer) ---
    const sectionsToAnimate = document.querySelectorAll('.section'); // Або конкретніші селектори

    const observerOptions = {
        root: null, // Відносно viewport
        rootMargin: '0px',
        threshold: 0.1 // Спрацює, коли 10% секції видно
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Можна відписатися від спостереження після анімації
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sectionsToAnimate.forEach(section => {
        // Початковий стан для анімації
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        // Починаємо спостереження
        sectionObserver.observe(section);
    });

}); // Кінець DOMContentLoaded

//-------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

    // Знаходимо потрібні елементи на сторінці
    const sortSelect = document.getElementById('sort-by');
    const productGrid = document.querySelector('.product-grid');
 
    // --- ДАНІ ПРО ТОВАРИ ---
    // Важливо! Тобі потрібно заповнити цей масив реальними даними
    // Додай сюди всі товари, які мають бути в каталозі.
    // Додай властивості, за якими будеш сортувати (price, popular, dateAdded)
    const allProducts = [
        { id: 1, name: "Букет \"Ніжність\"", price: 1200, imgSrc: "images/nijnist.jpg", popular: 5, dateAdded: '2025-04-25' },
        { id: 2, name: "Букет \"Весняний настрій\"", price: 950, imgSrc: "images/Vesnyaniy_Nastriy.webp", popular: 4, dateAdded: '2025-04-26' },
        { id: 3, name: "Авторський букет \"Натхнення\"", price: 1800, imgSrc: "images/nathnenna.webp", popular: 6, dateAdded: '2025-04-20' },
        { id: 4, name: "Квіти в коробці \"Елегант\"", price: 1500, imgSrc: "images/kvityVKorobtsi.webp", popular: 7, dateAdded: '2025-04-27' },
        { id: 5, name: "Букет \"Сонячний день\"", price: 1100, imgSrc: "images/sona4niyDEN.webp", popular: 3, dateAdded: '2025-04-24' },
        { id: 6, name: "Букет \"Легкість\"", price: 1350, imgSrc: "images/monobuqetEUSTR.jfif", popular: 5, dateAdded: '2025-04-22' },
        { id: 7, name: "Весільний букет \"Мрія\"", price: 2500, imgSrc: "images/vesilnyBuqet.jfif", popular: 8, dateAdded: '2025-04-15' },
        { id: 8, name: "Букет \"Стильний презент\"", price: 1600, imgSrc: "images/MUJITSKIBUQET.jpg", popular: 10, dateAdded: '2025-04-23' },
         // ... додай сюди ВСІ товари каталогу
    ];
 
    // --- ФУНКЦІЯ ВІДОБРАЖЕННЯ ТОВАРІВ ---
    function displayProducts(productsToDisplay) {
        // Очищуємо поточний вміст сітки
        if (productGrid) {
             productGrid.innerHTML = '';
 
             // Створюємо та додаємо картку для кожного товару
             productsToDisplay.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card'); // Використовуємо існуючий клас стилів
 
                productCard.innerHTML = `
                    <img src="${product.imgSrc}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price} грн</p>
                    <button class="add-to-cart-button">В кошик</button>
                `;
                // !!! Важливо: Якщо кнопка "В кошик" має додавати саме цей товар,
                // їй потрібно додати обробник подій або data-атрибут з ID товару тут.
                // Наприклад: <button class="add-to-cart-button" data-product-id="${product.id}">В кошик</button>
 
                productGrid.appendChild(productCard);
             });
         } else {
            console.error("Елемент .product-grid не знайдено!");
         }
    }
 
    // --- ФУНКЦІЯ СОРТУВАННЯ ---
    function sortProducts(sortByValue) {
        // Створюємо КОПІЮ масиву, щоб не змінювати оригінальний порядок `allProducts`
        let sortedProducts = [...allProducts];
 
        switch (sortByValue) {
            case 'popular':
                // Сортуємо за популярністю (від більшої до меншої)
                // Припускаємо, що `popular` - це число, де більше = популярніше
                sortedProducts.sort((a, b) => b.popular - a.popular);
                break;
            case 'price-asc':
                // Сортуємо за ціною: від низької до високої
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                // Сортуємо за ціною: від високої до низької
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                 // Сортуємо за датою додавання: від новіших до старіших
                 // Перетворюємо рядки дати на об'єкти Date для коректного порівняння
                 sortedProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                 break;
            // Можна додати 'default', якщо потрібно (наприклад, сортування за ID чи назвою)
        }
 
        // Відображаємо відсортовані товари
        displayProducts(sortedProducts);
    }
 
 
    // --- ОБРОБНИК ПОДІЇ ДЛЯ ВИПАДАЮЧОГО СПИСКУ ---
    if (sortSelect) {
        sortSelect.addEventListener('change', (event) => {
            const selectedValue = event.target.value; // Отримуємо значення обраного <option>
            sortProducts(selectedValue);
        });
    } else {
        console.error("Елемент #sort-by не знайдено!");
    }
 
 
    // --- ПОЧАТКОВЕ ВІДОБРАЖЕННЯ ТОВАРІВ ---
    // При завантаженні сторінки відображаємо товари в початковому порядку
    // або відсортовані за замовчуванням (наприклад, 'popular')
    sortProducts(sortSelect ? sortSelect.value : 'popular'); // Використовуємо значення за замовчуванням, якщо select існує
 
    // !!! Примітка щодо пагінації:
    // Цей код сортує ВСІ товари з масиву `allProducts`.
    // Якщо ти хочеш поєднати це з пагінацією, логіка ускладниться:
    // Спочатку потрібно буде відсортувати *всі* товари, а потім
    // вибрати з відсортованого масиву лише ті, що відповідають *поточній* сторінці пагінації,
    // і лише їх передати у функцію `displayProducts`.
 
 
    // --- ДОДАТКОВИЙ КОД (мобільне меню, кошик тощо) ---
    // ... (код для мобільного меню, кошика, який був раніше) ...
 
 }); // Кінець DOMContentLoaded