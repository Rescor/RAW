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
let positionVertical        = parseInt(getComputedStyle(tank).top);
let positionHorizontal      = parseInt(getComputedStyle(tank).left);

const STORY_MODE            = window.location.href.includes("story");
let score                   = 0;
let hp                      = 3;
let overheat                = false;
let railgunOverheat         = false;
let remainingEnemies        = 20;
let remainingSpawnEnemies   = 20;
const BOSS_SPAWN_SCORE      = 500;
let enemiesSpeed            = 100;
let enemiesBulletsSpeed     = 100;
let bossFightMode           = false;

let achievements;
let playerShip;
let allEnemies;
let allLightShips;

let enemies                 = {
    lightShip: {
        className: "lightShip",
        health: 10,
    },
    wall: {
        className: "wall",
        health: 10,
    },

    boss: {
        className: "boss",
        health: 20,
        assetPath: "assets/boss.png",
        immune: 1,
    }
}

let keysPressed             = {
    ArrowUp:    false,
    ArrowDown:  false,
    ArrowLeft:  false,
    ArrowRight: false,
    KeyR:       false,
    Space:      false,
    Shift:      false,
}

function getLSData() {
    if (!localStorage.getItem('achievements')) { localStorage.setItem('achievements', "{}") };
    if (!localStorage.getItem('ship')) { localStorage.setItem('ship', 1) };
    achievements    = JSON.parse(localStorage.getItem('achievements'));
    playerShip      = localStorage.getItem('ship');
}
getLSData();

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

function refreshGameStatus() {
    HP_ELEMENT.innerHTML        = hp;
    SCORE_ELEMENT.innerHTML     = score;
    HIGHSCORE_ELEMENT.innerHTML = localStorage.getItem('max-score') ? localStorage.getItem('max-score') : 0;
    REMAINING_ENEMIES_ELEMENT.innerHTML   = remainingEnemies;

    /* BOSS FIGHT SCREEN */
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

    if (keysPressed.Shift) {
        if (hp > 0 && !railgunOverheat) {
            let bullet = document.createElement("div");
            bullet.classList.add("railgunBullet");
            bullet.classList.add("bullet");
            fire(bullet, "railgun");
        }
    }

    
}

document.onkeydown = function(e) {
    if (e.code === "ArrowUp" || e.code === "KeyW")       { keysPressed.ArrowUp    = true; }
    if (e.code === "ArrowDown" || e.code === "KeyS")     { keysPressed.ArrowDown  = true; }
    if (e.code === "ArrowLeft" || e.code === "KeyA")     { keysPressed.ArrowLeft  = true; }
    if (e.code === "ArrowRight" || e.code === "KeyD")    { keysPressed.ArrowRight = true; }
    if (e.code === "KeyR")                               { keysPressed.KeyR       = true; }
    if (e.code === "Space")                              { keysPressed.Space      = true; }
    if (e.code === "ShiftLeft")                          { keysPressed.Shift      = true; }
    if (e.code.includes("Digit")) {
        let speed = e.code.substring(e.code.length - 1);
        enemiesSpeed = 100 * speed;
        enemiesBulletsSpeed = 100 * speed;
        clearInterval(moveInterval);
        clearInterval(enemyBulletMoveInt);
        moveInterval = setInterval( () => enemiesMove(), 3000 / enemiesSpeed);
        enemyBulletMoveInt = setInterval( () => enemyBulletMove(), 3000 / enemiesBulletsSpeed);
    }
}

document.onkeyup = function(e) {
    if (e.code === "ArrowUp" || e.code === "KeyW")       { keysPressed.ArrowUp      = false; }
    if (e.code === "ArrowDown" || e.code === "KeyS")     { keysPressed.ArrowDown    = false; }
    if (e.code === "ArrowLeft" || e.code === "KeyA")     { keysPressed.ArrowLeft    = false; }
    if (e.code === "ArrowRight" || e.code === "KeyD")    { keysPressed.ArrowRight   = false; }
    if (e.code === "KeyR")                               { keysPressed.KeyR         = false; }
    if (e.code === "Space")                              { keysPressed.Space        = false; }
    if (e.code === "ShiftLeft")                          { keysPressed.Shift        = false; }
}

