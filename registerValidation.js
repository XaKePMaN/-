document.addEventListener('DOMContentLoaded', () => {
   console.log("Логіка валідації реєстрації завантажена! (registerValidation.js)");

   // --- Знаходимо елементи форми ---
   const registerForm = document.getElementById('register-form');
   const nameInput = document.getElementById('name');
   const emailInput = document.getElementById('email');
   const phoneInput = document.getElementById('phone');
   const passwordInput = document.getElementById('password');
   const confirmPasswordInput = document.getElementById('confirm-password');

   // Знаходимо елементи для виводу помилок
   const nameError = document.getElementById('name-error');
   const emailError = document.getElementById('email-error');
   const phoneError = document.getElementById('phone-error');
   const passwordError = document.getElementById('password-error');
   const confirmPasswordError = document.getElementById('confirm-password-error');

   // Перевіряємо, чи форма існує та чи доступний об'єкт auth
   if (!registerForm || typeof window.auth === 'undefined') {
       if (!registerForm) {
            console.error("Форма #register-form не знайдена.");
       }
       if (typeof window.auth === 'undefined') {
           console.error("Об'єкт window.auth не доступний. Перевір firebase-init.js та порядок скриптів.");
       }
       return; // Зупиняємо виконання, якщо чогось не вистачає
   }

   registerForm.addEventListener('submit', (event) => {
       event.preventDefault(); // Зупиняємо стандартну відправку
       console.log("Спроба відправки форми реєстрації...");

       clearErrors(); // Скидаємо попередні помилки

       const name = nameInput.value.trim();
       const email = emailInput.value.trim();
       const phone = phoneInput.value.trim();
       const password = passwordInput.value.trim();
       const confirmPassword = confirmPasswordInput.value.trim();

       let isValid = true;

       // --- Клієнтська Валідація (залишається такою ж) ---
       if (name === '') { showError(nameError, 'Будь ласка, введіть ваше ім\'я.'); isValid = false; }
       if (email === '') { showError(emailError, 'Будь ласка, введіть ваш email.'); isValid = false; }
       else if (!isValidEmail(email)) { showError(emailError, 'Будь ласка, введіть коректний email.'); isValid = false; }
       if (password === '') { showError(passwordError, 'Будь ласка, введіть пароль.'); isValid = false; }
       else if (password.length < 6) { showError(passwordError, 'Пароль має містити щонайменше 6 символів.'); isValid = false; }
       if (confirmPassword === '') { showError(confirmPasswordError, 'Будь ласка, підтвердіть пароль.'); isValid = false; }
       else if (password !== confirmPassword) { showError(confirmPasswordError, 'Паролі не співпадають.'); isValid = false; }
       // Валідація телефону поки відсутня

       // --- Якщо клієнтська валідація пройшла ---
       if (isValid) {
           console.log('Клієнтська валідація пройдена. Спроба реєстрації через Firebase...');
           // Блокуємо кнопку на час запиту
           const submitButton = registerForm.querySelector('button[type="submit"]');
           submitButton.disabled = true;
           submitButton.textContent = 'Реєстрація...';

           // !!! ВИКЛИКАЄМО ФУНКЦІЮ FIREBASE !!!
           window.auth.createUserWithEmailAndPassword(email, password)
               .then((userCredential) => {
                   // Успішна реєстрація!
                   const user = userCredential.user;
                   console.log('Користувач успішно зареєстрований:', user);
                   alert('Ви успішно зареєстровані!');

                   // Опціонально: тут можна зберегти додаткові дані користувача (ім'я, телефон)
                   // в базу даних Firebase Firestore або Realtime Database,
                   // пов'язавши їх з user.uid (унікальним ID користувача).

                   // Очищуємо форму
                   registerForm.reset();
                   // Можна перенаправити на сторінку входу або на головну
                   window.location.href = 'login.html'; // Перехід на сторінку входу

               })
               .catch((error) => {
                   // Обробка помилок від Firebase
                   console.error("Помилка реєстрації Firebase:", error.code, error.message);

                   // Показуємо користувачу зрозуміле повідомлення про помилку
                   switch (error.code) {
                       case 'auth/email-already-in-use':
                           showError(emailError, 'Цей email вже використовується.');
                           break;
                       case 'auth/invalid-email':
                           showError(emailError, 'Некоректний формат email.');
                           break;
                       case 'auth/weak-password':
                           showError(passwordError, 'Пароль занадто слабкий (має бути не менше 6 символів).');
                           break;
                       default:
                           // Загальна помилка (можна показати її в окремому місці форми)
                           alert(`Помилка реєстрації: ${error.message}`);
                   }
               })
               .finally(() => {
                    // Розблоковуємо кнопку в будь-якому випадку
                    submitButton.disabled = false;
                    submitButton.textContent = 'Зареєструватися';
               });

       } else {
           console.log('Форма містить помилки клієнтської валідації.');
       }
   });

   // --- Допоміжні функції (залишаються без змін) ---
   function showError(errorElement, message) { /* ... */ }
   function clearErrors() { /* ... */ }
   function isValidEmail(email) { /* ... */ }

    // Не забудь додати стилі для .input-error у style.css, якщо ще не додав
    /*
    .input-error {
        border-color: #e74c3c !important;
        background-color: #fdd !important;
    }
    */

}); // Кінець DOMContentLoaded