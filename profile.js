
import { db } from './config.js';
import { doc, getDoc, collection } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

const loader = document.getElementById('loader');
const profileCard = document.getElementById('profileCard');

const els = {
    avatar: document.getElementById('pAvatar'),
    name: document.getElementById('pName'),
    role: document.getElementById('pRole'),
    followers: document.getElementById('pFollowers'),
    projects: document.getElementById('pProjects'),
    rating: document.getElementById('pRating'),
    about: document.getElementById('pAbout'),
    skills: document.getElementById('pSkills'),
    verified: document.getElementById('pVerified'),
    modalUserName: document.getElementById('modalUserName')
};

async function fetchProfile() {
    if (!userId) {
        loader.innerHTML = "<p>User not found (No ID provided)</p>";
        return;
    }

    try {
        let docRef = doc(db, "Developer", userId);
        let docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("No such document in Developer! Trying users...");
            docRef = doc(db, "users", userId);
            docSnap = await getDoc(docRef);
        }

        if (docSnap.exists()) {
            const data = docSnap.data();
            renderProfile(data);
        } else {
            loader.innerHTML = "<p>Profile not found.</p>";
        }
    } catch (error) {
        console.error("Error getting document:", error);
        loader.innerHTML = "<p>Error loading profile.</p>";
    }
}

function renderProfile(data) {
    // Basic Info
    els.avatar.src = data.photoURL || 'https://via.placeholder.com/150';
    els.name.textContent = data.name || 'User';
    els.role.textContent = data.developerType || data.role || 'Developer';
    els.modalUserName.textContent = (data.name || 'this user').split(' ')[0];

    // Verified
    if (data.isVerified) {
        els.verified.style.display = 'block';
    }

    // Stats
    const followers = data.followers ? data.followers.length : 0;
    const projects = data['portfolio-projects'] ? data['portfolio-projects'].length : 0;

    // Rating logic
    let ratingVal = 'New';
    if (data.rating) {
        ratingVal = parseFloat(data.rating).toFixed(1);
    } else if (data.ratingSum && data.ratingCount) {
        const avg = data.ratingSum / data.ratingCount;
        ratingVal = avg.toFixed(1);
    }

    // Formatting big numbers
    els.followers.textContent = followers > 999 ? (followers / 1000).toFixed(1) + 'k' : followers;
    els.projects.textContent = projects;
    els.rating.textContent = ratingVal;

    // About
    els.about.textContent = data.about || 'No bio available for this user.';

    // Skills
    if (data.skills && Array.isArray(data.skills)) {
        els.skills.innerHTML = data.skills.slice(0, 5).map(skill =>
            `<span class="skill-chip">${skill}</span>`
        ).join('');
    }

    // Reveal
    loader.style.display = 'none';
    profileCard.style.display = 'block';
}

// Modal Logic
const modal = document.getElementById('appModal');
const closeBtn = document.getElementById('closeModalBtn');
const openBtns = document.querySelectorAll('.open-modal-btn');

openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.style.display = 'flex';
        // Small delay for animation
        setTimeout(() => modal.classList.add('active'), 10);
    });
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
});

// Close click outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
});

fetchProfile();
