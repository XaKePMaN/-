// Весь код обгорнуто в один DOMContentLoaded, щоб він виконувався після завантаження HTML

// !!! ВАЖЛИВО: Визначаємо спільні функції кошика ГЛОБАЛЬНО (прив'язуємо до window) !!!
// Це робиться для того, щоб ці функції були доступні з інших скриптів (напр., catalogFilter.js)

// Функція: Отримати кошик з localStorage
window.getCart = function() {
    const cartJson = localStorage.getItem('shoppingCart');
    try {
        return cartJson ? JSON.parse(cartJson) : [];
    } catch (e) {
        console.error("Помилка парсингу кошика з localStorage:", e);
        return [];
    }
}; // <--- Зверни увагу на крапку з комою

// Функція: Зберегти кошик у localStorage
window.saveCart = function(cartData) {
    try {
        localStorage.setItem('shoppingCart', JSON.stringify(cartData));
    } catch (e) {
        console.error("Помилка збереження кошика в localStorage:", e);
    }
}; // <--- Зверни увагу на крапку з комою

// Функція: Оновити лічильник кошика в хедері
window.updateCartCounter = function() {
    const cart = window.getCart(); // Викликаємо глобальну версію
    const cartCountSpan = document.querySelector('.cart-count');
    if (cartCountSpan) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        if (cartCountSpan.parentElement) {
            cartCountSpan.parentElement.classList.toggle('not-empty', totalItems > 0);
        }
    }
}; // <--- Зверни увагу на крапку з комою

// Функція: Додати товар до кошика
window.addToCart = function(productId, productName, productPrice, productImg) {
    console.log(`--- Виклик window.addToCart для ID: ${productId} ---`);
    if (!productId || !productName || isNaN(parseFloat(productPrice)) || !productImg) {
         console.error("Недостатньо даних для додавання товару в кошик:", { productId, productName, productPrice, productImg });
         return;
    }
    const cart = window.getCart(); // Викликаємо глобальну версію
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            img: productImg,
            quantity: 1
        });
    }
    window.saveCart(cart); // Викликаємо глобальну версію
    window.updateCartCounter(); // Викликаємо глобальну версію
    console.log('Товар додано/оновлено (глобальна addToCart). Кошик:', window.getCart());
}; // <--- Зверни увагу на крапку з комою


// Тепер основний код, який виконується після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("Сторінка завантажена та готова! (script.js)");

    // --- Мобільне меню ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.navigation');
    if (menuToggle && navigation) {
        // ... (твій код для мобільного меню без змін) ...
         menuToggle.addEventListener('click', () => {
            navigation.classList.toggle('active');
             if (navigation.classList.contains('active')) {
                 menuToggle.textContent = '✕';
             } else {
                 menuToggle.textContent = '☰';
             }
         });
         const navLinks = navigation.querySelectorAll('a');
         navLinks.forEach(link => {
            link.addEventListener('click', () => {
                 if (navigation.classList.contains('active')) {
                     navigation.classList.remove('active');
                     menuToggle.textContent = '☰';
                 }
             });
         });
          document.addEventListener('click', (event) => {
             const isClickInsideNav = navigation.contains(event.target);
             const isClickOnToggle = menuToggle.contains(event.target);
             if (!isClickInsideNav && !isClickOnToggle && navigation.classList.contains('active')) {
                 navigation.classList.remove('active');
                 menuToggle.textContent = '☰';
             }
         });
    }

    // --- Плавний скрол до якорів ---
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    if (smoothScrollLinks.length > 0) {
        // ... (твій код для плавного скролу без змін) ...
        smoothScrollLinks.forEach(link => {
             link.addEventListener('click', function (e) {
                 const href = this.getAttribute('href');
                 if (href && href !== '#') {
                     try {
                          const targetElement = document.querySelector(href);
                          if (targetElement) {
                              e.preventDefault();
                              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (sectionsToAnimate.length > 0 && 'IntersectionObserver' in window) {
        // ... (твій код для Intersection Observer без змін) ...
         const observerOptions = { threshold: 0.1 };
         const sectionObserver = new IntersectionObserver((entries, observer) => {
             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                     entry.target.style.opacity = '1';
                     entry.target.style.transform = 'translateY(0)';
                     // observer.unobserve(entry.target);
                 }
             });
         }, observerOptions);
         sectionsToAnimate.forEach(section => {
             section.style.opacity = '0';
             section.style.transform = 'translateY(30px)';
             section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
             sectionObserver.observe(section);
         });
    }

    // --- ІНІЦІАЛІЗАЦІЯ ЛІЧИЛЬНИКА КОШИКА ---
    // Оновлюємо лічильник при першому завантаженні сторінки
    window.updateCartCounter(); // Викликаємо глобальну функцію

}); // Кінець DOMContentLoaded