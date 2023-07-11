if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

let player = {
  name: "Герой",
  health: 100,
  attributePoints: 15,
  strength: 5,
  agility: 5,
  intelligence: 5,
  charisma: 5,
  inventory: [],
  currentStep: 0,
  visitedSteps: [],
  encounteredCharacters: [],
};

let currentStep = 0;
// Переменная для хранения индекса текущего сообщения
let currentMessageIndex = 0;
// let currentOptionObject = {};
let messages = false;
// Инициализация массива выбранных опций
let selectedOptions = [];

// Проверяем, есть ли данные в localStorage, и загружаем их
let savedPlayerData = localStorage.getItem("playerData");
if (savedPlayerData) {
  player = JSON.parse(savedPlayerData);
}

function loadQuest(callback) {
  let xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", "quest.json?v=1", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      callback(data);
    }
  };
  xhr.send(null);
}

/**
Отображает следующее сообщение из массива сообщений.
Если есть еще сообщения, отображает автора, содержимое и аватар сообщения.
Отображает индикатор печати, если есть еще блоки сообщений.
Показывает опции, если это последний блок сообщений, иначе скрывает опции.
*/
function showNextMessage() {
  if (currentMessageIndex < messages.length) {
    var message = messages[currentMessageIndex];
    // console.log(currentMessageIndex, messages.length);
    if (!shouldShowObject(message)) {
      currentMessageIndex++;
      showNextMessage(); // Переходим к следующему сообщению
      return;
    }

    showMessage(message.author, message.content, message.avatar);
    let lastBlock = currentMessageIndex + 1 != messages.length;

    const typingIndicator = document.getElementById("typingIndicator");
    typingIndicator.style.display = lastBlock ? "flex" : "none";
    // console.log(typingIndicator.style.display);

    // Показываем опции или скрываем
    const optionsContainer = document.getElementById("optionsList");

    if (!lastBlock) {
      var chatWindow = document.getElementById("chatWindow");
      setTimeout(function () {
        optionsContainer.style.display = "block";
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }, 500);
    } else {
      optionsContainer.style.display = "none";
    }

    currentMessageIndex++;
  }
}

