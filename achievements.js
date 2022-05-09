
if (!localStorage.getItem('achievements')) { localStorage.setItem('achievements', "{}") };
let receivedAchievements = JSON.parse(localStorage.getItem('achievements'));

let achievements = {
    finishedGame: {
        title: "Завершить игру",
        icon_locked_url: "",
        icon_unlocked_url: "",
        description: "Завершите сюжетную часть игры.",
        reward: null,
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
            }

            titleElement.innerHTML = achievement.title;
            descriptionElement.innerHTML = achievement.description;
            E_ACHIEVEMENTS_LIST.appendChild(achievementElement);
            achievementElement.appendChild(titleElement);
            achievementElement.appendChild(descriptionElement)
        
    } 
}
setAchievementsList()