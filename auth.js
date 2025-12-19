const API_URL = "http://localhost:5000/api";

// Verify token with backend and get user data
async function verifyToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Invalid token");
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

// Logout function (expose globally)
function logout() {
  localStorage.clear();
  updateUI(null);
  window.location.href = "index.html";
}

// Update UI elements based on user state and role
function updateUI(user) {
  const authButtons = document.getElementById("authButtons");
  const profileMenu = document.getElementById("profileMenu");
  const profileDropdown = document.getElementById("profileDropdown");
  const logoutBtn = document.getElementById("logoutBtn");
  const navbarUser = document.getElementById("navbarUser");

  if (user) {
    if (authButtons) authButtons.style.display = "none";
    if (profileMenu) profileMenu.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none"; // We use profile menu logout

    // Set profile image or default
    const profileIcon = document.getElementById("profileIcon");
    profileIcon.src = user.profilePictureUrl || "images/default-avatar.png";

    // Optional: update navbarUser greeting for non-admins
    if (navbarUser && user.role.toLowerCase() !== "admin") {
      // Keep profile menu visible, no text needed here if using icon dropdown
    }
  } else {
    if (authButtons) authButtons.style.display = "inline-block";
    if (profileMenu) profileMenu.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";

    if (navbarUser) {
      // Reset login links
      authButtons.innerHTML = `
        <a href="login.html">User Login</a> |
        <a href="admin-login.html">Donor Login</a>
      `;
    }
  }

  // Always hide dropdown on UI update
  if(profileDropdown) profileDropdown.style.display = "none";
}

// Setup profile dropdown toggle
document.addEventListener("DOMContentLoaded", async () => {
  // Setup dropdown toggle listeners
  const profileIcon = document.getElementById("profileIcon");
  const profileDropdown = document.getElementById("profileDropdown");
  const profileMenu = document.getElementById("profileMenu");
  const logoutLink = document.getElementById("logoutLink");

  if (profileIcon && profileDropdown) {
    profileIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
    });
  }

  window.addEventListener("click", () => {
    if (profileDropdown) profileDropdown.style.display = "none";
  });

  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Verify user on page load and update UI
  const user = await verifyToken();

  if (user) {
    localStorage.setItem("role", user.role.toLowerCase());
    localStorage.setItem("name", user.name);

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    if (user.role.toLowerCase() === "admin" && currentPage === "index.html") {
      window.location.href = "add-food.html";
      return;
    }
  } else {
    localStorage.clear();
  }

  updateUI(user);
});

// Login form handler (keep your existing if present)
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role.toLowerCase());
    localStorage.setItem("name", data.user.name);
    window.location.href = data.user.role.toLowerCase() === "admin" ? "add-food.html" : "index.html";
  } else {
    alert(data.message || "Login failed");
  }
});

// Register form handler (keep your existing if present)
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value.toLowerCase();

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role })
  });
  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", data.user.name);
    window.location.href = role === "admin" ? "add-food.html" : "index.html";
  } else {
    alert(data.message || "Registration failed");
  }
});
