class SwipeGame extends HTMLElement {
    connectedCallback() {
        this.vehicles = [];
        this.likedVehicles = [];
        this.topVehicle = null;
        this.cardSpace = this.querySelector('#cardSpace');
        this.buttonsContainer = this.querySelector('#buttonsContainer');
        this.loadingOverlay = this.querySelector('#loadingOverlay');
        this.bookMatchedCar = this.querySelector('#bookMatchedCar');

        this.likeButton = this.querySelector('#likeButton');
        this.likeButton.addEventListener('click', () => {
            if (this.topVehicle) {
                this.likedVehicles.push(this.topVehicle);
            }
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

    displayTopCard() {
        this.topVehicle = this.vehicles.pop();
        if (this.topVehicle) {
            const card = document.createElement('dating-card');
            card.setVehicle(this.topVehicle);
            this.cardSpace.classList.remove('show');
            setTimeout(() => {
                this.cardSpace.classList.add('show');
                this.buttonsContainer.classList.add('show');
                this.cardSpace.replaceChildren(card);
            }, 200);
        } else {
            this.likeButton.setAttribute('disabled', 'true');
            this.discardButton.setAttribute('disabled', 'true');
            this.loadingOverlay.classList.add('show');
            this.getMatch();
        }
    }

    setDates(start, end) {
        this.start = start;
        this.end = end;
    }

    async getMatch() {
        console.log('running getMatch()');
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
            let match = (await response.json()).matchedVehicle;
            console.log(data);
            if (!match) {
                match = {
                    details: {
                        make: 'Volkswagen',
                        model: '(Failed to fetch a match)',
                        year: 2013,
                        colour: 'grey',
                        seats: 7,
                        doors: 3,
                        mileage: 374284,
                        isAutomatic: true,
                        engineType: 'gas',
                    },
                    _id: '65ff9b41d313082f48371c08',
                    category: 'full-size',
                    type: 'suv',
                    imageUrl:
                        'https://www.motortrend.com/uploads/2022/08/2022-Bugatti-Chiron-Super-Sport-2-1.jpg',
                    dailyPrice: 5,
                };
            }
            const card = document.createElement('dating-card');
            card.setMatch(match);
            this.cardSpace.classList.remove('show');
            this.loadingOverlay.classList.remove('show');
            this.buttonsContainer.classList.add('d-none');
            setTimeout(() => {
                this.cardSpace.classList.add('show');
                this.initalizeBookMatchedCar(match._id);
                this.cardSpace.replaceChildren(card);
                const jsConfetti = new JSConfetti();
                jsConfetti.addConfetti();
            }, 200);
        } else {
            document
                .querySelector('#toast')
                .caution('Failed to fetch a match.');
        }
    }

    async initalizeBookMatchedCar(vehicleId) {
        const startURI = encodeURIComponent(this.start);
        const endURI = encodeURIComponent(this.end);
        this.bookMatchedCar.href = `vehicles/booking/${vehicleId}?start=${startURI}&end=${endURI}`;
        this.bookMatchedCar.classList.add('show');
    }
}
customElements.define('swipe-game', SwipeGame);