function fire(bullet, type) {
    bullet.style.top    =  positionVertical + 22 + "px";
    bullet.style.left   =  positionHorizontal + 90 + "px";
    GAME_FIELD_ELEMENT.appendChild(bullet);
    type == "railgun" ? setRGOverheat() : setOverheat();
}

function bulletMove() {
    let allBullets = document.getElementsByClassName("bullet");

    for (let i = 0; i < allBullets.length; i++) {
        let bullet = allBullets[i];
        let bulletPosition = parseInt(bullet.style.left);
        bullet.style.left = bulletPosition + 20 + "px";
        if (bulletPosition > 2000) {
            bullet.remove();
            continue;
        };
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
    let targetClass = ship.classList[0];
    // if (targetClass == "wall") return;
    let explosion = document.createElement("div");

   explosion.classList.add(targetClass == "boss" ? "bossExplosion" : "explosion")

    explosion.style.top = ship.style.top;
    explosion.style.left = ship.style.left;
    document.body.appendChild(explosion);

    setTimeout(() => {document.body.removeChild(explosion)}, 850);
}

function enemySpawner(type) {
    let enemy = document.createElement("div");
    enemy.classList.add(type.className, "enemy");
    enemy.style.left = 2000 + "px";
    if (type.className == "boss") {
        enemy.style.top = 300 + "px";
        enemy.innerHTML = '<img src="' + enemies.boss.assetPath + '">';
    }
    else {
        enemy.style.top = getRandomArbitrary(190,800) + "px";
    }
    GAME_FIELD_ELEMENT.appendChild(enemy);
}

function enemiesMove() {
    let allLightShips = document.getElementsByClassName("enemy");
    
    for (let i = 0; i < allLightShips.length; i++) {
        let enemy = allLightShips[i];
        let enemyLeftPosition = parseInt(enemy.style.left);
        if (enemy.classList[0] != "wall" && getRandomArbitrary(0, 100) < 3) {
             enemyShoot(enemy);
        }
        enemy.style.left = enemyLeftPosition - 6 + "px";
    }
}

function enemyShoot(enemy) {
    let enemyBullet = document.createElement("div");
    enemyBullet.style.left = enemy.style.left;
    enemyBullet.style.top = enemy.style.top;
    enemyBullet.classList.add("enemyBullet");
    document.body.appendChild(enemyBullet);
}

function enemyBulletMove() {
    let allEnemyBullets = document.getElementsByClassName("enemyBullet");
    for (let i = 0; i < allEnemyBullets.length; i++) {
        let enemyBullet = allEnemyBullets[i];
        let enemyBulletPosition = parseInt(enemyBullet.style.left);
        enemyBullet.style.left = enemyBulletPosition - 20 + "px";
        if (enemyBulletPosition < -20) {
            enemyBullet.remove();
            continue;
        };
    }
}

let removeAllShips = function() {
    let allLightShips = document.getElementsByClassName("lightShip");
    let allWalls      = document.getElementsByClassName("wall");
    let allEnemyBullets    = document.getElementsByClassName("enemyBullet");
    for (let i = 0; i < allLightShips.length; i++) {
        GAME_FIELD_ELEMENT.removeChild(allLightShips[i]);
        i-=1;
    }
    for (let i = 0; i < allWalls.length; i++) {
        GAME_FIELD_ELEMENT.removeChild(allWalls[i]);
        i-=1;
    }
    for (let i = 0; i < allEnemyBullets.length; i++) {
        document.body.removeChild(allEnemyBullets[i]);
        i-=1;
    }

}

let setOverheat = function() {
    if (!overheat) {
        overheat = true;
        setTimeout(() => overheat = false, 250);
    };
}

let setRGOverheat = function() {
    if (!railgunOverheat) {
        railgunOverheat = true;
        setTimeout(() => railgunOverheat = false, 1500);
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
    if (remainingSpawnEnemies == 0 && remainingEnemies == 0) {
        clearInterval(enemySpawnInterval);
        bossSpawn();
    };

    if (!bossFightMode) {
        if (getRandomArbitrary(1, 5) == 1) {
            enemySpawner(enemies.wall);
            return;
        }
        enemySpawner(enemies.lightShip);
        remainingSpawnEnemies -= 1;
    }
}, getRandomArbitrary(500, 2000));

function bossSpawn() {
    bossFightMode = true;
    enemySpawner(enemies.boss);
    clearInterval(moveInterval);
    let bossElement      = document.getElementsByClassName("boss");
    let bossPosition     = bossElement[0].style.left;
    let bossSteps        = 0;

    let bossMoveInterval = setInterval( ()=> {
        bossPosition = parseInt(bossPosition) - 50 + "px";
        bossElement[0].style.left = bossPosition;
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
    clearInterval(hitCheckInterval);
    document.body.removeChild(GAME_FIELD_ELEMENT);
    SCORE_COUNTER_ELEMENT.innerHTML = score;
    GAME_OVER_SCREEN.style.display = "flex";
}

function checkHighscore(score) {
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

let hitCheckInterval = setInterval(() => {
    let allBullets = document.getElementsByClassName("bullet");
    let allEnemyBullets = document.getElementsByClassName("enemyBullet");
    let allEnemies  = document.getElementsByClassName("enemy");
    let allEnemiesShips = document.getElementsByClassName("lightShip");
    if (hp == 0) gameOver();

    // check bullets hit enemies
    for (let i = 0; i < allBullets.length; i++) {
        let bullet = allBullets[i];
        for (let j = 0; j < allEnemies.length; j++) {
            let enemy       = allEnemies[j];
            let enemyClass  = enemy.classList[0];
            if (!checkHit(bullet, enemy)) {
                continue;
            }
            // if regular enemy
            if (enemyClass != "wall" && enemyClass != "boss") {
                if (bullet.classList[0] != "railgunBullet") bullet.remove();
                explosion(enemy);
                enemy.remove();
                scoreCounter(50);
                remainingEnemies -= 1;
                refreshGameStatus();
                checkHighscore(score);
                
            }
            // if wall
            if (enemyClass == "wall") {
                if (bullet.classList[0] != "railgunBullet") bullet.remove();
                else {
                    explosion(enemy);
                    enemy.remove();
                    scoreCounter(25);
                    refreshGameStatus();
                    checkHighscore(score);
                }
            }
            // if boss
            if (enemyClass == "boss" && bossFightMode && enemies.boss.immune == 0) {
                    bullet.remove();
                    //scoreCounter(50);
                    enemies.boss.health -= 1;
                    refreshGameStatus();
                    checkHighscore(score);
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

        // check player hit enemy
    for (let j = 0; j < allEnemies.length; j++) {
        let enemy       = allEnemies[j];
        if (checkHit(tank, enemy)) {
            enemy.remove();
            playerExplosion();
            explosion(enemy);
            if (enemy.classList[0] != "wall") {
                remainingSpawnEnemies += 1;
                hp-=1;
            }
            refreshGameStatus();
            remainingSpawnEnemies += allEnemiesShips.length;
            removeAllShips();
            if (hp == 0) gameOver();
        }
    }

        // check enemyBullets hit player
    for (let i = 0; i < allEnemyBullets.length; i++) {
        let enemyBullet = allEnemyBullets[i];
        if (checkHit(enemyBullet, tank)) {
            enemyBullet.remove();
            playerExplosion();
            remainingSpawnEnemies += 1;
            hp-=1;
            refreshGameStatus()
            removeAllShips();
            if (hp == 0) gameOver();
        }
    }

    // check enemies behind the screen
    // remove enemies behind the screen and take damage
    for (let i = 0; i < allEnemies.length; i++) {
        let enemy = allEnemies[i];
        let enemyLeftPosition = parseInt(enemy.style.left);
        let enemyClass = enemy.classList[0];
        if (enemyLeftPosition <= -40) {
            if (enemyClass != "wall") {
                hp -= 1;
                remainingSpawnEnemies += 1;
            }
            enemy.remove();
        }
    }
}, 10);

let moveInterval = setInterval(() => enemiesMove(), 3000 / enemiesSpeed);
let bulletMoveInterval = setInterval(() => bulletMove(), 16);
let enemyBulletMoveInt = setInterval(() => enemyBulletMove(), 3000 / enemiesBulletsSpeed);

function scoreCounter(count) {
    score += count;
    SCORE_ELEMENT.innerHTML = score;
}

function getRandomArbitrary(min, max) { return Math.floor(Math.random() * (max - min) + min) }

function debug(text, target) { console.log(text, target); }
