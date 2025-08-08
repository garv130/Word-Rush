let score = 0;
//background
let background;
let backgroundWidth = 640;
let backgroundHeight = 640;
let context;

//character
let charWidth = 150;
let charHeight = 80;
let charX = backgroundWidth/11;
let charY = backgroundHeight/1.20;

let character = {
    x : charX,
    y : charY,
    width: charWidth,
    height: charHeight,
}

let words = [];
let currentInput = "";
let wordSpeed = 1.5;

//words
class Word{
    constructor(text, x, y, speed){
        this.text = text;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = context.measureText(text).width;
    }


    draw(){
        context.font = "24px Courier New";
        context.fillStyle = "white";
        context.fillText(this.text, this.x, this.y);
    }

    update(){
        this.x -= this.speed;
        this.draw();
    }

}
function getRandomWord(maxLength = 6){
    return fetch("https://random-word-api.herokuapp.com/word")
        .then(response => response.json())
        .then(data => {
        let word = data[0];
            
            if (word.length > maxLength) {
                return getRandomWord(maxLength); 
            }
            return word;
        })
        
}

let backgroundSound = new Audio("./music.mp3")
backgroundSound.volume = 0.4;


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

    setInterval(() => {
        const last = words[words.length - 1];
        if (last && last.x > backgroundWidth - 200) return
        getRandomWord().then(wordText => {
            const x = backgroundWidth;
            const y = character.y + character.height / 2;
            words.push(new Word(wordText, x, y, wordSpeed));
        });
    }, 3000);

    requestAnimationFrame(update);
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0,0,background.width,background.height)


    context.drawImage(charImg, character.x, character.y, character.width, character.height);

}