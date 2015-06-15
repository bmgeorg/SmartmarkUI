(function IIFE() {

// Enable strict mode for entire script
"use strict";

// Show folder choose dialog when current folder row is clicked
$(function() {
    $(".current_folder_row").click(function() {
        var outerList = $(this).siblings(".folder_choose_outer_list");
        if(outerList.is(":visible")) {
            outerList.hide();
        } else {
            loadRootFolderList(outerList);
            outerList.show();
        }
    });
});

// outerList - jQuery
function loadRootFolderList(outerList) {
    outerList.empty();
    chrome.bookmarks.getTree(function(rootFolderArray) {
        var rootFolder = rootFolderArray[0];
        var innerList = createInnerList(outerList, rootFolder);
        outerList.data("currentListFolder", rootFolder);
        outerList.append(innerList);
    });
}

const FOLDER_LIST_WIDTH = "358px";
var SlideDirectionEnum = {
    TO_RIGHT: 0,
    TO_LEFT: 1,
}

// outerList - jQuery
// folder - BookmarkTreeNode
// direction - SlideDirectionEnum
function replaceInnerList(outerList, folder, direction) {
    if(direction !== SlideDirectionEnum.TO_LEFT &&
        direction !== SlideDirectionEnum.TO_RIGHT) {
        throw "direction should be of type SlideDirectionEnum";
    }
    // Find old inner list inside outerList
    var oldList = $(".folder_choose_inner_list", outerList).eq(0);

    var newList = createInnerList(outerList, folder);

    /* hide newList to right or left, depending on slide direction */
    if(direction === SlideDirectionEnum.TO_LEFT) {
        newList.css("left", FOLDER_LIST_WIDTH);
    } else if(direction === SlideDirectionEnum.TO_RIGHT) {
        newList.css("left", "-" + FOLDER_LIST_WIDTH);
    }

    outerList.append(newList);

    // Store BookmarkTreeNode folder as data in the outerList
    outerList.data("currentListFolder", folder);

    // Animate sliding oldList out and newList in, then remove oldList.
    // Set queue to false to animate both concurrently.
    newList.animate(
        {left: "0px"}, { duration: 300, queue: false }
    );
    if(direction === SlideDirectionEnum.TO_LEFT) {
        oldList.animate(
            {left: "-" + FOLDER_LIST_WIDTH}, { duration: 300, queue: false,
            complete: function() { $(this).remove(); } }
        );
    } else {
        oldList.animate(
            {left: FOLDER_LIST_WIDTH}, { duration: 300, queue: false,
            complete: function() { $(this).remove(); } }
        );
    }
}

// outerList - jQuery
function navigateBack(outerList) {
    var currentListFolder = outerList.data("currentListFolder");
    // Only navigate back if not at root
    if(typeof currentListFolder.parentId !== "undefined") {
        chrome.bookmarks.getSubTree(currentListFolder.parentId, function(parentNodeArray) {
            replaceInnerList(outerList, parentNodeArray[0], SlideDirectionEnum.TO_RIGHT);
        });
    }
}

// outerList - jQuery
// folder - BookmarkTreeNode
function createInnerList(outerList, folder) {
    var newList = $('<div class="folder_choose_inner_list"></div>');
    for(let i = 0; i < folder.children.length; i++) {
        if(isFolder(folder.children[i])) {
            var newRow = createFolderRow(outerList, folder.children[i]);
            newList.append(newRow);
        }
    }

    // Add new folder input
    var newFolderRow = $('\
    <div class="flex_row small_height small_pad light_border_bottom">\
        <input placeholder="New Folder" class="small_height big_width"/>\
        <div class="flex_right_item">Create</div>\
    </div>\
    ');
    newList.prepend(newFolderRow)

    // Add navigation bar if folder is root
    if(!isRoot(folder)) {
        var navigationBar = $('\
        <div class="folder_choose_navigation_bar light_border_bottom flex_row">\
            <div class="back_button_icon xsmall_icon small_pad"></div>\
            <span class="current_list_folder_name">' + folder.title + '</span>\
        </div>\
        ');
        navigationBar.click(function() {
            navigateBack(outerList);    
        });
        newList.prepend(navigationBar);
    }

    return newList;
}

// outerList - jQuery
// folder - BookmarkTreeNode
function createFolderRow(outerList, folder) {
    var row = $('\
    <div class="folder_choose_row light_border_bottom">\
        <div class="folder_choose_row_left">\
            <div class="folder_icon small_icon"></div>\
            <span>' + folder.title + '</span>\
        </div>\
        <div class="folder_choose_row_right">\
        </div>\
    </div>\
    ');

    // If folder is a smart folder, gray out and place smart folder icon
    if(backend.isSmartFolder(folder.id)) {
        row.addClass("gray_text");
        // Add tooltip
        row.attr("title", "already a smart folder");
        var icon = $(".folder_icon", row);
        icon.removeClass("folder_icon").addClass("lightbulb_folder_icon");
    }
    // Attach BookmarkTreeNode folder to row
    row.data("folder", folder);
    row.click(function() {
        replaceInnerList(outerList, $(this).data("folder"), SlideDirectionEnum.TO_LEFT);
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
})(); /* IIFE */
