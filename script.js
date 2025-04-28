// Весь код обгорнуто в один DOMContentLoaded, щоб він виконувався після завантаження HTML
document.addEventListener('DOMContentLoaded', () => {
    console.log("Сторінка завантажена та готова! (script.js)");

    // --- Мобільне меню ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.navigation');

    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', () => {
            navigation.classList.toggle('active'); // Додаємо/видаляємо клас 'active'
            // Зміна іконки бургер-меню на хрестик
            if (navigation.classList.contains('active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });

        // Закриття меню при кліку на посилання (якщо це якірні посилання або для SPA)
        const navLinks = navigation.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Закриваємо меню тільки якщо воно активне
                if (navigation.classList.contains('active')) {
                    navigation.classList.remove('active');
                    menuToggle.textContent = '☰';
                }
            });
        });

        // Закриття меню при кліку поза ним
         document.addEventListener('click', (event) => {
             // Перевіряємо, що клік був не по меню і не по кнопці відкриття
             const isClickInsideNav = navigation.contains(event.target);
             const isClickOnToggle = menuToggle.contains(event.target);

             if (!isClickInsideNav && !isClickOnToggle && navigation.classList.contains('active')) {
                 navigation.classList.remove('active');
                 menuToggle.textContent = '☰';
             }
         });
    } else {
        // console.warn("Елементи мобільного меню (.mobile-menu-toggle або .navigation) не знайдені.");
    }


    // --- ЛОГІКА КОШИКА (СПІЛЬНІ ФУНКЦІЇ) ---

    // Функція: Отримати кошик з localStorage
    function getCart() {
        const cartJson = localStorage.getItem('shoppingCart');
        try {
            // Повертаємо розпарсений об'єкт або порожній масив, якщо кошика немає або дані некоректні
            return cartJson ? JSON.parse(cartJson) : [];
        } catch (e) {
            console.error("Помилка парсингу кошика з localStorage:", e);
            return []; // Безпечне повернення порожнього масиву
        }
    }

    // Функція: Зберегти кошик у localStorage
    function saveCart(cartData) {
        try {
             localStorage.setItem('shoppingCart', JSON.stringify(cartData));
        } catch (e) {
             console.error("Помилка збереження кошика в localStorage:", e);
        }
    }

    // Функція: Оновити лічильник кошика в хедері
    function updateCartCounter() {
        const cart = getCart(); // Отримуємо актуальні дані
        const cartCountSpan = document.querySelector('.cart-count');
        if (cartCountSpan) {
            // Рахуємо загальну кількість *одиниць* товару
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountSpan.textContent = totalItems;
            // Можна додати клас, якщо кошик не порожній, для стилізації
             cartCountSpan.parentElement.classList.toggle('not-empty', totalItems > 0);
        } else {
             // console.warn("Елемент лічильника кошика (.cart-count) не знайдено.");
        }
    }

    // Функція: Додати товар до кошика (використовується при кліку на кнопки)
    function addToCart(productId, productName, productPrice, productImg) {
        if (!productId || !productName || isNaN(parseFloat(productPrice)) || !productImg) {
             console.error("Недостатньо даних для додавання товару в кошик:", { productId, productName, productPrice, productImg });
             return; // Не додаємо товар, якщо дані некоректні
        }

        const cart = getCart();
        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            // Збільшуємо кількість існуючого товару
            cart[existingItemIndex].quantity += 1;
        } else {
            // Додаємо новий товар
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice), // Завжди зберігаємо ціну як число
                img: productImg,
                quantity: 1
            });
        }
        saveCart(cart); // Зберігаємо зміни
        updateCartCounter(); // Оновлюємо лічильник
        console.log('Товар додано/оновлено. Кошик:', getCart()); // Лог для перевірки
    }


    // --- ОБРОБКА КЛІКІВ НА СТАТИЧНИХ КНОПКАХ "В КОШИК" ---
    // Знаходить кнопки, які присутні в HTML при завантаженні сторінки
    // (наприклад, в секції "Популярні букети" на index.html)
    const staticAddToCartButtons = document.querySelectorAll('.add-to-cart-button');

    if (staticAddToCartButtons.length > 0) {
         staticAddToCartButtons.forEach(button => {
            // Додаємо обробник тільки якщо кнопка має необхідні data-атрибути
            // Це допомагає уникнути конфліктів з кнопками, що генеруються динамічно
            // і можуть мати іншу логіку додавання обробників.
            if (button.dataset.productId) {
                 button.addEventListener('click', (event) => {
                    // Отримуємо дані про товар з data-атрибутів кнопки, яка була натиснута
                    const targetButton = event.currentTarget; // Використовуємо currentTarget для надійності
                    const productId = targetButton.dataset.productId;
                    const productName = targetButton.dataset.productName;
                    const productPrice = targetButton.dataset.productPrice;
                    const productImg = targetButton.dataset.productImg;

                    // Перевіряємо, чи всі дані отримані
                    if (productId && productName && productPrice && productImg) {
                        addToCart(productId, productName, productPrice, productImg);

                        // --- Візуальний відгук (опціонально) ---
                        targetButton.textContent = 'Додано ✔';
                        targetButton.disabled = true;
                        setTimeout(() => {
                            targetButton.textContent = 'В кошик';
                            targetButton.disabled = false;
                        }, 2000);
                         // --- Кінець візуального відгуку ---
                    } else {
                        console.error("Не вдалося отримати дані про товар з data-атрибутів кнопки:", targetButton);
                    }
                 });
            }
         });
     } else {
         // console.warn("Статичні кнопки .add-to-cart-button не знайдені.");
     }


    // --- Плавний скрол до якорів ---
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    if (smoothScrollLinks.length > 0) {
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // Перевіряємо, чи це не просто "#" (порожній якір)
                if (href && href !== '#') {
                    try {
                         const targetElement = document.querySelector(href);
                         if (targetElement) {
                             e.preventDefault(); // Відміняємо стандартний перехід тільки якщо елемент знайдено
                             targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                             });
                         } else {
                             console.warn(`Елемент з ID "${href}" для плавного скролу не знайдено.`);
                         }
                     } catch (error) {
                         console.error(`Помилка пошуку елемента для плавного скролу (${href}):`, error);
                     }
                }
            });
        });
    }


    // --- Анімація появи секцій при скролі ---
    const sectionsToAnimate = document.querySelectorAll('.section');
    // Перевіряємо, чи браузер підтримує IntersectionObserver
    if (sectionsToAnimate.length > 0 && 'IntersectionObserver' in window) {
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
                    // Розкоментуй, якщо анімація потрібна лише один раз при першій появі
                    // observer.unobserve(entry.target);
                }
                // Можна додати else, щоб секція знову ставала прозорою, коли виходить з viewport
                // else {
                //     entry.target.style.opacity = '0';
                //     entry.target.style.transform = 'translateY(30px)';
                // }
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
    }


    // --- ІНІЦІАЛІЗАЦІЯ ЛІЧИЛЬНИКА КОШИКА ---
    // Оновлюємо лічильник при першому завантаженні сторінки
    updateCartCounter();

}); // Кінець єдиного DOMContentLoaded