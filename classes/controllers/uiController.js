// uiController.js

export class UiController {
    constructor() {
      this.locationImageElement = document.getElementById("locationImage");
      this.chatContainerElement = document.getElementById("chatContainer");
      this.optionsListElement = document.getElementById("optionsList");
      this.inventoryElement = document.getElementById("inventory");
      this.playerStatsElement = document.getElementById("playerStats");
    }
  
    /**
     * Обновляет изображение локации.
     * @param {string} imageUrl - URL изображения локации.
     */
    updateLocationImage(image) {
      if (!image) {
        image = "black.png";
      }
      this.locationImageElement.classList.add("open-animation");
      this.locationImageElement.src = location.pathname + "img/locations/" + image;
      setTimeout(() => {
        this.locationImageElement.classList.remove("open-animation");
      }, 500);
    }
  
    showMessage(message) {
      const msg = new Message(message.author, message.content, message.avatar);
      msg.show();
    }  
    
    /**
     * Обновляет список опций.
     */
    updateOptions(options) {
      this.optionsListElement.innerHTML = "";
      options.forEach((option) => {
        const optionElement = this.createOptionElement(option);
        this.optionsListElement.appendChild(optionElement);
      });
    }
  
    updateInventory(inventory) {
      this.inventoryElement.innerHTML = "";
      inventory.forEach((item) => {
        const itemElement = this.createInventoryItemElement(item);
        this.inventoryElement.appendChild(itemElement);
      });
    }
  
    // updatePlayerStats(player) {
    //   this.playerStatsElement.innerHTML = `
    //     <div>Имя: ${player.name}</div>
    //     <div>Здоровье: ${player.health}</div>
    //     <div>Сила: ${player.strength}</div>
    //     <div>Ловкость: ${player.agility}</div>
    //     <div>Интеллект: ${player.intelligence}</div>
    //     <div>Харизма: ${player.charisma}</div>
    //     <div>Очки атрибутов: ${player.attributePoints}</div>
    //   `;
    // }
  
    showGameOver(outcome) {
      const gameOverElement = document.getElementById("gameOver");
      gameOverElement.style.display = "block";
      const outcomeElement = document.getElementById("outcome");
      outcomeElement.innerText = outcome;
    }
  
    /**
     * Прокручивает окно чата вниз.
     */
    scrollChatToBottom() {
        setTimeout(function () {
            this.chatContainerElement.scrollTop = this.chatContainerElement.scrollHeight;
        }, 100);
    }

    /**
    * Создает элемент опции.
    * @param {Option} option - Объект опции.
    * @returns {HTMLElement} - Элемент опции.
    */
    createOptionElement(option) {
      const optionElement = document.createElement("li");
      let optionText = option.text;
      if (option.img_key) {
        optionText = `<i class='ra ${option.img_key}'></i> ${optionText}`;
      }
      optionElement.innerHTML = optionText;
      optionElement.addEventListener("click", () => {
        this.selectOption(option);
      });
      return optionElement;
    }  
  
    createInventoryItemElement(item) {
      const itemElement = document.createElement("div");
      itemElement.className = "inventory-item";
      itemElement.innerText = item.name;
      return itemElement;
    }
  }