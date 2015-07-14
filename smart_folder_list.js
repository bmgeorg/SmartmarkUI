// Enable strict mode for entire script
"use strict";

var SMART_FOLDER_LIST = (function() {
var module = {};

// container - jQuery
module.loadIn = function(container) {
    container.empty();

    var list = $('<div class="slist"></div>');

    var smartFolders = BACKEND.getSmartFolders();
    for(var i = 0; i < smartFolders.length; i++) {
        var item = createListItem(smartFolders[i]);
        list.append(item);
    }

    container.append(list);
}

// smartFolder - SmartFolder (see backend.js)
// returns - jQuery
function createListItem(smartFolder) {
    var item = $('<div class="slist_item"></div>');
    item.data("smartFolder", smartFolder);
    item.hover(
        function() {
            $(this).addClass("slist_item_hover");
        },
        function() {
            $(this).removeClass("slist_item_hover");
        }
    );

    var nameRow = $('<div class="slist_item_top_row flex_row"></div>');
    var tagsRow = $('<div class="slist_item_bottom_row flex_row"></div>');

    var name = $('<input type="text" class="slist_item_name full_height" \
        placeholder="Set folder name" />');
    name.val(smartFolder.name());
    name.change(function() {
        var newName = $(this).val();
        var theSmartFolder = item.data("smartFolder");
        // If newName is not empty and not just whitespace
        if(/\S/.test(newName)) {
            theSmartFolder.changeName(newName);
        } else {
            // Disallow empty/whitespace name - reset to previous value
            $(this).val(theSmartFolder.name());
        }
    });
    blurOnEnter(name);

    var tags = $('<input type="text" class="full_height" \
        placeholder="Tags (C++, Java, imgur)" />');
    tags.attr("value", smartFolder.tagsString());
    tags.change(function() {
        var newTagsString = $(this).val();
        var theSmartFolder = smartFolderBox.data("smartFolder");
        theSmartFolder.changeTagsString(newTagsString);
    });
    blurOnEnter(tags);

    nameRow.append('<div class="lightbulb_folder_icon small_icon"></div>');
    nameRow.append(name);
    tagsRow.append(tags);

    item.append(nameRow);
    item.append(tagsRow);

    // Add delete button
    var deleteButton = $('<div class="slist_item_delete"></div>');
    item.append(deleteButton);

    return item;
}

// Adds event listener that causes input to lose focus on enter press
// input - jQuery
function blurOnEnter(input) {
    input.keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
        }
    });
}

return module;
}());
