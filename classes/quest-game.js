import { Player } from "./player.js";
import { Message } from "./message.js";
import { Option } from "./option.js";
/**
 * Класс игры
 */
export class QuestGame {
  /**
   * Создает экземпляр класса QuestGame.
   */
  constructor() {
    this.player = null;
    this.currentStep = 0;
    this.currentMessageIndex = 0;
    this.messages = [];
    this.selectedOptions = [];
    this.options = []; 
  }

  /**
   * Инициализирует игру.
   */
  initialize() {
    this.loadPlayerData();
    this.registerServiceWorker();
    this.bindEventListeners();
    this.showIntroSection();
  }

  /**
   * Регистрирует Service Worker.
   */
  registerServiceWorker() {
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
  }

  /**
   * Загружает данные игрока.
   */
  loadPlayerData() {
    let savedPlayerData = localStorage.getItem("playerData");
    if (savedPlayerData) {
      const playerData = JSON.parse(savedPlayerData);
      this.player = new Player(playerData);
    }
  }

  /**
   * Привязывает обработчики событий.
   */
  bindEventListeners() {
    document.getElementById("chatContainer").addEventListener("click", () => {
      this.showNextMessage();
    });

    document.getElementById("startButton").addEventListener("click", () => {
      this.startQuestGame();
    });

    document
      .getElementById("attributePointsContainer")
      .addEventListener("click", (event) => {
        this.handleAttributeClick(event);
      });

    document
      .getElementById("optionsList")
      .addEventListener("click", (event) => {
        this.handleOptionClick(event);
      });
  }

  /**
   * Показывает секцию вступления.
   */
  showIntroSection() {
    document.getElementById("intro").style.display = "block";
    document.getElementById("game").style.display = "none";
  }

