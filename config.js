// Enable strict mode for entire script
"use strict";

var CONFIG = (function() {
var module = {};

var selectedItem; // jQuery

$(function() {
    // Show config on config button click
    $('#config_expand_button').click(function() {
        if($('#config_block').is(':visible')) {
            module.collapse();
        } else {
            module.expand();
        }
    });

    // Set up confirm-delete dialog
    $('#confirm_delete').click(function() {
        if(selectedItem) {
            var folder = selectedItem.data('smartFolder');
            BACKEND.delete(folder);
        }

        // Close dialog and reload list
        UTILITY.closeDialog();
        loadList();
    });

    $('#cancel_delete').click(function() {
        UTILITY.closeDialog();
    });

    // Deselect item if there is a click outside the list and dialogs
    UTILITY.clickOutside(
        $('#slist').add('.dialog').add('#dialog_overlay'),
        'slist_deselect',
        deselect
    );
});

module.expand = function() {
    var configBlock = $('#config_block');
    loadList();
    configBlock.show();
}

module.collapse = function() {
    $('#config_block').hide();
}

// item - jQuery
function select(item) {
    deselect();
    selectedItem = item;
    item.removeClass('slist_item_hover');
    item.addClass('slist_item_selected');
    $('.slist_item_shield', item).addClass('slist_item_disabled_shield');
    $('.slist_item_bottom_row', item).removeClass('hidden');
    $('.slist_item_delete', item).removeClass('hidden');
}

function deselect() {
    if(selectedItem) {
        selectedItem.removeClass('slist_item_selected');
        $('.slist_item_shield', selectedItem).removeClass('slist_item_disabled_shield')
        $('.slist_item_bottom_row', selectedItem).addClass('hidden');
        $('.slist_item_delete', selectedItem).addClass('hidden');
        selectedItem = undefined;
    }
}

// idempotent
function loadList() {
    var list = $('#slist');
    list.empty();

    list.append(createNewFolderItem()); 
    var smartFolders = BACKEND.smartFolders();
    for(var i = 0; i < smartFolders.length; i++) {
        list.append(createListItem(smartFolders[i]));
    }
}

// returns jQuery
function createNewFolderItem() {
    var item = $('\
    <div class="slist_item">\
        <div class="slist_item_top_row">\
        + Add new folder\
        </div>\
    </div>\
    ');

    item.hover(
        function() {
            item.addClass('slist_item_hover');
        },
        function() {
            item.removeClass('slist_item_hover');
        }
    );
    item.click(function() {
        UTILITY.showDialog('new_folder_dialog');
    });
    return item;
}

// smartFolder - SmartFolder (see backend.js)
function createListItem(smartFolder) {
    var item = $('\
    <div class="slist_item">\
        <div class="slist_item_shield"></div>\
        <div class="slist_item_top_row flex_row">\
            <div class="lightbulb_folder_icon s_icon"></div>\
            <input type="text" class="slist_item_name full_height"\
            placeholder="Set folder name">\
            <div class="slist_item_delete hidden"></div>\
        </div>\
        <div class="slist_item_bottom_row flex_row hidden">\
        <input type="text" class="slist_item_tags full_height"\
        placeholder="Tags (C++, Java, imgur)" value="Racquet, tennis, warehouse, shoe">\
        </div>\
    </div>\
    ');
    item.data('smartFolder', smartFolder);

    var shield = $('.slist_item_shield', item);
    // Use custom class instead of css :hover to be able to remove class on click
    shield.hover(
        function() {
            item.addClass('slist_item_hover');
        },
        function() {
            item.removeClass('slist_item_hover');
        }
    );
    shield.click(function() {
        select(item);
    });

    var name = $('.slist_item_name', item);
    name.val(smartFolder.name());
    name.change(function() {
        var newName = name.val();
        var folder = item.data('smartFolder');
        // If newName is not empty and not just whitespace
        if(/\S/.test(newName)) {
            folder.changeName(newName);
        } else {
            // Disallow empty/whitespace name - reset to previous value
            name.val(folder.name());
        }
    });
    UTILITY.blurOnEnter(name);

    var deleteButton = $('.slist_item_delete', item);
    deleteButton.click(function() {
        UTILITY.showDialog('confirm_delete_dialog');
    });

    var tags = $('.slist_item_tags', item);
    tags.attr("value", smartFolder.tagsString());
    tags.change(function() {
        var newTagsString = tags.val();
        var folder = item.data('smartFolder');
        folder.changeTagsString(newTagsString);
    });
    UTILITY.blurOnEnter(tags);

    return item;
}

return module;
}());
