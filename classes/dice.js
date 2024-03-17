class Dice {
    constructor(containerId, textId) {
      this.container = document.getElementById(containerId);
      this.text = document.getElementById(textId);
      this.sides = this.container.querySelectorAll(".side");
      this.radius = this.calculateRadius();
      this.transformList = this.generateTransformList();
      this.setStyles();
      this.bindEvents();
    }
  
    calculateRadius() {
      const width = this.container.offsetWidth;
      const height = width * 1.732;
      return width * 2 * 0.756 - 5;
    }
  
    generateTransformList() {
      // Generate an array of rotation and translation values for each side
      const list = [];
      for (let angle = 0; angle < 360; angle += 36) {
        for (const x of [-11, 11]) {
          for (const z of [60, 180, 300]) {
            list.push(`rotateY(${angle}deg) rotateX(${x}deg) rotateZ(${z}deg) translateZ(${this.radius}px)`);
          }
        }
      }
      return list;
    }
  
    setStyles() {
      const width = this.container.offsetWidth;
      const height = width * 1.732;
  
      this.container.style.width = width * 3 + "px";
      this.container.style.height = width * 3 + "px";
      this.container.style.paddingBottom = width / 2 + "px";
  
      this.text.style.marginTop = width * 1.2 + "px";
      this.text.style.fontSize = height / 3 + "px";
      this.text.style.width = width / 3 * 2 + "px";
      this.text.style.height = height + "px";
      this.text.style.transform = "translateZ(" + (this.radius + 6) + "px)";
  
      for (const side of this.sides) {
        side.style.width = width * 2 + "px";
        side.style.height = height + "px";
      }
    }
  
    bindEvents() {
      this.container.addEventListener("click", this.roll.bind(this));
    }
  
    roll() {
      const randY = Math.floor(Math.random() * 2) + 1;
      const randZ = Math.floor(Math.random() * 2) + 1;
      const randNum = Math.floor(Math.random() * 20) + 1;
  
      this.container.style.transform = `rotateY(${randY * 360}deg) rotateZ(${randZ * 360}deg)`;
      this.text.style.transition = "opacity 0.5s linear 2s";
      this.text.style.opacity = "100%";
      this.text.textContent = randNum;
    }
  }
  
// Usage example
//   const dice = new Dice("anim-container", "text");