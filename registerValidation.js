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

    // --- ВИЗНАЧЕННЯ ДОПОМІЖНИХ ФУНКЦІЙ ---
    // (Розміщуємо їх тут, щоб вони були доступні для обробника submit)

    // Функція для показу помилки
    function showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block'; // Показуємо елемент з помилкою
             // Додаємо клас до інпуту для візуального виділення
             if (errorElement.previousElementSibling && errorElement.previousElementSibling.tagName === 'INPUT') {
                 errorElement.previousElementSibling.classList.add('input-error');
             }
        } else {
            console.warn("Спроба показати помилку для неіснуючого елемента.");
        }
    }

    // Функція для очищення всіх помилок
    function clearErrors() {
        const errorMessages = registerForm.querySelectorAll('.error-message');
        errorMessages.forEach(span => {
            if(span) {
                span.textContent = '';
                span.style.display = 'none'; // Ховаємо елемент
            }
        });
         const errorInputs = registerForm.querySelectorAll('.input-error');
         errorInputs.forEach(input => {
             input.classList.remove('input-error');
         });
    }

    // Функція для базової перевірки формату email
    function isValidEmail(email) {
        console.log(`[Debug][isValidEmail] Перевіряю email: '${email}' (Тип: ${typeof email})`);
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Стандартний простий regex
        console.log(`[Debug][isValidEmail] Використовую regex: ${regex}`);
        const result = regex.test(email);
        console.log(`[Debug][isValidEmail] Результат regex.test(): ${result}`); // Має бути true для коректного email
        return result;
    }


    // --- Перевірка наявності форми та Firebase Auth ---
    if (!registerForm) {
        console.error("Форма #register-form не знайдена.");
        return; // Зупиняємо виконання, якщо немає форми
    }
    if (typeof window.auth === 'undefined') {
        console.error("Об'єкт window.auth не доступний. Перевір firebase-init.js та порядок скриптів.");
        // Не зупиняємо повністю, можливо, потрібна лише валідація без Firebase
        // return;
    }


    // --- Обробник події SUBMIT для форми ---
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log("Спроба відправки форми реєстрації...");

        clearErrors(); // Очищуємо помилки перед новою валідацією

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        let isValid = true;
        console.log('[Debug] Initial isValid:', isValid);

        // 1. Ім'я
        if (name === '') { showError(nameError, 'Будь ласка, введіть ваше ім\'я.'); isValid = false; }
        console.log(`[Debug] After Name Check (value='${name}') isValid:`, isValid);

        // 2. Email
        if (email === '') { showError(emailError, 'Будь ласка, введіть ваш email.'); isValid = false; }
        else if (!isValidEmail(email)) { showError(emailError, 'Будь ласка, введіть коректний email.'); isValid = false; }
        console.log(`[Debug] After Email Check (value='${email}') isValid:`, isValid);

        // 3. Телефон (без валідації)
        console.log(`[Debug] After Phone Check (value='${phone}') isValid:`, isValid);

        // 4. Пароль
        if (password === '') { showError(passwordError, 'Будь ласка, введіть пароль.'); isValid = false; }
        else if (password.length < 6) { showError(passwordError, 'Пароль має містити щонайменше 6 символів.'); isValid = false; }
        console.log(`[Debug] After Password Check (length=${password.length}) isValid:`, isValid);

        // 5. Підтвердження пароля
        console.log(`[Debug] Comparing passwords: Pwd='${password}' ConfirmPwd='${confirmPassword}'`);
        if (confirmPassword === '') { showError(confirmPasswordError, 'Будь ласка, підтвердіть пароль.'); isValid = false; }
        else if (password !== confirmPassword) { showError(confirmPasswordError, 'Паролі не співпадають.'); isValid = false; }
        console.log('[Debug] After ConfirmPwd Check isValid:', isValid);

        // --- Кінець валідації ---

        console.log('[Debug] Final isValid before Firebase call:', isValid);
        if (isValid) {
            console.log('Клієнтська валідація пройдена. Спроба реєстрації через Firebase...');
             // Перевіряємо ще раз доступність auth перед викликом
             if (typeof window.auth !== 'undefined') {
                 const submitButton = registerForm.querySelector('button[type="submit"]');
                 submitButton.disabled = true;
                 submitButton.textContent = 'Реєстрація...';

                 window.auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log('Користувач успішно зареєстрований:', user);
                        alert('Ви успішно зареєстровані!');
                        registerForm.reset();
                        window.location.href = 'login.html';
                    })
                    .catch((error) => {
                        console.error("Помилка реєстрації Firebase:", error.code, error.message);
                        switch (error.code) {
                            case 'auth/email-already-in-use': showError(emailError, 'Цей email вже використовується.'); break;
                            case 'auth/invalid-email': showError(emailError, 'Некоректний формат email.'); break;
                            case 'auth/weak-password': showError(passwordError, 'Пароль занадто слабкий (має бути не менше 6 символів).'); break;
                            default: alert(`Помилка реєстрації: ${error.message}`);
                        }
                    })
                    .finally(() => {
                         submitButton.disabled = false;
                         submitButton.textContent = 'Зареєструватися';
                    });
            } else {
                 console.error("Об'єкт window.auth не доступний ПЕРЕД викликом createUserWithEmailAndPassword.");
                 alert("Помилка конфігурації. Неможливо зареєструватися.");
            }

        } else {
            console.log('Форма містить помилки клієнтської валідації.');
        }
    }); // Кінець addEventListener('submit', ...)

     // Не забудь додати стилі для .input-error у style.css, якщо ще не додав
     /*
     .input-error {
         border-color: #e74c3c !important;
         background-color: #fdd !important;
     }
     */

}); // Кінець DOMContentLoaded