class WalkinForm extends HTMLElement {
    connectedCallback() {
        this.userForm = document.querySelector('user-form');
        this.userForm.mode = 'walkin';
        this.userForm.querySelector('#closeButton').remove();
        this.userForm.querySelector('.btn-close').remove();
        this.userForm.modal.show();

        this.datePlaceModal = new bootstrap.Modal(
            document.querySelector('#datePlaceModal')
        );

        // For testing:
        // this.datePlaceModal.show();
        // this.setEmail('tommy.mahut@gmail.com');
    }

    setEmail(email) {
        this.userEmail = email;
        this.datePlaceModal.show();
    }

    setVehiclePageUrl(url) {
        window.location.href = `${url}&email=${this.userEmail}`;
    }
}
customElements.define('walkin-form', WalkinForm);
