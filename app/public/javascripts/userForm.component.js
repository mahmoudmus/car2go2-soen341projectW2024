class UserForm extends HTMLElement {
    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
        this.form = this.querySelector('form');
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(this.form);
            const requestBody = {
                name: formData.get('name'),
                email: formData.get('email'),
                age: formData.get('age'),
                address: formData.get('address'),
                type: formData.get('type'),
                hash: formData.get('hash'),
            };
            const response = await fetch(this.requestUrl(), {
                method: this.requestMethod(),
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                const message = (await response.json()).message;
                document.querySelector('#toast').caution(message);
            } else if (this.mode === 'creating') {
                this.successfulCreation(await response.text());
            } else {
                this.successfulUpdate(await response.json());
            }
        });
        this.mode = 'creating';
    }

    requestMethod() {
        switch (this.mode) {
            case 'creating':
                return 'POST';
            case 'updating':
                return 'PUT';
            default:
                throw new Error('Invalid user form mode.');
        }
    }

    requestUrl() {
        switch (this.mode) {
            case 'creating':
                return '/users/new';
            case 'updating':
                return `/users/${this.userId}`;
            default:
                throw new Error('Invalid user form mode.');
        }
    }

    requestError() {
        switch (this.mode) {
            case 'creating':
                return 'Failed to create user.';
            case 'updating':
                return `Failed to update user.`;
            default:
                throw new Error('Invalid user form mode.');
        }
    }

    successfulCreation(html) {
        document.querySelector('#user-list').innerHTML += html;
        document.querySelector('#toast').notify('Successfully created user.');

        this.modal.hide();
        this.form.reset();
    }

    successfulUpdate(data) {
        const user = data.updatedUser;
        const userRow = document.querySelector(
            `user-row[user-id="${this.userId}"]`
        );

        userRow.name = user.name;
        userRow.email = user.email;
        userRow.address = user.address;
        userRow.type = user.type;

        this.modal.hide();
        this.form.reset();
        document.querySelector('#toast').notify('Successfully updated user.');
    }

    async setFields(userId) {
        this.userId = userId;
        const response = await fetch(`/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            document
                .querySelector('#toast')
                .warn('Could not get vehicle data.');
        } else {
            const user = (await response.json()).user;
            this.form.querySelector('#name').value = user.name;
            this.form.querySelector('#email').value = user.email;
            this.form.querySelector('#age').value = user.age;
            this.form.querySelector('#address').value = user.address;
            this.form.querySelector('#type').value = user.type;
        }
    }

    get mode() {
        return this._mode;
    }

    set mode(mode) {
        switch (mode) {
            case 'creating':
                this._mode = mode;
                this.form.reset();
                this.form.querySelector('#hash').required = true;
                this.title = 'New User';
                this.submitButtonText = 'Create';

                break;
            case 'updating':
                this._mode = mode;
                this.form.querySelector('#hash').required = false;
                this.title = 'Update User';
                this.submitButtonText = 'Update';
                break;
            default:
                throw new Error('Invalid vehicle form mode.');
        }
    }

    set title(title) {
        this.querySelector('.modal-title').innerHTML = title;
    }

    set submitButtonText(submitButtonText) {
        this.querySelector('button[type="submit"]').innerHTML =
            submitButtonText;
    }
}

customElements.define('user-form', UserForm);
