class SwipeGame extends HTMLElement {
    connectedCallback() {
        this.cardSpace = this.querySelector('#cardSpace');
        this.startGame('/vehicles/json');
    }

    async startGame(url) {
        this.fetchCards().then(() => {
            this.displayTopCard();
        });
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.removedNodes.length > 0) {
                    this.displayTopCard();
                }
            }
        });
        observer.observe(this, { childList: true });
        this.setupKeyControls();
        console.log('startGame() has been called.');
        // @todo
    }

    async fetchCards() {
        const response = await fetch(`/vehicles/json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            this.cards = (await response.json()).vehicleList;
            console.log(this.cards);
        } else {
            alert('Failed to fetch vehicles.');
        }
    }

    displayTopCard() {
        const vehicle = this.cards.shift();
        if (vehicle) {
            const card = document.createElement('dating-card');
            card.setAttribute('vehicle-id', vehicle._id);
            card.innerHTML = `
                <div class="card mb-3" style="width: 42rem;">
                    <img src="${vehicle.imageUrl}" alt="Car Image" style="width: 30rem;" />
                    <div class="card-body">
                        <h4 class="card-title">${vehicle.details.model}</h4>
                        <p class="card-text">I'm a ${vehicle.details.colour}, ${vehicle.type} ${vehicle.category} built by ${vehicle.details.make} in ${vehicle.details.year}.</p>
                        <div class="row">
                            <div class="col-md-4">
                                <ul>
                                    <li><b>Price: </b>${vehicle.dailyPrice}$/day</li>
                                    <li><b>Mileage: </b> ${vehicle.details.mileage} km</li>
                                </ul>
                            </div>
                            <div class="col-md-4">
                                <ul>
                                  <li><b>Number of Seats: </b>${vehicle.details.seats}</li>
                                  <li><b>Number of Doors: </b>${vehicle.details.doors}</li>
                                </ul>
                            </div>
                            <div class="col-md-4">
                                <ul>
                                    <li><b>Is Automatic? </b>${vehicle.details.isAutomatic}</li>
                                    <li><b>Engine Type: </b> ${vehicle.details.engineType}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>`;
            this.cardSpace.appendChild(card);
        } else {
            // Display score or end game message here
            console.log('No more cards');
        }
    }

    setupKeyControls() {
        document.addEventListener('keydown', (e) => {
            // Implement key controls if needed
            // For example, you could use arrow keys to "like" or "dislike"
        });
    }
}
customElements.define('swipe-game', SwipeGame);
