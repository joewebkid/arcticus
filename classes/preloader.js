// resource-loader.js
export class ResourceLoader {
    constructor(resources) {
      this.resources = resources;
      this.totalResources = this.countTotalResources();
      this.loadedResources = 0;
    }
  
    /**
     * Подсчет общего количества ресурсов для предзагрузки.
     */
    countTotalResources() {
      return (
        this.resources.images.length +
        this.resources.fonts.length +
        this.resources.css.length
      );
    }
  
    /**
     * Обновление прогресс-бара.
     * @param {number} progress - Текущий прогресс (от 0 до 100).
     */
    updateProgressBar() {
      const progress = (this.loadedResources / this.totalResources) * 100;
      const progressBar = document.getElementById('progress-bar');
      progressBar.style.width = `${progress}%`;
      progressBar.innerText = `${Math.floor(progress)}%`;
    }
  
    /**
     * Отображает прелоадер с прогресс-баром.
     */
    showPreloader() {
      const preloader = document.getElementById('preloader');
      preloader.style.display = 'block';
    }
  
    /**
     * Скрывает прелоадер.
     */
    hidePreloader() {
      const preloader = document.getElementById('preloader');
      preloader.style.display = 'none';
    }
  
    /**
     * Предзагрузка всех ресурсов: изображений, шрифтов и CSS.
     */
    preloadAllResources() {
      this.showPreloader();
      return Promise.all([
        this.preloadImages(),
        this.preloadFonts(),
        this.preloadCSS(),
      ]).then(() => {
        this.hidePreloader();
        console.log('Все ресурсы успешно загружены');
      }).catch((error) => {
        console.error('Ошибка при предзагрузке ресурсов:', error);
      });
    }
  
    /**
     * Предзагрузка изображений.
     */
    preloadImages() {
      return Promise.all(
        this.resources.images.map((url) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              this.loadedResources++;
              this.updateProgressBar();
              resolve(url);
            };
            img.onerror = () => reject(new Error(`Ошибка загрузки изображения: ${url}`));
          });
        })
      );
    }
  
    /**
     * Предзагрузка шрифтов.
     */
    preloadFonts() {
      return Promise.all(
        this.resources.fonts.map((font) => {
          const fontFace = new FontFace(font.name, `url(${font.url})`);
          return fontFace.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
            this.loadedResources++;
            this.updateProgressBar();
          });
        })
      );
    }
  
    /**
     * Предзагрузка CSS файлов.
     */
    preloadCSS() {
      return Promise.all(
        this.resources.css.map((url) => {
          return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            link.as = 'style';
            link.onload = () => {
              link.rel = 'stylesheet';
              this.loadedResources++;
              this.updateProgressBar();
              resolve(url);
            };
            document.head.appendChild(link);
          });
        })
      );
    }
  }
  

  /**  
@EXAMPLE
  // quest-game.js
import { ResourceLoader } from './resource-loader.js';
import { resources } from './resources.js';

export class QuestGame {
  initialize() {
    const resourceLoader = new ResourceLoader(resources);
    
    resourceLoader.preloadAllResources().then(() => {
      // Инициализируем игру после предзагрузки ресурсов
      this.loadPlayerData();
      this.bindEventListeners();
      this.showIntroSection();
    });
  }

  // Другие методы QuestGame как раньше...
}

*/
