// Массив с заданиями
const tasks = [

    {
        "question": "7×8",
        "blocks": [],
        "choices": ["56", "15", "23"],
        "correctChoice": "56",
        "inputType": "choice"
    },
     {
        "question": "Катя купила 2 одинаковые тетради и ручку за 70 рублей. Ручка стоит 10 рублей. Сколько стоит одна тетрадь? <hr><br> Введите суммы или x",
        "blocks": [
            {"label": "2 Тетради (цена одной тетради)", "value": "тетради"},
            {"label": "1 Ручка", "value": "ручки"},
            {"label": "Сумма", "value": "сумма"}
        ],
        "correctAnswer": "x,10,70",
        "inputType": "input"
    },
    {
        "question": "Дима купил 4 одинаковых карандаша за 80 рублей. Сколько стоит один карандаш? <hr><br> Выберите правильное значение.",
        "blocks": [
            {"label": "4 карандаша по цене x", "value": "x"},
            {"label": "Сумма", "value": 80}
        ],
        "choices": ["x = 10", "x = 20", "x = 40"],
        "correctChoice": "x = 20",
        "inputType": "choice"
    },
    {
        "question": "Иван купил 5 одинаковых яблок за 100 рублей. Составьте уравнение для расчета цены одного яблока (x).",
        "blocks": [
            {"label": "Яблоки (цена одного яблока)", "value": "x"},
            {"label": "Сумма", "value": 100}
        ],
        "correctEquation": "5x=100",
        "inputType": "equation"
    },

    {
        "question": "256 ÷ x = 32",
        "blocks": ["256 = x × 32", "x = 256 ÷ 32"],
        "choices": ["x = 6", "x = 8", "x = 12"],
        "correctChoice": "x = 8",
        "inputType": "choice"
    },
    {
        "question": "В коробке было 60 конфет. Петя съел несколько конфет, и у него осталось 40 конфет. Сколько конфет он съел?. <hr><br> Составьте уравнение для расчета колличества конфет.",
        "blocks": [
            {"label": "Петя съел (колличество)", "value": "x"},
            {"label": "Осталось у Пети)", "value": 40},
            {"label": "Сумма", "value": 60}
        ],
        "correctEquation": "x+40=60",
        "inputType": "equation"
    },
    {
        "question": "Маша купила 3 одинаковые книги и ручку за 120 рублей. Ручка стоит 30 рублей. Сколько стоит одна книга? <hr><br> Введите суммы или x",
        "blocks": [
            {"label": "3 Книги (цена одной книги)", "value": "книги"},
            {"label": "1 Ручка", "value": "ручки"},
            {"label": "Сумма", "value": "сумма"}
        ],
        "correctAnswer": "x,30,120",
        "inputType": "input"
    },
    {
        "question": "Маша купила 3 одинаковые книги и ручку за 120 рублей. Ручка стоит 30 рублей. Сколько стоит одна книга? <hr><br> Выберите правильное значение для цены книги.",
        "blocks": [
            {"label": "3 книги по цене x", "value": "x"},
            {"label": "Ручка", "value": 30},
            {"label": "Сумма", "value": 120}
        ],
        "choices": ["x", "30", "120"],
        "correctChoice": "x",
        "inputType": "choice"
    },
    {
        "question": "Маша купила 3 одинаковые книги и ручку за 120 рублей. Ручка стоит 30 рублей. Сколько стоит одна книга? <hr><br> Составьте уравнение для расчета цены книги (x).",
        "blocks": [
            {"label": "Книги (цена одной книги)", "value": "x"},
            {"label": "Ручка", "value": 30},
            {"label": "Сумма", "value": 120}
        ],
        "correctEquation": "3x+30=120",
        "inputType": "equation"
    },
    {
        "question": "Аня купила 4 одинаковые тетради и пенал за 200 рублей. Пенал стоит 40 рублей. Сколько стоит одна тетрадь? <hr><br> Введите суммы или x",
        "blocks": [
            {"label": "4 Тетради (цена одной тетради)", "value": "тетради"},
            {"label": "1 Пенал", "value": "пенал"},
            {"label": "Сумма", "value": "сумма"}
        ],
        "correctAnswer": "x,40,200",
        "inputType": "input"
    }, 
    {
        "question": "5×7",
        "blocks": [],
        "choices": ["46", "35", "61"],
        "correctChoice": "35",
        "inputType": "choice"
    },
    {
        "question": "Олег купил 3 одинаковые игрушки и шоколадку за 150 рублей. Шоколадка стоит 20 рублей. Сколько стоит одна игрушка? <hr><br> Выберите правильное значение.",
        "blocks": [
            {"label": "3 игрушки по цене x", "value": "x"},
            {"label": "Шоколадка", "value": 20},
            {"label": "Сумма", "value": 150}
        ],
        "choices": ["x = 30", "x = 40", "x = 50"],
        "correctChoice": "x = 40",
        "inputType": "choice"
    },
    {
        "question": "Вася купил 6 одинаковых тетрадей за 180 рублей. Сколько стоит одна тетрадь? <hr><br> Составьте уравнение для расчета цены одной тетради (x).",
        "blocks": [
            {"label": "Тетради (цена одной тетради)", "value": "x"},
            {"label": "Сумма", "value": 180}
        ],
        "correctEquation": "6x=180",
        "inputType": "equation"
    },
    {
        "question": "Катя купила 2 одинаковые книги и 2 ручки за 100 рублей. Одна ручка стоит 15 рублей. Сколько стоит одна книга? <hr><br> Введите суммы или x",
        "blocks": [
            {"label": "2 Книги (цена одной книги)", "value": "книги"},
            {"label": "2 Ручки", "value": "ручки"},
            {"label": "Сумма", "value": "сумма"}
        ],
        "correctAnswer": "x,30,100",
        "inputType": "input"
    },
    {
        "question": "8×8",
        "blocks": [],
        "choices": ["72", "15", "64"],
        "correctChoice": "64",
        "inputType": "choice"
    },
    {
        "question": "Ирина купила 5 одинаковых яблок и сок за 110 рублей. Сок стоит 20 рублей. Сколько стоит одно яблоко? <hr><br> Выберите правильное значение.",
        "blocks": [
            {"label": "5 яблок по цене x", "value": "x"},
            {"label": "Сок", "value": 20},
            {"label": "Сумма", "value": 110}
        ],
        "choices": ["x = 10", "x = 15", "x = 20"],
        "correctChoice": "x = 18",
        "inputType": "choice"
    },
    {
        "question": "Дима купил 4 одинаковые тетради и 2 ручки за 180 рублей. Одна ручка стоит 10 рублей. Сколько стоит одна тетрадь? <hr><br> Составьте уравнение для расчета цены одной тетради (x).",
        "blocks": [
            {"label": "Тетради (цена одной тетради)", "value": "x"},
            {"label": "Ручки", "value": 20},
            {"label": "Сумма", "value": 180}
        ],
        "correctEquation": "4x+20=180",
        "inputType": "equation"
    },
    {
        "question": "Маша купила 3 одинаковых платья и ремень за 450 рублей. Ремень стоит 50 рублей. Сколько стоит одно платье? <hr><br> Введите суммы или x",
        "blocks": [
            {"label": "3 Платья (цена одного платья)", "value": "платье"},
            {"label": "1 Ремень", "value": "ремень"},
            {"label": "Сумма", "value": "сумма"}
        ],
        "correctAnswer": "x,50,450",
        "inputType": "input"
    },
    {
        "question": "Миша купил 6 одинаковых карандашей и блокнот за 180 рублей. Блокнот стоит 30 рублей. Сколько стоит один карандаш? <hr><br> Выберите правильное значение.",
        "blocks": [
            {"label": "6 карандашей по цене x", "value": "x"},
            {"label": "Блокнот", "value": 30},
            {"label": "Сумма", "value": 180}
        ],
        "choices": ["x = 15", "x = 20", "x = 25"],
        "correctChoice": "x = 25",
        "inputType": "choice"
    },
];

let currentTaskIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

// Функция для отображения задания
function loadTask() {
    const gameContainer = document.getElementById('game');
    const task = tasks[currentTaskIndex];
    
    let html = `<p class="question">${task.question}</p>`;
    
    if (task.inputType === "input") {
        html += '<form id="answerInput" action="#"><div class="blocks">';
        task.blocks.forEach(block => {
            html += `<div class="block">${block.label}: <input type="text" name="${block.value}" class="answer-input" placeholder="Введите ${block.value}"></div>`;
        });
        html += '</div></form>';
    } else if (task.inputType === "choice") {
        html += '<div class="choices">';
        task.choices.forEach(choice => {
            html += `<div class="choice" onclick="selectChoice('${choice}')">${choice}</div>`;
        });
        html += '</div>';
    } else if (task.inputType === "equation") {
        html += '<div class="blocks">';
        task.blocks.forEach(block => {
            html += `<div class="block">${block.label}: ${block.value}</div>`;
        });
        html += '</div>';
        html += '<input type="text" id="equationInput" class="answer-input" placeholder="Введите уравнение">';
    }
    document.getElementById('result').innerText = ''
    gameContainer.innerHTML = html;
}

// Функция для проверки ответа
function checkAnswer() {
    const task = tasks[currentTaskIndex];
    let resultMessage = '';

    if (task.inputType === "input") {
        var formData = new FormData(document.getElementById('answerInput'));
        const userAnswer = Object.values(Object.fromEntries(formData)).join();
        const correctAnswer = task.correctAnswer;

        if (userAnswer === correctAnswer) {
            resultMessage = 'Правильно!';
            correctAnswers++;
            updateProgress(5);
        } else {
            resultMessage = `Неправильно. Правильный ответ: ${correctAnswer}`;
            incorrectAnswers++;
            updateProgress(-10);
        }
    } else if (task.inputType === "choice") {
        if (task.selectedChoice === task.correctChoice) {
            resultMessage = 'Правильно!';
            correctAnswers++;
            updateProgress(5);
        } else {
            resultMessage = `Неправильно. Правильный ответ: ${task.correctChoice}`;
            incorrectAnswers++;
            updateProgress(-10);
        }
    } else if (task.inputType === "equation") {
        const userEquation = document.getElementById('equationInput').value;
        if (userEquation === task.correctEquation) {
            resultMessage = 'Правильно!';
            correctAnswers++;
            updateProgress(5);
        } else {
            resultMessage = `Неправильно. Правильное уравнение: ${task.correctEquation}`;
            incorrectAnswers++;
            updateProgress(-10);
        }
    }

    document.getElementById('result').innerText = resultMessage;
    document.getElementById('correctCount').innerText = correctAnswers;
    document.getElementById('incorrectCount').innerText = incorrectAnswers;
    success = resultMessage === 'Правильно!';
    new Noty({text: resultMessage, type: success ?'success':'error', "timeout":1500}).show();

    if (success) {
        currentTaskIndex = (currentTaskIndex + 1) % tasks.length;
        setTimeout(loadTask, 800);
    }
}

// Функция для выбора варианта
function selectChoice(choice) {
    tasks[currentTaskIndex].selectedChoice = choice;
    const choices = document.querySelectorAll('.choice');
    choices.forEach(item => item.style.backgroundColor = '#fff');
    event.target.style.backgroundColor = '#d4edda';
}
let progress = 50;


// Функция для обновления прогресса
function updateProgress(change) {
    progress = Math.max(0, Math.min(100, progress + change)); // ограничение от 0 до 100
    document.getElementById('progressBar').value = progress;
    updateCharacter(progress);
}

// Функция для смены картинки персонажа в зависимости от прогресса
function updateCharacter(progress) {
    const characterImg = document.getElementById('character');
    
    if (progress >= 70) {
        characterImg.src = 'happy.png'; // Довольный персонаж
    } else if (progress >= 30) {
        characterImg.src = 'neutral.png'; // Нейтральный персонаж
    } else {
        characterImg.src = 'sad.png'; // Недовольный персонаж
    }
}

// Загрузить первое задание при загрузке страницы
window.onload = loadTask;
