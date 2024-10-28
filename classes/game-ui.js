export class GameUI {
  constructor(player) {
    this.player = player;

    this.menuButtons = document.querySelectorAll(".medieval-button");
    this.sections = {
      inventory: document.getElementById("inventory"),
      stats: document.getElementById("playerStats"),
      quest: document.getElementById("quest"),
      map: document.getElementById("map"),
      settings: document.getElementById("settings"),
    };

    this.inventoryList = document.getElementById("inventoryList");
    this.statsList = document.getElementById("statsList");
    this.questsList = document.getElementById("questsList");

    this.labels = {
      health: "Жизнь",
      attributePoints: "Очки атрибутов",
      strength: "Сила",
      agility: "Ловкость",
      intelligence: "Интелект",
      charisma: "Харизма",
      defense: "Защита",
      damage: "Урон",
    };

    this.expandedQuest = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.menuButtons.forEach((button) => {
      button.addEventListener("click", (event) => this.handleMenuClick(event));
    });
    this.questsList.addEventListener("click", (event) =>
      this.handleQuestClick(event)
    );

    document
      .getElementById("resetQuestButton")
      .addEventListener("click", () => this.resetQuest());
  }

  resetQuest() {
    if (confirm("Вы уверены, что хотите сбросить квест и начать заново?")) {
      // Удаляем данные игрока из localStorage
      localStorage.removeItem("playerData");
      // Перезагружаем страницу для начала игры заново
      window.location.reload();
    }
  }

  handleMenuClick(event) {
    const buttonId = event.target.closest(".medieval-button").id;
    const sectionName = this.getSectionName(buttonId);

    if (this.currentOpenSection === sectionName) {
      this.toggleSection(buttonId, false);
    } else {
      this.toggleSection(buttonId, true);
    }
  }

  toggleSection(buttonId, open) {
    document
      .querySelectorAll(".medieval-button")
      .forEach((button) => button.classList.remove("active"));
    this.closeAllSections();

    if (open) {
      document.getElementById(buttonId).classList.add("active");
      const sectionName = this.getSectionName(buttonId);
      this.sections[sectionName].style.display = "block";
      this.currentOpenSection = sectionName;
      this.displaySectionContent(sectionName);
    } else {
      this.currentOpenSection = null;
    }
  }

  getSectionName(buttonId) {
    switch (buttonId) {
      case "btnInventory":
        return "inventory";
      case "btnStats":
        return "stats";
      case "btnQuest":
        return "quest";
      case "btnMap":
        return "map";
      case "btnSettings":
        return "settings";
      default:
        return null;
    }
  }

  closeAllSections() {
    Object.values(this.sections).forEach(
      (section) => (section.style.display = "none")
    );
  }

  displaySectionContent(sectionName) {
    const displayMethods = {
      inventory: this.displayInventory.bind(this),
      stats: this.displayStats.bind(this),
      quest: this.displayQuest.bind(this),
      map: () => (this.sections.map.style.display = "block"),
      settings: () => (this.sections.settings.style.display = "block"),
    };
    displayMethods[sectionName]?.();
  }

  displayInventory() {
    this.inventoryList.innerHTML = "";

    for (const [i, value] of Array(36).entries()) {
      const listItem = document.createElement("div");
      listItem.className = "inventory-item";
      if (typeof this.player.inventory[i] !== "undefined") {
        const item = this.player.inventory[i];
        const image = document.createElement("img");
        image.src = `./img/icons/${item.img_key}`;
        listItem.appendChild(image);
        this.createItemInfo(item, listItem);
      }
      this.inventoryList.appendChild(listItem);
    }
  }

  // Отображение информации о предмете
  createItemInfo(item, listItem) {
    const contextMenu = document.createElement("div");
    contextMenu.className = "context-menu";
    contextMenu.textContent = item.name;

    if (item.slot !== -1) {
      const equipButton = this.createEquipButton(item);
      contextMenu.appendChild(equipButton);
    }
    listItem.appendChild(contextMenu);
  }

  createEquipButton(item) {
    const equipButton = document.createElement("div");
    equipButton.className = "active-button";

    const bodySlot =
      document.getElementsByClassName("item-body-slot")[item.slot];
    const isEquipped = this.player.equippedItems[item.slot] === item.id;

    equipButton.textContent = isEquipped ? "Снять" : "Экипировать";
    if (isEquipped) this.updateBodySlot(bodySlot, item.img_key);

    equipButton.addEventListener("click", () => {
      this.player.equipItem(item);
      const equipped = this.player.equippedItems[item.slot];
      equipButton.textContent = equipped ? "Снять" : "Экипировать";
      this.updateBodySlot(bodySlot, equipped ? item.img_key : null);
    });

    return equipButton;
  }

  updateBodySlot(slotElement, imgKey) {
    slotElement.innerHTML = "";
    if (imgKey) {
      const image = document.createElement("img");
      image.src = `./img/icons/${imgKey}`;
      slotElement.appendChild(image);
    }
  }

  displayStats() {
    this.statsList.innerHTML = "";
    Object.entries(this.player.stats).forEach(([stat, value]) => {
      if (this.labels[stat]) {
        const listItem = document.createElement("li");
        listItem.textContent = `${this.labels[stat]}: ${value}`;
        this.statsList.appendChild(listItem);
      }
    });
  }

  handleQuestClick(event) {
    const questItem = event.target.closest(".quest-item");
    if (questItem) {
      this.toggleQuestDescription(questItem.dataset.questId);
    }
  }

  toggleQuestDescription(questId) {
    const questItem = this.questsList.querySelector(
      `[data-quest-id="${questId}"]`
    );
    const questDescription = questItem.querySelector(".quest-description");

    if (this.expandedQuest === questId) {
      questItem.classList.remove("expanded");
      questDescription.style.display = "none";
      this.expandedQuest = null;
    } else {
      if (this.expandedQuest !== null) {
        this.closeQuestDescription();
      }
      questItem.classList.add("expanded");
      questDescription.style.display = "block";
      this.expandedQuest = questId;
    }
  }

  closeQuestDescription() {
    const previousQuest = this.questsList.querySelector(
      `[data-quest-id="${this.expandedQuest}"]`
    );
    const previousQuestDescription =
      previousQuest.querySelector(".quest-description");
    previousQuest.classList.remove("expanded");
    previousQuestDescription.style.display = "none";
  }

  displayQuest() {
    this.questsList.innerHTML = "";
    this.player.quests.forEach((quest) => {
      const listQuestItem = document.createElement("div");
      listQuestItem.className = "quest-item";
      listQuestItem.dataset.questId = quest.id;

      const questTitle = document.createElement("div");
      questTitle.className = "quest-title";
      questTitle.textContent = quest.name;
      listQuestItem.appendChild(questTitle);

      const questDescription = document.createElement("div");
      questDescription.className = "quest-description";
      questDescription.innerHTML = quest.description;
      listQuestItem.appendChild(questDescription);

      quest.subQuest?.forEach((subquestElem) => {
        const subQuest = document.createElement("div");
        subQuest.className = "quest-subquest";
        subQuest.innerHTML = `<span>□ ${subquestElem.name}</span><hr><p>${subquestElem.description}</p>`;
        questDescription.appendChild(subQuest);
      });

      this.questsList.appendChild(listQuestItem);
    });
  }
}
