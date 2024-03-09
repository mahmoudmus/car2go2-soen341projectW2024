class VehicleCarousel extends HTMLElement {
    connectedCallback() {
        this.classList.add('row', 'w-100');
        if (this.getAttribute('get-vehicles') !== null) {
            this.populate();
        }
    }

    async populate() {
        const today = new Date();
        const startDate = today.toISOString();

        const endDateObj = new Date(today);
        endDateObj.setDate(today.getDate() + 30);
        const endDate = endDateObj.toISOString();

        const response = await fetch(
            `/vehicles/available?start=${encodeURIComponent(
                startDate
            )}&end=${encodeURIComponent(endDate)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.ok) {
            const vehicles = (await response.json()).vehicles;
            this.vehicles = vehicles;
        } else {
            document
                .querySelector('#toast')
                .caution('Failed to fetch available vehicles.');
        }
    }

    set vehicles(vehicles) {
        this.innerHTML = '';
        vehicles.slice(0, 4).forEach((vehicle) => {
            const div = document.createElement('div');
            div.classList.add('col-6', 'col-lg-3', 'mb-3');
            div.innerHTML = `
            <vehicle-card
                class="card"
                vehicle-id="${vehicle._id}"
            >
                <img
                    src="${vehicle.imageUrl}"
                    class="card-img-top"
                    style="height: 200px; object-fit: cover"
                    alt="Car Image"
                />
                <div class="card-body">
                    <h5 class="card-title model">${vehicle.details.model}</h5>
                    <p class="card-text">
                        <span class="vehicle-year"
                        >${vehicle.details.year}</span
                        >&nbsp;|&nbsp;<span class="vehicle-make"
                        >${vehicle.details.make}</span
                        >&nbsp;|
                        $<span class="vehicle-price">${vehicle.hourlyPrice}</span><small class="text-secondary">/hr</small>
                    </p>
                    <button class="btn btn-dark start-reservation">
                        <i class="bi bi-calendar3-range"></i> Reserve
                    </button>
                </div>
            </vehicle-card>
            `;
            this.appendChild(div);
        });
        const div = document.createElement('div');
        div.classList.add('d-flex', 'justify-content-center', 'pb-5');
        div.innerHTML = `
        <a href="vehicles" role="button" class="btn btn-red-hot rounded-pill">
            <i class="bi bi-tags-fill px-2"></i>
            See All Available Vehicles  
        </a>
        `;
        this.appendChild(div);
    }
}

customElements.define('vehicle-carousel', VehicleCarousel);