  /**
   * Показывает секцию создания персонажа.
   */
  showCharacterCreation() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("characterCreation").style.display = "block";
  }

  /**
   * Запускает игру.
   */
  startQuestGame() {
    this.loadPlayerData();
    this.currentStep = this.player.currentStep || 0;
    this.showGameSection();
    this.executeStep(this.currentStep);
  }

  /**
   * Показывает секцию игры.
   */
  showGameSection() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("characterCreation").style.display = "none";
    document.getElementById("game").style.display = "block";
  }

  /**
   * Выполняет шаг квеста.
   * @param {number} stepId - Идентификатор шага квеста.
   */
  executeStep(stepId) {
    this.loadQuest(stepId)
      .then((step) => {
        this.clearMessage();
        this.clearOptions();
        this.currentMessageIndex = 0;
        this.currentStep = step.id;

        this.updatePlayerState(step);
        this.updateGameUI(step);
        this.savePlayerData();
        // this.showNextMessage();
      })
      .catch((error) => {
        console.error("Failed to execute step:", error);
      });
  }

  /**
   * Загружает данные квеста.
   * @param {Function} callback - Функция обратного вызова для обработки данных квеста.
   * @param {number} stepId - Идентификатор шага квеста.
   */
  loadQuest(stepId) {
    return fetch(`/data/ar_${stepId}.json`).then((response) =>
      response.json()
    );
  }

  /**
   * Показывает следующее сообщение из массива сообщений.
   */
  showNextMessage() {
    if (this.currentMessageIndex < this.messages.length) {
      const message = this.messages[this.currentMessageIndex];
      
      if (!this.shouldShowObject(message)) {
        this.currentMessageIndex++;
        this.showNextMessage();
        return;
      }

      // const { author, content, avatar } = message;
      message.show()

      const lastBlock = this.currentMessageIndex + 1 === this.messages.length;
      const typingIndicator = document.getElementById("typingIndicator");
      typingIndicator.style.display = lastBlock ? "none" : "flex";

      const optionsContainer = document.getElementById("optionsList");
      optionsContainer.style.display = lastBlock ? "block" : "none";
      this.scrollToBottom()
      this.currentMessageIndex++;
    }
  }
  
  updatePlayerState(step) {
    this.updateVisitedSteps(step);
    this.updatePlayerInventory(step);
    this.updateEncounteredCharacters(step);
  }

  updateVisitedSteps(step) {
    if (!this.player.visitedSteps.includes(step.id)) {
      this.player.visitedSteps.push(step.id);
    }
  }

  updatePlayerInventory(step) {
    if (step.item) {
      this.player.inventory.push(step.item);
      this.showMessage("Система", `Получен предмет: ${step.item.name}`);
    }
  }

  updateEncounteredCharacters(step) {
    if (step.character) {
      this.player.encounteredCharacters.push(step.character);
    }
  }

  updateGameUI(step) {
    if (step.location) {
      this.updateLocationImage(step.location.image);
    }

    if (step.messages) {
      this.messages = step.messages.map((messageData) => new Message(messageData));
      this.showNextMessage();
    }

    if (step.options) {
      this.options = step.options.map((optionData) => new Option(optionData));
      this.updateOptions();
    }
  }

  /**
   * Обновляет изображение локации.
   * @param {string} imageUrl - URL изображения локации.
   */
  updateLocationImage(imageUrl) {
    const locationImage = document.getElementById("locationImage");
    imageUrl = imageUrl ? `${location.pathname}img/locations/${imageUrl}` : `${location.pathname}img/locations/black.png`;

    locationImage.classList.add("open-animation");
    locationImage.src = imageUrl;
    setTimeout(() => {
      locationImage.classList.remove("open-animation");
    }, 500);
  }

  /**
   * Обновляет список опций.
   */
  updateOptions() {
    const optionsContainer = document.getElementById("optionsList");
    optionsContainer.innerHTML = "";

    this.options.forEach((option) => {
      if (this.shouldShowObject(option)) {
        const optionElement = this.createOptionElement(option);
        optionsContainer.appendChild(optionElement);
      }
    });
  }

  /**
   * Проверяет, должен ли объект (опция или сообщение) быть показан или скрыт на основе объекта опции и заданных условий.
   * @param {Object} object - Объект опции или сообщения.
   * @returns {boolean} - Возвращает true, если объект должен быть показан, иначе false.
   */
  shouldShowObject(object) {
    if (object.once && this.selectedOptions.includes(object.id)) {
      return false;
    }

    if (object.item && !this.player.inventory.includes(object.item)) {
      return false;
    }

    if (
      object.characters &&
      !object.characters.every((character) =>
        this.player.encounteredCharacters.includes(character)
      )
    ) {
      return false;
    }

    if (
      object.showIfStep &&
      !object.showIfStep.every((step) =>
        this.player.visitedSteps.includes(step)
      )
    ) {
      return false;
    }

    if (
      object.hideIfStep &&
      object.hideIfStep.some((step) => this.player.visitedSteps.includes(step))
    ) {
      return false;
    }

    return true;
  }

  /**
   * Создает элемент опции.
   * @param {Option} option - Объект опции.
   * @returns {HTMLElement} - Элемент опции.
   */
  createOptionElement(option) {
    const optionElement = document.createElement("li");
    let optionText = option.text;

    if (option.img_key) {
      optionText = `<i class='ra ${option.img_key}'></i> ${optionText}`;
    }

    optionElement.innerHTML = optionText;
    optionElement.addEventListener("click", () => {
      this.selectOption(option);
    });

    return optionElement;
  }

  /**
   * Выполняет выбор опции.
   * @param {Option} option - Объект опции.
   */
  selectOption(option) {
    this.selectedOptions.push(option.id);
  
    if (option.nextStep) {
      this.executeStep(option.nextStep);
    }
  
    if (option.result) {
      const { messages, options, item } = option.result;
      
      if (options) {
        this.options = options.map((optionData) => new Option(optionData))
        this.updateOptions();
      }
  
      this.currentMessageIndex = 0;
  
      if (messages) {
        this.messages = messages.map((messageData) => new Message(messageData));
        this.showNextMessage();
      }
  
      if (item) {
        this.player.inventory.push(item);
        this.showMessage("Система", `Получен предмет: ${item.name}`);
      }
    }
  
    if (option.item) {
      this.player.inventory.push(option.item);
      this.showMessage("Система", `Получен предмет: ${option.item.name}`);
    }
  }
  

  /**
   * Очищает окно чата.
   */
  clearMessage() {
    const messageContainer = document.getElementById("chatContainer");
    messageContainer.innerHTML = "";
  }

  /**
   * Очищает список опций.
   */
  clearOptions() {
    const optionsList = document.getElementById("optionsList");
    optionsList.innerHTML = "";
  }

  /**
   * Сохраняет данные игрока.
   */
  savePlayerData() {
    localStorage.setItem("playerData", JSON.stringify(this.player));
  }

  /**
   * Сохраняет данные игрока.
   */
  loadPlayerData() {
    let savedPlayerData = localStorage.getItem("playerData");
    if (savedPlayerData) {
      const playerData = JSON.parse(savedPlayerData);
      this.player = new Player(playerData);
    }
  }

  /**
   * Прокручивает окно чата вниз.
   */
  scrollToBottom() {
    const chatWindow = document.getElementById("chatWindow");
    setTimeout(function () {
      // optionsContainer.style.display = "block";
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 100);
  }

  /**
   * Обрабатывает клик по атрибуту.
   * @param {Event} event - Событие клика.
   */
  handleAttributeClick(event) {
    const attributePointsContainer = document.getElementById(
      "attributePointsContainer"
    );
    const attribute = event.target.dataset.attribute;

    if (
      attribute &&
      this.player.attributePoints > 0 &&
      event.target.closest("#characterCreation")
    ) {
      this.player.increaseAttribute(attribute);
      this.updateAttributePoints();
      this.updateAttributeValue(attribute);
    }
  }

  /**
   * Обрабатывает клик по опции.
   * @param {Event} event - Событие клика.
   */
  handleOptionClick(event) {
    const optionElement = event.target.closest("li");

    if (optionElement) {
      const option = optionElement.dataset.option;
      if (option) {
        this.selectOption(JSON.parse(option));
      }
    }
  }

  /**
   * Обновляет значение доступных очков атрибутов на странице.
   */
  updateAttributePoints() {
    document.getElementById("attributePointsValue").innerText =
      this.player.attributePoints;
  }

  /**
   * Обновляет значение конкретного атрибута на странице.
   * @param {string} attribute - Название атрибута, который нужно обновить.
   */
  updateAttributeValue(attribute) {
    document.getElementById(`${attribute}Value`).innerText =
      this.player[attribute];
  }
}