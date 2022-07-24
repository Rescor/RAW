
if (!localStorage.getItem('achievements')) { localStorage.setItem('achievements', "{}") };
let receivedAchievements = JSON.parse(localStorage.getItem('achievements'));
let playerShips = [1];
let achievements = {
    finishedGame: {
        title: "Завершить игру",
        icon_locked_url: "",
        icon_unlocked_url: "",
        description: "Завершите сюжетную часть игры.",
        reward: 2,
        got: false,
    },
    test: {
        title: "Тестовое достижение",
        icon_locked_url: "",
        icon_unlocked_url: "",
        description: "=^___^=",
        reward: null,
        got: false,
    },
}

const E_ACHIEVEMENTS_LIST = document.getElementById('achievementsList');

function setAchievementsList() {
    for (key in achievements) {
        let achievement = achievements[key];
        
        
        if (receivedAchievements[key]) {
            console.log("Get", achievement.title)
        }
        else {
            console.log("Not get", key)
        }
       
            let achievementElement = document.createElement("div");
            let titleElement = document.createElement("p");
            let descriptionElement = document.createElement("p");
            achievementElement.classList.add("achievement");
            if (receivedAchievements[key]) {
                achievementElement.classList.add("completed");
                playerShips.push(achievements[key].reward)
            }

            titleElement.innerHTML = achievement.title;
            descriptionElement.innerHTML = achievement.description;
            E_ACHIEVEMENTS_LIST.appendChild(achievementElement);
            achievementElement.appendChild(titleElement);
            achievementElement.appendChild(descriptionElement)
        
    } 
}
setAchievementsList()
let chooseShipElem = document.getElementById("chooseShip");
function setShipsList() {
    for (ship of playerShips) {
        console.log(ship)
        let btn = document.createElement("button");
        btn.innerHTML = ship;
        btn.id = ship;
        chooseShipElem.appendChild(btn);
        let createdBtn = document.getElementById(btn.id);
        createdBtn.onclick = () => localStorage.setItem("ship", btn.id)
        //btn.onclick = ;
    };
        
}
setShipsList()
function setId(id) {
    localStorage.setItem("ship", id)
}