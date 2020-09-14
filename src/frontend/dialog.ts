import * as $ from "jquery";

export function setupDialog() {
  $("#deadline-switch-check").change(toggleDate);
}

function toggleDate() {
  $("#due-date").prop("disabled", !$('#deadline-switch-check').is(':checked'));
}