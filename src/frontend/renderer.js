const { ipcRenderer } = require('electron');
let Handlebars = require('handlebars/runtime');
let createTemplates = require('./frontend/templates/build/templates');
window.$ = window.jQuery = require('./resources/jquery-3.4.1.min.js');
const today = new Date();

$(window).on('load', () => {
    // Firstly we hide all elements
    $('#first-run').hide();
    $('#default-view').hide();
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
    //resetTaskDialog();

    createTemplates();

    // Set up callbacks
    $("#name-submit").click(onNameInput);
    $('#daily-btn').click(() => switchViews('daily'));
    $('#tasks-btn').click(() => switchViews('tasks'));
    $('#new-task').click(showProjectDialog);
    $('#daily-tasks-add').click(showProjectDialog);
    $('#all-tasks-add').click(showProjectDialog);
    $('#daily-generate-tasks').click(generationRequest);

    ipcRenderer.on('dialog-closed', () => {
        $('.blackout').fadeOut(100);
    });

    ipcRenderer.on('project-submit', (event, data) => {
        reloadTasks(data);
        $('#no-tasks-container-all').hide();

        // After adding a task we may need to update the daily view
        if (!$('#daily-tasks-container').is(':visible') ||
            $('#daily-tasks-container').is(':hidden')) {
            $('#no-tasks-container-daily').hide();
            $('#none-generated-container').show();
        }
    });

    // We try to get the user data
    let userData = ipcRenderer.sendSync('user-data-request', null);
    if (userData === null) {
        // We're on the first run
        $('#first-run').show(150);
    } else {
        taskCount = userData['tasks'].length;
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

    $('.tooltip-text').hide();
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
        $('#tasks-view').fadeOut(100, function () {
            $('#daily-view').fadeIn(100);
        });
        $('#daily-btn').attr('data-selected', 'true');
        $('#tasks-btn').attr('data-selected', 'false');
    } else if (view == 'tasks') {
        $('#daily-view').fadeOut(100, function () {
            $('#tasks-view').fadeIn(100);
        });
        $('#daily-btn').attr('data-selected', 'false');
        $('#tasks-btn').attr('data-selected', 'true');
    }
}

function showProjectDialog() {
    $('.blackout').fadeIn(100);
    ipcRenderer.send('show-task-dialog');
}

function hideAllDaily() {
    $('#daily-tasks-container').hide();
    $('#no-tasks-container-daily').hide();
    $('#none-generated-container').hide();
    $('#all-done-container').hide();
}

function fillDailyView(data) {
    $('#daily-tasks-container').html(Handlebars.templates['tasklist'](data['daily']));
    hideAllDaily();
    $('#daily-tasks-container').show();

    // Checkmarks 
    $('.checkbox-container').click(checkboxClicked);
    
}

function loadDefaultView() {
    let data = ipcRenderer.sendSync('user-data-request');
    $('#greeting').html(Handlebars.templates['greeting']({ 'username': data['username'] }));

    hideAllDaily();
    if (data['tasks'].length == 0) {
        // If there are no tasks in the system,
        // prompt the user to add some
        $('#no-tasks-container-all').show();
        $('#no-tasks-container-daily').show();

        switchViews('tasks');
    } else {
        // There are tasks in the system, so fill up the all task list
        $('#all-tasks-container').html(Handlebars.templates['tasklist'](data['tasks']));
        $('#all-tasks-container').show();

        if (data['timestamp'] == today.toDateString()) {
            // If we have generated tasks today
            if (data['daily'].length == 0) {
                // But if the user has completed them all
                $('#all-done-container').show();
            } else {
                // If the user hasn't completed them all,
                // show them
                fillDailyView(data);
            }
        } else {
            // We haven't generated tasks today
            data['daily'] = ipcRenderer.sendSync('daily-list-request', null);
            fillDailyView(data);
        }

        switchViews('daily');
    }

    $('#default-view').show();
}

function reloadTasks(data) {
    $('#all-tasks-container').html(Handlebars.templates['tasklist'](data['tasks']));
    $('#all-tasks-container').show();
    $('.checkbox-container').click(checkboxClicked);
}

function generationRequest(event) {
    /* Check if there are tasks available in this session
       by looping through the task list.
       This is to cover the edge case where the user adds tasks
       and immediately checks them off.
     */

    if ($('#all-tasks-container').children('[data-completed="false"]').length != 0) {
        data = []
        data['daily'] = ipcRenderer.sendSync('daily-list-request', null);
        fillDailyView(data);
    } else {
        ipcRenderer.send('show-error', {title: 'No Tasks Available', message: 'Try adding some more.'})
    }
}

function checkboxClicked(event) {
    $(event.target).toggleClass('checked');
    let completed = $(event.target).hasClass('checked');
    let curr = event.target;
    while (!$(curr).hasClass('task-box')) {
        curr = $(curr).parent();
    }

    $(curr).attr('data-completed', completed);

    // Queue for removal in backend
    let parent = $(curr).parent().attr('id');
    if (parent == 'daily-tasks-container') {
        if (completed) {
            ipcRenderer.sendSync('daily-remove-request', $(curr).attr('data-id'));
        } else {
            ipcRenderer.sendSync('daily-remove-cancel', $(curr).attr('data-id'));
        }
    } else if (parent == 'all-tasks-container') {
        if (completed) {
            ipcRenderer.sendSync('task-remove-request', $(curr).attr('data-id'));
        } else {
            ipcRenderer.sendSync('task-remove-cancel', $(curr).attr('data-id'));
        }
    }
}