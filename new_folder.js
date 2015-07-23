// Enable strict mode for entire script
"use strict";

var NEW_FOLDER = (function() {
var module = {};

module.load = function() {
    var list = $('#alist');
    list.empty();

    chrome.bookmarks.getTree(function(tree) {
        var root = tree[0];
        sublistFolder = root;
        list.append(createSublist(root));
    });
}

var sublistFolder; // BookmarkTreeNode

var SlideDirection = {
    TO_RIGHT: 0,
    TO_LEFT: 1,
}

// folder - BookmarkTreeNode
function createSublist(folder) {
    var sublist = $('<div class="alist_sublist"></div>');
    for(let i = 0; i < folder.children.length; i++) {
        if(isFolder(folder.children[i])) {
            sublist.append(createListItem(folder.children[i]));
        }
    }

    /*
    // Add new folder input
    var newFolderRow = $('\
    <div class="flex_row small_height small_pad light_border_bottom">\
        <input placeholder="New Folder" class="full_height flex_growable"/>\
        <div class="create_folder_button">Create</div>\
    </div>\
    ');
    newList.prepend(newFolderRow)
    */

    // Add navigation bar if folder is root
    if(!isRoot(folder)) {
        var navigationBar = $('\
        <div class="folder_choose_navigation_bar light_border_bottom flex_row">\
            <div class="back_button_icon xs_icon small_pad"></div>\
            <span class="current_list_folder_name">' + folder.title + '</span>\
        </div>\
        ');
        navigationBar.click(navigateBack);
        sublist.prepend(navigationBar);
    }

    return sublist;
}

// folder - BookmarkTreeNode
function createListItem(folder) {
    var item = $('\
    <div class="alist_item flex_row">\
        <div class="alist_item_left flex_row">\
            <div class="folder_icon s_icon"></div>\
            <span class="alist_folder_name"><span>\
        </div>\
        <div class="alist_item_right">\
        </div>\
    </div>\
    ');
    
    var name = $('.alist_folder_name', item);
    name.text(folder.title);

    var rightItem = $('.alist_item_right', item);
    rightItem.click(function() {
        sublistFolder = folder;
        replaceSublist(folder, SlideDirection.TO_LEFT);
    });

    return item;
    /*
    // If folder is already a smart folder, gray out and replace folder icon
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
        replaceInnerList(outerList, $(this).data("folder"), SlideDirection.TO_LEFT);
    });
    */
}

// folder - BookmarkTreeNode
// direction - SlideDirection
function replaceSublist(folder, direction) {
    var alist = $('#alist');
    var oldList = $(".alist_sublist", alist);
    var newList = createSublist(folder);

    /* hide newList to right or left, depending on slide direction */
    var SLIDE_OFFSET = '300px';
    if(direction === SlideDirection.TO_LEFT) {
        newList.css("left", SLIDE_OFFSET);
    } else if(direction === SlideDirection.TO_RIGHT) {
        newList.css("left", "-" + SLIDE_OFFSET);
    }

    alist.append(newList);

    // Animate sliding oldList out and newList in, then remove oldList.
    // Set queue to false to animate both concurrently.
    newList.animate(
        {left: "0px"}, { duration: 300, queue: false }
    );
    if(direction === SlideDirection.TO_LEFT) {
        oldList.animate(
            {left: "-" + SLIDE_OFFSET}, { duration: 300, queue: false,
            complete: function() { oldList.remove(); } }
        );
    } else {
        oldList.animate(
            {left: SLIDE_OFFSET}, { duration: 300, queue: false,
            complete: function() { oldList.remove(); } }
        );
    }
}

function navigateBack() {
    // Only navigate back if not at root
    if(typeof sublistFolder.parentId !== "undefined") {
        chrome.bookmarks.getSubTree(sublistFolder.parentId, function(parent) {
            sublistFolder = parent[0];
            replaceSublist(parent[0], SlideDirection.TO_RIGHT);
        });
    }
}

// folder - BookmarkTreeNode
function isRoot(folder) {
    return typeof folder.parentId === "undefined";
}

// node - BookmarkTreeNode
function isFolder(node) {
    return typeof node.url === "undefined";
}

return module;
}());
