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

var deck;

function play() {
    deck = createDeck();
}