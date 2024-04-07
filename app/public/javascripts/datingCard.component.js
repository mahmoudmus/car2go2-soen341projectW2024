class DatingCard extends HTMLElement {
    connectedCallback() {
        // this.classList.add('d-flex', 'flex-column', 'justify-content-center');
    }
    setVehicle(vehicle) {
        this.vehicleId = vehicle._id;
        this.innerHTML = `
        <div class="card mb-3" style="width: 42rem;">
            <img
                src="${vehicle.imageUrl}"
                alt="Car Image"
                class="card-img-top"
                style="height: 300px; object-fit: cover;"
            />
            <div class="card-body">
                <h4 class="card-title">${vehicle.details.model}</h4>
                <p class="card-text">I'm a ${vehicle.details.colour}, ${vehicle.type} ${vehicle.category} built by
                ${vehicle.details.make} in ${vehicle.details.year}.
                </p>
                <div class="row">
                    <div class="col-md-4">
                        <ul>
                            <li><b>Price: </b>${vehicle.dailyPrice}$/day</li>
                            <li><b>Mileage: </b> ${vehicle.details.mileage} km</li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <ul>
                        <li><b>Number of Seats: </b>${vehicle.details.seats}</li>
                        <li><b>Number of Doors: </b>${vehicle.details.doors}</li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <ul>
                            <li><b>Is Automatic? </b>${vehicle.details.isAutomatic}</li>
                            <li><b>Engine Type: </b>${vehicle.details.engineType}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
        return this;
    }

    setMatch(vehicle) {
        this.vehicleId = vehicle._id;
        this.innerHTML = `
        <style>
            .best-match-card {
                border: 3px solid gold;
                border-radius: 15px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                margin-top: 20px;
                background-color: #fffbea;
            }
            
            .best-match-header {
                position: relative;
                text-align: center;
                color: #b17a4a;
            }
            
            .card-title {
                font-weight: bold;
                color: #815504;
            }
            
            .card-text {
                color: #6a4e02;
            }

            .card-size {
                width: 42rem;
            }
            
            ul {
                list-style-type: none;
            }
            
            li {
                color: #5a4011;
            }
        </style>

        <div class="card mb-3 best-match-card">
            <div class="best-match-header">
                <h2>
                    <b>
                        <i class="bi bi-star-fill"></i>Your best matched car:<i class="bi bi-star-fill"></i>
                    </b>
                </h2>
                <br>
                <img
                    src="${vehicle.imageUrl}"
                    alt="Car Image"
                    class="rounded"
                    style="height: 300px; object-fit: cover;"
                />
                <h4 class="card-title">${vehicle.details.model}</h4>
            </div>
            <div class="card-body">
            <p class="card-text">I'm a ${vehicle.details.colour}, ${vehicle.type} ${vehicle.category} built by
                ${vehicle.details.make} in ${vehicle.details.year}.
            </p>
            <div class="row">
                <div class="col-md-4">
                    <ul>
                        <li><b>Price: </b>${vehicle.dailyPrice}$/day</li>
                        <li><b>Mileage: </b> ${vehicle.details.mileage} km</li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <ul>
                        <li><b>Number of Seats: </b>${vehicle.details.seats}</li>
                        <li><b>Number of Doors: </b>${vehicle.details.doors}</li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <ul>
                        <li><b>Is Automatic? </b>${vehicle.details.isAutomatic}</li>
                        <li><b>Engine Type: </b> ${vehicle.details.engineType}</li>
                    </ul>
                </div>
            </div>
            </div>
        </div>
        `;
        return this;
    }
}

customElements.define('dating-card', DatingCard);
