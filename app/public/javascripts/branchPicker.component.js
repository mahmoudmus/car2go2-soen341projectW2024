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
        const branches = (await response.json()).branches;
        for (branch of branches) {
            this.addOption({ value: branch._id, name: branch.name });
        }
    }
    addOption({ value, name }) {
        const option = document.createElement('option');
        option.value = value;
        option.innerHTML = name.trim();
        this.select.appendChild(option);
    }
}

customElements.define('branch-picker', BranchPicker);
