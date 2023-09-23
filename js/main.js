"use strict";
const body = document.querySelector("body");
const canvas = document.querySelector("canvas");
const score = document.querySelector(".score__value");
const finalScore = document.querySelector(".final__score > span");
const menuScreen = document.querySelector(".menu__screen");
const btnPLay = document.querySelector(".btn__play");
const speakerBtn = document.querySelector(".speaker");
const themeBtn = document.querySelector(".theme-Btn");
const howToPlayBtn = document.querySelector(".how-to-play");
const howToPLayModal = document.querySelector(".container-modal");
const closeModal = document.querySelector(".btn-modal");
const ctx = canvas.getContext("2d");
const audio = new Audio("assets/audio/audio.mp3");
audio.volume = 0.2;
const mouseClick = new Audio("assets/audio/mouse_click.mp3");
mouseClick.volume = 0.2;
let isMuted = false;
const size = 30;
const initialPosition = { x: 270, y: 240 };
let snake = [
    initialPosition,
];
const incrementScore = () => {
    score.innerText = +score.innerText + 10;
};
const randomNumber = (max, min) => {
    return Math.round(Math.random() * (max - min) + min);
};
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
};
const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    return `rgb(${red}, ${green}, ${blue})`;
};
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};
let direction;
let loopId;
const drawFood = () => {
    const { x, y, color } = food;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
};
const drawSnake = () => {
    ctx.fillStyle = "#7e920b";
    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "#BAD80A";
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
};
const moveSnake = () => {
    if (!direction)
        return;
    const head = snake[snake.length - 1];
    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y });
    }
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y });
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size });
    }
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size });
    }
    snake.shift();
};
const drawGrid = () => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#2F2F2F';
    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
};
const checkEat = () => {
    const head = snake[snake.length - 1];
    if (head.x == food.x && head.y == food.y) {
        incrementScore();
        snake.push(head);
        if (isMuted === false) {
            audio.play();
        }
        else {
            audio.pause();
        }
        let x = randomPosition();
        let y = randomPosition();
        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }
        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};
const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    });
    if (wallCollision || selfCollision) {
        gameOver();
    }
};
const gameOver = () => {
    direction = undefined;
    canvas.style.display = "none";
    menuScreen.style.display = 'flex';
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(5px)";
};
const gameLoop = () => {
    clearInterval(loopId);
    ctx.clearRect(0, 0, 600, 600);
    drawGrid();
    drawFood();
    drawSnake();
    moveSnake();
    checkEat();
    checkCollision();
    loopId = setTimeout(() => {
        gameLoop();
    }, 270);
};
gameLoop();
document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != 'left') {
        direction = "right";
    }
    if (key == "ArrowLeft" && direction != 'right') {
        direction = "left";
    }
    if (key == "ArrowUp" && direction != 'down') {
        direction = "up";
    }
    if (key == "ArrowDown" && direction != 'up') {
        direction = "down";
    }
});
btnPLay.addEventListener("click", () => {
    score.innerText = "00";
    menuScreen.style.display = "none";
    canvas.style.display = "block";
    canvas.style.filter = "none";
    snake = [
        initialPosition
    ];
});
speakerBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    const speakerIcon = speakerBtn.children[0];
    speakerIcon.classList.toggle("ph-speaker-high");
    speakerIcon.classList.toggle("ph-speaker-slash");
});
themeBtn.addEventListener("click", () => {
    const themeIcon = themeBtn.children[0];
    themeIcon.classList.toggle("ph-moon");
    themeIcon.classList.toggle("ph-sun");
    body.classList.toggle("dark-theme");
    body.classList.toggle("white-theme");
});
body.addEventListener("click", () => {
    if (isMuted === false) {
        mouseClick.play();
    }
    else {
        mouseClick.pause();
    }
});
function toggleModal() {
    howToPLayModal.classList.toggle("hide");
}
howToPlayBtn.addEventListener("click", toggleModal);
closeModal.addEventListener("click", toggleModal);
