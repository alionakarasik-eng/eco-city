// === ОСНОВНЫЕ ПЕРЕМЕННЫЕ ===
let comments = JSON.parse(localStorage.getItem('forumComments')) || [];
let currentMap = null;

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
        initMap();
    }
    
    // Если это тест - сбросить при каждом открытии
    if (tabId === "test") {
        resetTest();
    }
}

// === ФУНКЦИИ ДЛЯ ТЕСТА ===
function initTest() {
    const finishButton = document.getElementById('finishTest');
    if (finishButton) {
        finishButton.addEventListener('click', finishTest);
    }
}

function finishTest() {
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
    const readMoreSpan = articlePreview.querySelector('.read-more');
    
    // Проверяем, открыта ли статья сейчас
    const isActive = articleFull.classList.contains('active');
    
    // Закрываем все другие статьи
    document.querySelectorAll('.article-full').forEach(article => {
        if (article.id !== `article-${articleId}`) {
            article.classList.remove('active');
        }
    });
    
    // Сбрасываем все тексты "Свернуть" на "Развернуть" для других статей
    document.querySelectorAll('.article-preview').forEach(preview => {
        if (preview !== articlePreview) {
            const otherReadMore = preview.querySelector('.read-more');
            if (otherReadMore) {
                otherReadMore.textContent = 'Нажмите чтобы развернуть ▼';
            }
        }
    });
    
    // Переключаем текущую статью
    if (isActive) {
        articleFull.classList.remove('active');
        readMoreSpan.textContent = 'Нажмите чтобы развернуть ▼';
    } else {
        articleFull.classList.add('active');
        readMoreSpan.textContent = 'Свернуть ▲';
    }
}

// === ФУНКЦИИ ДЛЯ НАВИГАЦИИ В ЭКО-ГОРОДЕ ===
function showEcoCityTab(tabName) {
    // Скрыть все вкладки эко-города
    document.querySelectorAll('.ecocity-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убрать активный класс у кнопок
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показать нужную вкладку
    document.getElementById(`ecocity-${tabName}`).classList.add('active');
    
    // Активировать кнопку
    event.target.classList.add('active');
    
    // Если открываем форум - загрузить комментарии
    if (tabName === 'forum') {
        displayComments();
    }
}

// === ФУНКЦИИ ДЛЯ ФОРУМА ===
function displayComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    
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
    if (currentMap) {
        currentMap.remove();
    }
    
    currentMap = L.map("map").setView([43.238949, 76.889709], 12);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(currentMap);
    
    L.marker([43.238949, 76.889709]).addTo(currentMap)
        .bindPopup("Алматы — экоситуация города")
        .openPopup();
}

function enableAddMode() {
    alert('Режим добавления точек включен! Кликните на карте, чтобы добавить пункт приема.');
}

function showRecyclingPoints() {
    alert('Пункты приема будут показаны после добавления на карту');
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
    document.querySelectorAll('.tab-btn[data-ecotab]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const tabName = this.getAttribute('data-ecotab');
            showEcoCityTab(tabName);
        });
    });
    
    // Инициализация статей
    document.querySelectorAll('.article-preview').forEach(article => {
        article.addEventListener('click', function() {
            const articleId = this.getAttribute('data-article');
            toggleArticle(articleId);
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
            }
        });
    }
    
    // Инициализация теста
    initTest();
    
    // Активируем первую вкладку
    openTab('main');
});