/**

Отображает сообщение в окне чата.
@param {string} author - Автор сообщения.
@param {string} content - Содержимое сообщения.
@param {string|boolean} [avatar=false] - Путь к изображению аватара или false, если аватар не нужен.
*/
function showMessage(author, content, avatar = false) {
  var chatWindow = document.getElementById("chatWindow");
  var chatContainer = document.getElementById("chatContainer");
  var messageContainer = document.createElement("div");
  messageContainer.className = "message";

  var authorElement = document.createElement("div");
  authorElement.className = "author";
  authorElement.innerText = author;

  let avatarElement = null;
  if (author === "Система") {
    avatar = "system.png";
  }
  if (author === "Герой") {
    avatar = "hero.png";
  }
  if (avatar) {
    avatarElement = document.createElement("img");
    avatarElement.classList.add("avatar");
    messageContainer.classList.add("left");
    avatarElement.src = location.pathname + "img/persons/" + avatar;
  } else {
    avatarElement = document.createElement("div");
    avatarElement.classList.add("avatar");
    messageContainer.classList.add("left");
    avatarElement.innerText = author[0];
  }
  if (author === "Я") {
    messageContainer.classList.add("right");
  }

  var contentElement = document.createElement("div");
  contentElement.className = "content";
  contentElement.innerText = content;

  if (author === "Система") {
    messageContainer.classList.add("system");
  }

  messageContainer.appendChild(avatarElement);
  messageContainer.appendChild(contentElement);
  contentElement.appendChild(authorElement);
  chatContainer.appendChild(messageContainer);

  setTimeout(function () {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 100);
}
/**

Увеличивает значение атрибута героя.
@param {string} attribute - Название атрибута, который нужно увеличить.
*/
function increaseAttribute(attribute) {
  if (player.attributePoints > 0) {
    player[attribute]++;
    player.attributePoints--;
    updateAttributePoints();
    updateAttributeValue(attribute);
  }
}

/**

Уменьшает значение атрибута героя.
@param {string} attribute - Название атрибута, который нужно уменьшить.
*/
function decreaseAttribute(attribute) {
  if (player[attribute] > 1) {
    player[attribute]--;
    player.attributePoints++;
    updateAttributePoints();
    updateAttributeValue(attribute);
  }
}

/**

Обновляет значение доступных очков атрибутов на странице.
*/
function updateAttributePoints() {
  document.getElementById("attributePointsValue").innerText =
    player.attributePoints;
}

/**

Обновляет значение конкретного атрибута на странице.
@param {string} attribute - Название атрибута, который нужно обновить.
*/
function updateAttributeValue(attribute) {
  document.getElementById(`${attribute}Value`).innerText = player[attribute];
}

/**

Показывает секцию создания персонажа и скрывает вводное сообщение.
*/
function showCharacterCreation() {
  let introSection = document.getElementById("intro");
  let characterCreationSection = document.getElementById("characterCreation");

  introSection.style.display = "none";
  characterCreationSection.style.display = "block";
}

function startQuestGame() {
  player.attributePoints = parseInt(
    document.getElementById("attributePointsValue").innerText
  );

  player.strength = parseInt(
    document.getElementById("strengthValue").innerText
  );
  player.agility = parseInt(document.getElementById("agilityValue").innerText);
  player.intelligence = parseInt(
    document.getElementById("intelligenceValue").innerText
  );
  player.charisma = parseInt(
    document.getElementById("charismaValue").innerText
  );

  savePlayerData();

  loadQuest(function (quest) {
    currentStep = player.currentStep || 0;
    showGameSection();

    executeStep(quest.steps[currentStep]);
  });
}

function startQuest() {
  let characterCreationSection = document.getElementById("characterCreation");
  let gameSection = document.getElementById("game");
  startQuestGame();

  characterCreationSection.style.display = "none";
  gameSection.style.display = "block";
}

//  @TODO
// Функция для проверки, были ли выбранная опция ранее
function hasSelectedOptions(option) {
  if (selectedOptions.includes(option.id)) {
    return true;
  }
  return false;
}

function executeStep(step) {
  clearMessage();
  clearOptions();
  currentMessageIndex = 0;
  currentStep = step.id;

  if(!player.visitedSteps) player.visitedSteps = []
  if (!player.visitedSteps.includes(step.id)) player.visitedSteps.push(step.id);

  messages = step.messages;
  //

  if (messages) {
    showNextMessage();
  }
  if (step.item) {
    player.inventory.push(step.item);
    showMessage("Система", `Получен предмет: ${step.item.name}`);
  }

  if (step.character) {
    player.encounteredCharacters.push(step.character);
  }
  if (step.location) {
    updateLocationImage(step.location.image);
  }
  if (step.options) {
    updateOptions(step.options);
  }

  savePlayerData();
}

function updateLocationImage(imageUrl) {
  let locationImage = document.getElementById("locationImage");
  if (!imageUrl) imageUrl = location.pathname + "img/locations/black.png";

  locationImage.classList.add("open-animation");
  locationImage.src = location.pathname + "img/locations/" + imageUrl;
  setTimeout(() => {
    locationImage.classList.remove("open-animation");
  }, 500);
}

function checkRequirements(requirements) {
  if (!requirements) {
    return true;
  }

  let keys = Object.keys(requirements);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (player[key] < requirements[key]) {
      return false;
    }
  }

  return true;
}

