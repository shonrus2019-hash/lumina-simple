let petState = {
  isHungry: true,
  energy: 50,
  mood: 70
};

const greeting = document.getElementById("greeting");
const feedBtn = document.getElementById("feedBtn");

async function initApp() {
  if (!window.Telegram?.WebApp) {
    greeting.textContent = "Ошибка: откройте в Telegram.";
    return;
  }

  const tg = window.Telegram.WebApp;

  // Отправляем initData на сервер для проверки
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: tg.initData }),
    });

    if (!response.ok) throw new Error("Не удалось проверить данные.");

    const userData = await response.json();
    updateUI(userData.first_name);
  } catch (e) {
    greeting.textContent = "Ошибка авторизации: " + e.message;
  }

  // Обработка клика
  feedBtn.addEventListener("click", async () => {
    petState.isHungry = false;
    petState.mood += 10;
    petState.energy += 5;

    // Отправляем обновление на сервер (например, сохранение в БД)
    await savePetState();

    updateUI(tg.initDataUnsafe.user?.first_name || "друг");
  });
}

async function savePetState() {
  try {
    await fetch('/api/update-pet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petState),
    });
  } catch (e) {
    console.error("Ошибка сохранения состояния:", e);
  }
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