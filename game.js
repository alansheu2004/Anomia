function Card(symbol, category) {
    this.symbols = symbol;
    this.category = category;
}

function Wildcard(symbol, symbol) {

}

function createDeck() {
    var deck = [];
    var categories = categoriesTextArea.value.split(",").map(function(x) {return x.trim();});
    var randomizedCategories = [];
    var categoryCounter = 0;
    var symbols = [];
    var symbolCounter = 0;
    var cardsNum = cardsNumSlider.value;

    if(categories.length == 0) {
        categories
    }

    while(randomizedCategories.length <= cardsNum*0.85) {
        randomizedCategories.push.apply(randomizedCategories, shuffleArray(categories));
    }

    for(let radio of document.getElementsByName("symbols")) {
        if(radio.checked) {
            symbols = [...Array(Number(radio.value)).keys()].map(function(x) {return x+1;});
            break;
        }
    }

    for(let symbol of symbols) {
        deck.push(new Card(symbol, randomizedCategories[categoryCounter++]));
        deck.push(new Card(symbol, randomizedCategories[categoryCounter++]));
    } 

    while(deck.length <= cardsNum*0.85) {
        deck.push.apply(symbols[symbolCounter%symbols.length], randomizedCategories[categoryCounter++]);
        deck.push.apply(symbols[symbolCounter%symbols.length], randomizedCategories[categoryCounter++]);
    }

    return deck;
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