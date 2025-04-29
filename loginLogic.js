// Файл: loginLogic.js
document.addEventListener('DOMContentLoaded', () => {
   console.log("Логіка логіну завантажена! (loginLogic.js)");

   // --- Знаходимо елементи форми ---
   const loginForm = document.getElementById('login-form');
   const emailInput = document.getElementById('email');
   const passwordInput = document.getElementById('password');
   const loginError = document.getElementById('login-error'); // Елемент для загальних помилок

   // Перевіряємо, чи форма та Firebase auth доступні
   if (!loginForm || typeof window.auth === 'undefined') {
       if(!loginForm) console.error("Форма #login-form не знайдена.");
       if(typeof window.auth === 'undefined') console.error("Об'єкт window.auth не доступний.");
       return;
   }

   // Додаємо слухача події "submit" до форми
   loginForm.addEventListener('submit', (event) => {
       event.preventDefault(); // Зупиняємо стандартну відправку
       console.log("Спроба входу...");

       // Скидаємо попередні помилки
       if(loginError) {
           loginError.textContent = '';
           loginError.style.display = 'none';
       }
       emailInput.classList.remove('input-error');
       passwordInput.classList.remove('input-error');

       // Отримуємо значення
       const email = emailInput.value.trim();
       const password = passwordInput.value.trim();

       let isValid = true;

       // --- Базова клієнтська валідація ---
       if (email === '') {
           // Можна додати показ помилки під полем email, як у реєстрації,
           // але для логіну часто достатньо однієї загальної помилки.
           isValid = false;
           emailInput.classList.add('input-error'); // Підсвітимо поле
       }
       if (password === '') {
           isValid = false;
           passwordInput.classList.add('input-error'); // Підсвітимо поле
       }

       if (!isValid) {
            if(loginError) {
                loginError.textContent = 'Будь ласка, введіть email та пароль.';
                loginError.style.display = 'block';
            }
            console.log("Помилка клієнтської валідації логіну.");
            return; // Не відправляємо запит, якщо поля порожні
       }

       // --- Якщо поля заповнені, пробуємо увійти через Firebase ---
       console.log('Клієнтська валідація логіну пройдена. Спроба входу через Firebase...');
       const submitButton = loginForm.querySelector('button[type="submit"]');
       submitButton.disabled = true;
       submitButton.textContent = 'Вхід...';

       // !!! ВИКЛИКАЄМО ФУНКЦІЮ FIREBASE ДЛЯ ВХОДУ !!!
       window.auth.signInWithEmailAndPassword(email, password)
           .then((userCredential) => {
               // Успішний вхід!
               const user = userCredential.user;
               console.log('Користувач успішно увійшов:', user);
               alert('Вхід виконано успішно!');

               // Перенаправляємо на головну сторінку (або в кабінет користувача)
               window.location.href = 'index.html';

           })
           .catch((error) => {
               // Обробка помилок входу від Firebase
               console.error("Помилка входу Firebase:", error.code, error.message);

               // Показуємо користувачу загальну помилку
               if (loginError) {
                   // Не варто показувати конкретну причину (user-not-found чи wrong-password)
                   // з міркувань безпеки. Краще загальне повідомлення.
                    loginError.textContent = 'Неправильний email або пароль.';
                    loginError.style.display = 'block';
                    emailInput.classList.add('input-error');
                    passwordInput.classList.add('input-error');
               } else {
                    alert('Неправильний email або пароль.'); // Якщо немає елемента для помилки
               }
           })
           .finally(() => {
               // Розблоковуємо кнопку
                submitButton.disabled = false;
                submitButton.textContent = 'Увійти';
           });
   });

    // Додатковий CSS для підсвічування полів з помилками (додай у style.css)
    /*
    .input-error {
        border-color: #e74c3c !important;
        background-color: #fdd !important;
    }
    .error-message {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 5px;
        display: none;
    }
    */

}); // Кінець DOMContentLoaded