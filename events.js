const API_EVENTS = "http://localhost:5000/api/events";

async function loadEvents() {
  const res = await fetch(API_EVENTS, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
  });
  const events = await res.json();
  document.getElementById("eventsList").innerHTML = events.map(e => `
    <div>
      <b>${e.eventName}</b> - ${new Date(e.eventDate).toLocaleString()}
    </div>
  `).join("");
}

document.getElementById("eventForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    eventName: document.getElementById("eventName").value,
    eventDate: document.getElementById("eventDate").value
  };
  await fetch(API_EVENTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(data)
  });
  loadEvents();
});

loadEvents();
