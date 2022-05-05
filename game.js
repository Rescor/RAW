const HP_ELEMENT            = document.querySelector("#hp");
const SCORE_ELEMENT         = document.querySelector("#score");
const SCORE_COUNTER_ELEMENT = document.querySelector(".scoreCounter");
const HIGHSCORE_ELEMENT     = document.querySelector("#highscore");
const tank                  = document.getElementById("tank");
const weapon                = document.getElementById("weapon");
const GAME_FIELD_ELEMENT    = document.getElementById("gameField");
const GAME_OVER_SCREEN      = document.getElementById("gameOver");
const BOSS_HEALTH_ELEMENT   = document.getElementById("bossHealth");
const REMAINING_ENEMIES_ELEMENT = document.getElementById("remainingEnemies");
let enemy                   = document.getElementById("enemy");
let positionVertical        = parseInt(getComputedStyle(tank).top);
let positionHorizontal      = parseInt(getComputedStyle(tank).left);

let score                   = 0;
let hp                      = 3;
let overheat                = false;
let remainingEnemies        = 1;
let remainingSpawnEnemies   = 1;

const BOSS_SPAWN_SCORE      = 500;

let allEnemies;
let allLightShips;

let enemies                 = {
    lightShip: {
        className: "lightShip",
        health: 10,
    },

    boss: {
        className: "boss",
        health: 20,
        assetPath: "assets/boss.png",
        immune: 1,
    }
}

let keysPressed = {
    ArrowUp:    false,
    ArrowDown:  false,
    ArrowLeft:  false,
    ArrowRight: false,
    Space:      false,
}

function refreshGameStatus() {
    HP_ELEMENT.innerHTML        = hp;
    SCORE_ELEMENT.innerHTML     = score;
    HIGHSCORE_ELEMENT.innerHTML = localStorage.getItem('max-score') ? localStorage.getItem('max-score') : 0;
    REMAINING_ENEMIES_ELEMENT.innerHTML   = remainingEnemies;
    if (remainingEnemies == 0) {
        BOSS_HEALTH_ELEMENT.innerHTML = '';
        for (let i = 0; i < enemies.boss.health; i++) {
            BOSS_HEALTH_ELEMENT.innerHTML += '<div class="healthBarCell"></div>'
        }
    }
}
refreshGameStatus();

let playerMoving = function() {
    if (keysPressed.ArrowUp) {
        tank.style.top = positionVertical - 10 + "px";
        positionVertical = parseInt(getComputedStyle(tank).top);
    }
    if (keysPressed.ArrowDown) {
        tank.style.top = positionVertical + 10 + "px";
        positionVertical = parseInt(getComputedStyle(tank).top);
    }
    if (keysPressed.ArrowLeft) {
        tank.style.left = positionHorizontal - 10 + "px";
        positionHorizontal = parseInt(getComputedStyle(tank).left);
    }
    if (keysPressed.ArrowRight) {
        tank.style.left = positionHorizontal + 10 + "px";
        positionHorizontal = parseInt(getComputedStyle(tank).left);
    }
    if (keysPressed.Space) {
        if (hp > 0 && !overheat) {
            let bullet = document.createElement("div");
            bullet.classList.add("bullet");
            fire(bullet);
        }
    }
}

document.onkeydown = function(e) {
    if (e.code === "ArrowUp")       { keysPressed.ArrowUp = true; }

    if (e.code === "ArrowDown")     { keysPressed.ArrowDown = true; }

    if (e.code === "ArrowLeft")     { keysPressed.ArrowLeft = true; }

    if (e.code === "ArrowRight")    { keysPressed.ArrowRight = true; }

    if (e.code === "Space")         { keysPressed.Space = true; }
}

