// === ОСНОВНЫЕ ПЕРЕМЕННЫЕ ===
let comments = JSON.parse(localStorage.getItem('forumComments')) || [];
let currentMap = null;
let mapPoints = JSON.parse(localStorage.getItem('mapPoints')) || [];
let isAddingPoint = false;

// === КОНФИГУРАЦИЯ РЕКОМЕНДАЦИЙ ДЛЯ ТЕСТА ===
const recommendationsConfig = {
    'no_sorting': {
        triggers: ['q7_-10', 'q7_-15'],
        message: '♻️ Важно сортировать мусор! Начните с разделения пластика, бумаги и стекла.',
        action: 'Посмотреть пункты приема на карте'
    },
    'no_recycling': {
        triggers: ['q7_-10'],
        message: '📦 Сдача банок и бутылок помогает перерабатывать материалы.',
        action: 'Узнать о переработке'
    },
    'high_energy': {
        triggers: ['q2_120'],
        message: '💡 Отопление углем/газом увеличивает углеродный след.',
        action: 'Советы по энергосбережению'
    }
};

// === ФУНКЦИИ ДЛЯ БОКОВОГО МЕНЮ ===
function openTab(tabId) {
    console.log('Opening tab:', tabId);
    
    // Скрыть все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = "none";
    });
    
    // Показать нужную вкладку
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = "block";
    }
    
    // Если это карта — запускаем инициализацию
    if (tabId === "ecoMap") {
        setTimeout(initMap, 100); // Небольшая задержка для инициализации карты
    }
    
    // Если это тест - сбросить при каждом открытии
    if (tabId === "test") {
        resetTest();
    }
}

// === ФУНКЦИИ ДЛЯ ТЕСТА ===
function initTest() {
    console.log('Initializing test...');
    const finishButton = document.getElementById('finishTest');
    if (finishButton) {
        finishButton.addEventListener('click', finishTest);
        console.log('Finish button listener added');
    }
}

function finishTest() {
    console.log('Finishing test...');
    let totalScore = 0;
    
    // Считаем общий балл
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        totalScore += parseInt(checkbox.value);
    });
    
    const finalScore = totalScore + 100;
    
    // Показываем результаты
    document.getElementById("result").textContent = `${finalScore} баллов`;
    document.getElementById("resultBox").style.display = "block";
    
    // Ваш оригинальный текст результатов
    let resultMessage = "";
    if (finalScore <= 190) {
        resultMessage = "🌱 Ваш экологический след низкий. Если бы все люди жили так, как вы, нам хватило бы одной планеты";
    } else if (finalScore <= 300) {
        resultMessage = "🌍 Ваш экологический след средний. Если бы все люди жили также как вы, нам понадобилось бы более одной планеты";
    } else {
        resultMessage = "🔥 Ваш экологический след высокий! Если бы все люди жили так, как вы, нам бы понадобилось 2 и более планет для жизни";
    }
    
    document.getElementById("resultText").textContent = resultMessage;
    
    // Показываем рекомендации
    showRecommendations();
}

function showRecommendations() {
    const recommendationsContainer = document.getElementById("recommendations");
    recommendationsContainer.innerHTML = '';
    
    Object.keys(recommendationsConfig).forEach(key => {
        const config = recommendationsConfig[key];
        
        config.triggers.forEach(trigger => {
            const [question, value] = trigger.split('_');
            const optionId = `input[name="${question}"][value="${value}"]`;
            const option = document.querySelector(optionId);
            
            if (option && !option.checked) {
                const recElement = document.createElement('div');
                recElement.className = 'recommendation';
                recElement.innerHTML = `
                    <p>${config.message}</p>
                    <button onclick="handleRecommendationAction('${key}')" class="btn-action">${config.action}</button>
                `;
                recommendationsContainer.appendChild(recElement);
            }
        });
    });
}

function resetTest() {
    // Сбросить все checkbox
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Сбросить результат
    document.getElementById("result").textContent = "0 баллов";
    document.getElementById("resultText").textContent = "";
    document.getElementById("resultBox").style.display = "none";
    document.getElementById("recommendations").innerHTML = "";
}

function handleRecommendationAction(actionType) {
    switch(actionType) {
        case 'no_sorting':
        case 'no_recycling':
            openTab('ecoMap');
            break;
        default:
            alert('Функция в разработке');
    }
}

