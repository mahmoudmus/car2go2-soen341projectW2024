class ReservationFilter extends HTMLElement {
    connectedCallback() {
        this.searchButton = this.querySelector('#search-button');
        this.searchInput = this.querySelector('#search-email');

        // Check for email parameter in URL and populate search box
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        if (emailParam) {
            this.searchInput.value = emailParam;
        }

        this.searchButton.addEventListener('click', this.handleSearch.bind(this));
        this.searchInput.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleSearch() {
        const email = this.searchInput.value.trim();
        if (email === '') {
            alert('Please enter an email to search.');
            return;
        }

        // Update URL with email parameter
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('email', email);
        window.location.search = searchParams.toString();
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.handleSearch();
        }
    }
}

customElements.define('reservation-filter', ReservationFilter);
