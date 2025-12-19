const API_ANALYTICS = "http://localhost:5000/api/analytics";

async function loadAnalytics() {
  const res = await fetch(API_ANALYTICS, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
  });
  const data = await res.json();
  document.getElementById("analytics").innerHTML = `
    <p>Total Items: ${data.totalItems}</p>
    <p>Total Quantity Saved: ${data.totalQuantity} kg</p>
    <p>Carbon Saved: ${data.carbonSavedKg} kg CO₂</p>
  `;
}
loadAnalytics();
