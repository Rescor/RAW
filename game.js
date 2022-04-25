const hpElem            = document.querySelector("#hp");
const scoreElem         = document.querySelector("#score");
const tank              = document.getElementById("tank");
const weapon            = document.getElementById("weapon");
let enemy               = document.getElementById("enemy");

let positionVertical    = parseInt(getComputedStyle(tank).top);
let positionHorizontal  = parseInt(getComputedStyle(tank).left);

let score               = 0;
let hp                  = 3;

let allEnemies;
let allLightSips;

let enemies             = {
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
    hpElem.innerHTML    = hp;
    scoreElem.innerHTML = score;
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
        let bullet = document.createElement("div");
        bullet.classList.add("bullet");
        fire(bullet);
    }
}

function fire(bullet) {
    bullet.style.top =  positionVertical + 22 + "px";
    bullet.style.left =  positionHorizontal + 90 + "px";
    document.body.appendChild(bullet);
    bulletMove(bullet);
}

function bulletMove(bullet) {
    let count = 0;
    allEnemies = document.getElementsByClassName("enemy");

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

function explosion(enemy) {
    let explosion = document.createElement("div");
    explosion.classList.add("explosion");
    explosion.style.top = enemy.style.top;
    explosion.style.left = enemy.style.left;
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
    document.body.appendChild(enemy);
}

function enemiesMove() {
    allLightSips = document.getElementsByClassName("lightShip");    
    for (let i = 0; i < allLightSips.length; i++) {
        // remove enemies behind the screen and take damage
        if (parseInt(allLightSips[i].style.left) <= -40) {
            allLightSips[i].remove();
            hp-=1;
            refreshGameStatus();
        }

        allLightSips[i].style.left = parseInt(allLightSips[i].style.left) - 20 + "px";
    }
    console.log(document.getElementById("space").style.backgroundPosition);
    //document.getElementById("space").style.backgroundPosition = parseInt(document.getElementById("space").style.backgroundPosition) + 10 + "%";
}

let enemySpawnInterval = setInterval(() => {
    enemySpawner(enemies.lightShip);
    if (score == 50) {
        clearInterval(enemySpawnInterval);
        bossSpawn();
    };
}, getRandomArbitrary(1500, 4000));

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


let moveInterval = setInterval(() => enemiesMove(), 100);

function scoreCounter(count) {
    score+=count;
    scoreElem.innerHTML = score;
}

function getRandomArbitrary(min, max) { return Math.floor(Math.random() * (max - min) + min) }
