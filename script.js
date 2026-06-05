const leadForm = document.querySelector(".lead-form");
const preferredDate = document.querySelector('input[name="preferred-date"]');

if (preferredDate) {
  preferredDate.min = new Date().toISOString().split("T")[0];
}

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    if (window.location.protocol === "file:") {
      event.preventDefault();
      window.location.href = "thank-you.html";
      return;
    }

    const button = leadForm.querySelector("button[type='submit']");

    if (button) {
      button.textContent = "Sending...";
      button.disabled = true;
    }
  });
}
