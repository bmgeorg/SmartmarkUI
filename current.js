// Enable strict mode for entire script
"use strict";

var CURRENT = (function() {
var module = {};

$(function() {
    //TODO: ask backend for current page folder
    //TODO: ask backend for recommended folder

    var clist = $('#clist');
    var current_folder_row = $('#current_folder_row');
    current_folder_row.click(function() {
        if(clist.is(":visible")) {
            collapse();
        } else {
            expand();
        }
    });
    UTILITY.clickOutside(clist.add(current_folder_row), 'current_folder_expand', collapse);
});

function collapse() {
    $('#clist').hide();
}

function expand() {
    CONFIG.collapse();
    var clist = $('#clist');
    loadList(clist, setCurrentFolder);
    clist.show();
}

// folder - SmartFolder
function setCurrentFolder(folder) {
    collapse();
    $('#current_folder').text(folder.name());
    BACKEND.setCurrentFolder(folder);
}

// list - jQuery
// callback - function(SmartFolder)
function loadList(list, callback) {
    list.empty();

    var smartFolders = BACKEND.smartFolders();
    for(var i = 0; i < smartFolders.length; i++) {
        (function(i) {
            var smartFolder = smartFolders[i];
            var item = $('<div class="clist_item"></div>');
            item.text(smartFolder.name());
            item.click(function() {
                callback(smartFolder);
            });
            list.append(item);
        }(i));
    }
}

return module;
}());
