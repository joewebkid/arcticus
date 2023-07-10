if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

let player = {
  name: 'Герой',
  health: 100,
  attributePoints:15,
  strength: 5,
  agility: 5,
  intelligence: 5,
  charisma: 5,
  inventory: [],
  currentStep:0,
  encounteredCharacters: [],
};

let currentStep = 0;

// Проверяем, есть ли данные в localStorage, и загружаем их
let savedPlayerData = localStorage.getItem('playerData');
if (savedPlayerData) {
  player = JSON.parse(savedPlayerData);
}

function loadQuest(callback) {
  let xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', 'quest.json', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      callback(data);
    }
  };
  xhr.send(null);
}

function increaseAttribute(attribute) {
  if (player.attributePoints > 0) {
    player[attribute]++;
    player.attributePoints--;
    updateAttributePoints();
    updateAttributeValue(attribute);
  }
  console.log(player)
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
  document.getElementById('attributePointsValue').innerText = player.attributePoints;
}

function updateAttributeValue(attribute) {
  document.getElementById(`${attribute}Value`).innerText = player[attribute];
}

function showCharacterCreation() {
  let introSection = document.getElementById('intro');
  let characterCreationSection = document.getElementById('characterCreation');

  introSection.style.display = 'none';
  characterCreationSection.style.display = 'block';
}

function startQuestGame() {
  player.attributePoints = parseInt(document.getElementById('attributePointsValue').innerText);

  player.strength = parseInt(document.getElementById('strengthValue').innerText);
  player.agility = parseInt(document.getElementById('agilityValue').innerText);
  player.intelligence = parseInt(document.getElementById('intelligenceValue').innerText);
  player.charisma = parseInt(document.getElementById('charismaValue').innerText);

  savePlayerData();

  loadQuest(function (quest) {
    currentStep = 0;
    showGameSection();
    updateMessage('--- Новый квест начинается ---');
    updateMessage(quest.story);
    executeStep(quest.steps[currentStep]);
  });
}

function startQuest() {
  let characterCreationSection = document.getElementById('characterCreation');
  let gameSection = document.getElementById('game');
  startQuestGame()

  characterCreationSection.style.display = 'none';
  gameSection.style.display = 'block';
}

function executeStep(step) {
  clearMessage();
  clearOptions();
  clearSystemMessage();

  let message = step.message;
  if (step.messages) {
    for (let i = 0; i < step.messages.length; i++) {
      let msg = step.messages[i];
      if (msg.item && player.inventory.includes(msg.item)) {
        message = msg.textWithItem;
      } else {
        message = msg.text;
      }
      if (checkRequirements(msg.requirements)) {
        message = msg.text;
        break;
      }
      break;
    }
  }
  // if (step.item) {
  //   player.inventory.push(step.item);
  //   message += `\n\n<div class="get_item_text">Получен предмет: ${step.item.name}</div>`;
  //   savePlayerData();
  // }
  // if (step.location) {
  //   message += `\n\n<div class="new_location_text">Вы находитесь в локации: ${step.location}</div>`;
  // }

  updateMessage(message);
  if (step.systemMessage) {
    let systemMessage = step.systemMessage;
    updateSystemMessage(systemMessage);
  }
  showPlayerStats();

  if (step.character) {
    player.encounteredCharacters.push(step.character);
    savePlayerData();
  }
  if (step.location) {
    console.log(step.location)
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
      if (checkRequirements(option.requirements)) {
        if (option.result) {
          updateSystemMessage(option.result);
          // Дополнительные действия, связанные с результатом
          if (option.item) {
            player.inventory.push(option.item);
            updateSystemMessage(`Получен предмет: ${option.item.name}`);
          }
        } else {
          currentStep = option.nextStep;
          executeStep(quest.steps[currentStep]);
        }
      } else {
        updateSystemMessage('У вас недостаточно характеристик для выбора этого варианта.');
      }
    } else {
      updateSystemMessage('Некорректный вариант ответа.');
    }
  });
}

