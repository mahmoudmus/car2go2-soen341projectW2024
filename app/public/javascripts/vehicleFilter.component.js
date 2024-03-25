class VehicleFilter extends HTMLElement {
    connectedCallback() {
        this.params = new URLSearchParams(window.location.search);

        // @todo this for every other filter field:
        this.categoryField = this.querySelector('#category');
        if (this.params.get('category')) {
            this.categoryField.value = this.params.get('category');
        }

        this.typeField = this.querySelector('#type');
        if (this.params.get('type')) {
            this.typeField.value = this.params.get('type');
        }

        this.makeField = this.querySelector('#make');
        if (this.params.get('make')) {
            this.typeField.value = this.params.get('make');
        }
        this.makeField = this.querySelector('#model');
        if (this.params.get('model')) {
            this.typeField.value = this.params.get('model');
        }
        this.makeField = this.querySelector('#isAutomatic');
        if (this.params.get('isAutomatic')) {
            this.typeField.value = this.params.get('isAutomatic');
        }
        this.makeField = this.querySelector('#minYear');
        if (this.params.get('minYear')) {
            this.typeField.value = this.params.get('minYear');
        }
        this.makeField = this.querySelector('#maxYear');
        if (this.params.get('maxYear')) {
            this.typeField.value = this.params.get('maxYear');
        }

        this.makeField = this.querySelector('#minPrice');
        if (this.params.get('minPrice')) {
            this.typeField.value = this.params.get('minPrice');
        }
        this.makeField = this.querySelector('#maxPrice');
        if (this.params.get('maxPrice')) {
            this.typeField.value = this.params.get('maxPrice');
        }

    }
}

customElements.define('vehicle-filter', VehicleFilter);
