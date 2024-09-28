// game-map.js

export class GameMap {
    constructor(mapContainerId, mapImageId, currentStep) {
      this.mapContainer = document.getElementById(mapContainerId);
      this.mapImage = document.getElementById(mapImageId);
      this.currentStep = currentStep;
    }
  
    /**
     * Загружает и отображает карту текущей локации.
     * @param {Object} mapData - Данные карты из JSON.
     */
    loadMap(mapData) {
      this.mapImage.src = mapData.image;
  
      // Очищаем предыдущие точки
      this.mapContainer.innerHTML = '';
  
      // Отображаем точки на карте
      mapData.points.forEach(point => {
        this.createMapPoint(point);
      });
  
      // Обновляем текущее местоположение
      this.updateMap();
    }
  
    /**
     * Создает и добавляет точку на карте.
     * @param {Object} point - Точка на карте.
     */
    createMapPoint(point) {
      const pointElement = document.createElement('div');
      pointElement.className = 'map-point';
      pointElement.style.left = `${point.x}px`;
      pointElement.style.top = `${point.y}px`;
  
      // Присваиваем идентификатор точки для дальнейшего обновления
      pointElement.dataset.id = point.id;
  
      // Если текущий шаг совпадает с точкой, выделяем её
      if (point.id === this.currentStep) {
        pointElement.classList.add('current-location');
      }
  
      // Добавляем название точки (опционально)
      const pointLabel = document.createElement('span');
      pointLabel.className = 'map-label';
      pointLabel.innerText = point.name;
      pointElement.appendChild(pointLabel);
  
      // Обрабатываем переход по карте при клике на точку
      pointElement.addEventListener('click', () => {
        if (this.canMoveToPoint(point)) {
          this.moveToPoint(point);
        }
      });
  
      this.mapContainer.appendChild(pointElement);
    }
  
    /**
     * Проверяет, может ли игрок переместиться к выбранной точке.
     * @param {Object} point - Точка на карте.
     */
    canMoveToPoint(point) {
      return point.parents.includes(this.currentStep);
    }
  
    /**
     * Перемещает игрока на новую точку.
     * @param {Object} point - Точка на карте.
     */
    moveToPoint(point) {
      const step = { id: point.id };
      this.updateCurrentStep(step);
    }
  
    /**
     * Обновляет текущее местоположение игрока.
     * @param {Object} step - Текущий шаг.
     */
    updateCurrentStep(step) {
      this.currentStep = step.id;
      this.updateMap();
    }
  
    /**
     * Обновляет отображение карты, выделяя текущее местоположение игрока.
     */
    updateMap() {
      const mapPoints = this.mapContainer.querySelectorAll('.map-point');
      mapPoints.forEach(point => {
        point.classList.remove('current-location');
        const pointId = parseInt(point.dataset.id, 10);
        if (pointId === this.currentStep) {
          point.classList.add('current-location');
        }
      });
    }
  }
  