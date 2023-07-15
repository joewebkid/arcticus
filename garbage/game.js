const fs = require('fs');

let player = {
  name: 'Герой',
  health: 100,
  strength: 10,
  agility: 10,
  intelligence: 10,
  inventory: [],
};

let currentStep = 0;

function loadQuest() {
  let rawData = fs.readFileSync('quest.json');
  let data = JSON.parse(rawData);
  return data;
}

function startQuest() {
  let quest = loadQuest();
  currentStep = 0;
  updateMessage(quest.story);
  updateOptions(quest.steps[currentStep].options);
  updateLocation('');
  updateInventory();
}

function executeStep(step) {
  updateMessage(step.message);

  if (step.item) {
    player.inventory.push(step.item);
    updateMessage(`Получен предмет: ${step.item.name}`);
  }

  if (step.location) {
    updateLocation(`Вы находитесь в локации: ${step.location}`);
  }

  updateOptions(step.options);
  updateInventory();
}

function selectOption(optionIndex) {
  let quest = loadQuest();
  let step = quest.steps[currentStep];

  if (optionIndex >= 1 && optionIndex <= step.options.length) {
    let option = step.options[optionIndex - 1];
    if (checkRequirements(option.requirements)) {
      currentStep = option.nextStep;
      executeStep(quest.steps[currentStep]);
    } else {
      updateMessage('У вас недостаточно характеристик для выбора этого варианта.');
    }
  } else {
    updateMessage('Некорректный вариант ответа.');
  }
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
  messageElement.textContent = message;
}

function updateOptions(options) {
  let optionsList = document.getElementById('optionsList');
  optionsList.innerHTML = '';

  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    if (checkRequirements(option.requirements)) {
      let optionItem = document.createElement('li');
      optionItem.textContent = option.text;
      optionItem.setAttribute('onclick', `selectOption(${i + 1})`);
      optionsList.appendChild(optionItem);
    }
  }
}

function updateLocation(location) {
  let locationName = document.getElementById('locationName');
  locationName.textContent = location;
}

function updateInventory() {
  let inventoryList = document.getElementById('inventoryList');
  inventoryList.innerHTML = '';

  if (player.inventory.length === 0) {
    let inventoryItem = document.createElement('li');
    inventoryItem.textContent = 'Ваш инвентарь пуст.';
    inventoryList.appendChild(inventoryItem);
  } else {
    for (let i = 0; i < player.inventory.length; i++) {
      let item = player.inventory[i];
      let inventoryItem = document.createElement('li');
      inventoryItem.textContent = `${item.name} - ${item.description}`;
      inventoryList.appendChild(inventoryItem);
    }
  }
}

function useItem(itemIndex) {
  if (itemIndex >= 1 && itemIndex <= player.inventory.length) {
    let item = player.inventory[itemIndex - 1];
    if (item.stats) {
      let keys = Object.keys(item.stats);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        player[key] += item.stats[key];
      }
      updateMessage(`Вы использовали предмет "${item.name}" и улучшили свои характеристики.`);
    } else {
      updateMessage(`Вы использовали предмет "${item.name}".`);
    }
    player.inventory.splice(itemIndex - 1, 1);
  } else {
    updateMessage('Некорректный номер предмета.');
  }
  updateInventory();
}

module.exports = {
  startQuest,
  selectOption,
  useItem,
};
