var sides = document.getElementsByClassName("side");
console.log(sides);

var width = 50;
var height = width * 1.732;
var radius = width * 2 * 0.756 - 5;
for (side of sides) {
  side.style.width = width * 2;
  side.style.height = height;
}

var dice = document.getElementById("dice");
dice.style.width = width * 3;
dice.style.height = width * 3;
dice.style.paddingBottom = width / 2;

var text = document.getElementById("text");
text.style.marginTop = width * 1.2;
text.style.fontSize = height / 3;
text.style.width = (width / 3) * 2 + "px";
text.style.height = height + "px";
text.style.transform = "translateZ(" + (radius + 6) + "px)";
var transformList = [
  "rotateY(  36deg ) rotateX( 53deg ) rotateZ(   0deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY( 108deg ) rotateX( 53deg ) rotateZ( 240deg ) translateZ(  " +
    radius +
    "px )",
  "   rotateY( 180deg ) rotateX( 53deg ) rotateZ( 240deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY( 253deg ) rotateX( 53deg ) rotateZ( 120deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY( 324deg ) rotateX( 53deg ) rotateZ(   0deg ) translateZ(  " +
    radius +
    "px )",

  "  rotateY(   0deg ) rotateX( -53deg ) rotateZ(  60deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY(  72deg ) rotateX( -53deg ) rotateZ(  60deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY( 144deg ) rotateX( -53deg ) rotateZ( 180deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY( 216deg ) rotateX( -53deg ) rotateZ( 180deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY( 288deg ) rotateX( -53deg ) rotateZ(  60deg ) translateZ(  " +
    radius +
    "px )",

  "  rotateY(  36deg ) rotateX( 11deg ) rotateZ( 180deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY( 108deg ) rotateX( 11deg ) rotateZ( 180deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY( 180deg ) rotateX( 11deg ) rotateZ( 300deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY( 253deg ) rotateX( 11deg ) rotateZ( 300deg ) translateZ(  " +
    radius +
    "px )",
  "  rotateY( 324deg ) rotateX( 11deg ) rotateZ( 180deg ) translateZ(  " +
    radius +
    "px )",

  "rotateY(   0deg ) rotateX( -11deg ) rotateZ( 120deg ) translateZ(  " +
    radius +
    "px )",
  "rotateY(  72deg ) rotateX( -11deg ) rotateZ(   0deg ) translateZ(  " +
    radius +
    "px )",
  "rotateY( 144deg ) rotateX( -11deg ) rotateZ(   0deg ) translateZ(  " +
    radius +
    "px )",
  "rotateY( 216deg ) rotateX( -11deg ) rotateZ(   0deg ) translateZ(  " +
    radius +
    "px )",
  "rotateY( 288deg ) rotateX( -11deg ) rotateZ( 120deg ) translateZ(  " +
    radius +
    "px )",
];
let i = 0;
for (i = 0; i < transformList.length; i++) {
  sides[i].style.transform = transformList[i];
}
const roll = () => {
  randY = Math.floor(Math.random() * 2) + 1;
  randZ = Math.floor(Math.random() * 2) + 1;
  randNum = Math.floor(Math.random() * 20) + 1;
  dice.style.transform =
    "rotateY(" + randY * 360 + "deg) rotateZ(" + randZ * 360 + "deg)";
  text.style.transform = "opacity 0.5s linear 2s";
  text.style.opacity = "100%";
  text.innerHTML = randNum;
  document.getElementById("slide").style.maxWidth = "800px";
  setTimeout(unroll, 5000);
};

const unroll = () => {
  dice.style.transform = "none";
  text.innerHTML = "";
  text.style.opacity = "0";
  document.getElementById("slide").style.maxWidth = "0px";
  setTimeout(roll, 4000);
};

window.onload = roll;
