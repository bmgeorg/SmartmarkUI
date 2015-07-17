// Enable strict mode for entire script
"use strict";

var CURRENT = (function() {
var module = {};

//TODO: ask backend for current page folder
//TODO: ask backend for recommended folder

$(function() {
    $('#current_folder_row').click(function() {
        var container = $('#clist_container');
        if(container.is(":visible")) {
            container.hide();
        } else {
            loadListIn(container);
            container.show();
        }
    });
});

function loadListIn(container) {
    container.empty();
    var list = $('<div id="clist"></div>');

    var smartFolders = BACKEND.smartFolders();
    //for(var i = 0; i < smartFolders.length; i++) {
    for(var i = 0; i < 1; i++) {
        var smartFolder = smartFolders[i];
        var item = $('<div class="clist_item"></div>');
        item.data('smartFolder', smartFolder);
        item.text(smartFolder.name());
        item.click(function() {
            console.log('item clicked');
        });
        list.append(item);
    }
    container.append(list);
}

return module;
}());
