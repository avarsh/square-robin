const {ipcRenderer} = require('electron');
window.$ = window.jQuery = require('./resources/jquery-3.4.1.min.js');

$(window).on('load', () => {
    // Linked buttons
    $('.linked').click((event) => {
        let group = $(event.target).parent();
        group.children().attr('data-selected', 'false');
        $(event.target).attr('data-selected', 'true');
        return true;
    });
});

ipcRenderer.on('show', () => {
    $('#project-details-form').trigger('reset');
    $('.tooltip-text').hide();
    $('#task-type-selector').show();
    $('#project-details-form').hide();

    $('#project-button').click(showProjectForm);
    $('#new-project-accept').click(addProject);
});

function showProjectForm(event) {
    $('#task-type-selector').fadeOut(100, function() {
        $('#project-details-form').fadeIn(100);
    });
}

function projectInputValid() {
    valid = true;
    if ($('#project-desc').val() == "") {
        $('#no-desc-err').fadeIn(200);
        valid = false;
    } else {
        $('#no-desc-err').fadeOut(200);
    }

    if ($('#project-due-date').val() == "") {
        $('#no-date-err').fadeIn(200);
        valid = false;
    } else {
        $('#no-date-err').fadeOut(200);
    }

    return valid;
}


function addProject(event) {
    if (!projectInputValid()) {
        return false;
    }

    let project = {};
    project['description'] = $('#project-desc').val();
    project['date'] = $('#project-due-date').val();
    if ($('#quick-size').attr('data-selected') == 'true') {
        project['size'] = 'quick';
    } else if ($('#long-size').attr('data-selected') == 'true') {
        project['size'] = 'long';
    } else if ($('#marathon-size').attr('data-selected') == 'true') {
        project['size'] = 'marathon';
    }

    project['schedule-on'] = $('#schedule-option').val();
    let data = ipcRenderer.sendSync('project-submit', project);

    return false;
}