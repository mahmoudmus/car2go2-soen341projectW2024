class EmailForm extends HTMLElement {
    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
        this.continueButton = this.querySelector('#continue');
        this.continueButton.addEventListener('click', async () => {
            const email = this.querySelector('#email').value.toLowerCase();
            const isValid = await this.validateEmail(email);
            if (!isValid) {
                document
                    .querySelector('#toast')
                    .warn("Email doesn't exist. Please try again.");
                return;
            } else {
                this.modal.hide();
                document.querySelector('walkin-form').setEmail(email);
            }
        });
    }

    async validateEmail(email) {
        const response = await fetch('/users/checkemail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        return Boolean(response.ok);
    }
}

customElements.define('email-form', EmailForm);
