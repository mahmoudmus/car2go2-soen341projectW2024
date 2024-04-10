class MapDiv extends HTMLElement {
    connectedCallback() {
        this.map = new google.maps.Map(this, {
            zoom: 7,
            center: { lat: 46.297764680393044, lng: 287.79998338923855 },
            mapId: 'DEMO_MAP_ID',
        });
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(this.map);
        this.populateMapWithBranchLocations();
        this.setAddressInputListener();
    }

    async populateMapWithBranchLocations() {
        const { AdvancedMarkerElement } = await google.maps.importLibrary(
            'marker'
        );

        const response = await fetch(`/branches/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.branches = (await response.json()).branches;
        for (const branch of this.branches) {
            const lng = branch.location[0];
            const lat = branch.location[1];
            branch.marker = new AdvancedMarkerElement({
                map: this.map,
                position: { lat: lat, lng: lng },
                title: branch.name,
            });
        }
    }

    setAddressInputListener() {
        this.address = '';
        let typingTimer;
        const doneTypingInterval = 500;

        const addressField = document.querySelector('#postal');
        addressField.addEventListener('input', () => {
            clearTimeout(typingTimer);

            typingTimer = setTimeout(() => {
                const address = addressField.value.trim();
                if (address !== '' && address !== this.address) {
                    this.setRouteToNearestBranch(address);
                }
            }, doneTypingInterval);
        });
    }

    async setRouteToNearestBranch(address) {
        this.address = address;

        // Obtaining nearest branch.
        const response = await fetch(
            `/branches/nearest/${encodeURIComponent(address)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const message = (await response.json()).message;
            document.querySelector('#toast').caution(message);
            return;
        }

        const nearestBranchId = (await response.json()).branch._id;
        let nearestBranchMarker;
        for (const branch of this.branches) {
            if (branch._id === nearestBranchId) {
                nearestBranchMarker = branch.marker;
                this.setBranchLabel(branch.name);
            }
        }

        // Setting route.
        const directionsService = new google.maps.DirectionsService();
        const request = {
            origin: address,
            destination: nearestBranchMarker.position,
            travelMode: 'DRIVING',
        };

        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                this.directionsRenderer.setDirections(null);
                this.directionsRenderer.setDirections(result);
            } else {
                console.error(`Directions request failed due to ${status}`);
            }
        });
    }

    setBranchLabel(label) {
        document.querySelector('#branchLabel').innerHTML = label;
    }
}

customElements.define('map-div', MapDiv);
