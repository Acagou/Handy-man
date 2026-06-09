const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const leadForm = document.querySelector(".lead-form");
const serviceCards = document.querySelectorAll(".service-card");
const selectedService = document.querySelector("#selected-service");
const requestTypeInputs = document.querySelectorAll('input[name="request-type"]');
const requestPathOptions = document.querySelectorAll(".request-path-option");
const requestPathPanels = document.querySelectorAll("[data-path-panel]");
const smallRepairType = document.querySelector('select[name="small-repair-type"]');
const estimateWorkType = document.querySelector('select[name="estimate-work-type"]');
const contactWindow = document.querySelector('select[name="contact-window"]');
const appointmentDays = document.querySelectorAll('input[name="preferred-date"]');
const timeWindow = document.querySelector('select[name="time-window"]');
const timeWindowField = document.querySelector(".time-window-field");
const descriptionLabel = document.querySelector("[data-description-label]");
const textarea = document.querySelector('textarea[name="job-description"]');
const characterCount = document.querySelector(".character-count");
const fileInput = document.querySelector('input[name="photo"]');
const photoFeedback = document.querySelector(".photo-feedback");
const nextButton = document.querySelector("[data-next-step]");
const prevButton = document.querySelector("[data-prev-step]");
const submitButton = document.querySelector('button[type="submit"]');
const formSteps = document.querySelectorAll("[data-step]");
const stepIndicators = document.querySelectorAll("[data-step-indicator]");
let currentStep = 1;

function currentRequestPath() {
  return document.querySelector('input[name="request-type"]:checked')?.dataset.pathChoice || "small-repair";
}

function currentRequestType() {
  return document.querySelector('input[name="request-type"]:checked')?.value || "$150 Small Repair Visit";
}

if (navToggle && siteHeader) {
  function closeNavigation() {
    siteHeader.classList.remove("nav-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function closeNavigationOnScrollIntent() {
    if (siteHeader.classList.contains("nav-open")) {
      closeNavigation();
    }
  }

  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("nav-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  window.addEventListener("wheel", closeNavigationOnScrollIntent, { passive: true });
  window.addEventListener("touchmove", closeNavigationOnScrollIntent, { passive: true });

  siteHeader.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });
}

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.requestPath) {
      setRequestPath(button.dataset.requestPath);
    }

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

  updateReview();
}

serviceCards.forEach((card) => {
  card.addEventListener("click", () => {
    setService(card.dataset.service);
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function setRequestPath(path) {
  requestTypeInputs.forEach((input) => {
    input.checked = input.dataset.pathChoice === path;
  });

  const isSmallRepair = path === "small-repair";

  requestPathOptions.forEach((option) => {
    option.classList.toggle("is-selected", option.querySelector("input")?.dataset.pathChoice === path);
  });

  requestPathPanels.forEach((panel) => {
    const isActive = panel.dataset.pathPanel === path;
    panel.hidden = !isActive;
    panel.querySelectorAll("input, select, textarea").forEach((field) => {
      if (field.matches('input[name="preferred-date"][disabled]')) {
        return;
      }

      field.disabled = !isActive;
    });
  });

  if (smallRepairType) {
    smallRepairType.required = isSmallRepair;
  }

  if (estimateWorkType) {
    estimateWorkType.required = !isSmallRepair;
  }

  if (contactWindow) {
    contactWindow.required = !isSmallRepair;
  }

  if (!isSmallRepair) {
    appointmentDays.forEach((day) => {
      if (!day.disabled) {
        day.checked = false;
      }
    });
  }

  if (descriptionLabel) {
    descriptionLabel.textContent = isSmallRepair ? "Short repair description" : "Short project description";
  }

  if (selectedService) {
    selectedService.value = currentRequestType();
  }

  updateTimeWindowState();
  updateReview();
}

requestTypeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    setRequestPath(input.dataset.pathChoice);
  });
});

[smallRepairType, estimateWorkType, contactWindow].forEach((field) => {
  field?.addEventListener("change", updateReview);
});

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

function selectedAppointmentDay() {
  return document.querySelector('input[name="preferred-date"]:checked')?.value || "";
}

function updateTimeWindowState() {
  const hasAvailableDay = currentRequestPath() === "small-repair" && Boolean(selectedAppointmentDay());

  if (timeWindow) {
    timeWindow.disabled = !hasAvailableDay;

    if (!hasAvailableDay) {
      timeWindow.value = "";
    }
  }

  if (timeWindowField) {
    timeWindowField.classList.toggle("is-disabled", !hasAvailableDay);
  }
}

appointmentDays.forEach((day) => {
  day.addEventListener("change", () => {
    updateTimeWindowState();
    updateReview();
  });
});

function selectedPhotoText() {
  if (!fileInput || !fileInput.files.length) {
    return "None selected";
  }

  return `${fileInput.files[0].name} selected`;
}

if (fileInput && photoFeedback) {
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]?.size > 10 * 1024 * 1024) {
      photoFeedback.textContent = "Please upload a photo under 10MB.";
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
  const isSmallRepair = currentRequestPath() === "small-repair";
  const requestType = currentRequestType();
  const workValue = isSmallRepair ? smallRepairType?.value : estimateWorkType?.value;
  const contactInfo = [
    document.querySelector('input[name="name"]')?.value,
    document.querySelector('input[name="phone"]')?.value,
    document.querySelector('input[name="email"]')?.value,
    document.querySelector('input[name="address"]')?.value
  ].filter(Boolean).join(" | ");

  document.querySelectorAll('[data-review-row="appointment"], [data-review-row="time-window"]').forEach((row) => {
    row.hidden = !isSmallRepair;
  });

  const typeLabel = document.querySelector('[data-review-label="repair-type"]');
  if (typeLabel) {
    typeLabel.textContent = isSmallRepair ? "Repair type" : "Project type";
  }

  const notesLabel = document.querySelector('[data-review-label="notes"]');
  if (notesLabel) {
    notesLabel.textContent = isSmallRepair ? "Repair notes" : "Project notes";
  }

  setReviewValue("request-type", requestType);
  setReviewValue("work-type", workValue || "Not selected");
  setReviewValue("preferred-date", isSmallRepair ? selectedAppointmentDay() || "Not selected" : "");
  setReviewValue("time-window", isSmallRepair ? timeWindow?.value || "Not selected" : "");
  setReviewValue("customer-info", contactInfo || "Not selected");
  setReviewValue("notes", textarea?.value || "None provided");
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

    const isLocalPreview = window.location.protocol === "file:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocalPreview) {
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
setRequestPath(currentRequestPath());
updateTimeWindowState();
updateReview();
