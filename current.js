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
    for(var i = 0; i < smartFolders.length; i++) {
        var item = $('<div class="clist_item"></div>');
        item.data('smartFolder', smartFolder);
        item
    }
    container.append(list);
}

// list - jQuery
// smartFolder - SmartFolder (see backend.js)
function addListItem(list, smartFolder) {

    shield.click(function() {
        selectItem(list, item);
    });
    item.append(shield);

    var topRow = $('<div class="slist_item_top_row flex_row"></div>');
    // Add folder icon
    topRow.append('<div class="lightbulb_folder_icon small_icon"></div>');
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
    // folder - BookmarkTreeNode
    function createInnerList(container, folder) {
        var newList = $('<div class="folder_choose_inner_list"></div>');
        for(let i = 0; i < folder.children.length; i++) {
            if(isFolder(folder.children[i])) {
                var newRow = createFolderRow(container, folder.children[i]);
                newList.append(newRow);
            }
        }

        // Add new folder input
        var newFolderRow = $('\
        <div class="flex_row small_height small_pad light_border_bottom">\
            <input placeholder="New Folder" class="full_height flex_growable"/>\
            <div class="create_folder_button">Create</div>\
        </div>\
        ');
        newList.prepend(newFolderRow)

        // Add navigation bar if folder is root
        if(!isRoot(folder)) {
            var navigationBar = $('\
            <div class="folder_choose_navigation_bar light_border_bottom flex_row">\
                <div class="back_button_icon xs_icon small_pad"></div>\
                <span class="current_list_folder_name">' + folder.title + '</span>\
            </div>\
            ');
            navigationBar.click(function() {
                navigateBack(container);    
            });
            newList.prepend(navigationBar);
        }

        return newList;
    }

    // container - jQuery
    // folder - BookmarkTreeNode
    function createFolderRow(container, folder) {
        var row = $('\
        <div class="folder_choose_row light_border_bottom">\
            <div class="folder_choose_row_left">\
                <div class="folder_icon s_icon"></div>\
                <span>' + folder.title + '</span>\
            </div>\
            <div class="folder_choose_row_right">\
            </div>\
        </div>\
        ');

        // If folder is a smart folder, gray out and place smart folder icon
        if(BACKEND.isSmartFolder(folder.id)) {
            row.addClass("gray_text");
            // Add tooltip
            row.attr("title", "already a smart folder");
            var icon = $(".folder_icon", row);
            icon.removeClass("folder_icon").addClass("lightbulb_folder_icon");
        }
        // Attach BookmarkTreeNode folder to row
        row.data("folder", folder);
        row.click(function() {
            replaceInnerList(container, $(this).data("folder"), SlideDirectionEnum.TO_LEFT);
        });

        return row;
    }

    // folder - BookmarkTreeNode
    function isRoot(folder) {
        return typeof folder.parentId === "undefined";
    }

    // node - BookmarkTreeNode
    function isFolder(node) {
        return typeof node.url === "undefined";
    }
}

return module;
}());
