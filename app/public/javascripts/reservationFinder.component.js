class ReservationFinder extends HTMLElement {
    connectedCallback() {
        this.searchVehiclesButton = this.querySelector('#button-addon');
        this.initializeDateRangePicker();
       
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
                    this.fetchAvailableVehicles();
                }
            });
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

    setVehicleCarousel(vehicles) {
        let vehicleCarousel = document.querySelector('vehicle-carousel');
        if (vehicleCarousel) {
            vehicleCarousel.vehicles = vehicles;
        }
    }

    toString(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
}

customElements.define('reservation-finder', ReservationFinder);