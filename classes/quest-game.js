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
      this.player = new Player(JSON.parse(savedPlayerData).name);
      this.player.currentStep = parseInt(
        JSON.parse(savedPlayerData).currentStep
      );
      this.player.visitedSteps = JSON.parse(savedPlayerData).visitedSteps;
    }
  }

  /**
   * Привязывает обработчики событий.
   */
  bindEventListeners() {
    document.getElementById("chatWindow").addEventListener("click", () => {
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
    // this.player.attributePoints = parseInt(
    //   document.getElementById("attributePointsValue").innerText
    // );
    // this.player.strength = parseInt(
    //   document.getElementById("strengthValue").innerText
    // );
    // this.player.agility = parseInt(
    //   document.getElementById("agilityValue").innerText
    // );
    // this.player.intelligence = parseInt(
    //   document.getElementById("intelligenceValue").innerText
    // );
    // this.player.charisma = parseInt(
    //   document.getElementById("charismaValue").innerText
    // );
    this.loadPlayerData();
    // this.savePlayerData();

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
    this.loadQuest((step) => {
      this.clearMessage();
      this.clearOptions();
      this.currentMessageIndex = 0;
      this.currentStep = step.id;

      if (!this.player.visitedSteps.includes(step.id)) {
        this.player.visitedSteps.push(step.id);
      }

      this.messages = step.messages.map(
        (message) =>
          new Message(message.author, message.content, message.avatar)
      );

      if (this.messages) {
        this.showNextMessage();
      }

      if (step.item) {
        this.player.inventory.push(step.item);
        this.showMessage("Система", `Получен предмет: ${step.item.name}`);
      }

      if (step.character) {
        this.player.encounteredCharacters.push(step.character);
      }

      if (step.location) {
        this.updateLocationImage(step.location.image);
      }

      if (step.options) {
        this.updateOptions(step.options);
      }

      this.savePlayerData();
    }, stepId);
  }

  /**
   * Загружает данные квеста.
   * @param {Function} callback - Функция обратного вызова для обработки данных квеста.
   * @param {number} stepId - Идентификатор шага квеста.
   */
  loadQuest(callback, stepId) {
    fetch(`/data/ar_${stepId}.json`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        callback(response);
      })
      .catch((error) => {
        console.error("Failed to load quest:", error);
      });
  }

  /**
   * Показывает следующее сообщение из массива сообщений.
   */
  showNextMessage() {
    if (this.currentMessageIndex < this.messages.length) {
      let message = this.messages[this.currentMessageIndex];

      if (!this.shouldShowObject(message)) {
        this.currentMessageIndex++;
        this.showNextMessage();
        return;
      }

      this.showMessage(message.author, message.content, message.avatar);

      let lastBlock = this.currentMessageIndex + 1 === this.messages.length;
      const typingIndicator = document.getElementById("typingIndicator");
      typingIndicator.style.display = lastBlock ? "none" : "flex";

      const optionsContainer = document.getElementById("optionsList");

      if (lastBlock) {
        setTimeout(() => {
          optionsContainer.style.display = "block";
          this.scrollToBottom();
        }, 500);
      } else {
        optionsContainer.style.display = "none";
      }

      this.currentMessageIndex++;
    }
  }

  /**
   * Отображает сообщение в окне чата.
   * @param {string} author - Автор сообщения.
   * @param {string} content - Содержимое сообщения.
   * @param {string|boolean} [avatar=false] - Путь к изображению аватара или false, если аватар не нужен.
   */
  showMessage(author, content, avatar = false) {
    const messageObject = new Message(author, content, avatar);
    messageObject.show();
  }

  /**
   * Обновляет изображение локации.
   * @param {string} imageUrl - URL изображения локации.
   */
  updateLocationImage(imageUrl) {
    const locationImage = document.getElementById("locationImage");
    if (!imageUrl) {
      imageUrl = location.pathname + "img/locations/black.png";
    }

    locationImage.classList.add("open-animation");
    locationImage.src = location.pathname + "img/locations/" + imageUrl;
    setTimeout(() => {
      locationImage.classList.remove("open-animation");
    }, 500);
  }

  /**
   * Обновляет список опций.
   * @param {Array<Option>} options - Массив опций.
   */
  updateOptions(options) {
    const optionsContainer = document.getElementById("optionsList");
    optionsContainer.innerHTML = "";

    options.forEach((option) => {
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
      this.messages = option.result.messages;

      if (option.result.options) {
        this.updateOptions(option.result.options);
      }

      this.currentMessageIndex = 0;

      if (this.messages) {
        this.showNextMessage();
      }

      if (option.item) {
        this.player.inventory.push(option.item);
        this.showMessage("Система", `Получен предмет: ${option.item.name}`);
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
    chatWindow.scrollTop = chatWindow.scrollHeight;
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
