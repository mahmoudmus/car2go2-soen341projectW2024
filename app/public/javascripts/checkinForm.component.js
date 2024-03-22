class CheckinForm extends HTMLElement {
    connectedCallback() {
        this.agreementButton = this.querySelector('#submitAgreement');
        this.depositButton = this.querySelector('#subdmitDeposit');
        this.finalizeButton = this.querySelector('#checkinSubmit');
        this.printButton = this.querySelector('#printButton');

        this.agreementButton.addEventListener('click', (e) => {
            e.target.parentElement.innerHTML = `
            <button class="btn btn-primary" type="button" disabled>
                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span role="status">Loading...</span>
            </button>
            `;
            setTimeout(() => {
                document.querySelector('#agreement-div').style.display = 'none';
                document.querySelector('#agreement-success-div').style.display =
                    '';
            }, 1000);
        });

        this.depositButton.addEventListener('click', (e) => {
            e.target.parentElement.innerHTML = `
            <button id="loader-button" class="btn btn-primary" type="button" disabled>
                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span role="status">Loading...</span>
            </button>
            `;
            setTimeout(() => {
                document.querySelector('#loader-button').style.display = 'none';
                document.querySelector('#success-div').style.display = '';
            }, 1500);
        });

        this.finalizeButton.addEventListener('click', () => {
            window.location.href = '/?checkin=true';
        });
        this.printButton.addEventListener('click', function () {
            window.print();
        });
    }
}

customElements.define('checkin-form', CheckinForm);
