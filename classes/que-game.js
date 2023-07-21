// questGame.js (с использованием uiController.js)

import { Player } from "./player.js";
import { Message } from "./message.js";
import { Option } from "./option.js";
import { UiController } from "./uiController.js";

export class QuestGame {
  constructor() {
    this.player = null;
    this.currentStep = 0;
    this.currentMessageIndex = 4;
    this.messages = [];
    this.selectedOptions = [];
    this.options = []; 
    this.uiController = new UiController();
  }

  initialize() {
    this.loadPlayerData();
    this.registerServiceWorker();
    this.bindEventListeners();
    this.showIntroSection();
  }

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

  loadPlayerData() {
    let savedPlayerData = localStorage.getItem("playerData");
    if (savedPlayerData) {
      const playerData = JSON.parse(savedPlayerData);
      this.player = new Player(playerData);
    }
  }

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

  showIntroSection() {
    document.getElementById("intro").style.display = "block";
    document.getElementById("game").style.display = "none";
  }

  showCharacterCreation() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("characterCreation").style.display = "block";
  }

  startQuestGame() {
    this.loadPlayerData();
    this.currentStep = this.player.currentStep || 0;
    this.showGameSection();
    this.executeStep(this.currentStep);
  }

  showGameSection() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("game").style.display = "block";
  }

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
      })
      .catch((error) => {
        console.error("Failed to execute step:", error);
      });
  }

  loadQuest(stepId) {
    return fetch(`${location.pathname}data/ar_${stepId}.json`).then((response) =>
      response.json()
    );
  }

  typingAnimation = () => {
    const lastBlock = this.currentMessageIndex === this.messages.length;
    
    const typingIndicator = document.getElementById("typingIndicator");
    typingIndicator.style.display = lastBlock ? "none" : "flex";

    const optionsContainer = document.getElementById("optionsList");
    optionsContainer.style.display = lastBlock ? "block" : "none";
    this.scrollToBottom()
  }

  showNextMessage() {
    this.typingAnimation()

    if (this.currentMessageIndex < this.messages.length) {
      const message = this.messages[this.currentMessageIndex];
      
      if (!this.shouldShowObject(message)) {
        this.currentMessageIndex++;
        this.showNextMessage();
        return;
      }
      
      this.uiController.showMessage(message);
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
      this.uiController.showMessage("Система", `Получен предмет: ${step.item.name}`);
    }
  }

  updateEncounteredCharacters(step) {
    if (step.character) {
      this.player.encounteredCharacters.push(step.character);
    }
  }
  
  updateGameUI(step) {
    const properties = ['location', 'messages', 'options'];
  
    for (const property of properties) {
      if (step[property]) {
        if (property === 'messages') {
          this.messages = step[property].map(messageData => new Message(messageData));
          this.showNextMessage();
        } else if (property === 'options') {
          this.options = step[property].map(optionData => new Option(optionData));
          this.uiController.updateOptions(this.options);
        } else {
          this.uiController.updateLocationImage(step[property].image);
        }
      }
    }
  }
  
  selectOption(option) {
    this.selectedOptions.push(option.id);
  
    if (option.nextStep) {
      this.executeStep(option.nextStep);
    }else if (option.result) {
      const { messages, options, item, image } = option.result;  
      this.currentMessageIndex = 0;
      
      if (image) {
        this.uiController.updateLocationImage(image);
      }
      
      if (options) {
        this.options = options.map((optionData) => new Option(optionData))
      }
  
      if (messages) {
        this.messages = messages.map((messageData) => new Message(messageData));
        this.showNextMessage();
      }
  
      if (item) {
        this.player.inventory.push(item);
        this.uiController.showMessage("Система", `Получен предмет: ${item.name}`);
      }
      this.uiController.updateOptions(this.options);
    }
  }

  clearMessage() {
    this.uiController.clearMessage();
  }

  clearOptions() {
    this.uiController.clearOptions();
  }

  savePlayerData() {
    localStorage.setItem("playerData", JSON.stringify(this.player));
  }

  loadPlayerData() {
    let savedPlayerData = localStorage.getItem("playerData");
    if (savedPlayerData) {
      const playerData = JSON.parse(savedPlayerData);
      this.player = new Player(playerData);
    }
  }

  scrollToBottom() {
    setTimeout(function () {
      const chatWindow = document.getElementById("chatWindow");
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 100);
  }

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
      this.uiController.updateAttributePoints();
      this.uiController.updateAttributeValue(attribute);
    }
  }

  handleOptionClick(event) {
    const optionElement = event.target.closest("li");

    if (optionElement

) {
      const option = optionElement.dataset.option;
      if (option) {
        this.selectOption(JSON.parse(option));
      }
    }
  }
}