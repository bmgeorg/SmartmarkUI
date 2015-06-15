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
        outerList.data("containingFolder", rootFolder);
        outerList.append(innerList);
    });
}

const FOLDER_LIST_WIDTH = "358px";
var SlideDirectionEnum = {
    TO_RIGHT: 0,
    TO_LEFT: 1,
}

// outerList - jQuery
// folderNode - BookmarkTreeNode
// direction - SlideDirectionEnum
function replaceInnerList(outerList, folderNode, direction) {
    if(direction !== SlideDirectionEnum.TO_LEFT &&
        direction !== SlideDirectionEnum.TO_RIGHT) {
        throw "direction should be of type SlideDirectionEnum";
    }
    var oldList = $(".folder_choose_inner_list", outerList).eq(0);

    var newList = createInnerList(outerList, folderNode);

    /* hide newList to right or left, depending on slide direction */
    if(direction === SlideDirectionEnum.TO_LEFT) {
        newList.css("left", FOLDER_LIST_WIDTH);
    } else {
        newList.css("left", "-" + FOLDER_LIST_WIDTH);
    }

    outerList.append(newList);
    outerList.data("containingFolder", folderNode);

    /* Animate sliding oldList out and newList in, then remove oldList.
     * Set queue to false to animate both concurrently.
     */
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
    var containingFolder = outerList.data("containingFolder");
    // Only navigate back if not at root
    if(typeof containingFolder.parentId !== "undefined") {
        chrome.bookmarks.getSubTree(containingFolder.parentId, function(parentNodeArray) {
            replaceInnerList(outerList, parentNodeArray[0], SlideDirectionEnum.TO_RIGHT);
        });
    }
}

// outerList - jQuery
// folderNode - BookmarkTreeNode
function createInnerList(outerList, folderNode) {
    var newList = $('<div class="folder_choose_inner_list"></div>');
    for(let i = 0; i < folderNode.children.length; i++) {
        /* only add child to list if child is a folder */
        if(!folderNode.children[i].url) {
            var newRow = createFolderRow(outerList, folderNode.children[i]);
            newList.append(newRow);
        }
    }

    // Show different top bar if folderNode is root
    if(!isRoot(folderNode)) {
        /* add back button/title bar to newList */
        var topBar = $('<div class="folder_choose_outer_list_bar light_border_bottom flex_row"><div class="back_button_icon xsmall_icon small_pad"></div><span class="containing_folder_name">Containing Folder name</span></div>');
        topBar.click(function() {
            navigateBack(outerList);    
        });
        newList.prepend(topBar);
    }

    return newList;
}

// outerList - jQuery
// folderNode - BookmarkTreeNode
function createFolderRow(outerList, folderNode) {
    var row = $('<div class="folder_choose_row light_border_bottom">\
        <div class="folder_choose_row_left">\
            <div class="folder_icon small_icon"></div>\
            <span>' +
            folderNode.title +
            '</span>\
        </div>\
        <div class="folder_choose_row_right">\
        </div>\
    </div>\
    ');
    // Attach BookmarkTreeNode folder to row
    row.data("folderNode", folderNode);
    row.click(function() {
        replaceInnerList(outerList, $(this).data("folderNode"), SlideDirectionEnum.TO_LEFT);
    });

    return row;
}

// folderNode - BookmarkTreeNode
function isRoot(folderNode) {
    return typeof folderNode.parentId === "undefined";
}

})(); /* IIFE */
