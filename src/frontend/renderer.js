const {ipcRenderer} = require('electron');
let Handlebars = require('handlebars/runtime');
let createTemplates = require('./frontend/templates/build/templates');
window.$ = window.jQuery = require('./resources/jquery-3.4.1.min.js');
const today = new Date();

$(window).on('load', () => {
    // Firstly we hide all elements
    $('#first-run').hide();
    $('#default-view').hide();
    $('#new-task-dialog').hide();
    $('.blackout').hide();

    // Hide the subviews within the views as well
    $('#daily-tasks-container').hide();
    $('#no-tasks-container-daily').hide();
    $('#none-generated-container').hide();
    $('#all-done-container').hide();

    $('#all-tasks-container').hide();
    $('#no-tasks-container-all').hide();

    // Configure UI elements
    setupUI();

    // Hide dialog views
    resetTaskDialog();

    createTemplates();

    // Set up callbacks
    $("#name-submit").click(onNameInput);
    $('#daily-btn').click(() => switchViews('daily'));
    $('#tasks-btn').click(() => switchViews('tasks'));
    $('#new-task').click(showProjectDialog);
    $('#project-button').click(showProjectForm);
    $('#new-task-dialog-close').click(hideProjectDialog);

    // We try to get the user data
    let userData = ipcRenderer.sendSync('user-data-request', null);
    if (userData === null) {
        // We're on the first run
        $('#first-run').show(150);
    } else {
        loadDefaultView();
        $('#default-view').show(200);
    }
});

function setupUI() {
    // Linked buttons
    $('.linked').click((event) => {
        let group = $(event.target).parent();
        group.children().attr('data-selected', 'false');
        $(event.target).attr('data-selected', 'true');
        return true;
    });
}


function onNameInput() {
    // TODO: Input validation
    // Send the name to the backend
    let name = $("#name-input").val();
    ipcRenderer.sendSync('user-info-input', name);

    // Hide first run view and show the default view
    $('#first-run').hide(100);

    loadDefaultView();
}

function switchViews(view) {
    if (view == 'daily') {
        $('#tasks-view').fadeOut(100, function() {
            $('#daily-view').fadeIn(100);
        });
        $('#daily-btn').attr('data-selected', 'true');
        $('#tasks-btn').attr('data-selected', 'false');
    } else if (view == 'tasks') {
        $('#daily-view').fadeOut(100, function() {
            $('#tasks-view').fadeIn(100);
        });
        $('#daily-btn').attr('data-selected', 'false');
        $('#tasks-btn').attr('data-selected', 'true');
    }
}

function resetTaskDialog() {
    $('#project-details-form').hide();
}

function showProjectDialog() {
    $('#project-details-form').trigger('reset');

    $('#task-type-selector').show();
    $('#project-details-form').hide();

    $('.blackout').fadeIn(100);
    $('#new-task-dialog').fadeIn(100);
}

function hideProjectDialog() {
    $('.blackout').fadeOut(100);
    $('#new-task-dialog').fadeOut(100);
}

function showProjectForm() {
    $('#task-type-selector').fadeOut(100, function() {
        $('#project-details-form').fadeIn(100);
    });
}

function hideAllDaily() {
    $('#daily-tasks-container').hide();
    $('#no-tasks-container-daily').hide();
    $('#none-generated-container').hide();
    $('#all-done-container').hide();
}

function fillDailyView(data) {
    $('#daily-tasks-container').html(Handlebars.templates['tasklist'](data['daily']));
    $('#daily-tasks-container').show();
}

function loadDefaultView() {
    let data = ipcRenderer.sendSync('user-data-request');
    $('#greeting').html(Handlebars.templates['greeting']({'username' : data['username']}));

    hideAllDaily();
    if (data['tasks'].length == 0) {
        switchViews('tasks');
        $('#no-tasks-container-all').show();
        $('#no-tasks-container-daily').show();
    } else {
        switchViews('daily');
        if (data['daily'].length == 0) {
            if (data['timestamp'] == today.toDateStr()) {
                // We must have completed all the tasks for today
                $('#all-done-container').show();
            } else {
                // Generate the tasks
                data['daily'] = ipcRenderer.sendSync('daily-list-request', null);
                fillDailyView(data);
            }
        } else {
            fillDailyView(data);
        }

        // Fill all tasks template
        $('#all-tasks-container').html(Handlebars.templates['tasklist'](data['tasks']));
    }
}