document.onkeyup = function(e) {
    if (e.code === "ArrowUp")       { keysPressed.ArrowUp = false; }

    if (e.code === "ArrowDown")     { keysPressed.ArrowDown = false; }

    if (e.code === "ArrowLeft")     { keysPressed.ArrowLeft = false; }

    if (e.code === "ArrowRight")    { keysPressed.ArrowRight = false; }

    if (e.code === "Space")         { keysPressed.Space = false; }
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
    let bulletPosition = positionHorizontal;

    let bulletMoveInterval = setInterval( () => {
        bullet.style.left = bulletPosition + 90 + count + "px";
        count += 16;

        for (let i = 0; i < allEnemies.length; i++) {
            let enemy = allEnemies[i];
            
            if (remainingEnemies > 0) {
                if (parseInt(bullet.style.left) + 20 >= parseInt(getComputedStyle(enemy).left) && parseInt(bullet.style.left) - 70 <= parseInt(getComputedStyle(enemy).left)) {
                    if (parseInt(bullet.style.top) >= parseInt(getComputedStyle(enemy).top) && parseInt(bullet.style.top) <= parseInt(getComputedStyle(enemy).top) + parseInt(getComputedStyle(enemy).height)) {
                        bullet.remove();
                        explosion(enemy);
                        enemy.remove();
                        // scoreCounter(50);
                        remainingEnemies -= 1;
                        refreshGameStatus();
                        checkhighscore(score);
                        clearInterval(bulletMoveInterval);
                    }
                }
            }
            
            
                 if (parseInt(bullet.style.left) + 20 >= parseInt(getComputedStyle(enemy).left) && parseInt(bullet.style.left) - 70 <= parseInt(getComputedStyle(enemy).left) && enemies.boss.immune == 0) {
                     if (parseInt(bullet.style.top) >= parseInt(getComputedStyle(enemy).top) && parseInt(bullet.style.top) <= parseInt(getComputedStyle(enemy).top) + parseInt(getComputedStyle(enemy).height)) {
                         bullet.remove();
                         // scoreCounter(50);
                         enemies.boss.health -= 1;
                         refreshGameStatus();
                         checkhighscore(score);
                         clearInterval(bulletMoveInterval);
                         if (enemies.boss.health == 0) {
                            explosion(enemy);
                            enemy.remove();
                         }
                     }
                 }
                }
            
            
 
            
        
        

        if (count == 3000) {
            clearInterval(bulletMoveInterval);
            bullet.remove()
        };
    }, 16);
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
        GAME_FIELD_ELEMENT.appendChild(enemy);
    }
    if (type.className == "boss"){
        enemy.classList.add(type.className);
        enemy.classList.add("enemy");
        enemy.style.top = 300 + "px";
        enemy.style.left = 2000 + "px";
        GAME_FIELD_ELEMENT.appendChild(enemy);
        enemy.innerHTML = '<img src="' + enemies.boss.assetPath + '">';

    }
        
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

        allLightShips[i].style.left = enemyLeftPosition - 6 + "px";
      
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
}


let enemySpawnInterval = setInterval(() => {
    if (remainingSpawnEnemies > 0) {
    enemySpawner(enemies.lightShip);
    remainingSpawnEnemies -= 1;
    }
    if (remainingSpawnEnemies == 0 && remainingEnemies == 0) {
        clearInterval(enemySpawnInterval);
        bossSpawn();
    };
}, getRandomArbitrary(500, 2500));

function bossSpawn() {
    enemySpawner(enemies.boss);
    let bossSteps = 0; 
    let bossElement = document.getElementsByClassName("boss");
    let bossMoveInterval = setInterval(()=> {
        bossElement[0].style.left = parseInt(bossElement[0].style.left) - 50 + "px";
        bossSteps++;
        if (bossSteps == 13) {
            clearInterval(bossMoveInterval);
            enemies.boss.immune = 0;
        }
    }, 300)
}

function gameOver() {
    clearInterval(moveInterval);
    clearInterval(enemySpawnInterval);
    clearInterval(playerMovingInterval);
    clearInterval(backgroundMoveInterval);
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

let playerMovingInterval = setInterval(playerMoving, 20);

let backgroundMoveInterval = setInterval(() => {
    let body = document.body;
    body.style.backgroundPosition = parseInt(getComputedStyle(body).backgroundPosition) + 1 + "%";
}, 33);

let moveInterval = setInterval(() => enemiesMove(), 30);

function scoreCounter(count) {
    score+=count;
    SCORE_ELEMENT.innerHTML = score;
}

function getRandomArbitrary(min, max) { return Math.floor(Math.random() * (max - min) + min) }
