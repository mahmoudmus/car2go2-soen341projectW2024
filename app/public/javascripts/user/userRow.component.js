class UserRow extends HTMLElement {
    connectedCallback() {
        this.row = this.parentElement.parentElement;

        const deleteButton = this.querySelector('.delete-user');
        deleteButton.addEventListener('click', () => this.deleteUser());
        const editButton = this.querySelector('.edit-user');
        editButton.addEventListener('click', () => this.editUser());
    }

    async deleteUser() {
        const popup = document.querySelector('confirmation-popup');
        let swalTitle = 'Delete User?';
        let swalText;
        let swalTitleSuccess = 'User Deleted!';
        let swalTextSuccess = 'User ID: ' + this.userId;
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
        const response = await fetch(`/users/${this.userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            this.row.remove();
            document
                .querySelector('#toast')
                .notify('Successfully deleted user.');
        } else if (response.status === 500) {
            document.querySelector('#toast').caution('Server Error.');
        } else {
            const message = (await response.json()).message;
            document.querySelector('#toast').warn(message);
        }
    }

    editUser() {
        const userForm = document.querySelector('user-form');
        userForm.setFields(this.userId);
        userForm.mode = 'updating';
        userForm.modal.show();
    }

    get userId() {
        return this.getAttribute('user-id');
    }

    set name(name) {
        this.row.querySelector('.user-name').innerHTML = name;
    }

    set email(email) {
        this.row.querySelector('.user-email').innerHTML = email;
    }

    set address(address) {
        this.row.querySelector('.user-address').innerHTML = address;
    }

    set type(type) {
        this.row.querySelector('.user-type').innerHTML = type;
    }
}

customElements.define('user-row', UserRow);
