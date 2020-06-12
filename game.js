function Card(symbol, category) {
    this.symbol = symbol;
    this.category = category;
}

function Wildcard(symbol, symbol) {

}

function createDeck() {
    var deck = [];
    var categories = categoriesTextArea.value.split(",").map(function(x) {return x.replace(/\s+/g," ").trim();});
    var randomizedCategories = [];
    var categoryCounter = 0;
    var symbols = [];
    var symbolCounter = 0;
    var cardsNum = cardsNumSlider.value;

    if(categories.length == 1 && categories[0] == "") {
        categories = ["A", "B", "C", "D", "E"];
    }

    while(randomizedCategories.length < cardsNum) {
        randomizedCategories.push.apply(randomizedCategories, shuffleArray(categories));
    }

    for(let radio of document.getElementsByName("symbols")) {
        if(radio.checked) {
            symbols = [...Array(Number(radio.value)).keys()].map(function(x) {return x+1;});
            break;
        }
    }

    while(deck.length <= cardsNum*0.85) {
        deck.push(new Card(symbols[symbolCounter%symbols.length], randomizedCategories[categoryCounter++]));
        symbolCounter++;
    }

    while(deck.length < cardsNum) {
        deck.push(new Wildcard());
    }

    return shuffleArray(deck);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function Player(name) {
    this.name = name;
    this.points = 0;
    this.stack = [];
}

function createPlayers() {
    let array = [];
    for(let player of playerInputDiv.children) {
        let name = player.children[0].value.replace(/\s+/g," ").trim()
        array.push(new Player(name == "" ? player.children[0].placeholder : name));
    }
    return array;
}

function setupElements() {
    layout = rowLayout.checked;
    if(layout) {
        for (let player of players) {
            let element = playerTemplate.cloneNode(true);
            element.children[0].textContent = player.name;
            element.children[1].textContent = player.points + " pts";
            element.id = "";
            playerDiv.appendChild(element);

            player.element = element;
        }
        
        players[turn%players.length].element.classList.add("turn");
        cardWidth = document.getElementsByClassName("placeholderCard")[0].offsetWidth;
        cardHeight = document.getElementsByClassName("placeholderCard")[0].offsetHeight;

        deckImg.style.height = cardWidth + "px";
        let sheet = document.createElement("style");
        sheet.textContent = "img.cardBack { width:"+cardWidth+"px; height:"+cardHeight+"px; }"
        sheet.textContent += "div.faceUpCard { width:"+cardWidth+"px; height:"+cardHeight+"px; }"
        document.body.appendChild(sheet);

        cardsLeft.textContent = deck.length;
    }
}

function CreateCard() {

}

const HWRatio = 3.5/2.25;
const WHRatio = 1/HWRatio;

const playerDiv = document.getElementById("playerDiv");
const playerTemplate = document.getElementById("playerTemplate");
const cardTemplate = document.getElementById("cardTemplate");
const cardBackTemplate = document.getElementById("cardBackTemplate")
const deckImg = document.getElementById("deck");
const cardsLeft = document.getElementById("cardsLeft");

var layout;
var cardWidth;
var cardHeight;

var deck;
var players;
var turn;

function play() {
    deck = createDeck();
    players = createPlayers();
    turn = 0;

    setupElements();
    deckImg.addEventListener("click", draw);
}

function draw() {
    deckImg.removeEventListener("click", draw);

    let player = players[turn%players.length];
    let card = deck.pop();
    let cardElement = cardTemplate.cloneNode(true);

    cardElement.children[0].textContent = card.category;
    cardElement.children[2].textContent = card.category;
    cardElement.id = "";
    cardElement.classList.add("cardFront");
    cardElement.children[1].src = "images/symbols/symbol" + (card.symbol+1) + ".svg";

    cardsLeft.textContent = deck.length;

    let newCardBack = cardBackTemplate.cloneNode(true);
    newCardBack.style.left = (deckImg.offsetLeft + cardHeight/2 - cardWidth/2) + "px";
    newCardBack.style.top = (deckImg.offsetTop + cardWidth/2 - cardHeight/2) + "px";
    newCardBack.style.transform = "rotate(90deg)";
    newCardBack.id = "";

    let targetX = player.element.children[2].offsetLeft;
    let targetY = player.element.children[2].offsetTop;
    let midX = (targetX + Number(newCardBack.style.left.slice(0,-2))) / 2;
    let midY = (targetY + Number(newCardBack.style.top.slice(0,-2))) / 2;

    cardElement.style.left = midX + "px";
    cardElement.style.top = midY + "px";
    cardElement.style.transform = "rotate(45deg) rotateY(90deg)";

    let sheet = document.createElement("style");
    sheet.textContent = "img.cardBack.flip { transform:rotate(45deg) rotateY(90deg); left:"+midX+"px; top:"+midY+"px; }"
    sheet.textContent += "div.cardFront.flip { transform:none; left:"+targetX+"px; top:"+targetY+"px; }"
    document.body.appendChild(sheet);

    game.appendChild(newCardBack);

    
    setTimeout(function() {
        newCardBack.removeAttribute("style");
        newCardBack.classList.add("flip");

        setTimeout(function() {
            game.removeChild(newCardBack);
            game.appendChild(cardElement);

            setTimeout(function() {
                cardElement.removeAttribute("style");
                cardElement.classList.add("flip");

                setTimeout(function() {
                    game.removeChild(cardElement);
                    player.element.children[2].appendChild(cardElement);
                    cardElement.classList.remove("flip");

                    document.body.removeChild(sheet);

                    player.element.classList.remove("turn");
                    player = players[(turn++)%players.length];
                    player.element.classList.add("turn");

                    deckImg.addEventListener("click", draw);
                }, 300);
            }, 50);
        }, 300);
    }, 50);
    
}