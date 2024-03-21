class BookingForm extends HTMLElement {
    connectedCallback() {
        this.setCatalogueLink();
        this.initializeBranchPicker();
        this.initializeAccessories();
        this.initializeDateRangePicker();
        this.initializeContinueButton();
    }

    async initializeDateRangePicker() {
        document.addEventListener('DOMContentLoaded', () => {
            this.calendar = flatpickr('#flatpickr', {
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
            const params = new URLSearchParams(window.location.search);
            const start = new Date(params.get('start'));
            const end = new Date(params.get('end'));
            this.calendar.setDate([start, end]);
            this.setUnavailabilities();
            this.calendar.config.onChange.push((selectedDates) => {
                this.updateBasePrice(selectedDates);
            });
            this.updateBasePrice(this.calendar.selectedDates);
        });
    }

    async setUnavailabilities() {
        const response = await fetch(
            `/vehicles/${this.vehicleId}/unavailabilities`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!response.ok) {
            document
                .querySelector('#toast')
                .warn('Could not get vehicle unavailabilities.');
        } else {
            const data = await response.json();
            this.calendar.set('disable', data.unavailabilities);
        }
    }

    setCatalogueLink() {
        const currentUrl = new URL(window.location.href);
        const params = new URLSearchParams(currentUrl.search);
        const link = `/vehicles?${params.toString()}`;
        this.querySelector('#catalogue-link').href = link;
    }

    initializeBranchPicker() {
        this.branchPicker = this.querySelector('branch-picker');
        this.branchPicker.addEventListener('change', () => {
            this.branchPicker.select.style.border = '';
            this.querySelector('#drop-off-label').innerHTML =
                this.branchPicker.selectedBranch.name;
        });
    }

    initializeAccessories() {
        this.checkboxes = this.querySelectorAll('input[type="checkbox"]');
        for (const checkbox of this.checkboxes) {
            checkbox.addEventListener('input', (e) => {
                this.renderInvoiceAccessory(e.target);
            });
            this.renderInvoiceAccessory(checkbox);
        }
    }

    initializeContinueButton() {
        this.continueButton = this.querySelector('#continue');
        this.continueButton.addEventListener('click', () => {
            if (!this.branchPicker.value) {
                this.branchPicker.select.style.border = '1px solid red';
                document
                    .querySelector('#toast')
                    .warn('Please select a dropoff location.');
            } else {
                // @todo
                // set the confirmModal details, see createReservation() for an example of how res details are extracted
                // this.confirmModal.show();
                this.createReservation(); // @delete
            }
        });
        // @todo
        // this.confirmModal = new bootstrap.Modal(this.querySelector(''));
        // this.querySelector('').addEventListener('click', this.createReservation); // for the confirm button
    }

    renderInvoiceAccessory(checkbox) {
        const label = this.querySelector(`div[for="${checkbox.id}"]`);
        if (checkbox.checked) {
            label.style.display = '';
        } else {
            label.style.display = 'none';
        }
        this.calculateTotal();
    }

    updateBasePrice(selectedDates) {
        const daysLabel = this.querySelector('#n-days');
        if (selectedDates.length === 2) {
            const start = selectedDates[0];
            const end = selectedDates[1];
            const days = (end - start) / (1000 * 60 * 60 * 24);

            daysLabel.parentElement.style.color = '';
            daysLabel.innerHTML = days;

            const basePrice = days * this.vehiclePrice;
            this.querySelector('#basePrice').innerHTML = basePrice;
        } else {
            daysLabel.parentElement.style.color = 'Red';
        }
        this.calculateTotal();
    }

    calculateTotal() {
        let price = parseFloat(this.querySelector('#basePrice').innerHTML, 10);
        for (const checkbox of this.checkboxes) {
            if (checkbox.checked) {
                price += parseFloat(checkbox.getAttribute('price'), 10);
            }
        }
        price *= 1.14975; // Quebec & Canadian Tax
        if (isNaN(price)) {
            price = '...';
        } else {
            price = price.toFixed(2);
        }
        this.querySelector('#total').innerHTML = price;
        this.price = price;
    }

    async createReservation() {
        const dropoffLocation = this.branchPicker.value;
        const accessories = this.selectedCheckboxes.map(
            (checkbox) => checkbox.value
        );
        const reservationData = {
            startDate: this.calendar.selectedDates[0],
            endDate: this.calendar.selectedDates[1],
            vehicleId: this.vehicleId,
            dropoffLocation,
            accessories,
            cost: parseFloat(this.querySelector('#total').innerHTML, 10),
        };
        console.log(reservationData);
        const response = await fetch('/reservations/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        });
        if (response.ok) {
            if ((await response.json()).billingInformation) {
                // @todo use query param to trigger success / thank you modal on home page
                // make api call to send confirmation email
                window.location.href = '/';
            } else {
                // window.location.href = '/'; @todo redirect to payment form to collect payment details
                // payment form confirmation will make api call to send confirmation email
            }
        } else {
            document
                .querySelector('#toast')
                .caution('Error creating reservation.');
        }
    }

    get selectedCheckboxes() {
        let selectedCheckboxes = [];
        for (const checkbox of this.checkboxes) {
            if (checkbox.checked) {
                selectedCheckboxes.push(checkbox);
            }
        }
        return selectedCheckboxes;
    }

    get vehicleId() {
        return this.getAttribute('vehicle-id');
    }

    get vehiclePrice() {
        return this.getAttribute('vehicle-price');
    }
}
customElements.define('booking-form', BookingForm);
