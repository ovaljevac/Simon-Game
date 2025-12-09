var buttonColors = new Array("red", "blue", "green", "yellow");
var randomChosenColor = "";
var gamePattern = new Array();
var userClickedPattern = new Array();
var level = 0;

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  query,
  orderByChild,
  limitToLast,
  onValue
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAt06Kj5avhC-C5MOMwnb_jZ244tCe1ieY",
  authDomain: "simon-database-b496f.firebaseapp.com",
  databaseURL: "https://simon-database-b496f-default-rtdb.firebaseio.com",
  projectId: "simon-database-b496f",
  storageBucket: "simon-database-b496f.appspot.com",
  messagingSenderId: "147212191292",
  appId: "1:147212191292:web:a62b2cff32c9bcf1566539"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const scoresRef = ref(db, "scores");

function saveScore(name, score) {
  return push(scoresRef, { name, score });
}

function subscribeHighscores() {
  const topQuery = query(scoresRef, orderByChild("score"), limitToLast(10));

  onValue(topQuery, snapshot => {
    const data = snapshot.val();
    const listEl = document.getElementById("highscores-list");
    if (!listEl) return;

    listEl.innerHTML = "";

    if (!data) return;

    const scores = Object.values(data).sort((a, b) => b.score - a.score);

    scores.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${item.name} – ${item.score}`;
      listEl.appendChild(li);
    });
  });
}


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
    var userChosenColor = selectedButton.id;
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
    document.body.classList.add("game-over");
    setTimeout(() => {
        document.body.classList.remove("game-over");
    }, 200);
    const finalScore = level - 1;
    setTimeout(() => {
        requestAnimationFrame(() => {
            const playerName = prompt("Game over! Insert your name:", "Anonymous");
            if (playerName && playerName.trim() !== "") {
                saveScore(playerName.trim(), finalScore);
            }
            document.querySelector("#level-title").textContent =
                "Game over, Press Start to play again!";
            startOver();
        });
    }, 350); 

   }
}

function startGame() {
    var startBtn = document.getElementById("start-button");
    startBtn.addEventListener("click", () => {
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
subscribeHighscores();

const toggleBtn = document.getElementById("toggle-scores");
const scoreBoard = document.getElementById("score-board");

toggleBtn.addEventListener("click", () => {
  if (scoreBoard.style.display === "none") {
    scoreBoard.style.display = "block";
  } else {
    scoreBoard.style.display = "none";
  }
});


