class CheckinSuccessModal extends HTMLElement {
    connectedCallback() {
        const params = new URL(window.location.href).searchParams;
        if (params.get('checkin')) {
            this.modal = new bootstrap.Modal(this);
            this.modal.show();
        }
    }
}

customElements.define('checkin-success-modal', CheckinSuccessModal);
