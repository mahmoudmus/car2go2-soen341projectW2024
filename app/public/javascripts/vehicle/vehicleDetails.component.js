class VehicleDetails extends HTMLElement {
    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
    }

    async setVehicle(vehicleId) {
        const response = await fetch(`/vehicles/${vehicleId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const vehicle = (await response.json()).vehicle;

            this.querySelector('#vehicle-model').innerHTML =
                vehicle.details.model;

            this.querySelector('#vehicle-category').innerHTML =
                vehicle.category;
            this.querySelector('#vehicle-type').innerHTML = vehicle.type;

            this.querySelector('#vehicle-year').innerHTML =
                vehicle.details.year;
            this.querySelector('#vehicle-make').innerHTML =
                vehicle.details.make;
            this.querySelector('#vehicle-price').innerHTML = vehicle.dailyPrice;

            this.querySelector('#vehicle-colour').innerHTML =
                vehicle.details.colour;
            this.querySelector('#vehicle-seats').innerHTML =
                vehicle.details.seats;
            this.querySelector('#vehicle-doors').innerHTML =
                vehicle.details.doors;

            this.querySelector('#vehicle-mileage').innerHTML =
                vehicle.details.mileage;
            this.querySelector('#vehicle-engine-type').innerHTML =
                vehicle.details.engineType;

            const isAuto = vehicle.details.isAutomatic;
            const message = isAuto ? '(automatic)' : '(not automatic)';
            this.querySelector('#vehicle-automatic').innerHTML = message;

            const branchResponse = await fetch(`/branches/${vehicle.branch}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (branchResponse.ok) {
                const branch = (await branchResponse.json()).branch;
                this.querySelector('#vehicle-branch').innerHTML = branch.name;
            } else {
                document
                    .querySelector('#toast')
                    .warn('Could not get vehicle branch.');
            }

            return true;
        } else {
            document
                .querySelector('#toast')
                .warn('Could not get vehicle data.');
            console.log(response);
            return false;
        }
    }

    async setReserveButtonCallback(vehicleCard) {
        this.querySelector('#reserve-button').addEventListener('click', () => {
            this.modal.hide();
            vehicleCard.startReservation();
        });
    }
}

customElements.define('vehicle-details', VehicleDetails);
