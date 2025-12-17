
        // --- 1. Database ---
        const cityData = {
            'mumbai': {
                mainImg: '/IMAGES/GATEWAY.jpg',
                places: [
                    {
                        name: "Gateway of India",
                        img: "/IMAGES/GATEWAY.jpg",
                        desc: "An iconic arched monument built in the 20th century.",
                        reach: "CST Railway Station se taxi ya bus (Route 111) lein.",
                        address: "Gateway of India, Colaba, Mumbai"
                    },
                    {
                        name: "Marine Drive",
                        img: "/IMAGES/MarineDrive.jpg",
                        desc: "The Queen's Necklace - a 3.6km long promenade.",
                        reach: "Churchgate Station se sirf 5 min ki walk hai.",
                        address: "Marine Drive, Mumbai"
                    }
                ]
            },
            'pune': {
                mainImg: '/IMAGES/SHANIWARWADA.jpg',
                places: [
                    {
                        name: "Shaniwar Wada",
                        img: "/IMAGES/SHANIWAR.jpg",
                        desc: "Great historical fortification of the Peshwa dynasty.",
                        reach: "Pune Junction se 15 min door hai via auto.",
                        address: "Shaniwar Wada, Pune"
                    },
                    {
                        name: "Sinhagad Fort",
                        img: "/IMAGES/sinhgad.jpg",
                        desc: "Hill fortress known for its historical significance and views.",
                        reach: "Pune city se private car ya Swargate bus se ja sakte hain.",
                        address: "Sinhagad Fort, Maharashtra"
                    }
                ]
            },
            'jaipur': {
                mainImg: '/IMAGES/HAWAMAHAL.jpg',
                places: [
                    {
                        name: "Hawa Mahal",
                        img: "/IMAGES/HAWAMAHAL.jpg",
                        desc: "Palace of Winds with 953 small windows.",
                        reach: "Jaipur Junction se auto ya e-rickshaw lein.",
                        address: "Hawa Mahal, Jaipur"
                    }
                ]
            }
        };

        // --- 2. Modal Logic ---
        function openCityModal(city) {
            let key = city.toLowerCase();
            let data = cityData[key];
            if(!data) return;

            document.getElementById('demoModal').style.display = 'flex';
            document.getElementById('modalTitle').innerText = city;
            document.getElementById('cityLabel').innerText = city;
            document.getElementById('modalImg').src = data.mainImg;

            // Load Amenities
            const amens = [
                {n: "Hotels", i: "🏨"}, {n: "Restaurants", i: "🍽️"}, 
                {n: "ATM", i: "🏧"}, {n: "Petrol Pump", i: "⛽"}, {n: "Hospital", i: "🏥"}
            ];
            document.getElementById('amenityLinks').innerHTML = amens.map(a => `
                <a href="https://www.google.com/maps/search/${a.n}+near+${city}" target="_blank" class="amenity-btn">
                    ${a.i} ${a.n}
                </a>
            `).join('');

            // Load Places
            document.getElementById('placesExplorer').innerHTML = data.places.map(p => {
                let pId = 'place-' + p.name.toLowerCase().replace(/\s+/g, '-');
                let mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`;
                return `
                    <div class="place-item" id="${pId}">
                        <img src="${p.img}">
                        <h4>${p.name}</h4>
                        <p>${p.desc}</p>
                        <div class="reach-box"><b>🚆 How to Reach:</b> ${p.reach}</div>
                        <a href="${mapUrl}" target="_blank" class="direction-btn">📍 Get Directions</a>
                    </div>
                `;
            }).join('');
        }

        // --- 3. Smart Search Function ---
        function filterCities() {
            let input = document.getElementById('citySearch').value.toLowerCase().trim();
            let cards = document.getElementsByClassName('city-card');

            if (input === "") {
                for (let card of cards) card.style.display = "block";
                return;
            }

            for (let card of cards) {
                let cityName = card.getAttribute('data-name');
                let data = cityData[cityName];
                let match = cityName.includes(input);

                if (data) {
                    data.places.forEach(place => {
                        let pName = place.name.toLowerCase();
                        // DIRECT JUMP IF EXACT MATCH
                        if (pName === input) {
                            openCityModal(cityName.charAt(0).toUpperCase() + cityName.slice(1));
                            setTimeout(() => {
                                let target = 'place-' + pName.replace(/\s+/g, '-');
                                let el = document.getElementById(target);
                                if(el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    el.style.backgroundColor = "#fff9c4";
                                    setTimeout(() => el.style.backgroundColor = "white", 2000);
                                }
                            }, 600);
                        }
                        if (pName.includes(input)) match = true;
                    });
                }
                card.style.display = match ? "block" : "none";
            }
        }
    