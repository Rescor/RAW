const HP_ELEMENT            = document.querySelector("#hp");
const SCORE_ELEMENT         = document.querySelector("#score");
const SCORE_COUNTER_ELEMENT = document.querySelector(".scoreCounter");
const HIGHSCORE_ELEMENT     = document.querySelector("#highscore");
const tank                  = document.getElementById("tank");
const weapon                = document.getElementById("weapon");
const GAME_FIELD_ELEMENT    = document.getElementById("gameField");
const GAME_OVER_SCREEN      = document.getElementById("gameOver");
const BOSS_HEALTH_ELEMENT   = document.getElementById("bossHealth");
const BOSS_HEALTH_STRING_ELEMENT    = document.getElementById("bossHealthString");
const REMAINING_ENEMIES_ELEMENT     = document.getElementById("remainingEnemies");
let enemy                   = document.getElementById("enemy");
let positionVertical        = parseInt(getComputedStyle(tank).top);
let positionHorizontal      = parseInt(getComputedStyle(tank).left);


let score                   = 0;
let hp                      = 3;
let overheat                = false;
let remainingEnemies        = 3;
let remainingSpawnEnemies   = 3;

if (!localStorage.getItem('achievements')) { localStorage.setItem('achievements', "{}") };
let achievements = JSON.parse(localStorage.getItem('achievements'));

if (!localStorage.getItem('ship')) { localStorage.setItem('ship', 1) };
let playerShip              = localStorage.getItem('ship');

function setPlayerShip() {
    if (playerShip == 1) {
        tank.style.background = "url('assets/player.png') no-repeat";
        tank.style.backgroundSize = "80px 50px"
    }
    if (playerShip == 2) {
        tank.style.background =  "url('assets/ship_02.png') no-repeat";
        tank.style.backgroundSize = "80px 50px";
    }
}
setPlayerShip();

let bossFightMode = false;
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
        BOSS_HEALTH_STRING_ELEMENT.style.display = "inherit";
        for (let i = 0; i < enemies.boss.health; i++) {
            BOSS_HEALTH_ELEMENT.innerHTML += '<div class="healthBarCell"></div>'
        }
    if (enemies.boss.health == 0) {
        BOSS_HEALTH_STRING_ELEMENT.style.display = "none";
    }
    }
}
refreshGameStatus();

