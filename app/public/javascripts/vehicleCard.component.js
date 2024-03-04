class VehicleCard extends HTMLElement {
    connectedCallback() {
        const deleteButton = this.querySelector('.delete-vehicle');
        deleteButton.addEventListener('click', () => this.deleteVehicle());
    }

    deleteVehicle() {
        fetch(`/vehicles/${this.getAttribute('vehicle_id')}`, {
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
}

customElements.define('vehicle-card', VehicleCard);
