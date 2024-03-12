class VehicleCard extends HTMLElement {
    connectedCallback() {
        const deleteButton = this.querySelector('.delete-vehicle');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => this.deleteVehicle());
        }
        const editButton = this.querySelector('.edit-vehicle');
        if (editButton) {
            editButton.addEventListener('click', () => this.editVehicle());
        }
        const reserveButton = this.querySelector('.start-reservation');
        if (reserveButton) {
            reserveButton.addEventListener('click', () =>
                this.startReservation()
            );
        }
    }

    async deleteVehicle() {
        const popup = document.querySelector('confirmation-popup');
        var swalTitle = 'Delete Vehicle?';
        var swalText = undefined;
        var swalTitleSuccess = "Vehicle Deleted!";
        var swalTextSuccess = "Vehicle ID: " + this.vehicleId;

        if (!(await popup.confirm(swalTitle, swalText, swalTitleSuccess, swalTextSuccess))) {
            return;
        }

        fetch(`/vehicles/${this.vehicleId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    this.remove();
                    document
                        .querySelector('#toast')
                        .notify('Successfully deleted vehicle.');
                } else {
                    document
                        .querySelector('#toast')
                        .caution('Could not delete vehicle.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    editVehicle() {
        const vehicleForm = document.querySelector('vehicle-form');
        vehicleForm.setFields(this.vehicleId);
        vehicleForm.mode = 'updating';
        vehicleForm.modal.show();
    }

    async startReservation() {
        const reservationForm = document.querySelector('reservation-form');
        reservationForm.mode = 'starting';
        const result = await reservationForm.setVehicle(this.vehicleId);
        if (result) {
            reservationForm.modal.show();
        }
    }

    get vehicleId() {
        return this.getAttribute('vehicle-id');
    }
}

customElements.define('vehicle-card', VehicleCard);
