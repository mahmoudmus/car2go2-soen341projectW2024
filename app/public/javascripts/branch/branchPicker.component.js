class BranchPicker extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <select class="form-control" id="branch" name="branch" required>
                <option value="" disabled selected>Select</option>
            </select>`;
        this.select = this.querySelector('select');
        this.populateOptions();
    }
    async populateOptions() {
        const response = await fetch(`/branches/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.branches = (await response.json()).branches;
        const display = this.getAttribute('address') ? 'address' : 'name';
        for (const branch of this.branches) {
            this.addOption({ value: branch._id, name: branch[display] });
        }
    }
    addOption({ value, name }) {
        const option = document.createElement('option');
        option.value = value;
        option.innerHTML = name.trim();
        this.select.appendChild(option);
    }

    get selectedBranch() {
        if (!this.branches || this.select.value === '') {
            return null;
        }
        for (const branch of this.branches) {
            if (branch._id === this.select.value) {
                return branch;
            }
        }
        return null;
    }

    get value() {
        return this.select.value;
    }
}

customElements.define('branch-picker', BranchPicker);
