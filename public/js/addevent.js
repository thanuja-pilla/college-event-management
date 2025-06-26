document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("event-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("event-name").value;
    const type = document.getElementById("event-type").value;
    const startDate = document.getElementById("event-start-date").value;
    const endDate = document.getElementById("event-end-date").value;
    const url = document.getElementById("event-url").value;
    const description = document.getElementById("event-description").value;
    const eligibility = document.getElementById("event-eligibility").value;

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          startDate,
          endDate,
          url,
          description,
          eligibility,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Event added successfully!");
        form.reset();
      } else {
        alert("❌ Failed to add event: " + result.message);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("⚠️ Server error. Please try again later.");
    }
  });
});
