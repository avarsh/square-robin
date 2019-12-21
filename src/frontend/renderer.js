const { ipcRenderer } = require('electron');
let Handlebars = require('handlebars/runtime');
let createTemplates = require('./frontend/templates/build/templates');
const DateHandler = require('./utils/date');
window.$ = window.jQuery = require('./resources/jquery-3.4.1.min.js');
const dateHandler = new DateHandler();

class StateManager {

    constructor() {
        this.daily = "none";
        this.all = "none";
    }
}

const state = new StateManager();

$(window).on('load', () => {
    // Firstly we hide all elements
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
    setupTaskList();

    // Add precompiled templates
    createTemplates();
    Handlebars.registerPartial('subtasks', Handlebars.templates['subtasks']);

    // Set up callbacks
    $('#daily-btn').click(() => switchViews('daily'));
    $('#tasks-btn').click(() => switchViews('tasks'));
    $('#new-task').click(showProjectDialog);
    $('#daily-tasks-add').click(showProjectDialog);
    $('#all-tasks-add').click(showProjectDialog);
    $('#daily-generate-tasks').click(generationRequest);

    ipcRenderer.on('dialog-closed', () => {
        $('.blackout').fadeOut(100);
    });

    ipcRenderer.on('project-submit', onProjectSubmit);

    // We try to get the user data
    let userData = ipcRenderer.sendSync('user-data-request', null);
    taskCount = userData['tasks'].length;
    loadDefaultView();
    $('#default-view').show(200);
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

function setupTaskList() {
    $('.task-container').on("click", '.task-box', expandTaskbox);
    $('.task-container').on("click", '.task-box > table .task-checkbox-col > .checkbox-container', checkboxClicked);
    $('.task-container').on("click", '.task-input input', (event) => {
        event.stopPropagation();
    });

    $('.task-container').on("click", '.subtask-add-button', addSubtask);
    $('.task-container').on("click", '.subtask-container .checkbox-container', subtaskChecked);
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

function getTaskWithId(id, tasks) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]['id'] == id) {
            return tasks[i];
        }
    }

    return null;
}

function fillDailyView(data) {
    let dailyList = [];
    //alert(JSON.stringify(data['daily']));
    //alert(data['daily']);
    data['daily'].forEach((id, idx, arr) => {
        dailyList.push(getTaskWithId(id, data['tasks']));
    });

    $('#daily-tasks-container').html(
        Handlebars.templates['tasklist'](
            dateHandler.convertTaskListForHuman(dailyList)
        )
    );

    hideAllDaily();
    $('#daily-tasks-container').show();
    state.daily = "daily-tasks";
}

function loadDefaultView() {
    let data = ipcRenderer.sendSync('user-data-request');

    hideAllDaily();
    if (data['tasks'].length == 0) {
        // If there are no tasks in the system,
        // prompt the user to add some
        $('#no-tasks-container-all').show();
        $('#no-tasks-container-daily').show();

        switchViews('tasks');
        state.daily = "none";
        state.all = "none";
    } else {
        // There are tasks in the system, so fill up the all task list
        $('#all-tasks-container').html(Handlebars.templates['tasklist'](
            dateHandler.convertTaskListForHuman(data['tasks'])));
        $('#all-tasks-container').show();
        state.all = "all";

        if (data['timestamp'] == dateHandler.todayStr) {
            // If we have generated tasks today
            //alert(data['daily']);
            if (data['daily'].length == 0) {
                // But if the user has completed them all
                $('#all-done-container').show();
                state.daily = "all-done";
            } else {
                // If the user hasn't completed them all,
                // show them
                fillDailyView(data);
            }
        } else {
            // We haven't generated tasks today
            data = ipcRenderer.sendSync('daily-list-request', null);
            fillDailyView(data);
        }

        switchViews('daily');
    }

    $('#default-view').show();
}

function reloadTasks(data) {
    $('#all-tasks-container').html(
        Handlebars.templates['tasklist'](
            dateHandler.convertTaskListForHuman(data['tasks'])
        )
    );

    $('#all-tasks-container').show();
    state.all = "all";
}

function onProjectSubmit(event, data) {
    reloadTasks(data);
    $('#no-tasks-container-all').hide();

    // After adding a task we may need to update the daily view
    if (state.daily != "daily-tasks" && state.daily != "all-done") {
        $('#no-tasks-container-daily').hide();
        $('#none-generated-container').show();
        state.daily = "none-generated";
    }
}

function generationRequest(event) {
    /* Check if there are tasks available in this session
       by looping through the task list.
       This is to cover the edge case where the user adds tasks
       and immediately checks them off.
     */

    if ($('#all-tasks-container').children('[data-completed="false"]').length != 0) {
        let data = ipcRenderer.sendSync('daily-list-request', null);
        fillDailyView(data);
    } else {
        ipcRenderer.send('show-error', {title: 'No Tasks Available', message: 'Try adding some more.'})
    }
}

function checkboxClicked(event) {
    let completed = !($(event.target).hasClass('checked'));
    let curr = event.target;
    curr = $(curr).closest('.task-box');

    let id = $(curr).attr('data-id');
    queueRemoval(id, completed);
    $('.task-box[data-id="' + id + '"]').each(function(idx, element) {
        let checkbox = $(element).find('.checkbox-container').first();
        $(checkbox).toggleClass('checked');
        $(element).attr('data-completed', completed);
    });

    event.stopPropagation();
}


function subtaskChecked(event) {
    event.stopPropagation();
    let localBox = $(event.target).closest('.subtask-box');
    let index = $(localBox).attr('data-id');
    let completed = ($(localBox).attr('data-completed') == 'false');

    let taskbox = $(event.target).closest('.task-box');
    let id = $(taskbox).attr('data-id');
    
    $('.task-box[data-id="' + id + '"]').each(function(idx, element) {
        let subtaskBox = $(element).find('.subtask-box[data-id="' + index + '"]');
        $(subtaskBox).attr('data-completed', completed);
    });


    ipcRenderer.sendSync('complete-subtask', {'completed': completed, 'id':id, 'index':index});
}

function queueRemoval(id, completed) {
    // Queue for removal in backend
    if (completed) {
        ipcRenderer.sendSync('task-remove-request', id);
    } else {
        ipcRenderer.sendSync('task-remove-cancel', id);
    }
}

function expandTaskbox() {
    $(this).find('.subtask-container').each((idx, element) => {
        $(element).slideToggle(200);
    });
}

function addSubtask(event) {
    event.stopPropagation();

    let button = event.target;
    let taskbox = $(button).closest('.task-box');
    args = {};
    let id = $(taskbox).attr('data-id');
    args['id'] = id;
    let input = $(taskbox).find('.task-input').first().children('input').first();
    args['description'] = $(input).val();
    let data = ipcRenderer.sendSync('add-subtask', args);
    
    $('.task-box[data-id="' + id + '"]')
        .find('.subtask-container')
        .html(
            Handlebars.templates['subtasks'](
                getTaskWithId(id, data['tasks'])
            )
    );
}
