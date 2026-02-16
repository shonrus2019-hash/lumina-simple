// script.js

let petState = {
  isHungry: true,
  energy: 50,
  mood: 70
};

const greeting = document.getElementById("greeting");
const feedBtn = document.getElementById("feedBtn");

function initApp() {
  // Получаем данные пользователя из Telegram
  if (typeof window.Telegram !== "undefined") {
    const user = Telegram.WebApp.initDataUnsafe.user;
    updateUI(user?.first_name || "друг");
  } else {
    greeting.textContent = "Откройте в Telegram: t.me/ваш_бот/tama";
  }

  // Обработка клика
  feedBtn.addEventListener("click", () => {
    petState.isHungry = false;
    petState.mood += 10;
    petState.energy += 5;
    updateUI(Telegram.WebApp.initDataUnsafe.user?.first_name || "друг");
  });
}

function updateUI(name) {
  if (petState.isHungry) {
    feedBtn.style.display = "block";
    feedBtn.textContent = "Покормить";
  } else {
    feedBtn.style.display = "none";
  }

  greeting.innerHTML = `
    Привет, ${name}!<br>
    Настроение: ${petState.mood}<br>
    Энергия: ${petState.energy}<br>
    ${petState.isHungry ? "Голоден!" : "Сыт!"}
  `;
}

// Запускаем приложение
initApp();