// Enable strict mode for entire script
"use strict";

$(function() {
    $("#config_expand_button").click(function() {
        var configBlock = $("#config_block");
        if(configBlock.is(":visible")) {
            configBlock.hide();
        } else {
            SMART_FOLDER_LIST.loadIn(configBlock);
            // Eventually I may change this to slideDown(), but that's laggy right now
            // Making elements fixed-width may help, but that stiffens the design too much right now
            configBlock.show();
        }
    });
});

