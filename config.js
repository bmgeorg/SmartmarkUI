// Enable strict mode for entire script
"use strict";

var CONFIG = (function() {
var module = {};

$(function() {
    $('#config_expand_button').click(function() {
        if($('#config_block').is(':visible')) {
            module.collapse();
        } else {
            module.expand();
        }
    });

    var list = $('#slist');
    setupConfirmDeleteDialog(list);

    // Deselect item if there is a click outside the list and dialogs
    UTILITY.clickOutside(
        list.add('.dialog').add('#dialog_overlay'),
        'slist_deselect',
        deselect
    );
});

module.collapse = function() {
    $('#config_block').hide();
}

module.expand = function() {
    var configBlock = $('#config_block');
    loadList();
    configBlock.show();
}

var selectedItem; // jQuery

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

    var smartFolders = BACKEND.smartFolders();
    for(var i = 0; i < smartFolders.length; i++) {
        list.append(createListItem(smartFolders[i]));
    }
}

// smartFolder - SmartFolder (see backend.js)
function createListItem(smartFolder) {
    var item = $('<div class="slist_item"></div>');
    item.data('smartFolder', smartFolder);

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
        select(item);
    });
    item.append(shield);

    var topRow = $('<div class="slist_item_top_row flex_row"></div>');
    // Add folder icon
    topRow.append('<div class="lightbulb_folder_icon s_icon"></div>');
    // Add name input
    var name = $('<input type="text" class="slist_item_name full_height" \
        placeholder="Set folder name" />');
    name.val(smartFolder.name());
    name.change(function() {
        var newName = $(this).val();
        var theSmartFolder = item.data('smartFolder');
        // If newName is not empty and not just whitespace
        if(/\S/.test(newName)) {
            theSmartFolder.changeName(newName);
        } else {
            // Disallow empty/whitespace name - reset to previous value
            $(this).val(theSmartFolder.name());
        }
    });
    UTILITY.blurOnEnter(name);
    topRow.append(name);
    // Add delete button
    var deleteButton = $('<div class="slist_item_delete hidden"></div>');
    deleteButton.click(function() {
        UTILITY.showDialog('confirm_delete_dialog');
    });
    topRow.append(deleteButton);
    item.append(topRow);

    var bottomRow = $('<div class="slist_item_bottom_row flex_row hidden"></div>');
    var tags = $('<input type="text" class="slist_item_tags full_height" \
        placeholder="Tags (C++, Java, imgur)" />');
    tags.attr("value", smartFolder.tagsString());
    tags.change(function() {
        var newTagsString = $(this).val();
        var theSmartFolder = item.data('smartFolder');
        theSmartFolder.changeTagsString(newTagsString);
    });
    UTILITY.blurOnEnter(tags);
    bottomRow.append(tags);
    item.append(bottomRow);

    return item;
}

function setupConfirmDeleteDialog() {
    var confirm = $('#confirm_delete');
    confirm.click(function() {
        if(selectedItem) {
            var folder = selectedItem.data('smartFolder');
            BACKEND.delete(folder);
        }

        // Close dialog and reload list
        UTILITY.closeDialog();
        loadList();
    });

    var cancel = $('#cancel_delete');
    cancel.click(function() {
        UTILITY.closeDialog();
    });
}



return module;
}());
