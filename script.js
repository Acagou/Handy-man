const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const leadForm = document.querySelector(".lead-form");
const serviceCards = document.querySelectorAll(".service-card");
const selectedService = document.querySelector("#selected-service");
const workType = document.querySelector('select[name="work-type"]');
const preferredDate = document.querySelector('input[name="preferred-date"]');
const textarea = document.querySelector('textarea[name="job-description"]');
const characterCount = document.querySelector(".character-count");
const fileInput = document.querySelector('input[name="photos"]');
const photoFeedback = document.querySelector(".photo-feedback");
const nextButton = document.querySelector("[data-next-step]");
const prevButton = document.querySelector("[data-prev-step]");
const submitButton = document.querySelector('button[type="submit"]');
const formSteps = document.querySelectorAll("[data-step]");
const stepIndicators = document.querySelectorAll("[data-step-indicator]");
let currentStep = 1;

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

if (preferredDate) {
  preferredDate.min = today.toISOString().split("T")[0];
}

if (navToggle && siteHeader) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("nav-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTarget);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

function setService(serviceName) {
  serviceCards.forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.service === serviceName);
  });

  if (selectedService) {
    selectedService.value = serviceName;
  }

  if (workType) {
    workType.value = serviceName;
  }

  updateReview();
}

serviceCards.forEach((card) => {
  card.addEventListener("click", () => {
    setService(card.dataset.service);
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (workType) {
  workType.addEventListener("change", () => {
    if (workType.value) {
      setService(workType.value);
    }
  });
}

function updateCharacterCount() {
  if (!textarea || !characterCount) {
    return;
  }

  characterCount.textContent = `${textarea.value.length} / ${textarea.maxLength}`;
}

if (textarea) {
  textarea.addEventListener("input", updateCharacterCount);
  updateCharacterCount();
}

function selectedPhotoText() {
  if (!fileInput || !fileInput.files.length) {
    return "None selected";
  }

  const count = Math.min(fileInput.files.length, 5);
  return `${count} photo${count === 1 ? "" : "s"} selected`;
}

if (fileInput && photoFeedback) {
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 5) {
      photoFeedback.textContent = "Please upload 5 photos or fewer.";
      fileInput.value = "";
    } else {
      photoFeedback.textContent = selectedPhotoText();
    }

    updateReview();
  });
}

function setStep(step) {
  currentStep = Math.max(1, Math.min(3, step));

  formSteps.forEach((panel) => {
    panel.classList.toggle("is-active", Number(panel.dataset.step) === currentStep);
  });

  stepIndicators.forEach((item) => {
    item.classList.toggle("is-active", Number(item.dataset.stepIndicator) === currentStep);
  });

  if (prevButton) {
    prevButton.hidden = currentStep === 1;
  }

  if (nextButton) {
    nextButton.hidden = currentStep === 3;
  }

  if (submitButton) {
    submitButton.hidden = currentStep !== 3;
  }

  updateReview();
}

function fieldsForCurrentStep() {
  const activeStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  return activeStep ? Array.from(activeStep.querySelectorAll("input, select, textarea")) : [];
}

function validateCurrentStep() {
  const fields = fieldsForCurrentStep().filter((field) => field.type !== "file");

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  return true;
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (!validateCurrentStep()) {
      return;
    }

    setStep(currentStep + 1);
  });
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    setStep(currentStep - 1);
  });
}

function setReviewValue(name, value) {
  const target = document.querySelector(`[data-review="${name}"]`);
  if (target) {
    target.textContent = value || "Not selected";
  }
}

function updateReview() {
  setReviewValue("work-type", workType?.value || selectedService?.value || "Punch lists");
  setReviewValue("preferred-date", preferredDate?.value || "Not selected");
  setReviewValue("time-window", document.querySelector('select[name="time-window"]')?.value || "Anytime");
  setReviewValue("photos", selectedPhotoText());
}

if (leadForm) {
  leadForm.addEventListener("input", updateReview);
  leadForm.addEventListener("change", updateReview);
  leadForm.addEventListener("submit", (event) => {
    if (!leadForm.checkValidity()) {
      event.preventDefault();
      leadForm.reportValidity();
      return;
    }

    if (window.location.protocol === "file:") {
      event.preventDefault();
      window.location.href = "thank-you.html";
      return;
    }

    if (submitButton) {
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;
    }
  });
}

setStep(1);
updateReview();
