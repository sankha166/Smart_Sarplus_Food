const API_URL = "http://localhost:5000/api";

async function loadStats() {
  try {
    const res = await fetch(`${API_URL}/analytics/stats`);
    const data = await res.json();
    document.getElementById("foodSaved").textContent = data.foodSaved + " kg";
    document.getElementById("peopleServed").textContent = data.peopleServed;
    document.getElementById("carbonSaved").textContent = data.carbonSaved + " kg CO₂";
  } catch (error) {
    console.error("Failed to load stats:", error);
  }
}

async function loadFood() {
  try {
    const res = await fetch(`${API_URL}/food`);
    const foodItems = await res.json();
    const list = document.getElementById("foodList");
    list.innerHTML = "";

    foodItems.forEach(item => {
      // Create container div for food card
      const card = document.createElement("div");
      card.classList.add("food-card");

      const categoriesHtml = item.categories?.map(cat =>
        `<span class="food-category">${cat}</span>`
      ).join(" ") || "";

      card.innerHTML = `
        <img src="${item.image || 'https://via.placeholder.com/400x180?text=No+Image'}" alt="${item.name}" />
        <div class="food-details">
          <div class="food-categories">${categoriesHtml}</div>
          <h3>${item.name}</h3>
          <p>${item.description || ''}</p>
          <p><strong>Donated by:</strong> ${item.donor || 'Unknown'}</p>
          <p><strong>Location:</strong> ${item.location}</p>
          <p><strong>Pickup Time:</strong> ${item.pickupTime || ''}</p>
          <p><strong>Expires:</strong> ${item.availableUntil ? new Date(item.availableUntil).toLocaleString() : 'N/A'}</p>
          <div class="food-footer-info">
            <span><b>Quantity Available:</b> ${item.quantity} ${item.unit || ''}</span>
            <span><b>Freshness:</b> ${item.freshnessStatus || 'Unknown'}</span>
          </div>
          ${shouldShowOrderButton() ? `<button class="request-btn" onclick="orderFood('${item._id}')">Order</button>` : ''}
        </div>
      `;

      list.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load food items:", error);
  }
}

// Helper to determine if order button should show
function shouldShowOrderButton() {
  const role = localStorage.getItem("role");
  return !role || role === "user"; // Show order button only if user or no role (not admin or donor)
}

function orderFood(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to order food.");
    window.location.href = "login.html";
    return;
  }
  alert(`Order placed for food ID: ${id}`);
  // Here you can add real order placing logic, e.g. API call
}

function setupUI() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const logoutBtn = document.getElementById("logoutBtn");
  const authButtons = document.getElementById("authButtons");
  const addFoodSection = document.getElementById("addFoodSection");

  if (token) {
    if(logoutBtn) logoutBtn.style.display = "inline-block";
    if(authButtons) authButtons.style.display = "none";

    if (role === "admin" || role === "donor") {
      if(addFoodSection) addFoodSection.style.display = "block";
    }
  } else {
    if(logoutBtn) logoutBtn.style.display = "none";
    if(authButtons) authButtons.style.display = "block";
    if(addFoodSection) addFoodSection.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadFood();
  setupUI();
});
