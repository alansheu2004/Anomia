const titleScreen = document.getElementById("titleScreen");
const instructions = document.getElementById("instructions");
const settings = document.getElementById("settings");
const game = document.getElementById("game");

const playerInputDiv = document.getElementById("playerInputDiv");
const addPlayerButton = document.getElementById("addPlayer");
const removePlayerButton = document.getElementById("removePlayer");
const playerInputTemplate = document.getElementById("playerInputTemplate");

const symbolsDiv = document.getElementById("symbolsDiv");
const symbolsPreview = document.getElementById("symbolsPreview");
const symbolPreviewTemplate = document.getElementById("symbolPreviewTemplate");

const selectCategories = document.getElementById("selectCategories");
const customCategories = document.getElementById("customCategories");
const categoriesTextArea = document.getElementById("customCategoriesField");

const cardsNumSlider = document.getElementById("cardsNum");
const cardsNumLabel = document.getElementById("cardsNumLabel");

const rowLayout = document.getElementById("rowLayout");
const circularLayout = document.getElementById("circularLayout");

function openSubscreen(div) {
    titleScreen.classList.add("fadeOut");
    setTimeout(function() {
        titleScreen.style.display = "none";
        titleScreen.classList.remove("fadeOut");

        div.classList.add("fadeIn");
        div.style.display = "flex";
        if (div == game) {
            play();
        }
        setTimeout(function() {
            div.classList.remove("fadeIn");
        }, 1000);
    }, 500);
}

function returnToTitle(div) {
    div.classList.add("fadeOut");
    setTimeout(function() {
        div.style.display = "none";
        div.classList.remove("fadeOut");

        titleScreen.classList.add("fadeIn");
        titleScreen.style.display = "flex";
        setTimeout(function() {
            titleScreen.classList.remove("fadeIn");
        }, 1000);
    }, 500);
}

function addPlayer() {
    var playerCount = playerInputDiv.children.length;

    if(playerCount < 6) {
        let player = playerInputTemplate.cloneNode(true);
        player.id = "";
        player.children[0].id = "player" + (playerCount+1);
        player.children[0].placeholder = "Player " + (playerCount+1);
        playerInputDiv.appendChild(player);
    }

    removePlayerButton.disabled = false;
    if(playerCount+1 >= 6) {
        addPlayerButton.disabled = true;
    }
}

function removePlayer() {
    var playerCount = playerInputDiv.children.length;

    if(playerCount > 2) {
        playerInputDiv.removeChild(playerInputDiv.lastChild);
    }

    addPlayerButton.disabled = false;
    if(playerCount-1 <= 2) {
        removePlayerButton.disabled = true;
    }
}

function changeSymbol(e) {
    var num = e.target.value;
    symbolsPreview.textContent = "";
    for(var i = 0; i < num; i++) {
        let symbol = symbolPreviewTemplate.cloneNode(true);
        symbol.id = "";
        symbol.src = "images/symbols/symbol" + (i+1) + ".svg";
        symbolsPreview.appendChild(symbol);
    }
}

function changeCategories() {
    if(selectCategories.options[selectCategories.selectedIndex] == customCategories) {
        categoriesTextArea.classList.add("expanded");
    } else {
        categoriesTextArea.classList.remove("expanded");
    }
}

function changeCardsNum(e) {
    cardsNumLabel.textContent = e.target.value;
}

window.onload = function() {
    for(var i = 0; i < 4; i++) {
        addPlayer();
    }

    for(let input of symbolsDiv.children) {
        input.addEventListener("change", changeSymbol);
        if(input.value == 5) {
            changeSymbol({target: input});
            input.checked = "checked";
        }
    }

    if(navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)) {

        document.getElementById("layoutText").textContent = "(Circular Layout recommended for mobile)";
        circularLayout.checked = "checked";
    } else {
        document.getElementById("layoutText").textContent = "(Row Layout recommended for desktop)";
        rowLayout.checked = "checked";
    }
}