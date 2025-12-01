var buttonColors = new Array("red", "blue", "green", "yellow");
var randomChosenColor = "";
var gamePattern = new Array();
var userClickedPattern = new Array();
var level = 0;


function nextSequence() {
    userClickedPattern = [];
    level++;
    document.querySelector("#level-title").textContent = "Level " + level; 
    var randomNumber = Math.floor(Math.random() * 4);
    randomChosenColor = buttonColors[randomNumber];
    animateButton(document.querySelector("#" + randomChosenColor), 200);
    playSound(randomChosenColor);
    gamePattern.push(randomChosenColor);
    console.log(gamePattern);
}


function animateButton (clickedButton, duration) {
    clickedButton.classList.add("pressed");
    setTimeout(function () {
        clickedButton.classList.remove("pressed");
    }, duration);
}

function playSound(buttonName) {
    var audioEl = new Audio("sounds/" + buttonName + ".mp3");
    audioEl.play();
}

function handler(selectedButton) {
    userChosenColor = selectedButton.id;
    userClickedPattern.push(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
    animateButton(selectedButton, 100);
    playSound(selectedButton.id);
    console.log(userClickedPattern);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] == gamePattern[currentLevel]) {
        console.log("success");
        if (userClickedPattern.length === gamePattern.length) {
            console.log("level complete, going to next level...");
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    }


    else {
        console.log("fail");
        playSound("wrong");
        document.getElementsByTagName("body")[0].classList.add("game-over");
        setTimeout(function () {
            document.getElementsByTagName("body")[0].classList.remove("game-over");
        }, 200);
        document.querySelector("#level-title").textContent = "Game over, Press Any Key to Restart";
        startOver();
    }
}

function startGame() {
    document.addEventListener("keydown", () => {
    setTimeout(nextSequence, 400);
}, { once: true });
}


function startOver() {
    level = 0;
    gamePattern = [];
    startGame();
}


buttonColors.forEach(element => {
    var btn = document.querySelector("#" + element);
    btn.addEventListener("click", () => handler(btn));
});

startGame();
