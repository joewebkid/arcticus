/**
 * Класс сообщения
 */
export class Message {
  /**
   * Создает экземпляр класса Message.
   * @param {string} author - Автор сообщения.
   * @param {string} content - Содержимое сообщения.
   * @param {string|boolean} [avatar=false] - Путь к изображению аватара или false, если аватар не нужен.
   */
  constructor(author, content, avatar = false) {
    this.author = author;
    this.content = content;
    this.avatar = avatar;
  }

  /**
   * Отображает сообщение в окне чата.
   */
  show() {
    const chatContainer = document.getElementById("chatContainer");
    const messageContainer = document.createElement("div");
    messageContainer.className = "message";

    const authorElement = document.createElement("div");
    authorElement.className = "author";
    authorElement.innerText = this.author;

    const avatarElement = this.avatar
      ? document.createElement("img")
      : document.createElement("div");
    avatarElement.classList.add("avatar");
    messageContainer.classList.add("left");
    if (this.avatar) {
      avatarElement.src = `${location.pathname}img/persons/${this.avatar}`;
    } else {
      avatarElement.innerText = this.author[0];
    }

    const contentElement = document.createElement("div");
    contentElement.className = "content";
    contentElement.innerText = this.content;

    const authorClasses = {
      "Неизвестный голос": "right",
      "Системное сообщение": "system",
    };

    if (authorClasses.hasOwnProperty(this.author)) {
      messageContainer.classList.add(authorClasses[this.author]);
    }

    messageContainer.append(avatarElement, contentElement);
    contentElement.appendChild(authorElement);
    chatContainer.appendChild(messageContainer);
  }
}