function updateLocationImage(imageUrl) {
  let locationImage = document.getElementById('locationImage');
  locationImage.src = "/img/locations/"+imageUrl;
  console.log(locationImage.src)
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

function updateMessage(message) {
  let messageElement = document.getElementById('message');
  messageElement.innerHTML += message + '\n';
}
function updateSystemMessage(message) {
  let systemMessageElement = document.getElementById('systemMessage');
  systemMessageElement.innerText = message;
}
function clearSystemMessage() {
  let messageElement = document.getElementById('systemMessage');
  messageElement.innerText = '';
}

function clearMessage() {
  let messageElement = document.getElementById('message');
  messageElement.innerText = '';
}

function updateOptions(options) {
  let optionsList = document.getElementById('optionsList');
  optionsList.innerHTML = '';

  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    if (checkRequirements(option.requirements)) {
      let optionItem = document.createElement('li');
      optionItem.innerText = option.text;
      optionItem.setAttribute('onclick', `selectOption(${i + 1})`);
      optionsList.appendChild(optionItem);
    }
  }
}

function clearOptions() {
  let optionsList = document.getElementById('optionsList');
  optionsList.innerHTML = '';
}

function toggleInventory() {
  let inventorySection = document.getElementById('inventory');
  if (inventorySection.style.display === 'none') {
    inventorySection.style.display = 'block';
    showInventory();
  } else {
    inventorySection.style.display = 'none';
  }
}

function showInventory() {
  let inventoryList = document.getElementById('inventoryList');
  inventoryList.innerHTML = '';

  if (player.inventory.length === 0) {
    let inventoryItem = document.createElement('li');
    inventoryItem.innerText = 'Ваш инвентарь пуст.';
    inventoryList.appendChild(inventoryItem);
  } else {
    let gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');

    for (let i = 0; i < player.inventory.length; i++) {
      let item = player.inventory[i];
      let inventoryItem = document.createElement('div');
      inventoryItem.classList.add('inventory-item');
      inventoryItem.innerHTML = `<span class="material-symbols-outlined">${item.img_key}</span>`;
      // contextmenu
      inventoryItem.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        var x = event.clientX;
        var y = event.clientY;
        showInventoryMenu(i,{"x":x,"y":y});
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
      text: 'Использовать',
      action: function() { useItem(itemIndex); }
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
  localStorage.setItem('playerData', JSON.stringify(player));
}

function showPlayerStats() {
  let playerStats = document.getElementById('playerStats');
  playerStats.innerHTML = '';

  let statsList = document.createElement('ul');

  let healthItem = document.createElement('li');
  healthItem.innerText = `Здоровье: ${player.health}`;
  statsList.appendChild(healthItem);

  let strengthItem = document.createElement('li');
  strengthItem.innerText = `Сила: ${player.strength}`;
  statsList.appendChild(strengthItem);

  let agilityItem = document.createElement('li');
  agilityItem.innerText = `Ловкость: ${player.agility}`;
  statsList.appendChild(agilityItem);

  let intelligenceItem = document.createElement('li');
  intelligenceItem.innerText = `Интеллект: ${player.intelligence}`;
  statsList.appendChild(intelligenceItem);

  playerStats.appendChild(statsList);
}

function showGameSection() {
  let introSection = document.getElementById('intro');
  let gameSection = document.getElementById('game');

  introSection.style.display = 'none';
  gameSection.style.display = 'block';
}

// Загружаем сохраненные данные при загрузке страницы
window.addEventListener('load', function () {
  let savedPlayerData = localStorage.getItem('playerData');
  if (savedPlayerData) {
    player = JSON.parse(savedPlayerData);
    currentStep = player.currentStep;
  }

  showPlayerStats();
  showInventory();

  loadQuest(function (quest) {
    executeStep(quest.steps[currentStep]);
  });

  // document.addEventListener('click', function(event) {
  //   if (!event.target.closest('#contextMenu')) {
  //     closeContextMenu();
  //   }
  // });
});