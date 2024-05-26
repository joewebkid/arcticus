export class Map {
    constructor(image, points = []) {
      this.image = image;
      this.points = points; // Массив объектов {x: координата, y: координата, name: наименование локации}
    }
  
    addPoint(x, y, name) {
      this.points.push({ x, y, name });
    }
  
    updatePoint(name, newX, newY) {
      const point = this.points.find(point => point.name === name);
      if (point) {
        point.x = newX;
        point.y = newY;
      }
    }
  
    removePoint(name) {
      this.points = this.points.filter(point => point.name !== name);
    }
  
    updateImage(newImage) {
      this.image = newImage;
    }
  }
  