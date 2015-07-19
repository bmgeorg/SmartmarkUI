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
});

module.collapse = function() {
    $('#config_block').hide();
}

module.expand = function() {
    var configBlock = $('#config_block');
    loadListIn(configBlock);
    configBlock.show();
}

// container - jQuery
function loadListIn(container) {
    container.empty();
    var list = $('<div id="slist"></div>');

    var smartFolders = BACKEND.smartFolders();
    for(var i = 0; i < smartFolders.length; i++) {
        addListItem(list, smartFolders[i]);
    }
    // Deselect item if there is a click outside the list and dialogs
    UTILITY.clickOutside(
        list.add('.dialog').add('#dialog_overlay'),
        'slist',
        function() {
            deselectItem(list);
        }
    );
    container.append(list);

    setupConfirmDeleteDialog(container, list);
}

// list - jQuery
// smartFolder - SmartFolder (see backend.js)
function addListItem(list, smartFolder) {
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
        selectItem(list, item);
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

    list.append(item);
}

// container - jQuery
// list - jQuery
function setupConfirmDeleteDialog(container, list) {
    var confirm = $('#confirm_delete');
    // Necessary to clear old listeners because smart list could be reloaded, but confirm
    // delete dialog will not be emptied and reloaded.
    confirm.off('click');
    confirm.click(function() {
        var item = list.data('selectedItem');
        if(item) {
            var folder = item.data('smartFolder');
            BACKEND.delete(folder);
        }

        // Close dialog and reload list
        UTILITY.closeDialog();
        container.empty();
        loadListIn(container);
    });

    var cancel = $('#cancel_delete');
    cancel.off('click');
    cancel.click(function() {
        UTILITY.closeDialog();
    });
}


// list - jQuery
// item - jQuery
function selectItem(list, item) {
    deselectItem(list);
    list.data('selectedItem', item);
    item.removeClass('slist_item_hover');
    item.addClass('slist_item_selected');
    $('.slist_item_shield', item).addClass('slist_item_disabled_shield');
    $('.slist_item_bottom_row', item).removeClass('hidden');
    $('.slist_item_delete', item).removeClass('hidden');
}

// list - jQuery
function deselectItem(list) {
    list.removeData('selectedItem');
    $('.slist_item', list).removeClass('slist_item_selected');
    $('.slist_item_shield', list).removeClass('slist_item_disabled_shield')
    $('.slist_item_bottom_row', list).addClass('hidden');
    $('.slist_item_delete', list).addClass('hidden');
}

return module;
}());
