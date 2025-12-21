import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const saveBtn = document.getElementById('saveBtn');

// 1. Save City Function
async function saveCity() {
    const name = document.getElementById('adminCityName').value.trim();
    const desc = document.getElementById('adminCityDesc').value.trim();
    const img = document.getElementById('adminCityImg').value.trim();
    const reach = document.getElementById('adminCityReach').value.trim();
    const placesInput = document.getElementById('adminCityPlaces').value.trim();

    if(!name) {
        alert("Bhai, City Name toh daalo!");
        return;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = "Saving to Firebase...";

    try {
        await setDoc(doc(db, "cities", name.toLowerCase()), {
    name: name,
    desc: desc,
    img: img,
    reach: reach,
    places: placesInput ? placesInput.split(',').map(s => s.trim()) : [],
    createdAt: serverTimestamp() // <-- Ye line naya data upar laane ke liye zaruri hai
});
        alert("City successfully added!");
        clearForm();
        loadCities(); 
    } catch (e) {
        alert("Error: " + e.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Save to Live Database';
    }
}

// 2. Load Cities List
async function loadCities() {
    const listDiv = document.getElementById('displayCityList');
    listDiv.innerHTML = "Fetching live data...";
    
    try {
        const querySnapshot = await getDocs(collection(db, "cities"));
        listDiv.innerHTML = "";

        if (querySnapshot.empty) {
            listDiv.innerHTML = "<p>Database khali hai bhai.</p>";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const city = docSnap.data();
            const key = docSnap.id;
            
            const cityItem = document.createElement('div');
            cityItem.className = 'city-item';
            cityItem.innerHTML = `
                <span><strong>${city.name}</strong></span>
                <button class="btn-delete" data-id="${key}">Delete</button>
            `;
            
            // Delete button listener
            cityItem.querySelector('.btn-delete').onclick = () => deleteCity(key);
            listDiv.appendChild(cityItem);
        });
    } catch (err) {
        listDiv.innerHTML = "Error loading data.";
        console.error(err);
    }
}

// 3. Delete Function
async function deleteCity(key) {
    if(confirm(`Kya aap sach mein "${key}" ko delete karna chahte hain?`)) {
        try {
            await deleteDoc(doc(db, "cities", key));
            loadCities();
        } catch (e) {
            alert("Delete nahi ho paya: " + e.message);
        }
    }
}

function clearForm() {
    document.querySelectorAll('#cityForm input, #cityForm textarea').forEach(el => el.value = "");
}

// Event Listeners
saveBtn.addEventListener('click', saveCity);
window.addEventListener('DOMContentLoaded', loadCities);