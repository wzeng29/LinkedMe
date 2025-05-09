// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, addDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
  getStorage, ref as storageRef, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDu4DBPq6ugvzTtZDMxEU64e9uxTqpgfKI",
  authDomain: "linkedme-ead28.firebaseapp.com",
  projectId: "linkedme-ead28",
  storageBucket: "linkedme-ead28.firebasestorage.app",
  messagingSenderId: "815313661905",
  appId: "1:815313661905:web:ca9a3fb461d79398eebaf0",
  measurementId: "G-YSW3RBMMEK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const gridSize = 400;
const gridContainer = document.getElementById("gridContainer");
const modalsContainer = document.getElementById("modalsContainer");

const claimedSpots = {}; // key: gridIndex, value: user data

async function loadUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));

  querySnapshot.forEach((doc) => {
    const user = doc.data();
    claimedSpots[user.gridIndex] = user;
  });

  renderGrid();
}

function renderGrid() {
  gridContainer.innerHTML = "";
  for (let i = 0; i < gridSize; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-item";
    cell.dataset.index = i;

    if (claimedSpots[i]) {
      const user = claimedSpots[i];
      cell.classList.add("taken");
      cell.style.backgroundImage = `url('${user.avatar_path}')`;
      cell.setAttribute("data-bs-toggle", "modal");
      cell.setAttribute("data-bs-target", `#userModal${i}`);
      createModal(i, user);
    } else {
      cell.textContent = i;
      cell.onclick = () => {
        document.getElementById("gridIndex").value = i;
        new bootstrap.Modal(document.getElementById("submitModal")).show();
      };
    }
    gridContainer.appendChild(cell);
  }
}

function createModal(index, user) {
  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = `userModal${index}`;
  modal.tabIndex = -1;
  modal.setAttribute("aria-labelledby", `userModalLabel${index}`);
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="userModalLabel${index}">${user.name}'s Profile</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <img src="${user.avatar_path}" class="grid-avatar mb-3" alt="Avatar">
          <ul class="list-group text-start">
            <li class="list-group-item"><strong>Age:</strong> ${user.age}</li>
            <li class="list-group-item"><strong>Gender:</strong> ${user.gender}</li>
            <li class="list-group-item"><strong>Country:</strong> ${user.country}</li>
            <li class="list-group-item"><strong>City:</strong> ${user.city}</li>
            <li class="list-group-item"><strong>Language:</strong> ${user.language}</li>
            <li class="list-group-item"><strong>Hobbies:</strong> ${user.hobbies}</li>
            <li class="list-group-item"><strong>Contact:</strong> ${user.contact}</li>
            <li class="list-group-item"><strong>Note:</strong> ${user.note}</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  modalsContainer.appendChild(modal);
}

const form = document.getElementById("userForm");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    console.log("⏳ Getting form values...");
    const gridIndex = parseInt(document.getElementById("gridIndex").value);
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value;
    const language = document.getElementById("language").value;
    const hobbies = document.getElementById("hobbies").value;
    const contact = document.getElementById("contact").value;
    const file = document.getElementById("avatar").files[0];
  
    if (!file) throw new Error("No file selected.");
  
    console.log("📤 Uploading avatar...");
    const fileRef = storageRef(storage, `avatars/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const avatarURL = await getDownloadURL(fileRef);
    console.log("✅ Avatar uploaded:", avatarURL);
  
    console.log("📝 Writing to Firestore...");
    await addDoc(collection(db, "users"), {
      gridIndex,
      name,
      age,
      gender,
      country,
      city,
      language,
      hobbies,
      contact,
      avatar_path: avatarURL
    });
  
    alert("🎉 Submission successful!");
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById("submitModal")).hide();
    await loadUsers();
  } catch (err) {
    console.error("❌ Submission error:", err);
    alert("Something went wrong: " + err.message);
  }
  

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit";
});

loadUsers();
