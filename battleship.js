var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}


var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        { locations: ['0', '0', '0'], hits: ['', '', ''] },
        { locations: ['0', '0', '0'], hits: ['', '', ''] },
        { locations: ['0', '0', '0'], hits: ['', '', ''] }
    ],
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!!')
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed!! :V')
        return false;
    },

    isSunk: function (ship) {
        for (let index = 0; index < this.shipLength; index++) {
            if (ship.hits[index] !== 'hit') {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
        var locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(location));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function () {
        var direction = Math.floor(Math.random() * 2); // generate a number between 0 at 1
        var row;
        var col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (let index = 0; index < this.shipLength; index++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + index));
            } else {
                newShipLocations.push((row + index) + '' + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations){
        for (let index = 0; index < this.numShips; index++) {
           var ship = model.ships[index];
            for (let j = 0; j < locations.length ; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0){
                    return true; // Exists collision
                }
            }
        }
        return false;
    }

}

var controller = {
    guesses: 0,
    processGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(`You sank all my battleships, in ${this.guesses} guesses`)
            }
        }
    }

}
function parseGuess(guess) {
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        alert('Oops, please enter a letter and a number on the board')
    } else {
        var firstChar = guess.charAt(0).toUpperCase();
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert('Oops, that isn`t on the board');
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert('Oops, that`s off the board');
        } else {
            return row + column;
        }
    }
    return null;
}

function init() {
    var fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButon;
    var guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}
function handleFireButon() {
    var guessInput = document.getElementById('guessInput');
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = '';

}

function handleKeyPress(e) {
    var fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

