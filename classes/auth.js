// auth.js
export class TelegramAuth {
  constructor() {
    this.user = null;
    this.init();
  }

  /**
   * Инициализирует авторизацию через Telegram.
   */
  init() {
    if (window.Telegram && window.Telegram.WebApp) {
      const telegram = window.Telegram.WebApp;
      this.user = telegram.initDataUnsafe?.user || null;

      if (this.user) {
        console.log("Пользователь авторизован: ", this.user);
        this.saveUserData(this.user);
      } else {
        console.error(
          "Не удалось получить данные пользователя через Telegram."
        );
      }
    } else {
      console.error("Telegram WebApp не доступен.");
    }
  }

  /**
   * Сохраняет данные пользователя.
   * @param {Object} user - Данные пользователя из Telegram.
   */
  saveUserData(user) {
    const userData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      auth_date: user.auth_date,
      photo_url: user.photo_url,
    };

    localStorage.setItem("telegramUser", JSON.stringify(userData));
  }

  /**
   * Получает данные пользователя из хранилища.
   * @returns {Object} Данные пользователя.
   */
  getUserData() {
    const userData = localStorage.getItem("telegramUser");
    return userData ? JSON.parse(userData) : null;
  }
}
