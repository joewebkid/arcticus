export class Dice {
  constructor(difficult_level, diceRequirements, player, executeOptionFunc) {
    this.buttonDiceOk = document.getElementById("buttonDiceOk")
    this.buttonDiceOk.style.display = "none"
    document.getElementById("difficult_level").classList.remove("success")
    document.getElementById("anim-container").classList.remove("success")

    const containerId = "dice";
    const textId = "dice-text";
    this.container = document.getElementById(containerId);
    this.text = document.getElementById(textId);
    this.sides = this.container.querySelectorAll(".side");
    this.width = 40;
    this.height = this.width * 1.732;
    this.radius = this.width * 2 * 0.756 - 5;
    this.transformList = this.generateTransformList();
    this.setStyles();
    this.bindEvents();
    this.applyTransforms();

    this.diceValue = 0;
    this.currentRoll = 0;
    this.maxRoll = 1
    this.player = player;
    this.diceRequirements = diceRequirements;
    this.difficult_level = difficult_level;
    this.executeOptionFunc = executeOptionFunc
  }

  getDiceRoll() {
    let total = 0;

    // this.player.stats
    this.diceRequirements.forEach((req) => {
      total += this.player.stats[req];
    });

    const roll = Math.floor(Math.random() * 6) + 1;
    this.diceValue = total + roll

    return total + roll;
  }

  rollDiceColor() {
    setTimeout(() => {
      this.buttonDiceOk.style.display = "flex"      
      
      if( this.diceValue >= this.difficult_level) {
        document.getElementById("difficult_level").classList.add("success")
        document.getElementById("anim-container").classList.add("success")
        this.executeOptionFunc(true)
      }else{
        document.getElementById("difficult_level").classList.add("danger")
        document.getElementById("anim-container").classList.add("danger")
        this.executeOptionFunc(false)
      }
    }, 2000);
  }

  showPanel () {
    document.getElementById("difficult_level").textContent = this.difficult_level
    document.getElementById("dice-panel").style.display = "flex"
  }

  hidePanel () {
    document.getElementById("dice-panel").style.display = "none"
    this.unroll()
  }  
  
  calculateRadius() {
    const width = this.container.offsetWidth;
    const height = width * 1.732;
    return width * 2 * 0.756 - 5;
  }

  generateTransformList() {
    return [
      "rotateY(  36deg ) rotateX( 53deg ) rotateZ(   0deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 108deg ) rotateX( 53deg ) rotateZ( 240deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 180deg ) rotateX( 53deg ) rotateZ( 240deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 253deg ) rotateX( 53deg ) rotateZ( 120deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 324deg ) rotateX( 53deg ) rotateZ(   0deg ) translateZ(  " + this.radius + "px )",
      "rotateY(   0deg ) rotateX( -53deg ) rotateZ(  60deg ) translateZ(  " + this.radius + "px )",
      "rotateY(  72deg ) rotateX( -53deg ) rotateZ(  60deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 144deg ) rotateX( -53deg ) rotateZ( 180deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 216deg ) rotateX( -53deg ) rotateZ( 180deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 288deg ) rotateX( -53deg ) rotateZ(  60deg ) translateZ(  " + this.radius + "px )",
      "rotateY(  36deg ) rotateX( 11deg ) rotateZ( 180deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 108deg ) rotateX( 11deg ) rotateZ( 180deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 180deg ) rotateX( 11deg ) rotateZ( 300deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 253deg ) rotateX( 11deg ) rotateZ( 300deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 324deg ) rotateX( 11deg ) rotateZ( 180deg ) translateZ(  " + this.radius + "px )",
      "rotateY(   0deg ) rotateX( -11deg ) rotateZ( 120deg ) translateZ(  " + this.radius + "px )",
      "rotateY(  72deg ) rotateX( -11deg ) rotateZ(   0deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 144deg ) rotateX( -11deg ) rotateZ(   0deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 216deg ) rotateX( -11deg ) rotateZ(   0deg ) translateZ(  " + this.radius + "px )",
      "rotateY( 288deg ) rotateX( -11deg ) rotateZ( 120deg ) translateZ(  " + this.radius + "px )",
    ];
  }

  // generateTransformList() {
  //   // Generate an array of rotation and translation values for each side
  //   const list = [];
  //   for (let angle = 0; angle < 360; angle += 36) {
  //     for (const x of [-11, 11]) {
  //       for (const z of [60, 180, 300]) {
  //         list.push(`rotateY(${angle}deg) rotateX(${x}deg) rotateZ(${z}deg) translateZ(${this.radius}px)`);
  //       }
  //     }
  //   }
  //   return list;
  // }

  setStyles() {
    const width = 40;
    const height = width * 1.732;

    this.container.style.width = width * 3 + "px";
    this.container.style.height = width * 3 + "px";
    this.container.style.paddingBottom = width / 2 + "px";

    this.text.style.marginTop = width * 1.1 + "px";
    this.text.style.fontSize = height / 3 + "px";
    this.text.style.width = width / 3 * 2 + "px";
    this.text.style.height = height + "px";
    this.text.style.transform = "translateZ(" + (this.radius + 6) + "px)";

    for (const side of this.sides) {
      side.style.width = width * 2 + "px";
      side.style.height = height + "px";
    }
  }

  applyTransforms() {
    for (let i = 0; i < this.transformList.length; i++) {
      this.sides[i].style.transform = this.transformList[i];
    }
  }

  bindEvents() {
    this.container.addEventListener("click", this.roll.bind(this));
    this.buttonDiceOk.addEventListener("click", this.hidePanel.bind(this));
  }

  roll() {
    if(this.maxRoll<=this.currentRoll) return
    const randY = Math.floor(Math.random() * 2) + 1;
    const randZ = Math.floor(Math.random() * 2) + 1;
    // const randNum = Math.floor(Math.random() * 20) + 1;

    this.container.style.transform = `rotateY(${randY * 360}deg) rotateZ(${randZ * 360}deg)`;
    this.text.style.transition = "opacity 0.5s linear 2s";
    this.text.style.opacity = "100%";
    this.text.textContent = this.getDiceRoll();
    this.rollDiceColor();
    this.currentRoll++;
  }

  unroll = () => {
    this.container.style.transform = "none"
    this.text.innerHTML = "";
    this.text.style.opacity = "0";
  }
}
  
// Usage example
//   const dice = new Dice("anim-container", "text");