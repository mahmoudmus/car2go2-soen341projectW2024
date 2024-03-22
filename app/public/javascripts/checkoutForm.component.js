class CheckoutForm extends HTMLElement {
    connectedCallback() {
        this.generateBillButton = this.querySelector('#generateBill');
        this.generateBillButton.addEventListener('click', () =>
            this.generateBill()
        );
        this.estimatedCostTextarea = this.querySelector('#EstimatedCost');
        // this.agreementButton = this.querySelector('#submitAgreement');
        // this.depositButton = this.querySelector('#subdmitDeposit');
        // this.printButton = this.querySelector('#printButton');
        // this.agreementButton.addEventListener('click', (e) => {
        //     e.target.parentElement.innerHTML = `
        //     <button class="btn btn-primary" type="button" disabled>
        //         <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        //         <span role="status">Loading...</span>
        //     </button>
        //     `;
        //     setTimeout(() => {
        //         document.querySelector('#agreement-div').style.display = 'none';
        //         document.querySelector('#agreement-success-div').style.display =
        //             '';
        //     }, 1000);
        // });
        // this.depositButton.addEventListener('click', (e) => {
        //     e.target.parentElement.innerHTML = `
        //     <button id="loader-button" class="btn btn-primary" type="button" disabled>
        //         <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        //         <span role="status">Loading...</span>
        //     </button>
        //     `;
        //     setTimeout(() => {
        //         document.querySelector('#loader-button').style.display = 'none';
        //         document.querySelector('#success-div').style.display = '';
        //     }, 1500);
        // });
        // this.printButton.addEventListener('click', function () {
        //     window.print();
        // });
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
            const html = await response.text();
            this.querySelector('#billTarget').innerHTML = html;
        } else {
            document
                .querySelector('#toast')
                .caution('Could not generate final bill.');
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
