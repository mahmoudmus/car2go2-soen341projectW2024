class WalkinForm extends HTMLElement {
    connectedCallback() {
        this.emailForm = document.querySelector('email-form');
        this.userForm = document.querySelector('user-form');
        this.userForm.mode = 'walkin';
        this.userForm.querySelector('.btn-close').remove();

        this.existingUserButton = this.userForm.querySelector('#closeButton');
        this.existingUserButton.setAttribute('data-bs-dismiss', '');
        this.existingUserButton.innerHTML = 'Select Existing User';
        this.existingUserButton.addEventListener('click', () => {
            this.userForm.modal.hide();
            this.emailForm.modal.show();
        });

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
