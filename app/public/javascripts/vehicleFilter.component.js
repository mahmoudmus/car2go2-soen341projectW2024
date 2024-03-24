class VehicleFilter extends HTMLElement {
    connectedCallback() {
        this.params = new URLSearchParams(window.location.search);

        // @todo this for every other filter field:
        this.categoryField = this.querySelector('#category');
        if (this.params.get('category')) {
            this.categoryField.value = this.params.get('category');
        }

        // this.row = this.parentElement.parentElement;
        // const deleteButton = this.querySelector('.delete-user');
        // deleteButton.addEventListener('click', () => this.deleteUser());
        // const editButton = this.querySelector('.edit-user');
        // editButton.addEventListener('click', () => this.editUser());
    }
}

customElements.define('vehicle-filter', VehicleFilter);
