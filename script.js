// === Переключение вкладок ===
function openTab(tabId) {
  // скрыть все
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });

  // показать нужную
  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.style.display = "block";

    // если это карта — запускаем инициализацию
    if (tabId === "ecoMap") {
      initMap();
    }
  }
}

// === Логика теста ===
function initTest() {
  let totalScore = 0;
  const totalQuestions = document.querySelectorAll("#ecoTestForm .question").length;
  let answeredQuestions = new Set();

  const questions = document.querySelectorAll("#ecoTestForm .question");

  questions.forEach(question => {
    const checkboxes = question.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        const value = parseInt(checkbox.value);

        if (checkbox.checked) {
          totalScore += value;
        } else {
          totalScore -= value;
        }

        if ([...checkboxes].some(cb => cb.checked)) {
          answeredQuestions.add(question.dataset.question);
          question.classList.add("completed");
        } else {
          answeredQuestions.delete(question.dataset.question);
          question.classList.remove("completed");
        }

        document.getElementById("result").textContent = `${totalScore} баллов`;

        if (answeredQuestions.size === totalQuestions) {
          let finalScore = totalScore + 100;
          document.getElementById("result").textContent = `${finalScore} баллов`;

          let resultMessage = "";
          if (finalScore <= 190) {
            resultMessage = "🌱 Ваш экологический след низкий. Если бы все люди жили так, как вы, нам хватило бы одной планеты";
          } else if (finalScore <= 300) {
            resultMessage = "🌍 Ваш экологический след средний. Если бы все люди жили также как вы, нам понадобилось бы более одной планеты";
          } else {
            resultMessage = "🔥 Ваш экологический след высокий! Если бы все люди жили так, как вы, нам бы понадобилось 2 и более планет для жизни";
          }
          document.getElementById("resultText").textContent = resultMessage;
        }
      });
    });
  });
}

// === Карта (Leaflet) ===
function initMap() {
  if (window.mapInitialized) return;
  window.mapInitialized = true;

  const map = L.map("map").setView([43.238949, 76.889709], 12); // Алматы

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.marker([43.238949, 76.889709]).addTo(map)
    .bindPopup("Алматы — экоситуация города")
    .openPopup();
}
