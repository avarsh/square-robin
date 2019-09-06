const {ipcRenderer} = require('electron');
const Handlebars = require('handlebars');
window.$ = window.jQuery = require('./resources/jquery-3.4.1.min.js');
const today = new Date();

function onNameInput() {
    // Send the name to the backend
    let name = $("#name-input").val();
    ipcRenderer.sendSync('user-info-input', name);

    // Hide first run view and show the default view
    $('#first-run').hide(100);

    loadDefaultView();
}

function switchViews(view) {
    if (view == 'daily') {
        $('#tasks-view').hide(200);
        $('#daily-view').show(200);
    } else if (view == 'tasks') {
        $('#daily-view').hide(200);
        $('#tasks-view').show(200);
    }
}

function hideAllDaily() {
    $('#daily-tasks-container').hide();
    $('#no-tasks-container-daily').hide();
    $('#none-generated-container').hide();
    $('#all-done-container').hide();
}

function loadDefaultView() {
    let data = ipcRenderer.sendSync('user-data-request');

    // TODO: precompile

    let greetingTemplateScript = $('#greeting-template').html();
    let greetingTemplate = Handlebars.compile(greetingTemplateScript);
    $('#greeting').html(greetingTemplate({'username' : data['username']}));

    if (data['tasks'].length == 0) {
        switchViews('tasks');
        $('#no-tasks-container-all').show();
        hideAllDaily();
        $('#no-tasks-container-daily').show();
    } else {
        switchViews('daily');
        if (data['daily'].length == 0) {
            if (data['timestamp'] == today.toDateStr()) {
                // We must have completed all the tasks for today
                hideAllDaily();
                $('#all-done-container').show();
            } else {
                // We need to generate some - TODO
            }
        } else {
            // Fill daily tasks template - TODO
        }

        // Fill all tasks template - TODO
    }

    $('#default-view').show(200);
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
    $('#daily-btn').click(() => switchViews('daily'));
    $('#tasks-btn').click(() => switchViews('tasks'));

    // We try to get the user data
    let userData = ipcRenderer.sendSync('user-data-request', null);
    if (userData === null) {
        // We're on the first run
        $('#first-run').show(150);
    } else {
        loadDefaultView();
    }
});