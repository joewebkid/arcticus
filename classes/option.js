/**
 * Класс опций
 */
export class Option {
  /**
   * Создает экземпляр класса Option.
   * @param {number} id - Идентификатор опции.
   * @param {string} text - Текст опции.
   * @param {string} img_key - Ключ изображения опции.
   * @param {string} img_key - Путь к изображению опции.
   * @param {number} nextStep - Идентификатор следующего шага.
   * @param {Object} result - Результат выбора опции.
   * @param {Object} failure - Отрицательный результат выбора опции.
   * @param {Object} once - Показывать один раз.
   * @param {Object} characters - встреченные персонажи.
   * @param {Object} hideIfItem - Предмет, связанный с опцией.
   * @param {Object} showIfItem - Предмет, связанный с опцией.
   * @param {Object} showIfQuest - Квест.
   * @param {Object} hideIfQuest - Квест.
   * @param {Object} showIfStatus - Квест.
   * @param {Object} hideIfStatus - Квест.
   * @param {Object} requirements - Требования для отображения опции.
   * @param {Object} hideIfStep - Требования для отображения опции.
   * @param {Object} diceRequirements - Требования для прохождения броска.
   * @param {Object} showIfStep - Требования для отображения опции.
   */
  constructor(optionData) {
    const defaultValues = {
      id: null,
      text: "",
      img_key: false,
      img: false,
      nextStep: null,
      result: null,
      failure: null,
      once: null,
      hideIfItem: null,
      showIfItem: null,
      hideIfQuest: null,
      showIfQuest: null,
      hideIfStatus: null,
      showIfStatus: null,
      requirements: null,
      hideIfStep: null,
      showIfStep: null,
      diceRequirements: null,
      diceReqLabels: null,
      diceDifficult: null,
    };

    Object.entries(defaultValues).forEach(([key, defaultValue]) => {
      this[key] = optionData?.[key] ?? defaultValue;
    });
  }

  /**
   * Создает элемент опции.
   * @returns {HTMLElement} - Элемент опции.
   */
  createOptionElement() {
    const optionElement = document.createElement("li");
    let optionText = this.text;
    if (this.diceDifficult && this.diceRequirements)
      this.diceRequirements.forEach((reqLabel) => {
        optionText += `[${reqLabel}]`;
      });
    if (this.img_key) {
      optionText = `<i class='ra ${this.img_key}'></i> ${optionText}`;
    }
    if (this.img) {
      optionText = `<img src='${this.img}'></i> ${optionText}`;
    }
    optionElement.innerHTML = optionText;
    return optionElement;
  }
}
