class SwipeGame extends HTMLElement {
    connectedCallback() {
        this.cardSpace = this.querySelector('#cardSpace');
        // @ todo this.likedCards =
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
        // this.setupKeyControls();
        console.log('startGame() has been called.');
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
            card.setVehicle(vehicle);
            card.setAttribute('vehicle-id', vehicle._id);
            this.cardSpace.appendChild(card);
        } else {
            // Display score or end game message here
            console.log('No more cards');
        }
    }
}
customElements.define('swipe-game', SwipeGame);
