// ✅ Reusable Modal Function with Icons and OK/Cancel Support
function showModal({ title, message, type = "ok", icon = "info" }) {
  return new Promise((resolve) => {
    const backdrop = document.getElementById("shared-modal-backdrop");
    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const actions = document.getElementById("modal-actions");
    const iconElement = document.querySelector(".icon-wrapperr i");
    const iconWrapper = document.querySelector(".icon-wrapperr");

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    // 🧹 Clear old buttons
    actions.innerHTML = "";

    // 🟢 Set icon style based on type
    switch (icon) {
      case "success":
        iconElement.className = "fas fa-check-circle";
        iconWrapper.style.backgroundColor = "#e6ffe6";
        iconElement.style.color = "#28a745";
        break;
      case "error":
        iconElement.className = "fas fa-times-circle";
        iconWrapper.style.backgroundColor = "#ffe6e6";
        iconElement.style.color = "#dc3545";
        break;
      case "warning":
        iconElement.className = "fas fa-exclamation-triangle";
        iconWrapper.style.backgroundColor = "#fff3cd";
        iconElement.style.color = "#ffc107";
        break;
      default:
        iconElement.className = "fas fa-info-circle";
        iconWrapper.style.backgroundColor = "#e7f1ff";
        iconElement.style.color = "#007bff";
        break;
    }

    // 🔘 Add Cancel Button (if type is ok-cancel)
    if (type === "ok-cancel") {
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "لغو";
      cancelBtn.className = "modal-button-secondary";
      cancelBtn.onclick = () => {
        closeModal();
        resolve(false);
      };
      actions.appendChild(cancelBtn);
    }

    // 🔵 Add OK Button
    const okBtn = document.createElement("button");
    okBtn.textContent = "تأیید";
    okBtn.className = "modal-button-primary";
    okBtn.onclick = () => {
      closeModal();
      resolve(true);
    };
    actions.appendChild(okBtn);

    // ✨ Show modal
    backdrop.style.display = "flex";
  });
}

function closeModal() {
  document.getElementById("shared-modal-backdrop").style.display = "none";
}
