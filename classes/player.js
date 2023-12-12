export class Player {
  constructor(playerData) {
    const defaultValues = {
      name: "Герой",
      stats: new PlayerStats(),
      skills: {},
      inventory: [],
      currentStep: 0,
      visitedSteps: [],
      encounteredCharacters: [],
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