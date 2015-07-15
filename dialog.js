var DIALOG = (function() {
var module = {};

// modal_id - string
module.showDialog = function(modal_id) {
    var overlay = $('#dialog_overlay');
    overlay.css({
        'display': 'block',
        'opacity': 0,
    });
    overlay.fadeTo(200, 0.5);
    overlay.click(function() {
        module.closeDialog();
    });

    var modal = $('#' + modal_id);
    modal.fadeTo(200, 1);
}

// modal_id - string
module.closeDialog = function() {
    var overlay = $('#dialog_overlay');
    overlay.fadeOut(200);

    var modal = $('.dialog');
    modal.hide();
}

$(function() {
    $('body').append('<div id="dialog_overlay"></div>');
});

return module;
}());
