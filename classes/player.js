import { Quest } from "./quest.js";
import { Map } from "./map.js";

export class Player {
  constructor(playerData) {
    const defaultValues = {
      name: "Герой",
      stats: new PlayerStats(),
      class: "",
      skills: {},
      inventory: [],
      equippedItems: {},
      currentStep: 0,
      visitedSteps: [],
      encounteredCharacters: [],
      quests: [],
      map: new Map("default_map_image.png"),
    };

    Object.entries(defaultValues).map(([key, defaultValue]) => {
      this[key] = playerData?.[key] ?? defaultValue;
    });
  }

  load() {
    // Загрузить данные игрока из хранилища
    let savedData = localStorage.getItem("playerData");
    if (savedData) {
      Object.assign(this, JSON.parse(savedData));
    }
  }

  save() {
    // Сохранить данные игрока в хранилище
    localStorage.setItem("playerData", JSON.stringify(this));
  }

  learnSkill(name, lvl_points) {
    this.skills[name] = this.skills[name] ?? 0 + lvl_points;
  }

  startQuest(id, name, description, type) {
    const quest = new Quest(id, name, description, type);
    this.quests.push(quest);
  }

  updateQuestStatus(id, newStatus) {
    const quest = this.quests.find((q) => q.id === id);
    if (quest) {
      quest.updateStatus(newStatus);
    }
  }

  getQuestStatus(id) {
    const quest = this.quests.find((q) => q.id === id);
    return quest ? quest.status : null;
  }

  equipItem(item) {
    // this.equippedItems = {};
    if (this.equippedItems[item.slot]) this.equippedItems[item.slot] = null;
    else this.equippedItems[item.slot] = item.id;
    this.save();
  }

  unequipItem(slot) {
    this.save();
  }
}

class PlayerStats {
  constructor(playerData) {
    const defaultValues = {
      health: 100,
      attributePoints: 15,
      strength: 5,
      agility: 5,
      intelligence: 5,
      charisma: 5,
    };

    Object.entries(defaultValues).map(([key, defaultValue]) => {
      this[key] = playerData?.[key] ?? defaultValue;
    });
  }
  // static get
  static get labels() {
    return {
      health: "Жизнь",
      attributePoints: "Очки атрибутов",
      strength: "Сила",
      agility: "Ловкость",
      intelligence: "Интелект",
      charisma: "Харизма",
      defense: "Защита",
      damage: "Урон",
    };
  }

  /**
   * Увеличивает значение атрибута героя.
   * @param {string} attribute - Название атрибута, который нужно увеличить.
   */
  increaseAttribute(attribute) {
    if (this.attributePoints > 0) {
      this.adjustAttribute(attribute, 1);
    }
  }

  /**
   * Уменьшает значение атрибута героя.
   * @param {string} attribute - Название атрибута, который нужно уменьшить.
   */
  decreaseAttribute(attribute) {
    if (this[attribute] > 1) {
      this.adjustAttribute(attribute, -1);
    }
  }

  /**
   * Изменяет значение атрибута героя на указанную величину.
   * @param {string} attribute - Название атрибута, который нужно изменить.
   * @param {number} amount - Величина, на которую нужно изменить атрибут.
   */
  adjustAttribute(attribute, amount) {
    this[attribute] += amount;
    this.attributePoints -= amount;
    document.getElementById("attributePointsValue").innerText =
      this.attributePoints;
    document.getElementById(`${attribute}Value`).innerText = this[attribute];
  }
}
/**
 * @param {масса}
 *
 * @param {доспехи}
 * @param {дисциплина}
 * @param {скорость}
 * @param {атака в бл. бою}
 * @param {защита в бл. бою}
 * @param {Сила оружия}
 * @param {Усиление натиска}
 */