let playerMoving = function() {
    if (keysPressed.ArrowUp) {
        if (parseInt(getComputedStyle(tank).top) - 10 >= 160){
            tank.style.top = positionVertical - 10 + "px";
            positionVertical = parseInt(getComputedStyle(tank).top);
        }
    }

    if (keysPressed.ArrowDown) {
        if (parseInt(getComputedStyle(tank).top) + 10 <= 790){
            tank.style.top = positionVertical + 10 + "px";
            positionVertical = parseInt(getComputedStyle(tank).top);
        }
    }

    if (keysPressed.ArrowLeft) {
        if (parseInt(getComputedStyle(tank).left) - 10 >= 15){
            tank.style.left = positionHorizontal - 10 + "px";
            positionHorizontal = parseInt(getComputedStyle(tank).left);
        }
    }

    if (keysPressed.ArrowRight) {
        if (parseInt(getComputedStyle(tank).left) + 10 <= 1300){
            tank.style.left = positionHorizontal + 10 + "px";
            positionHorizontal = parseInt(getComputedStyle(tank).left);
        }
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
    if (e.code === "ArrowUp" || e.code === "KeyW")       { keysPressed.ArrowUp = true; }

    if (e.code === "ArrowDown" || e.code === "KeyS")     { keysPressed.ArrowDown = true; }

    if (e.code === "ArrowLeft" || e.code === "KeyA")     { keysPressed.ArrowLeft = true; }

    if (e.code === "ArrowRight" || e.code === "KeyD")    { keysPressed.ArrowRight = true; }

    if (e.code === "Space")                              { keysPressed.Space = true; }
}

document.onkeyup = function(e) {
    if (e.code === "ArrowUp" || e.code === "KeyW")       { keysPressed.ArrowUp = false; }

    if (e.code === "ArrowDown" || e.code === "KeyS")     { keysPressed.ArrowDown = false; }

    if (e.code === "ArrowLeft" || e.code === "KeyA")     { keysPressed.ArrowLeft = false; }

    if (e.code === "ArrowRight" || e.code === "KeyD")    { keysPressed.ArrowRight = false; }

    if (e.code === "Space")                              { keysPressed.Space = false; }
}

function fire(bullet) {
    bullet.style.top    =  positionVertical + 22 + "px";
    bullet.style.left   =  positionHorizontal + 90 + "px";
    document.body.appendChild(bullet);
    setOverheat();
}

function bulletMove() {
    let allBullets = document.getElementsByClassName("bullet");
    let allEnemies  = document.getElementsByClassName("enemy");

    for (let i = 0; i < allBullets.length; i++) {
        let bullet = allBullets[i];
        let bulletPosition = parseInt(bullet.style.left);
        bullet.style.left = bulletPosition + 20 + "px";
        if (bulletPosition > 2000) {
            bullet.remove();
            continue;
        };

    if (!bossFightMode && enemies.boss.immune == 1) {
        for (let j = 0; j < allEnemies.length; j++) {
            let enemy = allEnemies[j]
            if (checkHit(bullet, enemy)) {
                bullet.remove();
                explosion(enemy);
                enemy.remove();
                scoreCounter(50);
                remainingEnemies -= 1;
                refreshGameStatus();
                checkhighscore(score);
                }
            }
        }
    
    else if (bossFightMode && enemies.boss.immune == 0) {
        let enemy = allEnemies[0]
        if (checkHit(bullet, enemy)) {
            bullet.remove();
                //scoreCounter(50);
                enemies.boss.health -= 1;
                refreshGameStatus();
                checkhighscore(score);
                if (enemies.boss.health == 0) {
                    explosion(enemy);
                    enemy.remove();
                    achievements.finishedGame = true;
                    localStorage.setItem('achievements', JSON.stringify(achievements));
                   // alert("Achievement get: Finish the game");
                    loadEnding();
                    }
                }
            }
        }

        
}

function checkHit(elem1, elem2) {
    let rect1 = elem1.getBoundingClientRect();
    let rect2 = elem2.getBoundingClientRect();

    if (rect1.right >= rect2.left && rect1.left <= rect2.right) {
        if (rect1.bottom >= rect2.top && rect1.top <= rect2.bottom) {
            return true;
        }
    }
    return false;
}

function explosion(ship) {
    let target = ship.classList[0];
    let explosion = document.createElement("div");
    if (target == "player" || target == "lightShip") {
        explosion.classList.add("explosion");
        explosion.style.top = ship.style.top;
        explosion.style.left = ship.style.left;
        document.body.appendChild(explosion);
    }
    else {
        explosion.classList.add("bossExplosion");
        explosion.style.top = ship.style.top;
        explosion.style.left = ship.style.left;
        document.body.appendChild(explosion);
    }
    setTimeout(() => {document.body.removeChild(explosion)}, 850);
}

function enemySpawner(type) {
    let enemy = document.createElement("div");
    if (type.className == "lightShip"){
        enemy.classList.add(type.className, "enemy");
        enemy.style.top = getRandomArbitrary(190,800) + "px";
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
        let enemy = allLightShips[i];
        enemyLeftPosition = parseInt(enemy.style.left);

        // if (getRandomArbitrary(0, 100) < 3) {
        //     enemyShoot(enemy);
        // }

        // !!! REFACTOR THIS !!!
        if (checkHit(tank, enemy)) {
            shipsToRemove.push(enemy);
            playerExplosion();
            explosion(enemy);
            remainingSpawnEnemies += 1;
            hp-=1;
            refreshGameStatus()
            removeAllShips();
            if (hp == 0) gameOver();
             
         }
        // remove enemies behind the screen and take damage
        if (enemyLeftPosition <= -40) {
            shipsToRemove.push(enemy);
            remainingSpawnEnemies += 1;
        }

        enemy.style.left = enemyLeftPosition - 6 + "px";
    }
    
    shipsToRemove.forEach(ship => {
        ship.remove();
        hp-=1;
        refreshGameStatus();
        if (hp == 0) gameOver();
    });
}

function enemyShoot(enemy) {
    let enemyBullet = document.createElement("div");
    enemyBullet.style.left = enemy.style.left;
    enemyBullet.style.top = enemy.style.top;
    enemyBullet.classList.add("enemyBullet");
    document.body.appendChild(enemyBullet);
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
    bossFightMode = true;
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

function loadEnding() {
    setTimeout(() => document.location.href = "end.html", 2000);
}

let playerMovingInterval = setInterval(playerMoving, 20);

let backgroundMoveInterval = setInterval(() => {
    let body = document.body;
    body.style.backgroundPosition = parseInt(getComputedStyle(body).backgroundPosition) + 1 + "%";
}, 33);

let moveInterval = setInterval(() => enemiesMove(), 30);
let bulletMoveInterval = setInterval(() => bulletMove(), 16);

function scoreCounter(count) {
    score+=count;
    SCORE_ELEMENT.innerHTML = score;
}

function getRandomArbitrary(min, max) { return Math.floor(Math.random() * (max - min) + min) }
