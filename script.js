// === Переключение вкладок ===
function openTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });
  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.style.display = "block";
  }
}

// === Логика теста ===
function initTest() {
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

          question.classList.add("completed");
          checkboxes.forEach(cb => cb.disabled = true);

          document.getElementById("result").textContent = `${totalScore} баллов`;

          if (answeredQuestions === totalQuestions) {
            totalScore += 100;
            document.getElementById("result").textContent = `${totalScore} баллов`;

            let resultMessage = "";
            if (totalScore <= 190) {
              resultMessage = "🌱 Ваш экологический след низкий!Если бы все люди жили так, как вы, нам хватило бы нашей планеты";
            } else if (totalScore <= 300) {
              resultMessage = "🌍 Ваш экологический след средний. Если бы все люди жили как вы, нам понадобилось бы полторы планеты для жизни";
            } else {
              resultMessage = "🔥 Ваш экологический след высокий!Если бы все люди жили как вы, нам понадобилось бы 2 и более планет земля для жизни";
            }
            document.getElementById("resultText").textContent = resultMessage;
          }
        }
      });
    });
  });
}

// === Карта ===
function initMap() {
  const map = L.map('map').setView([43.238949, 76.889709], 12); // Алматы

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  let pollutionData = [];

  function addRating(lat, lng, score, area) {
    const colors = ["green", "lime", "yellow", "orange", "red"];
    const color = colors[score - 1];

    L.circleMarker([lat, lng], {
      radius: 8,
      color: color,
      fillColor: color,
      fillOpacity: 0.8
    }).addTo(map).bindPopup(`${area}: ${score}/5`);

    pollutionData.push({ area, score });
    updateRating();
  }

  function updateRating() {
    const ratingList = document.getElementById("ratingList");
    ratingList.innerHTML = "";
    const grouped = {};
    pollutionData.forEach(item => {
      if (!grouped[item.area]) grouped[item.area] = [];
      grouped[item.area].push(item.score);
    });
    const averages = Object.keys(grouped).map(area => {
      const scores = grouped[area];
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { area, avg: avg.toFixed(1) };
    });
    averages.sort((a, b) => b.avg - a.avg);
    averages.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.area}: ${item.avg}/5`;
      ratingList.appendChild(li);
    });
  }

  addRating(43.25, 76.9, 5, "Центр");
  addRating(43.24, 76.85, 3, "Ауэзовский район");
  addRating(43.22, 76.95, 2, "Бостандыкский район");

  map.on("click", e => {
    const score = prompt("Оцените уровень загрязнения (1-5):");
    if (score >= 1 && score <= 5) {
      const area = prompt("Введите название района:");
      addRating(e.latlng.lat, e.latlng.lng, parseInt(score), area || "Неизвестный район");
    }
  });
}

// === Запуск при загрузке ===
document.addEventListener("DOMContentLoaded", () => {
  openTab('main');
  initTest();
  initMap();
});