// === ФУНКЦИИ ДЛЯ СТАТЕЙ В РАЗДЕЛЕ ЭКО-ГОРОДА ===
function toggleArticle(articleId) {
    console.log('Toggle article:', articleId);
    
    const articleFull = document.getElementById(`article-${articleId}`);
    const articlePreview = document.querySelector(`[data-article="${articleId}"]`);
    
    if (!articleFull || !articlePreview) {
        console.log('Article elements not found');
        return;
    }
    
    const readMoreSpan = articlePreview.querySelector('.read-more');
    
    // Проверяем, открыта ли статья сейчас
    const isActive = articleFull.style.display === 'block' || articleFull.classList.contains('active');
    
    // Закрываем все другие статьи
    document.querySelectorAll('.article-full').forEach(article => {
        article.style.display = 'none';
        article.classList.remove('active');
    });
    
    // Сбрасываем все тексты "Свернуть" на "Развернуть" для других статей
    document.querySelectorAll('.read-more').forEach(span => {
        span.textContent = 'Нажмите чтобы развернуть ▼';
    });
    
    // Переключаем текущую статью
    if (isActive) {
        articleFull.style.display = 'none';
        articleFull.classList.remove('active');
        if (readMoreSpan) readMoreSpan.textContent = 'Нажмите чтобы развернуть ▼';
    } else {
        articleFull.style.display = 'block';
        articleFull.classList.add('active');
        if (readMoreSpan) readMoreSpan.textContent = 'Свернуть ▲';
    }
}

// === ФУНКЦИИ ДЛЯ НАВИГАЦИИ В ЭКО-ГОРОДЕ ===
function showEcoCityTab(tabName, event) {
    console.log('Showing tab:', tabName);
    
    // Скрыть все вкладки эко-города
    document.querySelectorAll('.ecocity-tab').forEach(tab => {
        tab.style.display = "none";
        tab.classList.remove('active');
    });
    
    // Убрать активный класс у кнопок
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показать нужную вкладку
    const targetTab = document.getElementById(`ecocity-${tabName}`);
    if (targetTab) {
        targetTab.style.display = "block";
        targetTab.classList.add('active');
    }
    
    // Активировать кнопку
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Если открываем форум - загрузить комментарии
    if (tabName === 'forum') {
        displayComments();
    }
}

// === ФУНКЦИИ ДЛЯ ФОРУМА ===
function displayComments() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    commentsList.innerHTML = '';
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: #666;">Пока нет комментариев. Будьте первым!</p>';
        return;
    }
    
    comments.forEach((comment, index) => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
            ${comment.image ? `<img src="${comment.image}" class="comment-image" alt="Изображение" style="max-width: 300px; margin: 10px 0; border-radius: 5px;">` : ''}
            <button onclick="deleteComment(${index})" class="delete-btn" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">Удалить</button>
        `;
        commentsList.appendChild(commentDiv);
    });
}

function addComment(author, text, image = null) {
    const newComment = {
        author: author,
        text: text,
        image: image,
        date: new Date().toLocaleString('ru-RU')
    };
    
    comments.unshift(newComment);
    localStorage.setItem('forumComments', JSON.stringify(comments));
    displayComments();
}

function deleteComment(index) {
    if (confirm('Удалить этот комментарий?')) {
        comments.splice(index, 1);
        localStorage.setItem('forumComments', JSON.stringify(comments));
        displayComments();
    }
}

// === ФУНКЦИИ ДЛЯ КАРТЫ ===
function initMap() {
    console.log('Initializing map...');
    
    if (currentMap) {
        currentMap.remove();
    }
    
    // Создаем карту с центром в Алматы
    currentMap = L.map("map").setView([43.238949, 76.889709], 12);
    
    // Добавляем слой карты
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(currentMap);
    
    // Добавляем основной маркер Алматы
    L.marker([43.238949, 76.889709]).addTo(currentMap)
        .bindPopup("<b>Алматы</b><br>Экологическая ситуация города")
        .openPopup();
    
    // Загружаем сохраненные точки
    loadMapPoints();
    
    console.log('Map initialized');
}

function loadMapPoints() {
    if (!currentMap) return;
    
    // Очищаем старые маркеры
    currentMap.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer !== currentMap.getPane('markerPane').firstChild) {
            currentMap.removeLayer(layer);
        }
    });
    
    // Добавляем сохраненные точки
    mapPoints.forEach(point => {
        addPointToMap(point.lat, point.lng, point.name, point.description, false);
    });
}

function addPointToMap(lat, lng, name, description, saveToStorage = true) {
    if (!currentMap) return;
    
    const marker = L.marker([lat, lng]).addTo(currentMap);
    
    const popupContent = `
        <div style="min-width: 200px;">
            <strong>${name || 'Новая точка'}</strong>
            ${description ? `<br><p>${description}</p>` : ''}
            <br><small>Добавлено: ${new Date().toLocaleString('ru-RU')}</small>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    
    if (saveToStorage) {
        const newPoint = {
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            date: new Date().toLocaleString('ru-RU')
        };
        
        mapPoints.push(newPoint);
        localStorage.setItem('mapPoints', JSON.stringify(mapPoints));
    }
}

function enableAddMode() {
    if (!currentMap) {
        alert('Сначала дождитесь загрузки карты');
        return;
    }
    
    isAddingPoint = true;
    document.getElementById('mapInfo').textContent = 'Кликните на карту, чтобы добавить точку. Для отмены нажмите Esc.';
    document.getElementById('addPointBtn').textContent = '❌ Отменить добавление';
    document.getElementById('addPointBtn').style.background = '#f44336';
    
    // Временно меняем курсор
    currentMap.getContainer().style.cursor = 'crosshair';
    
    // Добавляем обработчик клика на карту
    currentMap.on('click', handleMapClick);
    
    // Добавляем обработчик Esc для отмены
    document.addEventListener('keydown', handleEscape);
}

