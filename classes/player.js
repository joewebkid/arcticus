export class Player {
  constructor(playerData) {
    const defaultValues = {
      name: "Герой",
      health: 100,
      attributePoints: 15,
      strength: 5,
      agility: 5,
      intelligence: 5,
      charisma: 5,
      inventory: [],
      currentStep: 0,
      visitedSteps: [],
      encounteredCharacters: [],
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
