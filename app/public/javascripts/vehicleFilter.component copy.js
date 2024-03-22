class VehicleFilter extends HTMLElement {
    connectedCallback() {
        this.row = this.parentElement.parentElement;

        const deleteButton = this.querySelector('.delete-user');
        deleteButton.addEventListener('click', () => this.deleteUser());
        const editButton = this.querySelector('.edit-user');
        editButton.addEventListener('click', () => this.editUser());
    }

}

customElements.define('vehicle-filter', VehicleFilter);
