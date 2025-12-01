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
    animateButton(document.querySelector("#" + randomChosenColor));
    playSound(randomChosenColor);
    gamePattern.push(randomChosenColor);
    console.log(gamePattern);
}


function animateButton (clickedButton) {
    clickedButton.classList.add("pressed");
    setTimeout(function () {
        clickedButton.classList.remove("pressed");
    }, 100);
}

function playSound(buttonName) {
    var audioEl = new Audio("sounds/" + buttonName + ".mp3");
    audioEl.play();
}

function handler(selectedButton) {
    userChosenColor = selectedButton.id;
    userClickedPattern.push(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
    animateButton(selectedButton);
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

function startOver() {
    level = 0;
    gamePattern = [];
    document.addEventListener("keydown", nextSequence, { once: true });
}


buttonColors.forEach(element => {
    var btn = document.querySelector("#" + element);
    btn.addEventListener("click", () => handler(btn));
});

document.addEventListener("keydown", nextSequence, { once: true });