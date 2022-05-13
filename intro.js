const BUTTON_NEXT = document.getElementById("nextButton");
const TEXT_ELEMENT = document.getElementById("chapterText");
const IMAGE_ELEMENT = document.getElementById("chapterImage");

let currentChapter = 1;

const CHAPTER_ASSETS = {
    1: {
        imagePath: "assets/chapter1_01.jpg",
        text: "Привет.<br><br>Сегодня я расскажу тебе историю, которая произошла с одним маленьким лисом и его другом пегасом.<br><br>"
    },
    2: {
        imagePath: "assets/chapter1_02.jpg",
        text: "В далёкой-далёкой галактике, на планете Ари Вулпес, что у звезды Солнышек, жили лисёнок Рав и его друг - пегас Некко.<br><br>Лисёнок и пегас были неразлучны. Они очень сильно любили друг друга и радовались каждому дню, проведённому вместе.<br><br>Но однажды всё изменилось.<br><br>"
    },
    3: {
        imagePath: "assets/chapter1_03.jpg",
        text: "Страшный монстр Сомгбёрд всегда завидовал дружбе лиса и пегаса. У Сомгбёрда не было друзей, потому что он их всех съел. После этого с ним никто больше не хотел дружить.<br><br>В какой-то момент зависть и злоба окончательно обуяли Сомгбёрда. Той же ночью он напал на планету Ари Вулпес и похитил пегаса.<br><br>"
    },
    4: {
        imagePath: "assets/chapter1_04.jpg",
        text: "К счастью, в это время лисёнок Рав не спал. В момент нападения он смотрел фильм, и увидел в окно, что происходит.<br><br>Лисёнок выбежал из дома и, не раздумывая, запрыгнул в свой корабль. В следующий миг взревел двигатель, и лис и бросился в погоню, спасать своего друга из лап страшного чудовища.<br><br>"
    },
}

BUTTON_NEXT.onclick = function() {
    if (currentChapter == 3) {
        BUTTON_NEXT.innerHTML = "Начать погоню!"
    }
    if (currentChapter == 4) {
        document.location.href = "game.html"
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