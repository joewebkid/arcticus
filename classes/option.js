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
  constructor(optionData) {
    const defaultValues = {
      id: null,
      text: "",
      img_key: "",
      nextStep: null,
      result: null,
      item: null,
      requirements: null,
    };
  
    Object.entries(defaultValues).forEach(([key, defaultValue]) => {
      this[key] = optionData?.[key] ?? defaultValue;
    });
  }  
}
