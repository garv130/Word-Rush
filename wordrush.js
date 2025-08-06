//background
let background;
let backgroundWidth = 640;
let backgoundHeight = 640;
let context;

//character
let charWidth = 30;
let charHeight = 50;
let charX = backgroundWidth/4;
let charY = backgroundHeight/2;

let character = {
    x : charX,
    y : charY,
    width: charWidth,
    height: charHeight,
}

window.onload = function(){
    background = document.getElementById("background");
    background.height = backgroundHeight;
    background.width = backgroundWidth;
    context = background.getContext("2d") //This is for drawing on the background

    //context.fillStyle = "white";
    //context.fillRect(character.x, character.y, character.width, character.height);

    charImg = new Image();
    charImg.src = "./car.png";
    charImg.onload = function(){
    context.drawImage(charImg, character.x, character.y, character.width, character.height);
    }
}