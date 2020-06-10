const titleScreen = document.getElementById("titleScreen");
const settings = document.getElementById("settings");

const playersDiv = document.getElementById("playersDiv");
const addPlayerButton = document.getElementById("addPlayer");
const removePlayerButton = document.getElementById("removePlayer");
const playerTemplate = document.getElementById("playerTemplate");

const symbolsDiv = document.getElementById("symbolsDiv");
const symbolsPreview = document.getElementById("symbolsPreview");
const symbolPreviewTemplate = document.getElementById("symbolPreviewTemplate");

function openSettings() {
    titleScreen.classList.add("fadeOut");
    setTimeout(function() {
        titleScreen.style.display = "none";
        settings.style.display = "flex";
        //settings.classList.add("fadeIn");
    }, 500)
}

function addPlayer() {
    var playerCount = playersDiv.children.length;

    if(playerCount < 6) {
        let player = playerTemplate.cloneNode(true);
        player.id = "";
        player.children[0].id = "player" + (playerCount+1);
        player.children[0].placeholder = "Player " + (playerCount+1);
        playersDiv.appendChild(player);
    }

    removePlayerButton.disabled = false;
    if(playerCount+1 >= 6) {
        addPlayerButton.disabled = true;
    }
}

function removePlayer() {
    var playerCount = playersDiv.children.length;

    if(playerCount > 2) {
        playersDiv.removeChild(playersDiv.lastChild);
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
}