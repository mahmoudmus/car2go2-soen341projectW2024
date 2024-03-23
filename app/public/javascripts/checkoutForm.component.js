class CheckoutForm extends HTMLElement {
    connectedCallback() {
        this.chargeButton = this.querySelector('#chargeButton');
        this.chargeButton.addEventListener('click', () => this.sendBillEmail());

        this.generateBillButton = this.querySelector('#generateBill');
        this.generateBillButton.addEventListener('click', () =>
            this.generateBill()
        );
        this.estimatedCostTextarea = this.querySelector('#EstimatedCost');
    }

    async generateBill() {
        const damagesCost = parseFloat(this.estimatedCostTextarea.value);
        const response = await fetch(
            `/reservations/${this.reservationId}/bill`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ damagesCost }),
            }
        );
        if (response.ok) {
            this.htmlInvoice = await response.text();
            this.querySelector('#billTarget').innerHTML = this.htmlInvoice;
            this.chargeButton.style.display = '';
        } else {
            document
                .querySelector('#toast')
                .caution('Could not generate final bill.');
        }
    }

    async sendBillEmail() {
        const total = parseFloat(this.querySelector('#total').innerHTML);
        const response = await fetch('/reservations/emailbill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bill: this.htmlInvoice,
                reservationId: this.reservationId,
                total,
            }),
        });
        if (response.ok) {
            this.postCheckout();
        } else {
            document
                .querySelector('#toast')
                .caution('Failed to send confirmation email.');
        }
    }

    async postCheckout() {
        const response = await fetch(`/reservations/${this.reservationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'checked-out' }),
        });
        if (response.ok) {
            window.location.href = '/?checkout=true';
        } else {
            document
                .querySelector('#toast')
                .caution('Could not set reservation status.');
        }
    }

    get reservationId() {
        return this.getAttribute('reservation-id');
    }
}

customElements.define('checkout-form', CheckoutForm);
