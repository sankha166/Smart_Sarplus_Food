const API = "http://localhost:5000/api";
const BASE_URL = "http://localhost:5000"; // For images

// Load food list
async function loadFood() {
  const foodListEl = document.getElementById("foodList");
  if (!foodListEl) return;

  foodListEl.innerHTML = "<p>Loading food items...</p>";

  try {
    const res = await fetch(`${API}/food`);
    if (!res.ok) throw new Error("Failed to load food items");

    const foods = await res.json();

    if (foods.length === 0) {
      foodListEl.innerHTML = "<p>No food available right now.</p>";
      return;
    }

    foodListEl.innerHTML = foods.map(f => `
      <div class="food-card">
        <img src="${f.imageUrl 
          ? BASE_URL + f.imageUrl 
          : BASE_URL + "/uploads/default.jpg"}" 
          alt="${f.name}" width="150">
        <h3>${f.name}</h3>
        <p>${f.quantity} kg - ${f.location}</p>
        <p>Freshness: ${f.freshnessStatus}</p>
        <p>Available until: ${new Date(f.availableUntil).toLocaleString()}</p>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
    foodListEl.innerHTML = "<p style='color:red;'>Error loading food items.</p>";
  }
}

// Handle add food form only if present
const foodForm = document.getElementById("foodForm");
if (foodForm) {
  foodForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(foodForm);
    const imageFile = document.getElementById("image").files[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`${API}/food`, {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add food");

      alert("✅ Food added successfully!");
      window.location.href = "index.html?added=1"; // redirect to index
    } catch (err) {
      console.error(err);
      alert("❌ Error adding food. Please try again.");
    }
  });
}

// If redirected after adding, reload list automatically
if (window.location.search.includes("added=1")) {
  loadFood();
} else {
  loadFood();
}
