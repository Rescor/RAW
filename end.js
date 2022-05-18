const BUTTON_NEXT = document.getElementById("nextButton");
const TEXT_ELEMENT = document.getElementById("chapterText");
const IMAGE_ELEMENT = document.getElementById("chapterImage");

let currentChapter = 1;

const CHAPTER_ASSETS = {
    1: {
        imagePath: "assets/chapter2_01.jpg",
        text: '"Ты не съешь Некко, Сомгбёрд!", - закричал лис, - "Я спасу его из твоих страшных лап!".<br><br>Лисёнок выпустил последний залп по Сомгбёрду, после чего тот взорвался. Тирания чудовища пала.<br><br>'
    },
    2: {
        imagePath: "assets/chapter2_02.jpg",
        text: "Лисёнок быстро нажал несколько клавиш. В следующую секунду бортовой компьютер нашёл пегаса среди хаоса поля битвы, захватил его гравитационным лучом и притянул на борт корабля.<br><br>Лисёнок сразу же бросился к своему другу.<br><br>Некко не дышал.<br><br>"
    },
    3: {
        imagePath: "assets/chapter2_03.png",
        text: '"Нет-нет-нет, пожалуйста, только не умирай!", - заплакал лисёнок, прижимая пегаса к себе. "Ты не можешь умереть!"<br><br>Не в силах что-либо сделать, лисёнок издал вопль боли и отчаяния.<br><br>'
    },
    4: {
        imagePath: "assets/chapter2_04.jpg",
        text: "Вдруг всё пространство вокруг озарило яркое сияние, из которого вышла ослепительно красивая девушка с лисьими ушками. Это была богиня Ари. Она почувствовала боль лисёнка Рава и решила прийти на помощь.<br><br>Ари коснулась груди пегаса, и Некко начал резко и глубоко дышать. Ари улыбнулась, погладила лисёнка и исчезла так же внезапно, как и появилась.<br><br>"
    },
    5: {
        imagePath: "assets/chapter2_05.jpg",
        text: "Спустя несколько дней лисёнок Рав и пегас Некко лежали на траве под тёплыми лучами Солнышка и наслаждались друг другом. Страшные события постепенно стирались из памяти.<br><br>- Люблю тебя, няшик - сказал лисёнок и обнял пегаса.<br><br>- И я тебя люблю, пушистый - ответил пегас и укрыл лисёнка крылом.<br><br>"
    },
}

BUTTON_NEXT.onclick = function() {
    if (currentChapter == 4) {
        BUTTON_NEXT.innerHTML = "Конец."
    }
    if (currentChapter == 5) {
        document.location.href = "thanks.html";
        return;
    }
    currentChapter += 1;
    refreshGameScreen()
}

function refreshGameScreen() {
    TEXT_ELEMENT.innerHTML = CHAPTER_ASSETS[currentChapter].text;
    IMAGE_ELEMENT.src = CHAPTER_ASSETS[currentChapter].imagePath;
}

refreshGameScreen()