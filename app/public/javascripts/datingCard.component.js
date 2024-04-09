class DatingCard extends HTMLElement {
    setVehicle(vehicle, match = false) {
        this.vehicleId = vehicle._id;

        const style = match
            ? `
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
            </style>`
            : '';

        const header = match
            ? `
            <h2>
                <b>
                    <i class="bi bi-star-fill pe-2"></i>Closest Match<i class="bi bi-star-fill ps-2"></i>
                </b>
            </h2>
            <br>
            `
            : '';

        const bio = this.vehicleBio(vehicle);
        this.innerHTML = `
        ${style}
        <div
            class="card mb-3 ${match ? 'best-match-card' : ''}"
            style="${match ? '' : 'max-width: 42rem;'}"
        >
            <div class="best-match-header">
                ${header}
                <img
                    src="${vehicle.imageUrl}"
                    alt="Car Image"
                    class="${match ? 'rounded' : 'card-img-top'}"
                    style="height: 300px; object-fit: cover;"
                />
                ${
                    match
                        ? '<h4 class="card-title">' +
                          vehicle.details.model +
                          '</h4>'
                        : ''
                }
            </div>
                <div class="card-body">
                ${
                    match
                        ? ''
                        : '<h4 class="card-title">' +
                          vehicle.details.model +
                          '</h4>'
                }
                <p class="card-text">
                   ${bio} 
                </p>
                <div class="row">
                    <div class="col-md-4">
                        <ul>
                            <li><b>Price: </b>${vehicle.dailyPrice}$/day</li>
                            <li><b>Mileage: </b> ${
                                vehicle.details.mileage
                            } km</li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <ul>
                        <li><b>Number of Seats: </b>${
                            vehicle.details.seats
                        }</li>
                        <li><b>Number of Doors: </b>${
                            vehicle.details.doors
                        }</li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <ul>
                            <li><b>Is Automatic? </b>${
                                vehicle.details.isAutomatic
                            }</li>
                            <li><b>Engine Type: </b>${
                                vehicle.details.engineType
                            }</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
        return this;
    }

    vehicleBio(vehicle) {
        let category = vehicle.category;
        if (category === 'fullsize') {
            category = 'full-sized';
        }
        const appendSuffix = ['standard', 'intermediate'].includes(category);
        category += appendSuffix ? '-sized' : '';
        return `
            I'm a ${vehicle.details.colour}, ${category} ${vehicle.type} built by ${vehicle.details.make} in ${vehicle.details.year}.
        `;
    }
}

customElements.define('dating-card', DatingCard);
