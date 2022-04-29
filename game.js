const HP_ELEMENT            = document.querySelector("#hp");
const SCORE_ELEMENT         = document.querySelector("#score");
const SCORE_COUNTER_ELEMENT = document.querySelector(".scoreCounter");
const HIGHSCORE_ELEMENT     = document.querySelector("#highscore");
const tank                  = document.getElementById("tank");
const weapon                = document.getElementById("weapon");
const GAME_FIELD_ELEMENT    = document.getElementById("gameField");
const GAME_OVER_SCREEN      = document.getElementById("gameOver");
let enemy                   = document.getElementById("enemy");
let positionVertical        = parseInt(getComputedStyle(tank).top);
let positionHorizontal      = parseInt(getComputedStyle(tank).left);

let score                   = 0;
let hp                      = 3;
let overheat                = false;

let allEnemies;
let allLightShips;

let enemies                 = {
    lightShip: {
        className: "lightShip",
        health: 10,
        color: "green",
    },

    boss: {
        className: "boss",
        health: 50,
        color: "blue",
    }
}


function refreshGameStatus() {
    HP_ELEMENT.innerHTML       = hp;
    SCORE_ELEMENT.innerHTML    = score;
    HIGHSCORE_ELEMENT.innerHTML = localStorage.getItem('max-score') ? localStorage.getItem('max-score') : 0;
}
refreshGameStatus();

document.onkeydown = function(e) {
    if (e.code === "ArrowUp") {
        tank.style.top = positionVertical - 20 + "px";
        positionVertical = parseInt(getComputedStyle(tank).top);
    }

    if (e.code === "ArrowDown") {
        tank.style.top = positionVertical + 20 + "px";
        positionVertical = parseInt(getComputedStyle(tank).top);
    }

    if (e.code === "ArrowLeft") {
        tank.style.left = positionHorizontal - 20 + "px";
        positionHorizontal = parseInt(getComputedStyle(tank).left);
    }

    if (e.code === "ArrowRight") {
        tank.style.left = positionHorizontal + 20 + "px";
        positionHorizontal = parseInt(getComputedStyle(tank).left);
    }

    if (e.code === "Space") {
        if (hp > 0 && !overheat) {
            let bullet = document.createElement("div");
            bullet.classList.add("bullet");
            fire(bullet);
        }
    }
}

function fire(bullet) {
    bullet.style.top    =  positionVertical + 22 + "px";
    bullet.style.left   =  positionHorizontal + 90 + "px";
    document.body.appendChild(bullet);
    bulletMove(bullet);
    setOverheat();
}

function bulletMove(bullet) {
    let count   = 0;
    allEnemies  = document.getElementsByClassName("enemy");

    let bulletMoveInterval = setInterval( () => {
        bullet.style.left = positionHorizontal + 90 + count + "px";
        count += 3;
        for (let i = 0; i < allEnemies.length; i++) {
            if (parseInt(bullet.style.left) + 20 >= parseInt(getComputedStyle(allEnemies[i]).left) && parseInt(bullet.style.left) - 70 <= parseInt(getComputedStyle(allEnemies[i]).left)) {
                if (parseInt(bullet.style.top) >= parseInt(getComputedStyle(allEnemies[i]).top) && parseInt(bullet.style.top) <= parseInt(getComputedStyle(allEnemies[i]).top) + 40) {
                    bullet.remove();
                    explosion(allEnemies[i]);
                    allEnemies[i].remove();
                    scoreCounter(50);
                    checkhighscore(score);
                    clearInterval(bulletMoveInterval);
                }
            }
        }
        

        if (count == 3000) {
            clearInterval(bulletMoveInterval);
            bullet.remove()
        };
    }, 4);
}

function explosion(ship) {
    let explosion = document.createElement("div");
    explosion.classList.add("explosion");
    explosion.style.top = ship.style.top;
    explosion.style.left = ship.style.left;
    document.body.appendChild(explosion);
    setTimeout(() => {document.body.removeChild(explosion)}, 850);
}

