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
        });
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
}

customElements.define('reservation-finder', ReservationFinder);
