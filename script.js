// Простой тест
document.getElementById('testBtn').addEventListener('click', function(){
  const ans = prompt("Ты сортируешь мусор дома? (да/нет)");
  if (ans && ans.toLowerCase().startsWith('д')) {
    alert("Отлично! Так мы меньше загрязняем природу 🌍");
  } else {
    alert("Попробуй начать с малого — это реально помогает 🌱");
  }
});

// Пример графика Chart.js (примерные данные)
const ctx = document.getElementById('airChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
    datasets: [{
      label: 'AQI (примерные значения)',
      data: [120, 95, 100, 85, 90, 80],
      tension: 0.3,
      fill: true,
      borderColor: 'rgb(46,125,50)',
      backgroundColor: 'rgba(46,125,50,0.15)',
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Динамика качества воздуха (пример)' }
    }
  }
});
