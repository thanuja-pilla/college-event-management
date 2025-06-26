document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("eventsContainer");
  if (!container) {
    console.warn("Container with id 'eventsContainer' not found.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const filterType = params.get("type");

  try {
    const res = await fetch("/api/events");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const events = await res.json();

    const filteredEvents = filterType
      ? events.filter(
          (event) => event.type?.toLowerCase() === filterType.toLowerCase()
        )
      : events;

    if (!filteredEvents.length) {
      container.innerHTML = `
        <p class="text-center text-gray-600">
          No events found${filterType ? ` for '${filterType}'` : ""}.
        </p>`;
      return;
    }

    container.innerHTML = filteredEvents
      .map(
        (event) => `
      <div class="bg-white p-6 rounded-xl shadow-md space-y-2 mb-4">
        <h3 class="text-xl font-bold text-blue-700">${event.name}</h3>
        <p class="text-sm text-gray-600">📅 ${event.startDate} → ${event.endDate}</p>
        <p class="text-gray-800">${event.description}</p>
        <span class="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
          ${event.type}
        </span>
        ${
          event.url
            ? `<div><a href="${event.url}" target="_blank" class="text-blue-500 hover:underline">🔗 Visit Event</a></div>`
            : ""
        }
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.error("Error fetching events:", err);
    container.innerHTML = `<p class="text-center text-red-600">❌ Failed to load events. Please try again later.</p>`;
  }
});
