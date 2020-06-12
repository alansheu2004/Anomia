function Card(symbol, category) {
    this.symbol = symbol;
    this.category = category;
    this.type = "card";
}

function Wildcard() {
    this.type = "wildcard";
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

    while(deck.length <= cardsNum*1) {
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

function createCard(card) { //Not for wildcards
    let cardElement = cardTemplate.cloneNode(true);
    cardElement.children[0].textContent = card.category;
    cardElement.children[2].textContent = card.category;
    cardElement.children[1].src = "images/symbols/symbol" + (card.symbol) + ".svg";
    cardElement.id = "";
    return cardElement;
}

function setupElements() {
    layout = rowLayout.checked;
    if(layout) {
        for (let player of players) {
            let element = playerTemplate.cloneNode(true);
            element.children[0].textContent = player.name;
            element.children[1].textContent = player.points + " pts";
            element.children[2].addEventListener("click", function() {winFaceOff(player);});
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
        sheet.textContent += "div.cardFront { width:"+cardWidth+"px; height:"+cardHeight+"px; }"
        document.body.appendChild(sheet);

        cardsLeft.textContent = deck.length;
    }
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
var faceOff = [];

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
    let cardElement;
    let wildcard = false;

    if(card.type == "wildcard") {
        let wildcardValid; 
        for(let player of players) {
            if(player.stack.length > 0) {
                if(wildcardValid == undefined) {
                    wildcardValid = player.stack.slice(-1)[0];
                } else if(wildcardValid != player.stack.slice(-1)[0]) {
                    wildcardValid = true;
                    break;
                }
            }
        }

        if(wildcardValid === true) {
            wildcard = true;
            try {
                card.symbol1 = players[Math.floor(Math.random() * 4)].stack.slice(-1)[0].symbol;
            } catch {}
            while(card.symbol2 == undefined || card.symbol1 == card.symbol2) {
                try {
                    card.symbol2 = players[Math.floor(Math.random() * 4)].stack.slice(-1)[0].symbol;
                } catch {}
            }
            cardElement = wildcardTemplate.cloneNode(true);
            cardElement.children[0].src = "images/symbols/symbol" + (card.symbol1) + ".svg";;
            cardElement.children[2].src = "images/symbols/symbol" + (card.symbol2) + ".svg";;
        } else {
            deck.splice(0, 0, card);
            draw();
            return;
        }
    } else {
        cardElement = createCard(card);
    }

    cardElement.classList.add("dynamic");

    cardsLeft.textContent = deck.length;

    let newCardBack = cardBackTemplate.cloneNode(true);
    newCardBack.style.left = (deckImg.offsetLeft + cardHeight/2 - cardWidth/2) + "px";
    newCardBack.style.top = (deckImg.offsetTop + cardWidth/2 - cardHeight/2) + "px";
    newCardBack.style.transform = "rotate(90deg)";
    newCardBack.id = "";

    let targetX = wildcard ? Number(newCardBack.style.left.slice(0,-2)) : player.element.children[3].offsetLeft;
    let targetY = wildcard ? Number(newCardBack.style.top.slice(0,-2)) : player.element.children[3].offsetTop;
    let midX = (targetX + Number(newCardBack.style.left.slice(0,-2))) / 2;
    let midY = (targetY + Number(newCardBack.style.top.slice(0,-2))) / 2;

    cardElement.style.left = midX + "px";
    cardElement.style.top = midY + "px";
    cardElement.style.transform = "rotate(45deg) rotateY(90deg)";

    let sheet = document.createElement("style");
    sheet.textContent = "img.cardBack.flip { transform:rotate(45deg) rotateY(90deg); left:"+midX+"px; top:"+midY+"px; }"
    sheet.textContent += "div.dynamic.flip { transform:none; left:"+targetX+"px; top:"+targetY+"px; }"
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
                    if(!wildcard) {
                        game.removeChild(cardElement);
                        if(player.element.children[3].children.length > 1) {
                            player.element.children[3].removeChild(player.element.children[3].children[1]);
                        }
                        player.element.children[3].appendChild(cardElement);
                        player.stack.push(card);
                    }
                    cardElement.classList.remove("flip");
                    cardElement.classList.remove("dynamic");

                    document.body.removeChild(sheet);

                    startFaceOff(wildcard, card, player);

                    player.element.classList.remove("turn");
                    player = players[(++turn)%players.length];
                    player.element.classList.add("turn");
                }, 300);
            }, 50);
        }, 300);
    }, 50);
}

function startFaceOff(wildcard, card, initiator) {
    faceOff = [];
    if(wildcard) {
        let player1;
        for(let player of players) {
            if(player.stack.length > 0 && player.stack.slice(-1)[0].symbol == card.symbol1) {
                player1 = player;
                break;
            }
        }
        if(player1 != undefined) {
            for(let player of players) {
                if(player.stack.length > 0 && player.stack.slice(-1)[0].symbol == card.symbol2) {
                    faceOff = [player1, player];
                }
            }
        }
    } else {
        for(let player of players) {
            if(player != initiator && player.stack.length > 0 && player.stack.slice(-1)[0].symbol == card.symbol) {
                faceOff = [initiator, player];
            }
        }
    }

    if(faceOff.length == 0) {
        deckImg.addEventListener("click", draw);
    } else {
        deckImg.addEventListener("click", faceOffAlert);
    }
}

function winFaceOff(player) {
    if(faceOff.includes(player)) {
        faceOff.splice(faceOff.indexOf(player), 1);
        faceOff[0].stack.pop();
        if (faceOff[0].stack.length > 0) {
            faceOff[0].element.children[3].insertBefore(createCard(faceOff[0].stack.slice(-1)[0]), faceOff[0].element.children[3].lastChild);
        }
        faceOff[0].element.children[3].lastChild.classList.add("slideUp");

        setTimeout(function() {
            faceOff[0].element.children[3].removeChild(faceOff[0].element.children[3].lastChild);
            player.points++;
            player.element.children[1].textContent = player.points + " pts";

            deckImg.removeEventListener("click", faceOffAlert);

            if(faceOff[0].stack.length > 0) {
                startFaceOff(false, faceOff[0].stack.slice(-1)[0], faceOff[0]);
            } else {
                deckImg.addEventListener("click", draw);
            }
        }, 250);
    } else {
        alert(player.name + " is not in a face-off!");
    }
}

function faceOffAlert() {
    alert("You can't draw a card. There's currently a face-off!");
}