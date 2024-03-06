class ReservationForm extends HTMLElement {
    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
        this.form = this.querySelector('form');
        this.initializeDateRangePicker();
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            // const formData = new FormData(this.form);
            const requestBody = {
                startDate: this.calendar.selectedDates[0],
                endDate: this.calendar.selectedDates[1],
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
                document
                    .querySelector('#toast')
                    .caution(this.requestError(response));
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
        // const template = document.createElement('div');
        // template.innerHTML = html;
        // console.log(template);
        // const vehicleCard = template.querySelector('vehicle-card');
        // document.querySelector('#vehicle-list').appendChild(vehicleCard);
        // document
        //     .querySelector('#toast')
        //     .notify('Successfully created reservation.');
        // this.modal.hide();
        // this.form.reset();
    }

    // successfulUpdate(data) {
    //     const vehicle = data.updatedVehicle;
    //     const vehicleCard = document.querySelector(
    //         `vehicle-card[vehicle-id="${this.vehicleId}"]`
    //     );
    //     vehicleCard.querySelector('.card-img-top').src = vehicle.imageUrl;
    //     vehicleCard.querySelector('.card-title').innerHTML = vehicle.type;
    //     vehicleCard
    //         .querySelector('.card-text')
    //         .classList.remove('text-success', 'text-danger');
    //     vehicleCard
    //         .querySelector('.card-text')
    //         .classList.add(vehicle.available ? 'text-success' : 'text-danger');
    //     vehicleCard.querySelector('.card-text').innerHTML = vehicle.available
    //         ? 'Available'
    //         : 'Unavailable';
    //     document
    //         .querySelector('#toast')
    //         .notify('Successfully updated vehicle.');

    //     this.modal.hide();
    //     this.form.reset();
    // }

    // setFields(vehicleId) {
    //     this.vehicleId = vehicleId;
    //     fetch(`/vehicles/${vehicleId}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //         .then((response) => {
    //             if (response.ok) {
    //                 return response.json();
    //             } else {
    //                 document
    //                     .querySelector('#toast')
    //                     .warn('Could not get vehicle data.');
    //                 console.log(response);
    //             }
    //         })
    //         .then((data) => {
    //             const vehicle = data.vehicle;
    //             this.form.querySelector('#type').value = vehicle.type;
    //             this.form.querySelector('#category').value = vehicle.category;
    //             this.form.querySelector('#imageUrl').value = vehicle.imageUrl;
    //             this.form.querySelector('#branch').value = vehicle.branch;
    //             this.form.querySelector('#hourlyPrice').value =
    //                 vehicle.hourlyPrice;
    //             this.form.querySelector('#available').checked =
    //                 vehicle.available;

    //             this.form.querySelector('#make').value = vehicle.details.make;
    //             this.form.querySelector('#model').value = vehicle.details.model;
    //             this.form.querySelector('#year').value = vehicle.details.year;
    //             this.form.querySelector('#colour').value =
    //                 vehicle.details.colour;
    //             this.form.querySelector('#seats').value = vehicle.details.seats;
    //             this.form.querySelector('#doors').value = vehicle.details.doors;
    //             this.form.querySelector('#mileage').value =
    //                 vehicle.details.mileage;
    //             this.form.querySelector('#engineType').value =
    //                 vehicle.details.engineType;
    //             this.form.querySelector('#automatic').checked =
    //                 vehicle.details.isAutomatic;
    //         })
    //         .catch((error) => {
    //             document
    //                 .querySelector('#toast')
    //                 .caution('Error fetching vehicle data.');
    //             console.error('Error:', error);
    //         });
    // }

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
}

customElements.define('reservation-form', ReservationForm);
