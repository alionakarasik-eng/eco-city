// === Конфигурация рекомендаций ===
const recommendationsConfig = {
    'no_sorting': {
        triggers: ['q7_-10', 'q7_-15'],
        message: '♻️ Важно сортировать мусор! Начните с разделения пластика, бумаги и стекла. Это уменьшает загрязнение и сохраняет ресурсы.',
        action: 'Посмотреть пункты приема на карте'
    },
    'no_recycling': {
        triggers: ['q7_-10'],
        message: '📦 Сдача банок и бутылок помогает перерабатывать материалы и сокращает отходы на свалках.',
        action: 'Узнать о переработке'
    },
    'high_energy': {
        triggers: ['q2_120'],
        message: '💡 Отопление углем/газом увеличивает углеродный след. Рассмотрите альтернативные источники энергии.',
        action: 'Советы по энергосбережению'
    },
    'meat_daily': {
        triggers: ['q4_85'],
        message: '🌱 Ежедневное потребление мяса значительно увеличивает экологический след. Попробуйте растительные альтернативы.',
        action: 'Рецепты вегетарианских блюд'
    },
    'big_car': {
        triggers: ['q3_75'],
        message: '🚗 Большие внедорожники потребляют много топлива. Рассмотрите более экономичные варианты транспорта.',
        action: 'Об экологичном транспорте'
    }
};

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
        
        // если это тест - сбросить при каждом открытии
        if (tabId === "test") {
            resetTest();
        }
    }
}

// === Логика теста ===
function initTest() {
    let totalScore = 0;
    const totalQuestions = document.querySelectorAll("#ecoTestForm .question").length;
    let answeredQuestions = new Set();

    const questions = document.querySelectorAll("#ecoTestForm .question");
    const finishButton = document.getElementById('finishTest');

    // Обработчик кнопки завершения
    finishButton.addEventListener('click', finishTest);

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
            });
        });
    });
}

// === Завершение теста ===
function finishTest() {
    const totalScore = parseInt(document.getElementById("result").textContent);
    const finalScore = totalScore + 100;
    
    document.getElementById("result").textContent = `${finalScore} баллов`;
    document.getElementById("resultBox").style.display = "block";

    // Сохраняем ваш оригинальный текст результатов
    let resultMessage = "";
    if (finalScore <= 190) {
        resultMessage = "🌱 Ваш экологический след низкийЕсли бы вс люди жили так, как вы, нам хватило бы одной планеты";
    } else if (finalScore <= 300) {
        resultMessage = "🌍 Ваш экологический след средний. Если бы все люди жили также как вы, нам понадобилось бы более одной планеты";
    } else {
        resultMessage = "🔥 Ваш экологический след высокий! Если бы все люди жили так, как вы, нам бы понадобилось 2 и более планет для жизни";
    }
    
    document.getElementById("resultText").textContent = resultMessage;
    
    // Показываем рекомендации
    showRecommendations();
}

// === Показать рекомендации ===
function showRecommendations() {
    const recommendationsContainer = document.getElementById("recommendations");
    recommendationsContainer.innerHTML = '';
    
    const selectedOptions = getSelectedOptions();
    const shownRecommendations = new Set();
    
    // Проверить каждую рекомендацию
    Object.keys(recommendationsConfig).forEach(key => {
        const config = recommendationsConfig[key];
        
        config.triggers.forEach(trigger => {
            const [question, value] = trigger.split('_');
            const optionId = `input[name="${question}"][value="${value}"]`;
            const option = document.querySelector(optionId);
            
            if (option && !option.checked && !shownRecommendations.has(key)) {
                const recElement = document.createElement('div');
                recElement.className = 'recommendation';
                recElement.innerHTML = `
                    <p>${config.message}</p>
                    <button onclick="handleRecommendationAction('${key}')" 
                            class="btn-action">${config.action}</button>
                `;
                recommendationsContainer.appendChild(recElement);
                shownRecommendations.add(key);
            }
        });
    });
}

// === Получить выбранные опции ===
function getSelectedOptions() {
    const selected = {};
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        const name = checkbox.getAttribute('name');
        const value = checkbox.value;
        if (!selected[name]) selected[name] = [];
        selected[name].push(value);
    });
    return selected;
}

