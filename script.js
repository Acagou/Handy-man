const leadForm = document.querySelector(".lead-form");

if (leadForm) {
  leadForm.addEventListener("submit", () => {
    const button = leadForm.querySelector("button[type='submit']");

    if (button) {
      button.textContent = "Sending...";
      button.disabled = true;
    }
  });
}
