// This script handles how flash messages dis-misses after a few seconds
document.addEventListener("DOMContentLoaded", () => {
  const flashIds = ["flash-success", "flash-error"];

  flashIds.forEach((id) => {
    const alertEl = document.getElementById(id);
    if (alertEl) {
      setTimeout(() => {
        // uses Bootstrap's Alert instance to trigger the fade-out animation cleanly
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
        bsAlert.close();
      }, 3000); // disappears after 4 seconds
    }
  });
});
