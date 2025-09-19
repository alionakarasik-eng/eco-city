
// === Переключение вкладок ===
function openTab(tabId) {
  // Скрываем все вкладки
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });

  // Показываем выбранную вкладку
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
          // Добавляем очки
          totalScore += parseInt(checkbox.value);
          answeredQuestions++;

          // Тускнение вопроса
          question.classList.add("completed");

          // Блокируем все чекбоксы в этом вопросе
          checkboxes.forEach(cb => cb.disabled = true);

          // Обновляем результат
          document.getElementById("result").textContent = `${totalScore} баллов`;

          // Проверка завершения теста
          if (answeredQuestions === totalQuestions) {
            // Автоматически +100 баллов
            totalScore += 100;
            document.getElementById("result").textContent = `${totalScore} баллов`;

            let resultMessage = "";

            if (totalScore <= 190) {
              resultMessage = "🌱 Ваш экологический след низкий! Отличный результат, продолжайте в том же духе. Для удовлетворения всех ваших потредностей нужно от 0,90 до 1,9 гектар земли. Наша планета способна дать около 1,9 гектара земли на одного человека, это означает, что если бы все люди жили так, как вы, нам понадобилось бы менее одной планеты.";
            } else if (totalScore <= 300) {
              resultMessage = "🌍 Ваш экологический след средний. Есть над чем подумать — попробуйте сократить потребление ресурсов. Для удовлетворения ваших потребностей понадобится 2-3 гектара земли. Наша земля способна дать около 1.9 гектара земли на 1 человека, это означает, что если бы все люди жили как вы, нам бы понадобилось от 1 до 1,5 планет Земля для жизни.";
            } else {
              resultMessage = "🔥 Ваш экологический след высокий! Постарайтесь пересмотреть привычки, чтобы уменьшить влияние на природу. Для удовлетворения всех ваших потребностей понадоюится более 3,5 гектар земли. Наша планета способна дать около 1,9 гектара земли на одного человека. Это означает, что если бы все люди жили как вы, нам понад

