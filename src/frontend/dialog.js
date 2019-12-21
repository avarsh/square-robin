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

    $('#new-project-accept').click(addProject);
    $('#deadline-switch-check').click(toggleDateSelector);
});

ipcRenderer.on('show', () => {
    $('#project-details-form').trigger('reset');
    $('#deadline-switch-check').prop('checked', true);
    $('.tooltip-text').hide();
    $('#project-details-form').show();
});

function projectInputValid() {
    valid = true;
    if ($('#project-desc').val() == "") {
        $('#no-desc-err').fadeIn(200);
        valid = false;
    } else {
        $('#no-desc-err').fadeOut(200);
    }

    if ($('#deadline-switch-check').is(':checked') && 
            $('#project-due-date').val() == "") {
        $('#no-date-err').fadeIn(200);
        valid = false;
    } else {
        $('#no-date-err').fadeOut(200);
    }

    return valid;
}

function toggleDateSelector(event) {
    $('#project-due-date').prop('disabled', !$('#deadline-switch-check').is(':checked'));

    return true;
}

function addProject(event) {
    if (!projectInputValid()) {
        return false;
    }

    let project = {};
    project['description'] = $('#project-desc').val();
    if ($('#deadline-switch-check').is(':checked')) {
        project['date'] = $('#project-due-date').val();
    } else {
        project['date'] = null;
    }

    if ($('#quick-size').attr('data-selected') == 'true') {
        project['size'] = 'quick';
    } else if ($('#long-size').attr('data-selected') == 'true') {
        project['size'] = 'long';
    } else if ($('#marathon-size').attr('data-selected') == 'true') {
        project['size'] = 'marathon';
    }

    ipcRenderer.sendSync('project-submit', project);

    return false;
}
