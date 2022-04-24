let tank = document.getElementById("tank");
let weapon = document.getElementById("weapon");
let enemy = document.getElementById("enemy");
let score = 0;

let enemies = {
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
let allEnemies;

let positionVertical = parseInt(getComputedStyle(tank).top);
let positionHorizontal = parseInt(getComputedStyle(tank).left);

let scoreElem =  document.querySelector("#score");

document.onkeydown = function(e) {
    if (e.code === "ArrowUp") {
        tank.style.top = positionVertical - 20 + "px";
        positionVertical = parseInt(getComputedStyle(tank).top);
        console.log(positionVertical)
    }

    if (e.code === "ArrowDown") {
        tank.style.top = positionVertical + 20 + "px";
        positionVertical = parseInt(getComputedStyle(tank).top);
        console.log(positionVertical)
    }

    if (e.code === "ArrowLeft") {
        tank.style.left = positionHorizontal - 20 + "px";
        positionHorizontal = parseInt(getComputedStyle(tank).left);
        console.log(positionVertical)
    }

    if (e.code === "ArrowRight") {
        tank.style.left = positionHorizontal + 20 + "px";
        positionHorizontal = parseInt(getComputedStyle(tank).left);
        console.log(positionVertical)
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
    
    let thisInterval = setInterval( () => {
        
        
        bullet.style.left = positionHorizontal + 90 + count + "px";
        count += 3;
        for (let i = 0; i < allEnemies.length; i++) {
            if (parseInt(bullet.style.left) + 20 >= parseInt(getComputedStyle(allEnemies[i]).left)) {
                if (parseInt(bullet.style.top) >= parseInt(getComputedStyle(allEnemies[i]).top) && parseInt(bullet.style.top) <= parseInt(getComputedStyle(allEnemies[i]).top) + 40) {
                    bullet.remove();
                    allEnemies[i].remove();
                    scoreCounter(50);
                    clearInterval(thisInterval);
                }
            }
        }
        

        if (count == 3000) {
            clearInterval(thisInterval);
            bullet.remove()
        };
    }, 4);
    
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

function move(px) {
    tank.style.top = positionVertical + px + "px";
    positionVertical = parseInt(getComputedStyle(tank).top);
    console.log(positionVertical);
}

function enemiesMove() {
    allEnemies = document.getElementsByClassName("enemy");    
    for (let i = 0; i < allEnemies.length; i++) {
        allEnemies[i].style.left = parseInt(allEnemies[i].style.left) - 20 + "px";
    }
}



function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }


function scoreCounter(count) {
    score+=count;
    scoreElem.innerHTML = score;
}

let enemySpawnInterval = setInterval(() => {
    enemySpawner(enemies.lightShip);
    if (score == 150) {
        clearInterval(enemySpawnInterval);
        clearInterval(moveInterval);
        bossSpawn();
    };
}, getRandomArbitrary(500, 2000));

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



let moveInterval = setInterval(() => {
    enemiesMove();
}, 100);
