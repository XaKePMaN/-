document.addEventListener('DOMContentLoaded', () => {
   console.log("Сторінка кошика завантажена! (cartLogic.js)");

   // --- Необхідні DOM-елементи ---
   const cartTableBody = document.getElementById('cart-table-body');
   const cartContentContainer = document.getElementById('cart-content');
   const emptyCartMessage = document.getElementById('empty-cart-msg');
   const summarySubtotalEl = document.getElementById('summary-subtotal');
   const summaryTotalEl = document.getElementById('summary-total');
   // Лічильник в хедері (для оновлення тут теж)
   const cartCountSpan = document.querySelector('.cart-count');

   // --- СПІЛЬНІ ФУНКЦІЇ КОШИКА (дублюємо з script.js або краще винести в окремий спільний модуль) ---
   function getCart() {
       const cartJson = localStorage.getItem('shoppingCart');
       try {
           return cartJson ? JSON.parse(cartJson) : [];
       } catch (e) {
           console.error("Помилка парсингу кошика з localStorage:", e);
           return [];
       }
   }

   function saveCart(cartData) {
       try {
           localStorage.setItem('shoppingCart', JSON.stringify(cartData));
       } catch (e) {
           console.error("Помилка збереження кошика в localStorage:", e);
       }
   }

   function updateCartCounter() {
       const cart = getCart();
       if (cartCountSpan) {
           const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
           cartCountSpan.textContent = totalItems;
           // Оновлення класу для можливої стилізації не порожнього кошика
            if (cartCountSpan.parentElement) {
               cartCountSpan.parentElement.classList.toggle('not-empty', totalItems > 0);
           }
       }
   }

   // --- ФУНКЦІЇ СПЕЦИФІЧНІ ДЛЯ СТОРІНКИ КОШИКА ---

   // Функція: Оновлення підсумків (Subtotal, Total)
   function updateCartSummary() {
       const cart = getCart();
       let subtotal = 0;
       cart.forEach(item => {
           // Переконуємось, що ціна і кількість - числа
           const price = parseFloat(item.price) || 0;
           const quantity = parseInt(item.quantity, 10) || 0;
           subtotal += price * quantity;
       });

       // TODO: Додати логіку розрахунку доставки, якщо потрібно
       const shippingCost = 0; // Поки що доставка безкоштовна або не враховується
       const total = subtotal + shippingCost;

       if (summarySubtotalEl) {
           summarySubtotalEl.textContent = `${subtotal.toFixed(2)} грн`;
       }
       if (summaryTotalEl) {
           summaryTotalEl.textContent = `${total.toFixed(2)} грн`;
       }
   }

   // Функція: Відображення товарів у таблиці кошика
   function renderCartItems() {
       const cart = getCart();
       if (!cartTableBody) return; // Виходимо, якщо таблиці немає

       // Очищуємо поточний вміст таблиці
       cartTableBody.innerHTML = '';

       if (cart.length === 0) {
           // Якщо кошик порожній - показуємо повідомлення, ховаємо таблицю і підсумок
           if (emptyCartMessage) emptyCartMessage.classList.add('visible');
           if (cartContentContainer) cartContentContainer.style.display = 'none';
       } else {
           // Якщо є товари - ховаємо повідомлення, показуємо таблицю і підсумок
           if (emptyCartMessage) emptyCartMessage.classList.remove('visible');
           if (cartContentContainer) cartContentContainer.style.display = 'grid'; // Повертаємо grid

           cart.forEach(item => {
               const row = document.createElement('tr');
               const itemSubtotal = (parseFloat(item.price) * parseInt(item.quantity, 10)).toFixed(2);

               row.innerHTML = `
                   <td>
                       <div class="cart-item-details">
                           <img src="${item.img || 'images/placeholder.png'}" alt="${item.name || 'Назва товару'}">
                       </div>
                   </td>
                   <td><h4>${item.name || 'Назва товару'}</h4></td>
                   <td>${parseFloat(item.price).toFixed(2)} грн</td>
                   <td>
                       <div class="quantity-controls">
                           <button class="quantity-decrease" data-product-id="${item.id}">-</button>
                           <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-product-id="${item.id}">
                           <button class="quantity-increase" data-product-id="${item.id}">+</button>
                       </div>
                   </td>
                   <td class="hide-mobile">${itemSubtotal} грн</td>
                   <td>
                       <button class="remove-item-button" title="Видалити товар" data-product-id="${item.id}">✕</button>
                   </td>
               `;
               cartTableBody.appendChild(row);
           });
       }
        // Оновлюємо підсумки та лічильник в хедері після рендерингу
        updateCartSummary();
        updateCartCounter();
   }

   // Функція: Зміна кількості товару
   function changeQuantity(productId, change) { // change може бути +1 або -1
        const cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
           const newQuantity = cart[itemIndex].quantity + change;
           if (newQuantity > 0) {
               cart[itemIndex].quantity = newQuantity;
                saveCart(cart);
                renderCartItems(); // Перемальовуємо кошик
           } else {
               // Якщо кількість стала 0 або менше, видаляємо товар
               removeItemFromCart(productId);
           }
        }
   }

    // Функція: Оновлення кількості з поля вводу
    function updateQuantityFromInput(productId, newQuantity) {
        const cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);
        const quantity = parseInt(newQuantity, 10);

        if (itemIndex > -1) {
           if (quantity > 0 && quantity <= 99) { // Перевірка на валідність
               cart[itemIndex].quantity = quantity;
                saveCart(cart);
                renderCartItems();
            } else if (quantity <= 0) {
                removeItemFromCart(productId); // Видаляємо, якщо ввели 0 або менше
            } else {
                // Якщо ввели не число або більше 99, просто повертаємо старе значення
                renderCartItems(); // Перемальовуємо, щоб відновити поле вводу
            }
        }
    }

   // Функція: Видалення товару з кошика
   function removeItemFromCart(productId) {
       let cart = getCart();
       cart = cart.filter(item => item.id !== productId); // Залишаємо всі товари, крім видаленого
       saveCart(cart);
       renderCartItems(); // Перемальовуємо кошик
       console.log(`Товар ${productId} видалено. Кошик:`, getCart());
   }


   // --- ОБРОБНИКИ ПОДІЙ (Використовуємо Делегування) ---
   if (cartTableBody) {
    cartTableBody.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.dataset.productId;

        if (!productId) return; // Виходимо, якщо клік не по кнопці з ID

        if (target.classList.contains('quantity-increase')) {
            changeQuantity(productId, 1);
        } else if (target.classList.contains('quantity-decrease')) {
            changeQuantity(productId, -1);
        } else if (target.classList.contains('remove-item-button')) {
            // Просто викликаємо функцію видалення одразу
            removeItemFromCart(productId);
        }
    });

     // Обробник для зміни значення в полі input кількості
     cartTableBody.addEventListener('change', (event) => {
         const target = event.target;
         if (target.classList.contains('quantity-input')) {
             const productId = target.dataset.productId;
             const newQuantity = target.value;
             if (productId) {
                 updateQuantityFromInput(productId, newQuantity);
             }
         }
     });
}


   // --- ІНІЦІАЛІЗАЦІЯ СТОРІНКИ КОШИКА ---
   renderCartItems(); // Відображаємо товари при завантаженні сторінки

}); // Кінець DOMContentLoaded