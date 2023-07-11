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
  encounteredCharacters: [],
};

let currentStep = 0;
// Переменная для хранения индекса текущего сообщения
let currentMessageIndex = 0;
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




// ---
function showNextMessage() {
  if (currentMessageIndex < messages.length) {
    var message = messages[currentMessageIndex];
    showMessage(message.author, message.content, message.avatar);
    let lastBlock = (currentMessageIndex+1) != messages.length


    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = lastBlock ? 'flex' : 'none';
    console.log(typingIndicator.style.display)

    // Показываем опции или скрываем
    const optionsContainer = document.getElementById('optionsList');
    
    if(!lastBlock) {
      var chatWindow = document.getElementById("chatWindow");
      setTimeout(function() {
        optionsContainer.style.display = 'block';
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }, 500);
    }else{
      optionsContainer.style.display = 'none';

    }

    currentMessageIndex++;
  }
}

function showMessage(author, content, avatar = false) {
  var chatWindow = document.getElementById("chatWindow");
  var chatContainer = document.getElementById("chatContainer");
  var messageContainer = document.createElement("div");
  messageContainer.className = "message";

  var authorElement = document.createElement("div");
  authorElement.className = "author";
  authorElement.innerText = author;

  let avatarElement = null
  if (author === "Система") { avatar = "system.png" }
  if (author === "Герой") { avatar = "hero.png" }
  if(avatar) {
    avatarElement = document.createElement("img");
    avatarElement.classList.add("avatar");
    messageContainer.classList.add("left");
    avatarElement.src = location.pathname+"img/persons/"+avatar;
  }else{
    avatarElement = document.createElement("div");
    avatarElement.classList.add("avatar");
    messageContainer.classList.add("left");
    avatarElement.innerText = author[0];
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

  setTimeout(function() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 100);
}

function increaseAttribute(attribute) {
  if (player.attributePoints > 0) {
    player[attribute]++;
    player.attributePoints--;
    updateAttributePoints();
    updateAttributeValue(attribute);
  }
  console.log(player);
}

function decreaseAttribute(attribute) {
  if (player[attribute] > 1) {
    player[attribute]--;
    player.attributePoints++;
    updateAttributePoints();
    updateAttributeValue(attribute);
  }
}

function updateAttributePoints() {
  document.getElementById("attributePointsValue").innerText =
    player.attributePoints;
}

function updateAttributeValue(attribute) {
  document.getElementById(`${attribute}Value`).innerText = player[attribute];
}

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
    currentStep = 0;
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
  if (selectedOptions.includes(option.text)) {
    return true;
  }
  return false;
}

function executeStep(step) {
  clearMessage();
  clearOptions();
  currentMessageIndex = 0
  messages = step.messages
//  @TODO hasSelectedOptions
  if (messages) {
    showNextMessage();
  } 
  if (step.item) {
    player.inventory.push(step.item);
    showMessage("Система", `Получен предмет: ${step.item.name}`);
  }

  if (step.character) {
    player.encounteredCharacters.push(step.character);
    savePlayerData();
  }
  if (step.location) {
    updateLocationImage(step.location.image);
  }
  if (step.options) {
    updateOptions(step.options);
  }
}

function selectOption(optionIndex) {
  loadQuest(function (quest) {
    let step = quest.steps[currentStep];

    if (optionIndex >= 1 && optionIndex <= step.options.length) {
      let option = step.options[optionIndex - 1];
//  @TODO     // selectedOptions.push(option.text);
      if (checkRequirements(option.requirements)) {
        if (option.result) {
          messages = option.result.messages
          currentMessageIndex = 0
          if (messages) {
            showNextMessage();
          }
          // Дополнительные действия, связанные с результатом
          if (option.item) {
            player.inventory.push(option.item);
            showMessage("Система", `Получен предмет: ${option.item.name}`);
          }
        } else {
          currentStep = option.nextStep;
          executeStep(quest.steps[currentStep]);
        }
      } else {
        showMessage(
          "Система",
          "У вас недостаточно характеристик для выбора этого варианта."
        );
      }
    } else {
      showMessage("Система", "Некоректный вариант ответа.");
    }
  });
}

