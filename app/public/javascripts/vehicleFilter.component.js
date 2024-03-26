class VehicleFilter extends HTMLElement {
    connectedCallback() {
        this.setFieldsUsingUrlParams();
        this.FilterButton = this.querySelector('#submitFilter');
        this.FilterButton.addEventListener('click', () => this.applyFilters());
    }

    applyFilters() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        params.set('category', encodeURIComponent(this.categoryField.value));
        params.set('type', encodeURIComponent(this.typeField.value));
        params.set('make', encodeURIComponent(this.makeField.value));
        params.set('model', encodeURIComponent(this.modelField.value));
        params.set(
            'isAutomatic',
            encodeURIComponent(this.automaticCheckbox.checked)
        );
        params.set('minYear', encodeURIComponent(this.minYearField.value));
        params.set('maxYear', encodeURIComponent(this.maxYearField.value));
        params.set('minPrice', encodeURIComponent(this.minPriceField.value));
        params.set('maxPrice', encodeURIComponent(this.maxPriceField.value));

        url.search = params.toString();
        window.location.href = url.toString();
    }

    setFieldsUsingUrlParams() {
        this.params = new URLSearchParams(window.location.search);

        this.categoryField = this.querySelector('#category');
        if (this.params.get('category')) {
            this.categoryField.value = decodeURIComponent(
                this.params.get('category')
            );
        }

        this.typeField = this.querySelector('#type');
        if (this.params.get('type')) {
            this.typeField.value = decodeURIComponent(this.params.get('type'));
        }

        this.makeField = this.querySelector('#make');
        if (this.params.get('make')) {
            this.makeField.value = decodeURIComponent(this.params.get('make'));
        }

        this.modelField = this.querySelector('#model');
        if (this.params.get('model')) {
            this.modelField.value = decodeURIComponent(
                this.params.get('model')
            );
        }

        this.automaticCheckbox = this.querySelector('#isAutomatic');
        if (this.params.get('isAutomatic')) {
            if (decodeURIComponent(this.params.get('isAutomatic')) === 'true') {
                this.automaticCheckbox.checked = true;
            } else {
                this.automaticCheckbox.checked = false;
            }
        }

        this.minYearField = this.querySelector('#minYear');
        if (this.params.get('minYear')) {
            this.minYearField.value = decodeURIComponent(
                this.params.get('minYear')
            );
        }

        this.maxYearField = this.querySelector('#maxYear');
        if (this.params.get('maxYear')) {
            this.maxYearField.value = decodeURIComponent(
                this.params.get('maxYear')
            );
        }

        this.minPriceField = this.querySelector('#minPrice');
        if (this.params.get('minPrice')) {
            this.minPriceField.value = decodeURIComponent(
                this.params.get('minPrice')
            );
        }

        this.maxPriceField = this.querySelector('#maxPrice');
        if (this.params.get('maxPrice')) {
            this.maxPriceField.value = decodeURIComponent(
                this.params.get('maxPrice')
            );
        }
    }
}

customElements.define('vehicle-filter', VehicleFilter);
