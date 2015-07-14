// Enable strict mode for entire script
"use strict";

var SMART_FOLDER_LIST = (function() {
var module = {};

// container - jQuery
module.loadIn = function(container) {
    container.empty();

    var list = $('<div class="slist"></div>');

    var smartFolders = BACKEND.smartFolders();
    for(var i = 0; i < smartFolders.length; i++) {
        addListItem(list, smartFolders[i]);
    }

    container.append(list);
}

// list - jQuery
// smartFolder - SmartFolder (see backend.js)
function addListItem(list, smartFolder) {
    var item = $('<div class="slist_item"></div>');
    item.data("smartFolder", smartFolder);

    // shield absorbs hover and click events propagates them to item, preventing item's children
    // from receiving the events
    var shield = $('<div class="slist_item_shield"></div>');
    shield.hover(
        function() {
            item.addClass('slist_item_hover');
        },
        function() {
            item.removeClass('slist_item_hover');
        }
    );
    shield.click(function() {
        collapseAll(list);
        expand(item);
    });
    item.append(shield);

    var nameRow = $('<div class="slist_item_top_row flex_row"></div>');
    nameRow.append('<div class="lightbulb_folder_icon small_icon"></div>');
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
    nameRow.append(name);
    item.append(nameRow);

    var tagsRow = $('<div class="slist_item_bottom_row flex_row"></div>');
    var tags = $('<input type="text" class="full_height" \
        placeholder="Tags (C++, Java, imgur)" />');
    tags.attr("value", smartFolder.tagsString());
    tags.change(function() {
        var newTagsString = $(this).val();
        var theSmartFolder = smartFolderBox.data("smartFolder");
        theSmartFolder.changeTagsString(newTagsString);
    });
    blurOnEnter(tags);
    tagsRow.append(tags);
    item.append(tagsRow);

    var deleteButton = $('<div class="slist_item_delete"></div>');
    item.append(deleteButton);

    list.append(item);
}

// list - jQuery
function collapseAll(list) {
    $('.slist_item', list).removeClass('slist_item_expanded');
    $('.slist_item_shield', list).removeClass('slist_item_disabled_shield')
    $('.slist_item_bottom_row', list).hide();
}

// item - jQuery
function expand(item) {
    item.removeClass('slist_item_hover');
    item.addClass('slist_item_expanded');
    $('.slist_item_shield', item).addClass('slist_item_disabled_shield');
    $('.slist_item_bottom_row', item).show();        
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
