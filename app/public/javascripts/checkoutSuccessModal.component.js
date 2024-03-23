class CheckoutSuccessModal extends HTMLElement {
    connectedCallback() {
        const params = new URL(window.location.href).searchParams;
        if (params.get('checkout')) {
            this.modal = new bootstrap.Modal(this);
            this.modal.show();
        }
    }
}

customElements.define('checkout-success-modal', CheckoutSuccessModal);