function enemySpawner(type) {
    let enemy = document.createElement("div");
    if (type.className == "lightShip"){
        enemy.classList.add(type.className, "enemy");
        enemy.style.top = getRandomArbitrary(100,900) + "px";
        enemy.style.left = 2000 + "px";
    }
    if (type.className == "boss"){
        enemy.classList.add(type.className);
        enemy.classList.add("enemy");
        enemy.style.top = 400 + "px";
        enemy.style.left = 2000 + "px";
    }
        GAME_FIELD_ELEMENT.appendChild(enemy);
}

function enemiesMove() {
    allLightShips = document.getElementsByClassName("lightShip");
    
    let shipsToRemove = [];
    for (let i = 0; i < allLightShips.length; i++) {
        enemyLeftPosition = parseInt(allLightShips[i].style.left);
        enemyTopPosition = parseInt(allLightShips[i].style.top);

        if (enemyLeftPosition <= positionHorizontal + 90 && enemyLeftPosition >= positionHorizontal) {
             if (enemyTopPosition + 50 >= positionVertical && enemyTopPosition <= positionVertical + 50) {
                shipsToRemove.push(allLightShips[i]);
                playerExplosion();
                explosion(allLightShips[i]);
                hp-=1;
                refreshGameStatus()
                removeAllShips();
                if (hp == 0) gameOver();
             }
         }
        // remove enemies behind the screen and take damage
        if (enemyLeftPosition <= -40) {
            shipsToRemove.push(allLightShips[i]);
            
        }

        allLightShips[i].style.left = enemyLeftPosition - 20 + "px";
      
    }
    
    shipsToRemove.forEach(ship => {
        ship.remove();
        hp-=1;
        refreshGameStatus();
        if (hp == 0) gameOver();
    });
}

let removeAllShips = function() {
    let allLightShips = document.getElementsByClassName("lightShip");
    for (let i = 0; i < allLightShips.length; i++) {
        GAME_FIELD_ELEMENT.removeChild(allLightShips[i]);
        i-=1;
    }
}

let setOverheat = function() {
    if (!overheat) {
        overheat = true;
        setTimeout(() => overheat = false, 250);
    };
    console.log("Overheat: ", overheat)
}

let playerExplosion = function() {
    explosion(tank);
    GAME_FIELD_ELEMENT.removeChild(tank);
    tank.style.left     = "100px";
    tank.style.top      = "400px";
    positionVertical    = 400;
    positionHorizontal  = 100;
    

    let spawnTank = function() {
        GAME_FIELD_ELEMENT.appendChild(tank);
    }
    setTimeout(spawnTank, 1000);
    //spawnTank();
}


let enemySpawnInterval = setInterval(() => {
    enemySpawner(enemies.lightShip);
    if (score == 450) {
        clearInterval(enemySpawnInterval);
        bossSpawn();
    };
}, getRandomArbitrary(500, 2500));

function bossSpawn() {
    enemySpawner(enemies.boss);
    let bossSteps = 0; 
    let bossElement = document.getElementsByClassName("boss");
    console.log(bossElement);
    let bossMoveInterval = setInterval(()=> {
        bossElement[0].style.left = parseInt(bossElement[0].style.left) - 50 + "px";
        bossSteps++;
        if (bossSteps == 13) {
            clearInterval(bossMoveInterval);
        }
    }, 300)
}

function gameOver() {
    clearInterval(moveInterval);
    clearInterval(enemySpawnInterval);
    for (let i = 0; i < allLightShips.length; i++) {
        allLightShips[i].remove();
        }
    document.body.removeChild(GAME_FIELD_ELEMENT);
    SCORE_COUNTER_ELEMENT.innerHTML = score;
    GAME_OVER_SCREEN.style.display = "flex";
}

function checkhighscore(score) {
    let currentScore = score;
    let currenthighscore = localStorage.getItem('max-score', score);
    if (currentScore > currenthighscore) {
        localStorage.setItem('max-score', score);
        refreshGameStatus();
    }
}

let moveInterval = setInterval(() => enemiesMove(), 100);

function scoreCounter(count) {
    score+=count;
    SCORE_ELEMENT.innerHTML = score;
}

function getRandomArbitrary(min, max) { return Math.floor(Math.random() * (max - min) + min) }
