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
    var categoryOption = selectCategories.options[selectCategories.selectedIndex];
    if(categoryOption == customCategories) {
        var categories = categoriesTextArea.value
    } else {
        var categories = categoryOption.value;
    }
    categories = categories.split(",")
        .map(function(x) {return x.replace(/\s+/g," ").trim().substring(0,30);})
        .filter(function(y) {return (y !== "")});
    var randomizedCategories = [];
    var categoryCounter = 0;
    var symbols = [];
    var symbolCounter = 0;
    var cardsNum = cardsNumSlider.value;

    if(categories.length == 0) {
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

function createCard(card) { //Not for wildcards
    let cardElement = cardTemplate.cloneNode(true);
    cardElement.children[0].textContent = card.category;
    cardElement.children[2].textContent = card.category;
    cardElement.children[1].src = "images/symbols/symbol" + (card.symbol) + ".svg";
    cardElement.id = "";
    return cardElement;
}

function setupElements() {
    playerDiv.textContent = "";
    for (let player of players) {
        let element = playerTemplate.cloneNode(true);
        element.children[0].textContent = player.name;
        element.children[1].textContent = player.points + " pts";
        element.children[2].addEventListener("click", function() {winFaceOff(player);});
        element.id = "";
        playerDiv.appendChild(element);

        player.element = element;
    }

    rankingDiv.style.display = "none";
    rankingDiv.classList.add("hidden");
    ranking.textContent = "";
    deckDiv.style.display = "flex";
    
    players[turn%players.length].element.classList.add("turn");

    setDimensions();

    cardsLeft.textContent = deck.length;
}

function setDimensions() {
    layout = rowLayout.checked;

    if(stylesheet != undefined) {
        document.body.removeChild(stylesheet);
    }

    if(layout) {
        cardWidth = document.getElementsByClassName("placeholderCard")[0].offsetWidth;
        cardHeight = document.getElementsByClassName("placeholderCard")[0].offsetHeight;
        deckImg.style.height = cardWidth + "px";

        stylesheet = document.createElement("style");
        stylesheet.textContent = "img.cardBack { width:"+cardWidth+"px; height:"+cardHeight+"px; }"
        stylesheet.textContent += "div.cardFront { width:"+cardWidth+"px; height:"+cardHeight+"px; }"
        stylesheet.textContent += "div.cardFront p { font-size:"+cardWidth/10+"px; }"
    
        document.body.appendChild(stylesheet);
    } else {
        let vh = document.documentElement.clientHeight/100;
        let vw = document.documentElement.clientWidth/100;

        cardWidth = Math.min((80*vh - 80)/(2*HWRatio + 1), (80*vw - 80)/(3*HWRatio));
        cardHeight = cardWidth * HWRatio;
        deckImg.style.height = cardWidth + "px";

        stylesheet = document.createElement("style");
        stylesheet.textContent = "img.cardBack { width:"+cardWidth+"px; height:"+cardHeight+"px; }";
        stylesheet.textContent = "img.placeholderCard { width:"+cardWidth+"px; height:"+cardHeight+"px; }";
        stylesheet.textContent += "div.cardFront { width:"+cardWidth+"px; height:"+cardHeight+"px; }";
        stylesheet.textContent += "div.cardFront p { font-size:"+cardWidth/10+"px; }";

        document.body.appendChild(stylesheet);

        for(let i = 0; i < players.length; i++) {
            let angle = i*2*Math.PI/players.length - (players.length%2==0 ? 0 : Math.PI/2);
            players[i].angle = angle;
            let radius = Math.sqrt(1 / (Math.pow(Math.cos(angle)/(50*vw-20),2) + Math.pow(Math.sin(angle)/(50*vh-20),2))) - players[i].element.offsetHeight/2;
            stylesheet.textContent += "div.player:nth-child("+(i+1)+") {" +
                "transform: rotate(" + (angle+3*Math.PI/2) + "rad);" +
                "left: " + (50*vw + radius*Math.cos(angle) - players[i].element.offsetWidth/2) + "px;" +
                "top: " + (50*vh + radius*Math.sin(angle) - players[i].element.offsetHeight/2) + "px;" +
            "}";
        }
    }
}

const HWRatio = 3.5/2.25;
const WHRatio = 1/HWRatio;

const playerDiv = document.getElementById("playerDiv");
const playerTemplate = document.getElementById("playerTemplate");
const cardTemplate = document.getElementById("cardTemplate");
const cardBackTemplate = document.getElementById("cardBackTemplate");
const deckDiv = document.getElementById("deckDiv");
const deckImg = document.getElementById("deck");
const cardsLeft = document.getElementById("cardsLeft");
const rankingDiv = document.getElementById("rankingDiv");
const ranking = document.getElementById("ranking");

var layout; //true if rowLayout
var cardWidth;
var cardHeight;
var stylesheet;

var deck;
var players;
var turn;
var faceOff = [];
var currentWildcard = false;

function play() {
    deck = createDeck();
    players = createPlayers();
    turn = 0;
    faceOff = [];
    if(currentWildcard) {
        game.removeChild(currentWildcard);
        currentWildcard = false;
    }

    setupElements();
    deckImg.removeEventListener("click",faceOffAlert);
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
                    wildcardValid = player.stack.slice(-1)[0].symbol;
                } else if(wildcardValid != player.stack.slice(-1)[0].symbol) {
                    wildcardValid = true;
                    break;
                }
            }
        }

        if(deck.length == 0) {
            wildcardValid = true;
        }

        if(wildcardValid === true) {
            wildcard = true;
            while(card.symbol1 == undefined) {
                try {
                    card.symbol1 = players[Math.floor(Math.random() * 4)].stack.slice(-1)[0].symbol;
                } catch {}
            }
            while(card.symbol2 == undefined || card.symbol1 == card.symbol2) {
                try {
                    card.symbol2 = players[Math.floor(Math.random() * 4)].stack.slice(-1)[0].symbol;
                } catch {}
            }
            cardElement = wildcardTemplate.cloneNode(true);
            cardElement.children[0].src = "images/symbols/symbol" + (card.symbol1) + ".svg";
            cardElement.children[2].src = "images/symbols/symbol" + (card.symbol2) + ".svg";
            cardElement.id = "";
            currentWildcard = cardElement;
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

    let targetX = wildcard ? Number(newCardBack.style.left.slice(0,-2)) : player.element.children[3].getBoundingClientRect().left;
    let targetY = wildcard ? Number(newCardBack.style.top.slice(0,-2)) : player.element.children[3].getBoundingClientRect().top;
    let targetA = layout ? 0 : (player.angle-Math.PI/2)*180/Math.PI;
    console.log(targetA);
    let midX = (targetX + Number(newCardBack.style.left.slice(0,-2))) / 2;
    let midY = (targetY + Number(newCardBack.style.top.slice(0,-2))) / 2;
    let midA = (targetA + 90) / 2

    cardElement.style.left = midX + "px";
    cardElement.style.top = midY + "px";
    cardElement.style.transform = "scale(1.25,1.25) rotate("+midA+"deg) rotateY(90deg)";

    let sheet = document.createElement("style");
    sheet.textContent = "img.cardBack.flip { transform:scale(1.5,1.5) rotate("+midA+"deg) rotateY(90deg); left:"+midX+"px; top:"+midY+"px; }"
    sheet.textContent += "div.dynamic.flip { transform: rotate("+targetA+"deg); left:"+targetX+"px; top:"+targetY+"px; }"
    document.body.appendChild(sheet);

    game.appendChild(newCardBack);

    
    setTimeout(function() {
        newCardBack.removeAttribute("style");
        newCardBack.classList.add("flip");

        if(deck.length == 0) {
            document.getElementById("deckDiv").classList.add("hidden");
        }

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
                        cardElement.classList.remove("dynamic");   
                    } else {
                        cardElement.style.left = cardElement.offsetLeft+"px";
                        cardElement.style.top = cardElement.offsetTop+"px";
                    }
                    cardElement.classList.remove("flip");

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
        if (currentWildcard) {
            currentWildcard.classList.add("slideDown");
            setTimeout(function() {
                game.removeChild(currentWildcard);
                currentWildcard = false;
            }, 250);
        }
        
        if (deck.length > 0) {
            deckImg.addEventListener("click", draw);
        } else {
            deckDiv.style.display = "none";
            deckDiv.classList.remove("hidden");

            for(let player of players.sort(function(a, b) {return b.points - a.points}).slice(0,3)) {
                let li = document.createElement("li");
                li.textContent = player.name + ": " + player.points + " pts"
                ranking.appendChild(li);
            }

            rankingDiv.classList.remove("hidden");
            rankingDiv.style.display = "flex";
        }
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
        if (currentWildcard) {
            currentWildcard.classList.add("slideDown");
        }
        player.points++;
        player.element.children[1].textContent = player.points + " pts";

        setTimeout(function() {
            faceOff[0].element.children[3].removeChild(faceOff[0].element.children[3].lastChild);
            if (currentWildcard) {
                game.removeChild(currentWildcard);
                currentWildcard = false;
            }

            deckImg.removeEventListener("click", faceOffAlert);

            if(faceOff[0].stack.length > 0) {
                startFaceOff(false, faceOff[0].stack.slice(-1)[0], faceOff[0]);
            } else {
                faceOff = [];
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