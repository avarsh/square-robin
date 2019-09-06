const {ipcRenderer} = require('electron');
const Handlebars = require('handlebars');
window.$ = window.jQuery = require('./resources/jquery-3.4.1.min.js');

function onNameInput() {
    // Send the name to the backend
    let name = $("#name-input").val();
    ipcRenderer.sendSync('user-info-input', name);

    // Hide first run view and show the default view
    $('#first-run').hide(100);

    loadDefaultView();
}

function loadDefaultView() {
    let data = ipcRenderer.sendSync('user-data-request');

    // TODO: precompile

    let greetingTemplateScript = $('#greeting-template').html();
    let greetingTemplate = Handlebars.compile(greetingTemplateScript);
    $('#greeting').html(greetingTemplate({'username' : data['username']}));

    $('#default-view').show(100);
}

$(window).on('load', () => {
    // Firstly we hide all elements
    $('#first-run').hide();
    $('#default-view').hide();
    $('#new-task-dialog').hide();

    // Hide the subviews within the views as well
    $('#daily-tasks-container').hide();
    $('#no-tasks-container-daily').hide();
    $('#none-generated-container').hide();
    $('#all-done-container').hide();

    $('#all-tasks-container').hide();
    $('#no-tasks-container-all').hide();

    // Set up callbacks
    $("#name-submit").click(onNameInput);

    // We try to get the user data
    let userData = ipcRenderer.sendSync('user-data-request', null);
    if (userData === null) {
        // We're on the first run
        $('#first-run').show(150);
    } else {
        loadDefaultView();
    }
});