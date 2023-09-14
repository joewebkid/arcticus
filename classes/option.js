/**
 * Класс опций
 */
export class Option {
  /**
   * Создает экземпляр класса Option.
   * @param {number} id - Идентификатор опции.
   * @param {string} text - Текст опции.
   * @param {string} img_key - Ключ изображения опции.
   * @param {number} nextStep - Идентификатор следующего шага.
   * @param {Object} result - Результат выбора опции.
   * @param {Object} once - Показывать один раз.
   * @param {Object} characters - встреченные персонажи.
   * @param {Object} item - Предмет, связанный с опцией.
   * @param {Object} requirements - Требования для отображения опции.
   * @param {Object} hideIfStep - Требования для отображения опции.
   * @param {Object} diceRequirements - Требования для прохождения броска.
   * @param {Object} showIfStep - Требования для отображения опции.
   */
  constructor(optionData) {
    const defaultValues = {
      id: null,
      text: "",
      img_key: "",
      nextStep: null,
      result: null,
      once: null,
      item: null,
      requirements: null,
      hideIfStep: null,
      showIfStep: null,
      diceRequirements: null,
      dice: null,
    };

    Object.entries(defaultValues).forEach(([key, defaultValue]) => {
      this[key] = optionData?.[key] ?? defaultValue;
    });
  }

  getDiceRoll(player) {
    let total = 0;

    this.diceRequirements.forEach((req) => {
      total += player[req.name] * req.multiplier;
    });

    const roll = Math.floor(Math.random() * 6) + 1;

    return total + roll;
  }

  rollDice() {
    return this.getDiceRoll() >= this.dice;
  }

  /**
   * Создает элемент опции.
   * @returns {HTMLElement} - Элемент опции.
   */
  createOptionElement() {
    const optionElement = document.createElement("li");
    let optionText = this.text;
    if (this.img_key) {
      optionText = `<i class='ra ${this.img_key}'></i> ${optionText}`;
    }
    optionElement.innerHTML = optionText;
    return optionElement;
  }
}
