// Enable strict mode for entire script
"use strict";

$(function() {
    $("#config_expand_button").click(function() {
        var configBlock = $("#config_block");
        if(configBlock.is(":visible")) {
            configBlock.hide();
        } else {
            loadSmartFolders(configBlock);
            // Eventually I may change this to slideDown(), but that's laggy right now
            // Making elements fixed-width may help, but that stiffens the design too much right now
            configBlock.show();
        }
    });
});

// container - jQuery
function loadSmartFolders(container) {
    container.empty();

    // Add smart folder boxes
    var smartFolders = backend.getSmartFolders();
    for(var i = 0; i < smartFolders.length; i++) {
        var smartFolder = createSmartFolderBox(smartFolders[i]);
        container.append(smartFolder);
    }

    // Add new smart folder config box
    var newSmartFolderBox = createNewSmartFolderBox();
    var newSmartFolderButton = $('<span>+ Add smart folder</span>');
    newSmartFolderButton.click(function() {
        $(this).hide();
        newSmartFolderBox.show();
    });

    container.append(newSmartFolderBox);
    container.append(newSmartFolderButton);

    /* Begin supporting functions */

    // returns - jQuery
    function createNewSmartFolderBox() {
        var newSmartFolderBox = $('<div id="new_folder_choose_dialog" class="folder_choose_box box"></div>');

        var outerList = $('<div class="folder_choose_outer_list dark_border_top"></div>');
        var currentFolderRow = $('\
        <div class="current_folder_row flex_row small_pad dark_border_bottom">\
            <div class="folder_icon small_icon"></div>\
            <span>Choose Folder</span>\
            <div class="dropdown_icon xsmall_icon flex_right_item"></div>\
        </div>\
        ');
        currentFolderRow.click(function() {
            if(outerList.is(":visible")) {
                outerList.hide();
            } else {
                loadRootFolderList(outerList);
                outerList.show();
            }
        });

        newSmartFolderBox.append(currentFolderRow);
        newSmartFolderBox.append(outerList);

        return newSmartFolderBox;
    }

    // smartFolder - SmartFolder (see backend_interface)
    // returns - jQuery
    function createSmartFolderBox(smartFolder) {
        var smartFolderBox = $('<div class="smart_folder_box box"></div>');
        var nameRow = $('<div class="smart_folder_name_row flex_row"></div>');
        var tagsRow = $('<div class="smart_folder_tags_row flex_row"></div>');

        var nameInput = $('<input type="text" class="smart_folder_name full_height" placeholder="Set folder name"></div>');
        nameInput.val(smartFolder.name());
        nameInput.change(function() {
            var newName = $(this).val();
            console.log("Changing name to " + newName);
            var theSmartFolder = smartFolderBox.data("smartFolder");
            // If newName is not empty and not just whitespace
            if(/\S/.test(newName)) {
                theSmartFolder.changeName(newName);
            } else {
                // Disallow empty/whitespace name - reset to previous value
                $(this).val(theSmartFolder.name());
            }
        });
        blurOnEnter(nameInput);

        var tagsInput = $('<input type="text" class="full_height" placeholder="Tags (C++, Java, imgur)"></div>');
        tagsInput.attr("value", smartFolder.tagsString());
        tagsInput.change(function() {
            var newTagsString = $(this).val();
            console.log("Changing tags string to " + newTagsString);
            var theSmartFolder = smartFolderBox.data("smartFolder");
            theSmartFolder.changeTagsString(newTagsString);
        });
        blurOnEnter(tagsInput);

        nameRow.append('<div class="lightbulb_folder_icon small_icon"></div>');
        nameRow.append(nameInput);
        tagsRow.append(tagsInput);

        smartFolderBox.append(nameRow);
        smartFolderBox.append(tagsRow);

        smartFolderBox.data("smartFolder", smartFolder);

        return smartFolderBox;
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
}
