class ReservationFinder extends HTMLElement {
    connectedCallback() {
        // this.searchVehiclesButton = this.querySelector('#button-addon');
        this.postalInput = this.querySelector('.postal-group');
        this.searchButton = this.querySelector('#search-vehicles');
        this.initializeDateRangePicker();
        this.searchButton.addEventListener('click', () =>
            this.redirectToFilteredVehicles()
        );
    }

    async initializeDateRangePicker() {
        document.addEventListener('DOMContentLoaded', () => {
            this.calendar = flatpickr('#dateRangeFinder', {
                mode: 'range',
                showMonths: 2,
                minDate: new Date().toISOString().split('T')[0],
            });
            const updateCalendarMode = () => {
                if (window.matchMedia('(min-width: 768px)').matches) {
                    this.calendar.set('showMonths', 2);
                } else {
                    this.calendar.set('showMonths', 1);
                }
            };
            updateCalendarMode();
            window.addEventListener('resize', updateCalendarMode);
            this.calendar.config.onChange.push((selectedDates) => {
                if (selectedDates[0] && selectedDates[1]) {
                    this.showPostalInput();
                }
            });

            if (this.mode === 'catalogue') {
                const params = new URLSearchParams(window.location.search);

                const postalURIComponent = params.get('postal');
                if (postalURIComponent) {
                    this.querySelector('#postal').value =
                        decodeURIComponent(postalURIComponent);
                }

                const startURIComponent = params.get('start');
                const endURIComponent = params.get('end');
                if (startURIComponent && endURIComponent) {
                    const start = new Date(
                        decodeURIComponent(startURIComponent)
                    );
                    const end = new Date(decodeURIComponent(endURIComponent));
                    this.calendar.setDate([start, end]);
                }

                if (params.get('email')) {
                    this.email = decodeURIComponent(params.get('email'));
                }
            }
        });
    }

    async fetchAvailableVehicles() {
        const selectedDates = this.calendar.selectedDates;
        document.querySelector('reservation-form').dates = selectedDates;
        try {
            const start = selectedDates[0];
            const end = selectedDates[1];
            const startDate = start.toISOString();
            const endDate = end.toISOString();
            // Fetch available vehicles for the selected reservation period
            const response = await fetch(
                `/vehicles/available?start=${encodeURIComponent(
                    startDate
                )}&end=${encodeURIComponent(endDate)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const label = document.querySelector('#results-label');
                label.innerHTML = `Vehicles available between ${this.toString(
                    start
                )} and ${this.toString(end)}:`;
                const vehicles = (await response.json()).vehicles;
                this.setVehicleCarousel(vehicles);
            } else {
                document
                    .querySelector('#toast')
                    .caution('Failed to fetch available vehicles.');
            }
        } catch (error) {
            console.error('Error fetching available vehicles:', error);
        }
    }

    showPostalInput() {
        console.log(this.postalInput);
        this.postalInput.style.display = '';
    }

    redirectToFilteredVehicles() {
        const toast = document.querySelector('#toast');

        const start = this.calendar.selectedDates[0];
        const end = this.calendar.selectedDates[1];
        if (!start || !end) {
            toast.warn('Please select a start and end date.');
            return;
        }

        const startURIComponent = encodeURIComponent(start.toISOString());
        const endURIComponent = encodeURIComponent(end.toISOString());
        let code = encodeURIComponent(document.querySelector('#postal').value);

        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        params.set('start', startURIComponent);
        params.set('end', endURIComponent);
        params.set('postal', code);

        const walkin = document.querySelector('walkin-form');
        if (walkin) {
            url.search = params.toString();
            walkin.setVehiclePageUrl(url.toString());
            return;
        }

        if (this.email) {
            params.set('email', this.email);
        }
        url.search = params.toString();
        window.location.href = url.toString();
    }

    isValidPostal(postal) {
        const regex =
            /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
        return regex.test(postal);
    }

    isValidZip(zip) {
        const regex = /^\d{5}(-\d{4})?$/;
        return regex.test(zip);
    }

    toString(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    get mode() {
        return this.getAttribute('mode');
    }
}

customElements.define('reservation-finder', ReservationFinder);
