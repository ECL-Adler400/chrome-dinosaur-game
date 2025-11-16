//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//carrot
let carrotArray = [];

let carrotWidth = 40;
let carrotHeight = 50;
let carrotX = 700;
let carrotY = boardHeight - carrotHeight;

let carrotImg;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "./img/unicorn.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    carrotImg = new Image();
    carrotImg.src = "./img/carrot.png";

    requestAnimationFrame(update);
    setInterval(placeCarrot, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("click", handleClick);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //carrot
    for (let i = 0; i < carrotArray.length; i++) {
        let carrot = carrotArray[i];
        carrot.x += velocityX;
        context.drawImage(carrot.img, carrot.x, carrot.y, carrot.width, carrot.height);

        if (detectCollision(dino, carrot) && !carrot.collected) {
            carrot.collected = true;
            score += 100; // bonus points for collecting carrot
        }
    }
    
    // Remove collected carrots that are off screen
    carrotArray = carrotArray.filter(carrot => carrot.x > -carrot.width && !carrot.collected);

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
    
    if (gameOver) {
        context.fillStyle="black";
        context.font="30px courier";
        context.fillText("GAME OVER", boardWidth/2 - 80, boardHeight/2);
    }
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //jump
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}

function placeCarrot() {
    if (gameOver) {
        return;
    }

    //place carrot
    let carrot = {
        img : carrotImg,
        x : carrotX,
        y : carrotY,
        width : carrotWidth,
        height: carrotHeight,
        collected: false
    }

    let placeCarrotChance = Math.random(); //0 - 0.9999...

    if (placeCarrotChance > .50) { //50% chance to place a carrot
        carrotArray.push(carrot);
    }

    if (carrotArray.length > 5) {
        carrotArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    if (gameOver) {
        resetGame();
        return;
    }
    
    // Jump on touch
    if (dino.y == dinoY) {
        velocityY = -10;
    }
}

function handleClick(e) {
    if (gameOver) {
        resetGame();
    }
}

function resetGame() {
    gameOver = false;
    score = 0;
    carrotArray = [];
    velocityY = 0;
    dino.y = dinoY;
    dinoImg.src = "./img/unicorn.png";
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