function handleMapClick(e) {
    if (!isAddingPoint) return;
    
    const name = prompt('Введите название точки:');
    if (name === null) {
        disableAddMode();
        return;
    }
    
    const description = prompt('Введите описание точки (необязательно):') || '';
    
    addPointToMap(e.latlng.lat, e.latlng.lng, name, description);
    disableAddMode();
}

function handleEscape(e) {
    if (e.key === 'Escape' && isAddingPoint) {
        disableAddMode();
    }
}

function disableAddMode() {
    isAddingPoint = false;
    document.getElementById('mapInfo').textContent = 'Кликните на кнопку "Добавить точку", затем кликните на карту, чтобы отметить место';
    document.getElementById('addPointBtn').textContent = '➕ Добавить точку на карту';
    document.getElementById('addPointBtn').style.background = '';
    
    if (currentMap) {
        currentMap.getContainer().style.cursor = '';
        currentMap.off('click', handleMapClick);
    }
    
    document.removeEventListener('keydown', handleEscape);
}

function clearAllPoints() {
    if (confirm('Удалить все точки с карты?')) {
        mapPoints = [];
        localStorage.setItem('mapPoints', JSON.stringify(mapPoints));
        
        if (currentMap) {
            loadMapPoints(); // Это перезагрузит карту без точек
        }
        
        alert('Все точки удалены');
    }
}

// === ОБЩАЯ ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Инициализация бокового меню
    document.querySelectorAll('.sidebar a[data-tab]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            openTab(tabId);
        });
    });
    
    // Инициализация навигации в эко-городе
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const tabName = this.getAttribute('data-ecotab') || this.getAttribute('onclick')?.match(/showEcoCityTab\('(\w+)'\)/)?.[1];
            if (tabName) {
                showEcoCityTab(tabName, e);
            }
        });
    });
    
    // Инициализация статей - ПРОСТОЙ И РАБОЧИЙ СПОСОБ
    document.querySelectorAll('.article-preview').forEach(article => {
        article.addEventListener('click', function(e) {
            // Если кликнули на кнопку "развернуть", используем её data-атрибут
            if (e.target.classList.contains('read-more')) {
                const articleId = e.target.getAttribute('data-article') || 
                                 this.getAttribute('data-article') || 
                                 this.getAttribute('onclick')?.match(/toggleArticle\((\d+)\)/)?.[1];
                if (articleId) {
                    toggleArticle(articleId);
                }
            } else {
                // Если кликнули на саму статью, используем data-атрибут статьи
                const articleId = this.getAttribute('data-article') || 
                                 this.getAttribute('onclick')?.match(/toggleArticle\((\d+)\)/)?.[1];
                if (articleId) {
                    toggleArticle(articleId);
                }
            }
        });
    });
    
    // Инициализация форума
    const forumForm = document.getElementById('forumForm');
    if (forumForm) {
        forumForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const author = document.getElementById('authorName').value;
            const text = document.getElementById('commentText').value;
            const imageFile = document.getElementById('imageUpload').files[0];
            
            if (!author || !text) {
                alert('Пожалуйста, заполните имя и сообщение');
                return;
            }
            
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    addComment(author, text, e.target.result);
                    document.getElementById('imagePreview').innerHTML = '';
                };
                reader.readAsDataURL(imageFile);
            } else {
                addComment(author, text);
            }
            
            // Очистка формы
            this.reset();
        });
    }
    
    // Инициализация предпросмотра изображений
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('imagePreview').innerHTML = 
                        `<img src="${e.target.result}" alt="Предпросмотр" style="max-width: 200px; max-height: 200px; border-radius: 5px; margin-top: 10px;">`;
                };
                reader.readAsDataURL(file);
            } else {
                document.getElementById('imagePreview').innerHTML = '';
            }
        });
    }
    
    // Инициализация кнопок карты
    const addPointBtn = document.getElementById('addPointBtn');
    if (addPointBtn) {
        addPointBtn.addEventListener('click', enableAddMode);
    }
    
    const clearPointsBtn = document.getElementById('clearPointsBtn');
    if (clearPointsBtn) {
        clearPointsBtn.addEventListener('click', clearAllPoints);
    }
    
    // Инициализация теста
    initTest();
    
    // Активируем первую вкладку
    openTab('main');
    
    console.log('All initialization complete');
});

// Делаем функции глобальными для onclick атрибутов
window.openTab = openTab;
window.showEcoCityTab = showEcoCityTab;
window.toggleArticle = toggleArticle;
window.handleRecommendationAction = handleRecommendationAction;
window.deleteComment = deleteComment;
window.enableAddMode = enableAddMode;
window.clearAllPoints = clearAllPoints;
