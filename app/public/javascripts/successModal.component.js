class SuccessModal extends HTMLElement {
    connectedCallback() {
        const params = new URL(window.location.href).searchParams;
        const reservationId = params.get('success');

        if (reservationId) {
            this.modal = new bootstrap.Modal(this);
            this.modal.show();
            this.sendConfirmationEmail(reservationId);
        }
    }
    async sendConfirmationEmail(reservationId) {
        const response = await fetch('/reservations/emailconfirmation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reservationId }),
        });
        if (!response.ok) {
            document
                .querySelector('#toast')
                .caution('Failed to send confirmation email.');
        }
    }
}

customElements.define('success-modal', SuccessModal);
