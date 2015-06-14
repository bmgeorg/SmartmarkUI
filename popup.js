// Enable strict mode for entire script
"use strict";

const FOLDER_CHOOSE_INNER_LIST_WIDTH = "358px";
var DirectionEnum = {
    SLIDE_RIGHT: 0,
    SLIDE_LEFT: 1,
}

$(function() {
    $("#current_folder").click(function() {
        var folderList = $("#folder_choose_list");
        if(folderList.is(":visible")) {
            folderList.hide();
        } else {
            loadTopLevelFolders();
            folderList.show();
        }
    });
});

function loadTopLevelFolders() {
    $("#folder_choose_list").empty();
    chrome.bookmarks.getTree(function(rootFolders) {
        var rootFolder = rootFolders[0];
        var newList = createFolderInnerList(rootFolder, false);
        $("#folder_choose_list").append(newList);
    });
}

function navigateToFolder(folderNode, direction) {
    if(direction !== DirectionEnum.SLIDE_LEFT &&
        direction !== DirectionEnum.SLIDE_RIGHT) {
        throw "direction should be of type DirectionEnum";
    }
    var oldList = $("#folder_choose_list .folder_choose_inner_list").eq(0);

    var newList = createFolderInnerList(folderNode, !isRoot(folderNode) );

    /* hide newList */
    if(direction === DirectionEnum.SLIDE_LEFT) {
        newList.css("left", FOLDER_CHOOSE_INNER_LIST_WIDTH);
    } else {
        newList.css("left", "-" + FOLDER_CHOOSE_INNER_LIST_WIDTH);
    }

    $("#folder_choose_list").append(newList);

    /* Animate sliding oldList out and newList in, then remove oldList.
     * Set queue to false to animate both concurrently.
     */
    newList.animate(
        {left: "0px"}, { duration: 300, queue: false }
    );
    if(direction === DirectionEnum.SLIDE_LEFT) {
        oldList.animate(
            {left: "-" + FOLDER_CHOOSE_INNER_LIST_WIDTH}, { duration: 300, queue: false,
            complete: function() { $(this).remove(); } }
        );
    } else {
        oldList.animate(
            {left: FOLDER_CHOOSE_INNER_LIST_WIDTH}, { duration: 300, queue: false,
            complete: function() { $(this).remove(); } }
        );
    }
}

function navigateBack() {
    var containingFolder = $("#folder_choose_list").data("containingFolder");
    if(typeof containingFolder.parentId !== "undefined") {
        chrome.bookmarks.getSubTree(containingFolder.parentId, function(resultNodes) {
            console.log("Parent id: " + containingFolder.parentId); 
            console.log("Length: " + resultNodes.length);
            console.log(resultNodes[0]);
            navigateToFolder(resultNodes[0], DirectionEnum.SLIDE_RIGHT);
        });
    } else {
        // Do nothing if at root
    }
}

function createFolderInnerList(folderNode, withTopBar) {
    var newList = $('<div class="folder_choose_inner_list"></div>');
    for(let i = 0; i < folderNode.children.length; i++) {
        /* only add child to list if child is a folder */
        if(!folderNode.children[i].url) {
            var newRow = createFolderRow(folderNode.children[i]);
            newList.append(newRow);
        }
    }

    if(withTopBar) {
        /* add back button/title bar to newList */
        var topBar = $('<div class="containing_folder_row flex_row"><div class="back_button"></div><span class="containing_folder_name">Containing Folder name</span></div>');
        topBar.click(navigateBack);
        newList.prepend(topBar);
    }

    $("#folder_choose_list").data("containingFolder", folderNode);
    return newList;
}

function createFolderRow(folderNode) {
    var row = $('<div class="folder_choose_row">\
        <div class="folder_choose_row_left">\
            <img src="http://icons.iconseeker.com/ico/minimal-folder/minimal-burnable-folder.ico" class="small_icon" />\
            <span>' +
            folderNode.title +
            '</span>\
        </div>\
        <div class="folder_choose_row_right">\
        </div>\
    </div>\
    ');
    row.data("folderNode", folderNode);
    row.click(function() {
        navigateToFolder($(this).data("folderNode"), DirectionEnum.SLIDE_LEFT);
    });

    return row;
}

function isRoot(folderNode) {
    return typeof folderNode.parentId === "undefined";
}
/*
document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarkFolders();
});

$(function() {
  $('#search').change(function() {
     $('#bookmarks').empty();
     dumpBookmarks($('#search').val());
  });
});
// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
    });
}
function dumpTreeNodes(bookmarkNodes, query) {
  var list = $('<ul>');
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) {
    list.append(dumpNode(bookmarkNodes[i], query));
  }
  return list;
}
function dumpNode(bookmarkNode, query) {
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title).indexOf(query) == -1) {
        return $('<span></span>');
      }
    }
    var anchor = $('<a>');
    anchor.attr('href', bookmarkNode.url);
    anchor.text(bookmarkNode.title);
    //When clicking on a bookmark in the extension, a new tab is fired with
    //the bookmark url.
    anchor.click(function() {
      chrome.tabs.create({url: bookmarkNode.url});
    });
    var span = $('<span>');
    var options = bookmarkNode.children ?
      $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
      $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
        'href="#">Delete</a>]</span>');
    var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
      '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
      '</td></tr></table>') : $('<input>');
    // Show add and edit links when hover over.
        span.hover(function() {
        span.append(options);
        $('#deletelink').click(function() {
          $('#deletedialog').empty().dialog({
                 autoOpen: false,
                 title: 'Confirm Deletion',
                 resizable: false,
                 height: 140,
                 modal: true,
                 overlay: {
                   backgroundColor: '#000',
                   opacity: 0.5
                 },
                 buttons: {
                   'Yes, Delete It!': function() {
                      chrome.bookmarks.remove(String(bookmarkNode.id));
                      span.parent().remove();
                      $(this).dialog('destroy');
                    },
                    Cancel: function() {
                      $(this).dialog('destroy');
                    }
                 }
               }).dialog('open');
         });
        $('#addlink').click(function() {
          $('#adddialog').empty().append(edit).dialog({autoOpen: false,
            closeOnEscape: true, title: 'Add New Bookmark', modal: true,
            buttons: {
            'Add' : function() {
               chrome.bookmarks.create({parentId: bookmarkNode.id,
                 title: $('#title').val(), url: $('#url').val()});
               $('#bookmarks').empty();
               $(this).dialog('destroy');
               window.dumpBookmarks();
             },
            'Cancel': function() {
               $(this).dialog('destroy');
            }
          }}).dialog('open');
        });
        $('#editlink').click(function() {
         edit.val(anchor.text());
         $('#editdialog').empty().append(edit).dialog({autoOpen: false,
           closeOnEscape: true, title: 'Edit Title', modal: true,
           show: 'slide', buttons: {
              'Save': function() {
                 chrome.bookmarks.update(String(bookmarkNode.id), {
                   title: edit.val()
                 });
                 anchor.text(edit.val());
                 options.show();
                 $(this).dialog('destroy');
              },
             'Cancel': function() {
                 $(this).dialog('destroy');
             }
         }}).dialog('open');
        });
        options.fadeIn();
      },
      // unhover
      function() {
        options.remove();
      }).append(anchor);
  }
  var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }
  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
*/
