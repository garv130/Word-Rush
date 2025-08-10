let score = 0;
let isSpawning = false;
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
let wordSpeed = 2;

//words
class Word{
    constructor(text, x, y, speed){
        this.text = text;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = context.measureText(text).width;
    }


    draw(isActive){
        context.font = "bold 28px Courier New";

        if (isActive) {

        let matchCount = 0;
        for (let i = 0; i < currentInput.length; i++) {
            if (this.text[i] === currentInput[i]) {
                matchCount++;
            } else {
                break; 
            }
        }
        
        const correctPart = this.text.substring(0, matchCount);
        const restPart = this.text.substring(matchCount);

        
        context.fillStyle = "lime";
        context.fillText(correctPart, this.x, this.y);

        
        const correctWidth = context.measureText(correctPart).width;
        context.fillStyle = "white";
        context.fillText(restPart, this.x + correctWidth, this.y);
    } 
        else {
        
        context.fillStyle = "white";
        context.fillText(this.text, this.x, this.y);
    }
        
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
        if (isSpawning) return;
        if (words.length > 0) return;

        isSpawning = true;
        getRandomWord().then(wordText => {
            const x = backgroundWidth;
            const y = character.y + character.height / 2;
            words.push(new Word(wordText, x, y, wordSpeed));
        }).finally(() => {
            isSpawning = false;
        });
    }, 2000);

    requestAnimationFrame(update);
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0,0,background.width,background.height)
    context.save();
    context.font = "bold 24px Courier New";
    context.fillStyle = "black";
    context.textAlign = "right";
    context.fillText("Score: " + score, backgroundWidth - 10, 30);
    context.restore();
    backgroundSound.play()

      for (let i = 0; i < words.length; i++) {
        words[i].x -= words[i].speed;
        words[i].draw(i === 0);

        
        if (
            words[i].x <= character.x + character.width &&
            words[i].x + words[i].width >= character.x
        ) {
            gameOver()
        }
    }


    context.drawImage(charImg, character.x, character.y, character.width, character.height);

    context.font = "bold 24px Courier New";
    context.fillStyle = "red";
    context.textAlign = "left";
    context.fillText("Typed: " + currentInput, 10, 30);

}

function gameOver(){
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOverScreen").style.display = "block";
    backgroundSound.muted = true;
}

function restartGame(){

    words = [];
    currentInput = "";
    wordSpeed = 2;
    score = 0;
    backgroundSound.muted = false;
    backgroundSound.currentTime = 0; 

    document.getElementById("gameOverScreen").style.display = "none";

}

document.addEventListener("keydown", (event) => {
    if (event.key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
    } else if (event.key.length === 1) {
        currentInput += event.key.toLowerCase();
        for (let i = 0; i < words.length; i++) {
  if (currentInput === words[i].text) {
    words.splice(i, 1); 
    currentInput = "";
    score += 1;                       
    wordSpeed = Math.min(wordSpeed + 0.2, 6);
    break;
  }
}
    }
});