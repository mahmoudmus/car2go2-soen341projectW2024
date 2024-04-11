class EmailForm extends HTMLElement {
    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
        this.continueButton = this.querySelector('#continue');
        this.continueButton.addEventListener('click', () => {
            this.modal.hide();
            const email = this.querySelector('#email').value;
            document.querySelector('walkin-form').setEmail(email);
        });
    }
}

customElements.define('email-form', EmailForm);