// === Обработчик действий рекомендаций ===
function handleRecommendationAction(actionType) {
    switch(actionType) {
        case 'no_sorting':
        case 'no_recycling':
            openTab('ecoMap');
            showRecyclingPoints();
            break;
        case 'high_energy':
            alert('Экономить энергию очень важно, потому что при её производстве сжигаются природные ресурсы и в атмосферу попадают вредные выбросы. Когда мы выключаем свет и приборы, которыми не пользуемся, мы уменьшаем нагрузку на природу и сокращаем счета за электричество. Маленькая привычка каждого помогает сохранить большие ресурсы для будущего.');
            break;
        case 'meat_daily':
            alert('Покупать продукты местного производства очень важно, потому что они обычно свежие, полезнее и поддерживают фермеров и производителей в нашем регионе. Такие продукты не нужно везти издалека, значит, тратится меньше топлива и в атмосферу попадает меньше вредных выбросов. Когда мы выбираем местные продукты, мы не только заботимся о своём здоровье, но и помогаем развивать экономику своего города и страны.!');
            break;
        case 'big_car':
            alert('Экологичный транспорт — это способы передвижения, которые меньше всего загрязняют окружающую среду. К таким видам относят пешие прогулки, велосипед, электросамокаты, электромобили и, конечно, общественный транспорт, который перевозит сразу много людей и тем самым снижает выбросы на одного пассажира.

Лучше всего отдавать предпочтение ходьбе и велосипеду на короткие расстояния, а в городе чаще пользоваться автобусами, метро или трамваями. Если нужен автомобиль, экологичнее выбирать электромобиль или гибрид. Чем больше людей переходят на экологичный транспорт, тем чище становится воздух и комфортнее сама городская среда.');
            break;
    }
}

// === Сброс теста ===
function resetTest() {
    // Сбросить все checkbox
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = false;
    });
    
    // Сбросить классы completed
    document.querySelectorAll('.question').forEach(question => {
        question.classList.remove('completed');
    });
    
    // Сбросить результат
    document.getElementById("result").textContent = "0 баллов";
    document.getElementById("resultText").textContent = "";
    document.getElementById("resultBox").style.display = "none";
    document.getElementById("recommendations").innerHTML = "";
}

// === Карта с пунктами приема ===
let recyclingPoints = [];
let mapInitialized = false;

function initMap() {
    if (mapInitialized) return;
    mapInitialized = true;

    const map = L.map("map").setView([43.238949, 76.889709], 12); // Алматы

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Основной маркер
    L.marker([43.238949, 76.889709]).addTo(map)
        .bindPopup("Алматы — экоситуация города")
        .openPopup();

    // Загрузка пунктов приема из localStorage
    loadRecyclingPoints(map);
    
    // Обработчик клика для добавления новых точек
    map.on('click', function(e) {
        addNewRecyclingPoint(e.latlng, map);
    });
    
    window.currentMap = map;
}

// === Загрузка пунктов приема ===
function loadRecyclingPoints(map) {
    const savedPoints = JSON.parse(localStorage.getItem('recyclingPoints')) || [];
    
    savedPoints.forEach(point => {
        addPointToMap(point, map);
    });
}

// === Добавление точки на карту ===
function addPointToMap(point, map) {
    const marker = L.marker([point.lat, point.lng])
        .addTo(map)
        .bindPopup(`
            <b>${point.name || 'Пункт приема'}</b><br>
            ${point.description || ''}<br>
            ${point.price ? `Цена: ${point.price}` : ''}
        `);
    
    recyclingPoints.push({
        marker: marker,
        data: point
    });
}

// === Добавление новой точки ===
function addNewRecyclingPoint(latlng, map) {
    const name = prompt('Название пункта приема:');
    if (!name) return;
    
    const description = prompt('Что принимают (пластик, стекло, бумага и т.д.):');
    const price = prompt('Цена за кг (если есть):');
    
    const newPoint = {
        id: Date.now(),
        lat: latlng.lat,
        lng: latlng.lng,
        name: name,
        description: description,
        price: price,
        addedBy: 'user'
    };
    
    addPointToMap(newPoint, map);
    savePoints();
}

// === Сохранение точек ===
function savePoints() {
    const pointsData = recyclingPoints.map(p => p.data);
    localStorage.setItem('recyclingPoints', JSON.stringify(pointsData));
}

// === Показать пункты приема ===
function showRecyclingPoints() {
    if (window.currentMap && recyclingPoints.length > 0) {
        recyclingPoints.forEach(point => {
            point.marker.openPopup();
        });
    } else {
        alert('Пункты приема будут показаны после добавления на карту');
    }
}

// === Инициализация при загрузке ===
document.addEventListener("DOMContentLoaded", function() {
    // Добавляем кнопку завершения теста в HTML
    const testForm = document.getElementById('ecoTestForm');
    if (testForm && !document.getElementById('finishTest')) {
        const finishButton = document.createElement('div');
        finishButton.className = 'test-actions';
        finishButton.innerHTML = '<button type="button" id="finishTest" class="btn-primary">Завершить тест</button>';
        testForm.appendChild(finishButton);
    }
    
    // Добавляем контейнер для рекомендаций
    const resultBox = document.getElementById('resultBox');
    if (resultBox && !document.getElementById('recommendations')) {
        const recommendationsDiv = document.createElement('div');
        recommendationsDiv.id = 'recommendations';
        resultBox.appendChild(recommendationsDiv);
    }
    
    // Преобразуем варианты ответов в столбик
    document.querySelectorAll('.question').forEach(question => {
        const labels = question.querySelectorAll('label');
        const optionsColumn = document.createElement('div');
        optionsColumn.className = 'options-column';
        
        labels.forEach(label => {
            optionsColumn.appendChild(label.cloneNode(true));
        });
        
        question.innerHTML = question.querySelector('p').outerHTML + optionsColumn.outerHTML;
    });
    
    // Инициализируем тест
    initTest();
});