function updateLocationImage(imageUrl) {
  let locationImage = document.getElementById("locationImage");
  locationImage.src = location.pathname+"img/locations/" + imageUrl;
  console.log(locationImage.src);
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

// function updateMessage(message) {
//   let messageElement = document.getElementById("message");
//   messageElement.innerHTML += message + "\n";
// }
// function updateSystemMessage(message) {
//   let systemMessageElement = document.getElementById("systemMessage");
//   systemMessageElement.innerText = message;
// }
// function clearSystemMessage() {
//   let messageElement = document.getElementById("systemMessage");
//   messageElement.innerText = "";
// }

function clearMessage() {
  var messageContainer = document.getElementById("chatContainer");
  messageContainer.innerHTML = "";
}

function updateOptions(options) {
  let optionsList = document.getElementById("optionsList");
  optionsList.innerHTML = "";

  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    if (checkRequirements(option.requirements)) {
      let optionItem = document.createElement("li");
      let optionText = option.text
      if(option.img_key) { optionText = `<i class='ra ${option.img_key}'></i> ${optionText}` }
      optionItem.innerHTML = optionText;
      optionItem.setAttribute("onclick", `selectOption(${i + 1})`);
      optionsList.appendChild(optionItem);
    }
  }
}

function clearOptions() {
  let optionsList = document.getElementById("optionsList");
  optionsList.innerHTML = "";
}

function toggleInventory() {
  let inventorySection = document.getElementById("inventory");
  if (inventorySection.style.display === "none") {
    inventorySection.style.display = "block";
    showInventory();
  } else {
    inventorySection.style.display = "none";
  }
}

function showInventory() {
  let inventoryList = document.getElementById("inventoryList");
  inventoryList.innerHTML = "";

  if (player.inventory.length === 0) {
    let inventoryItem = document.createElement("li");
    inventoryItem.innerText = "Ваш инвентарь пуст.";
    inventoryList.appendChild(inventoryItem);
  } else {
    let gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");

    for (let i = 0; i < player.inventory.length; i++) {
      let item = player.inventory[i];
      let inventoryItem = document.createElement("div");
      inventoryItem.classList.add("inventory-item");
      inventoryItem.innerHTML = `<span class="material-symbols-outlined">${item.img_key}</span>`;
      // contextmenu
      inventoryItem.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        var x = event.clientX;
        var y = event.clientY;
        showInventoryMenu(i, { x: x, y: y });
      });
      gridContainer.appendChild(inventoryItem);
    }

    inventoryList.appendChild(gridContainer);
  }
}

function showInventoryMenu(itemIndex, coords) {
  let item = player.inventory[itemIndex];
  let menuOptions = [];

  if (item.usable) {
    menuOptions.push({
      text: "Использовать",
      action: function () {
        useItem(itemIndex);
      },
    });
  }

  // showContextMenu(menuOptions, coords, item);
}

// function showContextMenu(options, coords, item) {
//   clearContextMenu();

//   let contextMenu = document.getElementById('contextMenu');
//   let contextMenuList = document.createElement('ul');

//   for (let i = 0; i < options.length; i++) {
//     let option = options[i];
//     let menuItem = document.createElement('li');
//     menuItem.className = "context-menu-item";
//     menuItem.innerText = option.text;
//     menuItem.addEventListener('click', option.action);
//     contextMenuList.appendChild(menuItem);
//   }

//   contextMenu.innerText = item.name
//   contextMenu.appendChild(contextMenuList);
//   contextMenu.style.display = 'block';
//   contextMenu.style.left = coords.x + 'px';
//   contextMenu.style.top = coords.y + 'px';
// }

// function clearContextMenu() {
//   let contextMenu = document.getElementById('contextMenu');
//   contextMenu.innerHTML = '';
//   contextMenu.style.display = 'none';
// }

// function closeContextMenu() {
//   clearContextMenu();
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

function showPlayerStats() {
  let playerStats = document.getElementById("playerStats");
  playerStats.innerHTML = "";

  let statsList = document.createElement("ul");

  let healthItem = document.createElement("li");
  healthItem.innerText = `Здоровье: ${player.health}`;
  statsList.appendChild(healthItem);

  let strengthItem = document.createElement("li");
  strengthItem.innerText = `Сила: ${player.strength}`;
  statsList.appendChild(strengthItem);

  let agilityItem = document.createElement("li");
  agilityItem.innerText = `Ловкость: ${player.agility}`;
  statsList.appendChild(agilityItem);

  let intelligenceItem = document.createElement("li");
  intelligenceItem.innerText = `Интеллект: ${player.intelligence}`;
  statsList.appendChild(intelligenceItem);

  playerStats.appendChild(statsList);
}

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

  showPlayerStats();
  showInventory();

  // loadQuest(function (quest) {
  //   executeStep(quest.steps[currentStep]);
  //   console.log()
  // });

  // Обработчик события клика на #chatWindow
  document.getElementById("chatWindow").addEventListener("click", function () {
    showNextMessage();
  });

  // document.addEventListener('click', function(event) {
  //   if (!event.target.closest('#contextMenu')) {
  //     closeContextMenu();
  //   }
  // });
});
