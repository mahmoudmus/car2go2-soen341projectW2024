class SwipeGame extends HTMLElement {
    connectedCallback() {
        this.vehicles = [];
        this.likedVehicles = [];
        this.topVehicle = null;
        this.cardSpace = this.querySelector('#cardSpace');
        this.loadingOverlay = this.querySelector('#loadingOverlay');

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
            const data = await response.json();
            // Slice to get only 10 vehicles (for now)
            this.vehicles = data.vehicleList.slice(0, 10);
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
            this.cardSpace.classList.remove('show');
            setTimeout(() => {
                this.cardSpace.classList.add('show');
                this.cardSpace.replaceChildren(card);
            }, 200);
        } else {
            this.loadingOverlay.classList.add('show');
            // @todo send these to azal's backend
            console.log(this.likedVehicles);
        }
    }
}
customElements.define('swipe-game', SwipeGame);
