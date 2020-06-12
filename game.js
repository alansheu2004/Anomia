function Card(symbol, category) {
    this.symbols = symbol;
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
        deckImg.style.width = cardWidth + "px";
        document.getElementById("cardsLeft").textContent = deck.length;
    }
}

function CreateCard() {

}

const HWRatio = 3.5/2.25;
const WHRatio = 1/HWRatio;

const playerDiv = document.getElementById("playerDiv");
const playerTemplate = document.getElementById("playerTemplate");
const deckImg = document.getElementById("deck");

var layout;
var cardWidth;

var deck;
var players;
var turn;

function play() {
    deck = createDeck();
    players = createPlayers();
    turn = 0;

    setupElements();
    deckImg
}