/**

Выполняет шаг квеста.
@param {Object} step - Объект, представляющий шаг квеста.
*/
function selectOption(option) {
  loadQuest(function (quest) {
    selectedOptions.push(option.id);
    // checkRequirements(option.requirements)
    if (option.nextStep) {
      executeStep(quest.steps[option.nextStep]);
    }

    if (option.result) {
      messages = option.result.messages;
      currentMessageIndex = 0;
      if (messages) {
        showNextMessage();
      }
      // Дополнительные действия, связанные с результатом
      if (option.item) {
        player.inventory.push(option.item);
        showMessage("Система", `Получен предмет: ${option.item.name}`);
      }
    }

    if (option.item) {
      player.inventory.push(option.item);
      showMessage("Система", `Получен предмет: ${option.item.name}`);
    }
  });
}

function clearMessage() {
  var messageContainer = document.getElementById("chatContainer");
  messageContainer.innerHTML = "";
}

function updateOptions(options) {
  const optionsContainer = document.getElementById("optionsList");
  optionsContainer.innerHTML = ""; // Очищаем контейнер с опциями

  options.forEach((option) => {
    if (shouldShowObject(option)) {
      // Проверяем, нужно ли показывать опцию
      const optionElement = createOptionElement(option);
      optionsContainer.appendChild(optionElement);
    }
  });
}

/**
 * Проверяет, должен ли объект (опция или сообщение) быть показан или скрыт на основе объекта опции и заданных условий.
 *
 * @param {Object} option - Объект опции.
 * @param {number} option.id - Идентификатор опции.
 * @param {boolean} [option.once] - Флаг единоразового показа опции.
 * @param {Array<string>} [option.showOnStep] - Массив идентификаторов шагов, при которых опция должна быть показана.
 * @param {Array<string>} [option.hideOnStep] - Массив идентификаторов шагов, при которых опция должна быть скрыта.
 * @param {string} [option.item] - Предмет, необходимый для показа опции.
 * @param {Array<string>} [option.characters] - Массив персонажей, которых необходимо встретить для показа опции.
 * @returns {boolean} - Возвращает true, если опция должна быть показана, иначе false.
 */
function shouldShowObject(object) {
  return true
  // Проверяем, есть ли у опции свойство единоразового показа и если да, проверяем, была ли эта опция уже выбрана
  if (object.once && selectedOptions.includes(object.id)) {
    return false;
  }
  // Проверяем, если у опции есть предмет, проверяем, есть ли этот предмет в инвентаре героя
  if (object.item && !player.inventory.includes(object.item)) {
    return false;
  }
  // Проверяем, если у опции есть персонажи, проверяем, встретил ли герой всех этих персонажей
  if (
    object.characters &&
    !object.characters.every((character) =>
      player.encounteredCharacters.includes(character)
    )
  ) {
    return false;
  }
  // Проверяем, если у опции есть условие посещения шага, проверяем, посетил ли герой этот шаг для отображения или скрытия опции
  if (
    object.showOnStep &&
    !object.showOnStep.every((step) => player.visitedSteps.includes(step))
  ) {
    return false;
  }

  console.log(object.hideOnStep, player.visitedSteps);
  if (
    object.hideOnStep &&
    !object.hideOnStep.every((step) => !player.visitedSteps.includes(step))
  ) {
    return false;
  }
  // Если все проверки пройдены, показываем опцию
  return true;
}

function createOptionElement(option) {
  const optionElement = document.createElement("li");
  optionText = option.text;
  if (option.img_key) {
    optionText = `<i class='ra ${option.img_key}'></i> ${optionText}`;
  }
  optionElement.innerHTML = optionText;
  optionElement.addEventListener("click", () => selectOption(option));
  return optionElement;
}

function clearOptions() {
  let optionsList = document.getElementById("optionsList");
  optionsList.innerHTML = "";
}

// function toggleInventory() {
//   let inventorySection = document.getElementById("inventory");
//   if (inventorySection.style.display === "none") {
//     inventorySection.style.display = "block";
//     showInventory();
//   } else {
//     inventorySection.style.display = "none";
//   }
// }

