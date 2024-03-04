class VehicleForm extends HTMLElement {
    connectedCallback() {
        this.purpose = this.getAttribute('purpose');

        this.modal = new bootstrap.Modal(this);
        this.form = this.querySelector('form');
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(this.form);
            const requestBody = {
                type: formData.get('type'),
                category: formData.get('category'),
                imageUrl: formData.get('imageUrl'),
                branch: formData.get('branch'),
                available: formData.get('available') === 'on',
                hourlyPrice: formData.get('hourlyPrice'),
                details: {
                    make: formData.get('make'),
                    model: formData.get('model'),
                    year: formData.get('year'),
                    colour: formData.get('colour'),
                    seats: formData.get('seats'),
                    doors: formData.get('doors'),
                    mileage: formData.get('mileage'),
                    isAutomatic: formData.get('automatic') === 'on',
                    engineType: formData.get('engineType'),
                },
            };
            fetch(this.requestUrl(), {
                method: this.requestMethod(),
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network error.');
                    } else if (this.purpose === 'creating') {
                        return response.text();
                    } else {
                        return response.json();
                    }
                })
                .then((data) => {
                    if (this.purpose === 'creating') {
                        this.successfulCreation(data);
                    } else {
                        this.successfulUpdate(data);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    document
                        .querySelector('#toast')
                        .caution(this.requestError());
                });
        });
    }

    requestMethod() {
        switch (this.purpose) {
            case 'creating':
                return 'POST';
            case 'updating':
                return 'PUT';
            default:
                throw new Error('Invalid vehicle form purpose.');
        }
    }

    requestUrl() {
        switch (this.purpose) {
            case 'creating':
                return '/vehicles';
            case 'updating':
                return `/vehicles/${this.vehicleId}`;
            default:
                throw new Error('Invalid vehicle form purpose.');
        }
    }

    requestError() {
        switch (this.purpose) {
            case 'creating':
                return 'Failed to create vehicle.';
            case 'updating':
                return `Failed to update vehicle.`;
            default:
                throw new Error('Invalid vehicle form purpose.');
        }
    }

    successfulCreation(html) {
        const vehicleContainer = document.createElement('div');
        vehicleContainer.className = 'col-12 col-md-6 col-lg-4 mb-3';
        vehicleContainer.innerHTML = html;
        document.querySelector('#vehicle-list').appendChild(vehicleContainer);
        document
            .querySelector('#toast')
            .notify('Successfully created vehicle.');

        this.modal.hide();
        this.form.reset();
    }

    successfulUpdate(data) {
        const vehicle = data.updatedVehicle;
        const vehicleCard = document.querySelector(
            `vehicle-card[vehicle-id="${this.vehicleId}"]`
        );
        vehicleCard.querySelector('.card-img-top').src = vehicle.imageUrl;
        vehicleCard.querySelector('.card-title').innerHTML = vehicle.type;
        vehicleCard
            .querySelector('.card-text')
            .classList.remove('text-success', 'text-danger');
        vehicleCard
            .querySelector('.card-text')
            .classList.add(vehicle.available ? 'text-success' : 'text-danger');
        vehicleCard.querySelector('.card-text').innerHTML = vehicle.available
            ? 'Available'
            : 'Unavailable';
        document
            .querySelector('#toast')
            .notify('Successfully updated vehicle.');

        this.modal.hide();
        this.form.reset();
    }

    setFields(vehicleId) {
        this.vehicleId = vehicleId;
        fetch(`/vehicles/${vehicleId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    document
                        .querySelector('#toast')
                        .warn('Could not get vehicle data.');
                    console.log(response);
                }
            })
            .then((data) => {
                const vehicle = data.vehicle;
                this.form.querySelector('#type').value = vehicle.type;
                this.form.querySelector('#category').value = vehicle.category;
                this.form.querySelector('#imageUrl').value = vehicle.imageUrl;
                this.form.querySelector('#branch').value = vehicle.branch;
                this.form.querySelector('#hourlyPrice').value =
                    vehicle.hourlyPrice;
                this.form.querySelector('#available').checked =
                    vehicle.available;

                this.form.querySelector('#make').value = vehicle.details.make;
                this.form.querySelector('#model').value = vehicle.details.model;
                this.form.querySelector('#year').value = vehicle.details.year;
                this.form.querySelector('#colour').value =
                    vehicle.details.colour;
                this.form.querySelector('#seats').value = vehicle.details.seats;
                this.form.querySelector('#doors').value = vehicle.details.doors;
                this.form.querySelector('#mileage').value =
                    vehicle.details.mileage;
                this.form.querySelector('#engineType').value =
                    vehicle.details.engineType;
                this.form.querySelector('#automatic').checked =
                    vehicle.details.isAutomatic;
            })
            .catch((error) => {
                document
                    .querySelector('#toast')
                    .caution('Error fetching vehicle data.');
                console.error('Error:', error);
            });
    }
}

customElements.define('vehicle-form', VehicleForm);
