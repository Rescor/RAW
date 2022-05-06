const BUTTON_NEXT = document.getElementById("nextButton");
const TEXT_ELEMENT = document.getElementById("chapterText");
const IMAGE_ELEMENT = document.getElementById("chapterImage");

let currentChapter = 1;

const CHAPTER_ASSETS = {
    1: {
        imagePath: "assets/chapter1_01.jpg",
        text: "ENDING TEXT 1"
    },
    2: {
        imagePath: "assets/chapter1_02.jpg",
        text: "ENDING TEXT 2"
    },
    3: {
        imagePath: "assets/chapter1_03.jpg",
        text: "ENDING TEXT 3"
    },
}

BUTTON_NEXT.onclick = function() {
    if (currentChapter == 3) {
        document.location.href = "index.html"
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