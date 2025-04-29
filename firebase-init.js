// Файл: firebase-init.js

console.log("Firebase Init Script Завантажено.");

// Встав сюди конфігураційний об'єкт, який ти скопіював з Firebase Console
const firebaseConfig = {
   apiKey: "AIzaSyB148r6P0cnsTrUsHfJi5ZDwmR9Sp8VKCc",
   authDomain: "kvitkovy-rai-rivne.firebaseapp.com",
   projectId: "kvitkovy-rai-rivne",
   storageBucket: "kvitkovy-rai-rivne.firebasestorage.app",
   messagingSenderId: "926292765627",
   appId: "1:926292765627:web:c0a721f5d654cb461a329e"
};

// Ініціалізуємо Firebase App
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase App ініціалізовано успішно.");

    // Отримуємо доступ до сервісу Authentication і робимо його глобально доступним
    // Це дозволить іншим скриптам (registerValidation.js, login.js) його використовувати
    window.auth = firebase.auth();
    console.log("Firebase Auth сервіс готовий до використання (window.auth).");

} catch (e) {
    console.error("Помилка ініціалізації Firebase:", e);
    // Тут можна показати повідомлення користувачу про помилку конфігурації
}