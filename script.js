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

// === Мини-тест ===
function initTest() {
  const btn = document.getElementById("testBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const ans = prompt("Ты сортируешь мусор дома? (да/нет)");
    if (!ans) return;

    if (ans.toLowerCase().startsWith("д")) {
      alert("Отлично! Ты вносишь вклад в сохранение природы 🌍");
    } else {
      alert("Попробуй начать сортировать — даже маленькие шаги важны 🌱");
    }
  });
}

// === Запуск функций после загрузки страницы ===
document.addEventListener("DOMContentLoaded", () => {
  // По умолчанию открыть первую вкладку (Главная)
  openTab('main');
  // Инициализация теста
  initTest();
});

