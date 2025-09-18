// === Переключение вкладок ===
function openTab(tabId) {
  // Скрываем все вкладки
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(tab => tab.style.display = 'none');

  // Показываем выбранную вкладку
  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.style.display = 'block';
  }
}

// === Логика теста ===
document.addEventListener("DOMContentLoaded", () => {
  let totalScore = 0;
  let answeredQuestions = 0;
  const totalQuestions = document.querySelectorAll("#ecoTestForm .question").length;

  const questions = document.querySelectorAll("#ecoTestForm .question");

  questions.forEach(question => {
    const checkboxes = question.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          totalScore += parseInt(checkbox.value);
          answeredQuestions++;

          // Отмечаем вопрос как "пройденный"
          question.classList.add("completed");

          // Делаем все чекбоксы внутри неактивными
          checkboxes.forEach(cb => cb.disabled = true);

          // Обновляем результат
          document.getElementById("result").textContent = `${totalScore} баллов`;

          // Если все вопросы пройдены — показать итоговое сообщение
if (answeredQuestions === totalQuestions) {
  // +100 баллов автоматически
  totalScore += 100;
  document.getElementById("result").textContent = `${totalScore} баллов`;

  let resultMessage = "";

  if (totalScore <= 190) {
    resultMessage = "🌱 Ваш экологический след низкий! Отличный результат, продолжайте в том же духе. Для удовлетворения всех ваших потредностей нужно от 0,90 до 1,9 гектар земли. Наша планета способна дать около 1,9 гектара земли на одного человека, это означает, что если бы все люди жили так, как вы, нам понадобилось бы менее одной планеты.";
  } else if (totalScore <= 300) {
    resultMessage = "🌍 Ваш экологический след средний. Есть над чем подумать — попробуйте сократить потребление ресурсов. Для удовлетворения ваших потребностей понадобится 2-3 гектара земли. Наша земля способна дать около 1.9 гектара земли на 1 человека, это означаетБ что если бы все люди жили как вы, нам бы понадобилось от 1 до 1,5 планет Земля для жизни.";
  } else {
    resultMessage = "🔥 Ваш экологический след высокий! Постарайтесь пересмотреть привычки, чтобы уменьшить влияние на природу. Для удовлетворения всех ваших потребностей понадоюится от более 3,5 гектар земли. Наша планета способна дать около 1,9 гектара земли на одного человека. Это означает, что если бы все люди жили как вы, нам понадобилось бы более 1,8 планет для жизни";
  }

  document.getElementById("resultText").textContent = resultMessage;
}

          }
        }
      });
    });
  });
});


// === Запуск функций после загрузки страницы ===
document.addEventListener("DOMContentLoaded", () => {
  // По умолчанию открыть первую вкладку (Главная)
  openTab('main');
  // Инициализация теста
  initTest();
// === Карта загрязнения ===
function initMap() {
  // Создаём карту
  const map = L.map('map').setView([43.238949, 76.889709], 12); // центр Алматы (можно заменить)

  // Подключаем слой карты
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Массив оценок загрязнения
  let pollutionData = [];

  // Функция для добавления оценки
  function addRating(lat, lng, score, area) {
    const colors = ["green", "lime", "yellow", "orange", "red"];
    const color = colors[score - 1];

    // Добавляем маркер
    L.circleMarker([lat, lng], {
      radius: 8,
      color: color,
      fillColor: color,
      fillOpacity: 0.8
    }).addTo(map).bindPopup(`${area}: ${score}/5`);

    // Сохраняем данные
    pollutionData.push({ area, score });

    // Обновляем рейтинг
    updateRating();
  }

  // Обновление рейтинга
  function updateRating() {
    const ratingList = document.getElementById("ratingList");
    ratingList.innerHTML = "";

    // Группировка по микрорайонам
    const grouped = {};
    pollutionData.forEach(item => {
      if (!grouped[item.area]) grouped[item.area] = [];
      grouped[item.area].push(item.score);
    });

    // Средние оценки
    const averages = Object.keys(grouped).map(area => {
      const scores = grouped[area];
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { area, avg: avg.toFixed(1) };
    });

    // Сортировка от грязных к чистым
    averages.sort((a, b) => b.avg - a.avg);

    // Вывод списка
    averages.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.area}: ${item.avg}/5`;
      ratingList.appendChild(li);
    });
  }

  // Пример добавленных точек
  addRating(43.25, 76.9, 5, "Центр");
  addRating(43.24, 76.85, 3, "Ауэзовский район");
  addRating(43.22, 76.95, 2, "Бостандыкский район");

  // При клике на карту — запросить оценку у пользователя
  map.on("click", e => {
    const score = prompt("Оцените уровень загрязнения (1-5):");
    if (score >= 1 && score <= 5) {
      const area = prompt("Введите название микрорайона:");
      addRating(e.latlng.lat, e.latlng.lng, parseInt(score), area || "Неизвестный район");
    }
  });
}

// === Запуск карты при загрузке страницы ===
document.addEventListener("DOMContentLoaded", () => {
  initMap();
});
});
// Функция переключения вкладок меню
function openTab(tabId) {
  // Скрываем все вкладки
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });

  // Показываем выбранную
  document.getElementById(tabId).style.display = "block";
}

