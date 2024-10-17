import { Player } from "./player.js";
import { Message } from "./message.js";
import { Option } from "./option.js";
import { Dice } from "./dice.js";
import { GameUI } from "./game-ui.js";
import { GameMap } from "./game-map.js";
import { ResourceLoader } from "./resource-loader.js";
import { resources } from "./resources-data.js";
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
    this.currentMessageIndex = 4;
    this.messages = [];
    this.selectedOptions = [];
    this.options = [];
    this.gameUi = null;
    this.map = new GameMap("pointContainer", "mapImage", this.currentStep);
  }

  /**
   * Инициализирует игру.
   */
  initialize() {
    const resourceLoader = new ResourceLoader(resources);

    this.loadPlayerData();
    this.bindEventListeners();
    this.showIntroSection();
    this.registerServiceWorker();

    // resourceLoader.preloadAllResources().then(() => {
    //   this.loadPlayerData();
    //   this.bindEventListeners();
    //   this.showIntroSection();
    //   this.registerServiceWorker();
    // });
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
   * Привязывает обработчики событий.
   */
  bindEventListeners() {
    document.getElementById("chatContainer").addEventListener("click", () => {
      this.showNextMessage();
    });

    document.getElementById("startButton").addEventListener("click", () => {
      this.startQuestGame();
    });

    // document
    //   .getElementById("attributePointsContainer")
    //   .addEventListener("click", (event) => {
    //     this.handleAttributeClick(event);
    //   });

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
    document.getElementById("start_button").classList.add("active");
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
    this.currentStep = this.player.currentStep || 0;
    this.showGameSection();
    this.executeStep(this.currentStep);
  }

  /**
   * Показывает секцию игры.
   */
  showGameSection() {
    document.getElementById("intro").style.display = "none";
    // document.getElementById("characterCreation").style.display = "none";
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
        this.player.save();

        // this.savePlayerData();
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
    return fetch(`${location.pathname}data/ar_${stepId}.json`).then(
      (response) => response.json()
    );
  }

  typingAnimation = () => {
    const lastBlock = this.currentMessageIndex === this.messages.length;

    const typingIndicator = document.getElementById("typingIndicator");
    typingIndicator.style.display = lastBlock ? "none" : "flex";

    const optionsContainer = document.getElementById("optionsList");
    optionsContainer.style.display = lastBlock ? "block" : "none";
    this.scrollToBottom();
  };

  /**
   * Показывает следующее сообщение из массива сообщений.
   */
  showNextMessage() {
    this.typingAnimation();

    if (this.currentMessageIndex < this.messages.length) {
      const message = this.messages[this.currentMessageIndex];

      if (!this.shouldShowObject(message)) {
        this.currentMessageIndex++;
        this.showNextMessage();
        return;
      }

      message.show();
      this.currentMessageIndex++;
    }
  }

  updatePlayerState(step) {
    this.updateVisitedSteps(step);
    this.updateCurrentStep(step);
    this.updatePlayerInventory(step);
    this.updateEncounteredCharacters(step);
  }

  /**
   * Обновляет текущий шаг и отображает изменения на карте.
   * @param {Object} step - Текущий шаг.
   */
  updateCurrentStep(step) {
    this.currentStep = step.id;
    this.player.currentStep = step.id;
    this.map.updateCurrentStep(step);
  }

  updateVisitedSteps(step) {
    if (!this.player.visitedSteps.includes(step.id)) {
      this.player.visitedSteps.push(step.id);
    }
  }

  updatePlayerInventory(step) {
    if (step.item) {
      this.player.inventory.push(step.item);
      new Message({
        author: "Система",
        content: `Получен предмет: ${step.item.name}`,
      }).show();
    }
  }

  updateEncounteredCharacters(step) {
    if (step.character) {
      this.player.encounteredCharacters.push(step.character);
    }
  }

  updateGameUI(step) {
    const properties = ["location", "messages", "options"];

    for (const property of properties) {
      if (step[property]) {
        if (property === "messages") {
          this.messages = step[property].map(
            (messageData) => new Message(messageData)
          );
          this.showNextMessage();
        } else if (property === "options") {
          this.options = step[property].map(
            (optionData) => new Option(optionData)
          );
          this.updateOptions();
        } else {
          this.updateLocationImage(step[property].image);
        }
      }
    }
  }

  /**
   * Обновляет изображение локации.
   * @param {string} imageUrl - URL изображения локации.
   */
  updateLocationImage(imageUrl) {
    const locationImage = document.getElementById("locationImage");
    imageUrl = imageUrl
      ? `${location.pathname}img/locations/${imageUrl}`
      : `${location.pathname}img/locations/black.png`;

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
      // console.log("shouldShowObject", this.shouldShowObject(option), option);
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
   * @TODO Перенести в класс Object от которого будут наследоваться Options и Messages
   */
  shouldShowObject(object) {
    const { visitedSteps, inventory, encounteredCharacters } = this.player;
    // if (object.id == 19)
    //   console.log(
    //     object,
    //     object.item,
    //     inventory,
    //     inventory.includes(object.item)
    //   );
    const inventoryIds = inventory.map((item) => {
      return item["name"];
    });
    console.log(
      inventoryIds,
      object.hideIfItem,
      inventoryIds.includes(object.showIfItem)
    );
    const conditions = {
      // once: this.selectedOptions.includes(object.id),
      once: visitedSteps.includes(object.id),
      showIfItem: !inventoryIds.includes(object.showIfItem),
      hideIfItem: inventoryIds.includes(object.hideIfItem),
      characters: new Set(object.characters).hasAll(encounteredCharacters),
      showIfStep: !new Set(visitedSteps).hasAll(object.showIfStep),
      hideIfStep: new Set(object.hideIfStep).hasAny(visitedSteps),
    };
    // console.log(conditions);
    // console.log("conditions", conditions);

    for (const condition in conditions) {
      if (object[condition] && conditions[condition]) {
        return false;
      }
    }
    // if (object.id == 19) console.log(conditions);

    return true;
  }

  /**
   * Создает элемент опции.
   * @param {Option} option - Объект опции.
   * @returns {HTMLElement} - Элемент опции.
   */
  createOptionElement(option) {
    let optionElement = option.createOptionElement(this.player);
    optionElement.addEventListener("click", () => {
      this.selectOption(option);
    });

    return optionElement;
  }

  // set options(x) {
  //   console.log(x);
  //   this.updateOptions();
  // }

  /**
   * Выполняет выбор опции.
   * @param {Option} option - Объект опции.
   */
  selectOption(option) {
    const { diceRequirements, diceDifficult } = option;
    if (diceRequirements && diceDifficult) {
      const dice = new Dice(
        diceDifficult,
        diceRequirements,
        this.player,
        this.executeSelectedOption.bind(this, option)
      );
      dice.showPanel();
    } else {
      this.executeSelectedOption(option);
    }
  }

  executeSelectedOption(option, status = true) {
    this.selectedOptions.push(option.id);

    const opt_result = status ? option.result : option.failure;

    if (option.nextStep) {
      this.executeStep(option.nextStep);
    } else if (opt_result) {
      const { messages, options, item, image, choose_class, quest } =
        opt_result;
      this.currentMessageIndex = 0;

      if (image) {
        this.updateLocationImage(image);
      }

      if (options) {
        this.options = options.map((optionData) => new Option(optionData));
      }

      if (messages) {
        this.messages = messages.map((messageData) => new Message(messageData));
        this.showNextMessage();
      }

      if (choose_class) {
        this.player.class = choose_class;
      }

      if (quest) {
        let alreadyIsset = this.player.quests.filter(function (v) {
          return v["id"] == quest.id;
        })[0];

        if (alreadyIsset) {
          const itemToReplace = this.player.quests.find((item) => {
            console.log(item, item.id === quest.id, quest);
            if (item.id === quest.id) {
              item.description += "<br>" + quest.description;
              return true;
            }
          });
        } else this.player.quests.push(quest);
        this.messages.push(
          new Message({
            author: "Система",
            content: `Новая задача: ${quest.name}`,
          })
        );
      }

      if (item) {
        this.player.inventory.push(item);
        this.messages.push(
          new Message({
            author: "Система",
            content: `Получен предмет: ${item.name}`,
          })
        );
      }

      this.updatePlayerState(option);
      this.updateOptions();
      this.player.save();
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
   * Загружает данные карты и передает их в класс GameMap.
   */
  loadMapData() {
    // Пример получения данных карты (можно динамически загружать разные карты)
    fetch("./data/maps/mp_0.json")
      .then((response) => response.json())
      .then((mapData) => {
        this.map.loadMap(mapData);
      });
  }

  /**
   * Загружает данные игрока.
   */
  loadPlayerData() {
    this.player = new Player();
    this.player.load();
    this.gameUi = new GameUI(this.player);
    this.loadMapData();
  }

  /**
   * Прокручивает окно чата вниз.
   */
  scrollToBottom() {
    setTimeout(function () {
      // optionsContainer.style.display = "block";
      const chatWindow = document.getElementById("chatWindow");
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 100);
  }

  // Под удаление или перенос
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
