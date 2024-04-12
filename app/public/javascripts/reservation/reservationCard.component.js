class ReservationCard extends HTMLElement {
    connectedCallback() {
        const deleteButton = this.querySelector('.delete-reservation');
        deleteButton.addEventListener('click', () => this.deleteReservation());
        const editButton = this.querySelector('.edit-reservation');
        editButton.addEventListener('click', () => this.editReservation());
        const copyButton = this.querySelector('.copy-on-click');
        copyButton.addEventListener('click', () =>
            this.copyToClipboard('Reservation ID copied to clipboard.')
        );
        const checkinButton = this.querySelector('.checkin-reservation');
        if (checkinButton) {
            checkinButton.addEventListener('click', () => {
                document.location.href = `reservations/checkin/${this.reservationId}`;
            });
        }
        const returnButton = this.querySelector('.return-reservation');
        if (returnButton) {
            returnButton.addEventListener('click', () => {
                document.location.href = `reservations/return/${this.reservationId}`;
            });
        }
    }

    async deleteReservation() {
        const popup = document.querySelector('confirmation-popup');
        let swalTitle = 'Delete Reservation?';
        let swalText;
        let swalTitleSuccess = 'Reservation Deleted!';
        let swalTextSuccess = 'Reservation ID: ' + this.reservationId;
        if (
            !(await popup.confirm(
                swalTitle,
                swalText,
                swalTitleSuccess,
                swalTextSuccess
            ))
        ) {
            return;
        }
        const response = await fetch(`/reservations/${this.reservationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            this.remove();
            document
                .querySelector('#toast')
                .notify('Successfully deleted reservation.');
        } else if (response.status === 500) {
            document.querySelector('#toast').caution('Server Error.');
        } else {
            const message = (await response.json()).message;
            document.querySelector('#toast').warn(message);
        }
    }

    editReservation() {
        window.location.href = `/reservations/edit/${this.reservationId}`;
    }

    async copyToClipboard(message) {
        try {
            await navigator.clipboard.writeText(this.reservationId);
            document.querySelector('#toast').notify(message);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    get reservationId() {
        return this.getAttribute('reservation-id');
    }

    set name(name) {
        this.querySelector('.reservation-name').innerHTML = name;
    }

    set email(email) {
        this.querySelector('.reservation-email').innerHTML = email;
    }

    set imageUrl(imageUrl) {
        this.querySelector('.reservation-image').src = imageUrl;
    }

    set model(model) {
        this.querySelector('.reservation-model').innerHTML = model;
    }

    set year(year) {
        this.querySelector('.reservation-year').innerHTML = `(${year})`;
    }

    set startDate(startDate) {
        this.querySelector('.reservation-start-date').innerHTML = startDate;
    }

    set endDate(endDate) {
        this.querySelector('.reservation-end-date').innerHTML = endDate;
    }

    set cost(cost) {
        this.querySelector('.reservation-cost').innerHTML = cost;
    }
}

customElements.define('reservation-card', ReservationCard);
