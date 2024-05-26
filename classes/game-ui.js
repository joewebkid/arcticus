export class GameUI {
    constructor(player) {
      this.player = player;
  
      this.menuButtons = document.querySelectorAll('.medieval-button');
      this.sections = {
        inventory: document.getElementById('inventory'),
        stats: document.getElementById('playerStats'),
        map: document.getElementById('map'),
        settings: document.getElementById('settings')
      };
  
      this.inventoryList = document.getElementById('inventoryList');
      this.statsList = document.getElementById('statsList');
  
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
  
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      this.menuButtons.forEach(button => {
        button.addEventListener('click', (event) => this.handleMenuClick(event));
      });
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
  }