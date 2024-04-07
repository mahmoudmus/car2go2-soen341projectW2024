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
            this.branchLabel = data.branchLabel;
        } else {
            document
                .querySelector('#toast')
                .caution('Failed to fetch vehicles.');
        }
    }

    async displayTopCard() {
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
            const response = await this.getMatch();
            // display winner
            console.log(response);
        }
    }

    setDates(start, end) {
        this.start = start;
        this.end = end;
    }

    async getMatch() {
        const body = {
            vehicleArray: this.likedVehicles,
            branchName: this.branchLabel,
            startDate: this.start,
            endDate: this.end,
        };

        const response = await fetch('/vehicles/liked', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            // this.loadingOverlay.classList.remove('show');
            // this.cardSpace.replaceChildren(
            //     document.createElement('dating-match').setMatch(data)
            // );
        } else {
            document
                .querySelector('#toast')
                .caution('Failed to fetch a match.');
        }
    }
}
customElements.define('swipe-game', SwipeGame);
