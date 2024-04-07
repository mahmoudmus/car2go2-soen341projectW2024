class SwipeGame extends HTMLElement {
    connectedCallback() {
        this.vehicles = [];
        this.likedVehicles = [];
        this.topVehicle = null;
        this.cardSpace = this.querySelector('#cardSpace');

        this.likeButton = this.querySelector('#likeButton');
        this.likeButton.addEventListener('click', () => {
            this.likedVehicles.push(this.topVehicle);
            this.displayTopCard();
        });

        this.discardButton = this.querySelector('#dislikeButton');
        this.discardButton.addEventListener('click', () => {
            this.displayTopCard();
        });

        this.startGame('/vehicles/json');
    }

    async startGame(url) {
        this.style.display = ''; // Removing display: none
        this.fetchCards(url).then(() => {
            this.displayTopCard();
        });
    }

    // @todo remove default value
    async fetchCards(url = '/vehicles/json') {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            this.vehicles = (await response.json()).vehicleList;
        } else {
            document
                .querySelector('#toast')
                .caution('Failed to fetch vehicles.');
        }
    }

    displayTopCard() {
        this.topVehicle = this.vehicles.pop();
        if (this.topVehicle) {
            const card = document.createElement('dating-card');
            card.setVehicle(this.topVehicle);
            this.cardSpace.replaceChildren(card);
        } else {
            this.cardSpace.replaceChildren();
            // @todo send these to azal's backend
            console.log(this.likedVehicles);
        }
    }
}
customElements.define('swipe-game', SwipeGame);
