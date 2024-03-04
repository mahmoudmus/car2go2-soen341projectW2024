class VehicleCard extends HTMLElement {
    connectedCallback() {
        const deleteButton = this.querySelector('.delete-vehicle');
        deleteButton.addEventListener('click', () => this.deleteVehicle());
        const editButton = this.querySelector('.edit-vehicle');
        editButton.addEventListener('click', () => this.editVehicle());
    }

    deleteVehicle() {
        fetch(`/vehicles/${this.vehicleId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    this.parentElement.remove();
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

    get vehicleId() {
        return this.getAttribute('vehicle-id');
    }
}

customElements.define('vehicle-card', VehicleCard);
