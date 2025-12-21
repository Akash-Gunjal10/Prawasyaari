import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAN6PY-TB15Tn9-JU9xa4Z3UVMhRMSr4IQ",
    authDomain: "prawasyaari-db.firebaseapp.com",
    projectId: "prawasyaari-db",
    storageBucket: "prawasyaari-db.firebasestorage.app",
    messagingSenderId: "743128470174",
    appId: "1:743128470174:web:1f95e4b56d8fc7ea17e18f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let allCitiesData = {};

// loadCities function ko aise update karein:
async function loadCities() {
    const grid = document.getElementById('cityGrid');
    try {
        // Query banayein jo 'createdAt' ke hisaab se descending order (nayi pehle) mein ho
        const q = query(collection(db, "cities"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        grid.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const city = doc.data();
            const key = doc.id;
            allCitiesData[key] = city;

            grid.innerHTML += `
                <div class="city-card">
                    <img src="${city.img}" class="city-img" alt="${city.name}">
                    <div class="city-info">
                        <div class="city-name">${city.name}</div>
                        <p class="city-desc">${city.desc}</p>
                        <button class="btn-explore" onclick="openCityModal('${key}')">Explore Guide</button>
                    </div>
                </div>`;
        });
    } catch (e) { 
        console.error("Error loading cities:", e); 
    }
}


// 2. Open Modal with City Details
window.openCityModal = (key) => {
    const data = allCitiesData[key];
    if(!data) return;

    document.getElementById('modalTitle').innerText = data.name;
    document.getElementById('modalImg').src = data.img;
    document.getElementById('modalReach').innerText = data.reach || "Details not provided.";
    
    const list = document.getElementById('modalPlacesList');
    list.innerHTML = data.places.map(p => `<li style="margin-bottom:8px;"><i class="fas fa-check-circle" style="color:var(--primary); margin-right:8px;"></i>${p}</li>`).join('');

    const query = encodeURIComponent(data.name);
    document.getElementById('link-hotel').href = `https://www.google.com/maps/search/Hotels+in+${query}`;
    document.getElementById('link-food').href = `https://www.google.com/maps/search/Restaurants+in+${query}`;
    document.getElementById('link-petrol').href = `https://www.google.com/maps/search/Petrol+Pump+in+${query}`;
    document.getElementById('link-atm').href = `https://www.google.com/maps/search/ATM+in+${query}`;

    document.getElementById('cityModal').style.display = 'flex';
};

// 3. Close Modal
window.closeModal = () => {
    document.getElementById('cityModal').style.display = 'none';
};

// 4. Search Functionality
window.filterCities = () => {
    const input = document.getElementById('citySearch').value.toLowerCase();
    const cards = document.querySelectorAll('.city-card');
    cards.forEach(card => {
        const cityName = card.querySelector('.city-name').innerText.toLowerCase();
        const cityDesc = card.querySelector('.city-desc').innerText.toLowerCase();
        card.style.display = (cityName.includes(input) || cityDesc.includes(input)) ? "block" : "none";
    });
};

// Is line ko imports mein add karein


// Start Loading
loadCities();