export class GameUI {
    constructor(player) {
      this.player = player;
  
      this.menuButtons = document.querySelectorAll('.medieval-button');
      this.sections = {
        inventory: document.getElementById('inventory'),
        stats: document.getElementById('playerStats'),
        quest: document.getElementById('quest'),
        map: document.getElementById('map'),
        settings: document.getElementById('settings')
      };
  
      this.inventoryList = document.getElementById('inventoryList');
      this.statsList = document.getElementById('statsList');
      this.questsList = document.getElementById('questsList');
  
      this.labels = {
        health: "Жизнь",
        attributePoints: "Очки атрибутов",
        strength: "Сила",
        agility: "Ловкость",
        intelligence: "Интелект",
        charisma: "Харизма",
        defense: "Защита",
        damage: "Урон",
      };
  
      this.expandedQuest = null;

      this.setupEventListeners();
    }
  
    setupEventListeners() {
      this.menuButtons.forEach(button => {
        button.addEventListener('click', (event) => this.handleMenuClick(event));
      });
      this.questsList.addEventListener('click', (event) => this.handleQuestClick(event));

      document.getElementById('resetQuestButton').addEventListener('click', () => {
        this.resetQuest();
      });
    }
    
    resetQuest() {
      if (confirm('Вы уверены, что хотите сбросить квест и начать заново?')) {
        // Удаляем данные игрока из localStorage
        localStorage.removeItem('playerData');
        // Перезагружаем страницу для начала игры заново
        window.location.reload();
      }
    }
  
    handleMenuClick(event) {
      const target = event.target.id ? event.target : event.target.parentNode
      const buttonId = target.id;
      const sectionName = this.getSectionName(buttonId);
  
      if (this.currentOpenSection === sectionName) {
        this.sections[sectionName].style.display = 'none';
        this.currentOpenSection = null;
      } else {
        this.closeAllSections();
        this.sections[sectionName].style.display = 'block';
        this.currentOpenSection = sectionName;
        this.displaySectionContent(sectionName);
      }
    }

    getSectionName(buttonId) {
      switch (buttonId) {
        case 'btnInventory':
          return 'inventory';
        case 'btnStats':
          return 'stats';
        case 'btnQuest':
          return 'quest';
        case 'btnMap':
          return 'map';
        case 'btnSettings':
          return 'settings';
        default:
          return null;
      }
    }

    closeAllSections() {
        Object.values(this.sections).forEach(section => section.style.display = 'none');
    }
      

    displaySectionContent(sectionName) {
        switch (sectionName) {
            case 'inventory':
              this.displayInventory();
              break;
            case 'stats':
              this.displayStats();
              break;
            case 'quest':
              this.displayQuest();
              // this.sections.quest.style.display = 'block';
              break;
            case 'map':
              this.sections.map.style.display = 'block';
              break;
            case 'settings':
              this.sections.settings.style.display = 'block';
              break;
            // Add more cases if additional sections need specific display logic
            default:
            break;
        }
    }
  
    displayInventory() {
      this.inventoryList.innerHTML = '';
      this.player.inventory.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'inventory-item';
        listItem.textContent = item.name; // Adjust as necessary for your inventory item structure
        this.inventoryList.appendChild(listItem);
      });
    }
  
    displayStats() {
      this.statsList.innerHTML = '';
      const stats = this.player.stats;
      Object.keys(stats).forEach(stat => {
        if (stat in this.labels) {
          const listItem = document.createElement('li');
          listItem.textContent = `${this.labels[stat]}: ${stats[stat]}`;
          this.statsList.appendChild(listItem);
        }
      });
    }
    handleQuestClick(event) {
      const questItem = event.target.closest('.quest-item');
      if (questItem) {
        this.toggleQuestDescription(questItem.dataset.questId);
      }
    }
  
    toggleQuestDescription(questId) {
      const questItem = this.questsList.querySelector(`[data-quest-id="${questId}"]`);
      const questDescription = questItem.querySelector('.quest-description');
  
      if (this.expandedQuest === questId) {
        questItem.classList.remove('expanded');
        questDescription.style.display = 'none';
        this.expandedQuest = null;
      } else {
        if (this.expandedQuest !== null) {
          this.closeQuestDescription();
        }
        questItem.classList.add('expanded');
        questDescription.style.display = 'block';
        this.expandedQuest = questId;
      }
    }
  
    closeQuestDescription() {
      const previousQuest = this.questsList.querySelector(`[data-quest-id="${this.expandedQuest}"]`);
      const previousQuestDescription = previousQuest.querySelector('.quest-description');
      previousQuest.classList.remove('expanded');
      previousQuestDescription.style.display = 'none';
    }
  

    displayQuest() {
      console.log(this.player.quests)
      this.questsList.innerHTML = '';
      this.player.quests.forEach(quest => {
        const listQuestItem = document.createElement('div');
        listQuestItem.className = 'quest-item';
        listQuestItem.dataset.questId = quest.id;
        listQuestItem.textContent = quest.name; // ---------
        
        const questDescription = document.createElement('div');
        questDescription.className = 'quest-description';
        questDescription.textContent = quest.description;
        listQuestItem.appendChild(questDescription);
        
        this.questsList.appendChild(listQuestItem);
      });
    }
  }