
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
        

        // --- LOAD DATA FROM DATABASE (Admin Panel) ---
// 1. डेटा रेंडर करना (ताकि Admin वाला डेटा फ्रंट पेज पर दिखे)
function renderCities() {
    let storedData = JSON.parse(localStorage.getItem('prawasyaariData')) || {};
    let grid = document.getElementById('cityGrid');
    if(!grid) return; 
    
    grid.innerHTML = ""; 

    for (let key in storedData) {
        let city = storedData[key];
        grid.innerHTML += `
            <div class="city-card" data-name="${key}">
                <img src="${city.img}" class="city-img">
                <div class="city-info">
                    <h3 class="city-name">${city.name}</h3>
                    <p class="city-desc">${city.desc}</p>
                    <button class="btn-explore" onclick="openCityModal('${key}')">Explore Guide</button>
                </div>
            </div>`;
    }
}

// 2. Modal खोलने का सही तरीका (ID: cityModal इस्तेमाल करें)
function openCityModal(cityKey) {
    let storedData = JSON.parse(localStorage.getItem('prawasyaariData')) || {};
    let data = storedData[cityKey];

    if(data) {
        document.getElementById('modalTitle').innerText = data.name;
        document.getElementById('modalImg').src = data.img;
        document.getElementById('modalReach').innerText = data.reach;

        
        
        
        let list = document.getElementById('modalPlacesList');
        list.innerHTML = ""; // Purani list saaf karne ke liye

        // Places ko ek-ek karke dikhane ke liye loop
        if(data.places && Array.isArray(data.places)) {
            data.places.forEach(place => {
                let li = document.createElement('li');
                li.innerText = place;
                list.appendChild(li);
            });
        } else {
            list.innerHTML = "<li>No places found</li>";
        }

        document.getElementById('cityModal').style.display = 'flex';
    }
}

function closeModal() {
    document.getElementById('cityModal').style.display = 'none';
}

window.onload = renderCities;

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
    