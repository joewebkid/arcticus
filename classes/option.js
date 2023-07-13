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
   * @param {Object} item - Предмет, связанный с опцией.
   * @param {Object} requirements - Требования для отображения опции.
   */
  constructor(id, text, img_key, nextStep, result, item, requirements) {
    this.id = id;
    this.text = text;
    this.img_key = img_key;
    this.nextStep = nextStep;
    this.result = result;
    this.item = item;
    this.requirements = requirements;
  }
}
