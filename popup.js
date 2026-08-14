const DEFAULTS = { enabled: true, mode: "asterisks", intensity: "balanced" };
const levels = ["gentle", "balanced", "ruthless"];
const enabled = document.querySelector("#enabled");
const slider = document.querySelector("#intensity");
const label = document.querySelector("#intensityLabel");

function setDisabledState(value) {
  document.body.classList.toggle("disabled", !value);
}

chrome.storage.sync.get(DEFAULTS, settings => {
  enabled.checked = settings.enabled;
  document.querySelector(`input[name="mode"][value="${settings.mode}"]`).checked = true;
  slider.value = levels.indexOf(settings.intensity);
  label.value = settings.intensity[0].toUpperCase() + settings.intensity.slice(1);
  setDisabledState(settings.enabled);
});

enabled.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabled.checked });
  setDisabledState(enabled.checked);
});
document.querySelectorAll('input[name="mode"]').forEach(input => input.addEventListener("change", () => {
  chrome.storage.sync.set({ mode: input.value });
}));
slider.addEventListener("input", () => {
  const value = levels[Number(slider.value)];
  label.value = value[0].toUpperCase() + value.slice(1);
  chrome.storage.sync.set({ intensity: value });
});
