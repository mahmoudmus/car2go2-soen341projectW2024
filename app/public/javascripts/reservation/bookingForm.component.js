class BookingForm extends HTMLElement {
    connectedCallback() {
        this.setBackLink();
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
            if (this.editMode) {
                const dateObjects = [
                    new Date(this.reservation.startDate),
                    new Date(this.reservation.endDate),
                ];
                this.calendar.setDate(dateObjects);
                this.setUnavailabilities(dateObjects);
            } else {
                const params = new URLSearchParams(window.location.search);
                const start = new Date(decodeURIComponent(params.get('start')));
                const end = new Date(decodeURIComponent(params.get('end')));
                this.calendar.setDate([start, end]);
                this.setUnavailabilities();
            }
            this.calendar.config.onChange.push((selectedDates) => {
                this.updateBasePrice(selectedDates);
            });
            this.updateBasePrice(this.calendar.selectedDates);
        });
    }

    async setUnavailabilities(dateObjects = []) {
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
            let filteredUnavailabilities;
            if (dateObjects.length === 2) {
                const startObj = dateObjects[0];
                const endObj = dateObjects[1];
                filteredUnavailabilities = data.unavailabilities.filter(
                    (date) => {
                        const dateObj = new Date(date);
                        return dateObj < startObj || dateObj > endObj;
                    }
                );
            } else {
                filteredUnavailabilities = data.unavailabilities;
            }
            this.calendar.set('disable', filteredUnavailabilities);
        }
    }

    setBackLink() {
        if (this.editMode) {
            this.querySelector('#catalogue-link').href = '/myreservations';
        } else {
            const currentUrl = new URL(window.location.href);
            const params = new URLSearchParams(currentUrl.search);
            const link = `/vehicles?${params.toString()}`;
            this.querySelector('#catalogue-link').href = link;
        }
    }

    initializeBranchPicker() {
        this.branchPicker = this.querySelector('branch-picker');
        this.branchPicker.addEventListener('change', () => {
            this.branchPicker.select.style.border = '';
            this.querySelector('#drop-off-label').innerHTML =
                this.branchPicker.selectedBranch.name;
        });
        if (this.editMode) {
            window.addEventListener('load', () => {
                this.branchPicker.presetValue =
                    this.reservation.dropoffLocation;
                this.branchPicker.select.style.border = '';
            });
        }
    }

    initializeAccessories() {
        this.checkboxes = this.querySelectorAll('input[type="checkbox"]');
        for (const checkbox of this.checkboxes) {
            checkbox.addEventListener('input', (e) => {
                this.renderInvoiceAccessory(e.target);
            });
            this.renderInvoiceAccessory(checkbox);
        }
        if (this.editMode) {
            for (const accessory of this.reservation.accessories) {
                const checkbox = this.querySelector(
                    `input[value="${accessory}"]`
                );
                checkbox.checked = true;
                this.renderInvoiceAccessory(checkbox);
            }
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
                if (this.editMode) {
                    this.updateReservation();
                } else {
                    this.showConfirmationModal();
                }
            }
        });
        this.confirmModal = new bootstrap.Modal(
            document.getElementById('confirmationModal')
        );
        this.querySelector('#final-confirm-button').addEventListener(
            'click',
            () => this.createReservation()
        );
    }

    async updateReservation() {
        const response = await fetch(
            `/reservations/edit/${this.reservationId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate: this.calendar.selectedDates[0],
                    endDate: this.calendar.selectedDates[1],
                    dropoffLocation: this.branchPicker.value,
                    accessories: this.selectedCheckboxes.map(
                        (checkbox) => checkbox.value
                    ),
                    cost: parseFloat(
                        this.querySelector('#total').innerHTML,
                        10
                    ),
                }),
            }
        );
        if (response.ok) {
            window.location.href = `/myreservations`;
        } else {
            document
                .querySelector('#toast')
                .warn('Could not update reservation.');
        }
    }

    showConfirmationModal() {
        const selectedDates = this.calendar.selectedDates;
        if (selectedDates.length === 2) {
            const startDateStr = selectedDates[0].toLocaleDateString();
            const endDateStr = selectedDates[1].toLocaleDateString();
            document.getElementById(
                'confirm-dates'
            ).textContent = `${startDateStr} to ${endDateStr}`;
        }
        document.getElementById('confirm-dropoff-location').textContent =
            this.querySelector('#drop-off-label').textContent;

        const servicesList = document.getElementById('confirm-services');
        servicesList.innerHTML = '';
        this.selectedCheckboxes.forEach((checkbox) => {
            const serviceItem = document.createElement('li');
            serviceItem.textContent =
                checkbox.nextElementSibling.textContent.trim();
            servicesList.appendChild(serviceItem);
        });
        document.getElementById('confirm-total-price').textContent = this.price;
        this.confirmModal.show();
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
        const accessories = this.selectedCheckboxes.map(
            (checkbox) => checkbox.value
        );
        const reservationData = {
            startDate: this.calendar.selectedDates[0],
            endDate: this.calendar.selectedDates[1],
            vehicleId: this.vehicleId,
            dropoffLocation: this.branchPicker.value,
            accessories,
            cost: parseFloat(this.querySelector('#total').innerHTML, 10),
            email: this.userEmail,
        };
        const response = await fetch('/reservations/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        });
        if (response.ok) {
            const data = await response.json();
            if (data.billingInformation) {
                window.location.href = `/?success=${data.reservation._id}`;
            } else {
                window.location.href = `/reservations/payment?success=${data.reservation._id}`;
            }
        } else {
            const message = (await response.json()).message;
            document.querySelector('#toast').caution(message);
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

    get userEmail() {
        const emailField = this.querySelector('#email');
        if (emailField) {
            return emailField.value;
        }
        return null;
    }

    get reservationId() {
        return this.getAttribute('reservation-id');
    }

    get editMode() {
        return Boolean(this.reservationId);
    }
}
customElements.define('booking-form', BookingForm);
