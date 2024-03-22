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
                this.querySelector('#postal').value = params.get('postal');

                const start = new Date(params.get('start'));
                const end = new Date(params.get('end'));
                this.calendar.setDate([start, end]);
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

        let code = document.querySelector('#postal').value.replace(/\s+/g, '');
        if (!this.isValidPostal(code) && !this.isValidZip(code)) {
            toast.warn('Only valid zip and postal codes are accepted.');
            return;
        }

        const startURIComponent = encodeURIComponent(start.toISOString());
        const endURIComponent = encodeURIComponent(end.toISOString());
        const baseUrl = window.location.protocol + '//' + window.location.host;
        window.location.href = `${baseUrl}/vehicles?start=${startURIComponent}&end=${endURIComponent}&postal=${code}`;
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
