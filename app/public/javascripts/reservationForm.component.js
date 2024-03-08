class ReservationForm extends HTMLElement {
    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
        this.form = this.querySelector('form');
        this.initializeDateRangePicker();
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(this.form);
            const requestBody = {
                startDate: this.calendar.selectedDates[0],
                endDate: this.calendar.selectedDates[1],
                email: formData.get('email'),
                vehicleId: formData.get('vehicleId'),
            };
            let response = await fetch(this.requestUrl(), {
                method: this.requestMethod(),
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            let data;
            if (!response.ok) {
                let message = (await response.json()).message;
                if (!message) {
                    message = 'Server error.';
                }
                document.querySelector('#toast').caution(message);
                return;
            } else if (this.mode === 'creating') {
                data = await response.text();
            } else {
                data = await response.json();
            }
            if (this.mode === 'creating') {
                this.successfulCreation(data);
            } else {
                this.successfulUpdate(data);
            }
        });
        this.mode = 'creating';
    }

    async initializeDateRangePicker() {
        document.addEventListener('DOMContentLoaded', () => {
            this.calendar = flatpickr('#dateRange', {
                mode: 'range',
                showMonths: 2,
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
            this.calendar.config.onChange.push(() =>
                this.fetchAvailableVehicles()
            );
        });
    }

    requestMethod() {
        switch (this.mode) {
            case 'creating':
                return 'POST';
            case 'updating':
                return 'PUT';
            default:
                throw new Error('Invalid vehicle form mode.');
        }
    }

    requestUrl() {
        switch (this.mode) {
            case 'creating':
                return '/reservations';
            case 'updating':
                return `/reservations/${this.reservationId}`;
            default:
                throw new Error('Invalid reservation form mode.');
        }
    }

    requestError(response) {
        if (response.status === 401) {
            return 'You must be signed in to continue.';
        }
        switch (this.mode) {
            case 'creating':
                return 'Failed to create reservation.';
            case 'updating':
                return `Failed to update reservation.`;
            default:
                throw new Error('Invalid reservation form mode.');
        }
    }

    successfulCreation(html) {
        const template = document.createElement('div');
        template.innerHTML = html;
        console.log(template);
        const reservationCard = template.querySelector('reservation-card');
        document
            .querySelector('#reservation-list')
            .appendChild(reservationCard);
        document
            .querySelector('#toast')
            .notify('Successfully created reservation.');
        this.modal.hide();
        this.form.reset();
    }

    successfulUpdate(data) {
        const reservation = data.reservation;
        const reservationCard = document.querySelector(
            `reservation-card[reservation-id="${this.reservationId}"]`
        );
        reservationCard.name = reservation.user.name;
        reservationCard.email = reservation.user.email;
        reservationCard.startDate = new Date(
            reservation.startDate
        ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        reservationCard.endDate = new Date(
            reservation.endDate
        ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        reservationCard.imageUrl = reservation.vehicle.imageUrl;
        reservationCard.model = reservation.vehicle.details.model;
        reservationCard.year = reservation.vehicle.details.year;

        this.modal.hide();
        this.form.reset();
    }

    async setFields(reservationId) {
        this.reservationId = reservationId;
        const response = await fetch(`/reservations/${reservationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            document
                .querySelector('#toast')
                .warn('Could not get reservation data.');
        } else {
            const reservation = (await response.json()).reservation;
            this.calendar.setDate([reservation.startDate, reservation.endDate]);
            await this.fetchAvailableVehicles();
            this.form.querySelector('#email').value = reservation.user.email;
            this.form.querySelector('#vehicleId').value =
                reservation.vehicle._id;
        }
    }

    get mode() {
        return this._mode;
    }

    set mode(mode) {
        switch (mode) {
            case 'creating':
                this._mode = mode;
                this.form.reset();
                this.title = 'New Reservation';
                this.submitButtonText = 'Create';

                break;
            case 'updating':
                this._mode = mode;
                this.title = 'Update Reservation';
                this.submitButtonText = 'Update';
                break;
            default:
                throw new Error('Invalid reservation form mode.');
        }
    }

    set title(title) {
        this.querySelector('.modal-title').innerHTML = title;
    }

    set submitButtonText(submitButtonText) {
        this.querySelector('button[type="submit"]').innerHTML =
            submitButtonText;
    }

    async fetchAvailableVehicles() {
        const selectedDates = this.calendar.selectedDates;
        if (!selectedDates[0] || !selectedDates[1]) {
            return;
        }
        try {
            const startDate = selectedDates[0].toISOString();
            const endDate = selectedDates[1].toISOString();
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
                const data = await response.json();
                this.updateVehicleOptions(data.vehicles);
            } else {
                document
                    .querySelector('#toast')
                    .caution('Failed to fetch available vehicles.');
            }
        } catch (error) {
            console.error('Error fetching available vehicles:', error);
        }
    }

    updateVehicleOptions(vehicles) {
        const chooseVehicleInput = this.querySelector('#vehicleId');
        chooseVehicleInput.innerHTML = '';

        vehicles.forEach((vehicle) => {
            const option = document.createElement('option');
            option.value = vehicle._id;
            option.textContent = `${vehicle.details.model} ${vehicle.details.year}`;
            chooseVehicleInput.appendChild(option);
        });
    }
}

customElements.define('reservation-form', ReservationForm);
