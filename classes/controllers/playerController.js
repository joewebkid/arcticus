import { Player } from "../player.js";
// playerController.js

export class PlayerController {

    constructor(playerData) {
      this.player = new Player(playerData);
    }
  
    getPlayer() {
      return this.player;
    }
  
    loadPlayer() {
      // Загрузить данные игрока из хранилища
      let savedPlayerData = localStorage.getItem("playerData");
      if (savedPlayerData) {
        const playerData = JSON.parse(savedPlayerData);
        this.player = new Player(playerData);
      }
    }
  
    savePlayer() {
      // Сохранить данные игрока в хранилище      
      localStorage.setItem("playerData", JSON.stringify(this.player));
    }
  
    increaseStat(stat) {
      // Увеличить стату игрока  
      this.player.increaseStat(stat);
    }
  
    addItemToInventory(item) {
      // Добавить предмет в инвентарь      
      this.player.inventory.push(item);
    }
  
    setQuestStatus(quest, status) {
      // Установить статус прохождения квеста
    }
  
    updateLastLocation(location) {
      // Обновить последнюю локацию посещения
    }
  
    getVisitedLocations() {
      // Получить список посещенных локаций
    }
  
  }
  
  // Использование
  
  const playerController = new PlayerController();
  
  // Получение данных игрока
  const player = playerController.getPlayer();
  
  // Добавление предмета  
  playerController.addItemToInventory(sword);
  
  // Сохранение
  playerController.savePlayer();