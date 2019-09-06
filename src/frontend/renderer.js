const {ipcRenderer} = require('electron');
window.$ = window.jQuery = require('./resources/jquery-3.4.1.min.js');

function onNameInput() {
    // Send the name to the backend
    let name = $("#name-input").val();
    ipcRenderer.sendSync('user-info-input', name);
}

$(window).on('load', () => {
    // Firstly we hide all elements
    $('#first-run').hide();
    $('#default-view').hide();
    $('#new-task-dialog').hide();

    // Set up callbacks
    $("#name-submit").click(onNameInput);

    // We try to get the user data
    let userData = ipcRenderer.sendSync('user-data-request', null);
    if (userData === null) {
        // We're on the first run
        $('#first-run').show(150);
    }
});