// function showInventory() {
//   let inventoryList = document.getElementById("inventoryList");
//   inventoryList.innerHTML = "";

//   if (player.inventory.length === 0) {
//     let inventoryItem = document.createElement("li");
//     inventoryItem.innerText = "Ваш инвентарь пуст.";
//     inventoryList.appendChild(inventoryItem);
//   } else {
//     let gridContainer = document.createElement("div");
//     gridContainer.classList.add("grid-container");

//     for (let i = 0; i < player.inventory.length; i++) {
//       let item = player.inventory[i];
//       let inventoryItem = document.createElement("div");
//       inventoryItem.classList.add("inventory-item");
//       inventoryItem.innerHTML = `<span class="material-symbols-outlined">${item.img_key}</span>`;
//       // contextmenu
//       inventoryItem.addEventListener("contextmenu", function (event) {
//         event.preventDefault();
//         var x = event.clientX;
//         var y = event.clientY;
//         showInventoryMenu(i, { x: x, y: y });
//       });
//       gridContainer.appendChild(inventoryItem);
//     }

//     inventoryList.appendChild(gridContainer);
//   }
// }

// function showInventoryMenu(itemIndex, coords) {
//   let item = player.inventory[itemIndex];
//   let menuOptions = [];

//   if (item.usable) {
//     menuOptions.push({
//       text: "Использовать",
//       action: function () {
//         useItem(itemIndex);
//       },
//     });
//   }
// }

// function useItem(itemIndex) {
//   if (itemIndex >= 1 && itemIndex <= player.inventory.length) {
//     let item = player.inventory[itemIndex - 1];
//     if (item.stats) {
//       let keys = Object.keys(item.stats);
//       for (let i = 0; i < keys.length; i++) {
//         let key = keys[i];
//         player[key] += item.stats[key];
//       }
//       updateMessage(`Вы использовали предмет "${item.name}" и улучшили свои характеристики.`);
//     } else {
//       updateMessage(`Вы использовали предмет "${item.name}".`);
//     }
//     player.inventory.splice(itemIndex - 1, 1);
//     savePlayerData();
//     showInventory();
//     showPlayerStats();
//   } else {
//     updateMessage('Некорректный номер предмета.');
//   }
// }

function savePlayerData() {
  player.currentStep = currentStep;
  localStorage.setItem("playerData", JSON.stringify(player));
}

// function showPlayerStats() {
//   let playerStats = document.getElementById("playerStats");
//   playerStats.innerHTML = "";

//   let statsList = document.createElement("ul");

//   let healthItem = document.createElement("li");
//   healthItem.innerText = `Здоровье: ${player.health}`;
//   statsList.appendChild(healthItem);

//   let strengthItem = document.createElement("li");
//   strengthItem.innerText = `Сила: ${player.strength}`;
//   statsList.appendChild(strengthItem);

//   let agilityItem = document.createElement("li");
//   agilityItem.innerText = `Ловкость: ${player.agility}`;
//   statsList.appendChild(agilityItem);

//   let intelligenceItem = document.createElement("li");
//   intelligenceItem.innerText = `Интеллект: ${player.intelligence}`;
//   statsList.appendChild(intelligenceItem);

//   playerStats.appendChild(statsList);
// }

function showGameSection() {
  let introSection = document.getElementById("intro");
  let gameSection = document.getElementById("game");

  introSection.style.display = "none";
  gameSection.style.display = "block";
}

// Загружаем сохраненные данные при загрузке страницы
window.addEventListener("load", function () {
  let savedPlayerData = localStorage.getItem("playerData");
  if (savedPlayerData) {
    player = JSON.parse(savedPlayerData);
    currentStep = player.currentStep;
  }

  // showPlayerStats();
  // showInventory();

  // Обработчик события клика на #chatWindow
  document.getElementById("chatWindow").addEventListener("click", function () {
    showNextMessage();
  });
});
