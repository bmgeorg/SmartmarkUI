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
    var smartFolders = backend.getSmartFolders();
    for(var i = 0; i < smartFolders.length; i++) {
        var smartFolder = createSmartFolderBox(smartFolders[i]);
        container.append(smartFolder);
    }
}

// smartFolder - SmartFolder (see backend_interface)
// returns - jQuery
function createSmartFolderBox(smartFolder) {
    var smartFolderBox = $('\
    <div class="smart_folder_box box">\
        <div class="smart_folder_name_row flex_row">\
            <div class="lightbulb_folder_icon small_icon"></div>\
            <input type="text" class="smart_folder_name full_height no_autofocus" value="' + smartFolder.name() + '" placeholder="Set folder name">\
        </div>\
        <div class="smart_folder_tags_row flex_row">\
            <input type="text" class="full_height no_autofocus" value="' + smartFolder.tagsString() + '" placeholder="Tags (C++, Java, imgur)">\
        </div>\
        <div class="smart_folder_delete_button"></div>\
    </div>\
    ');
    smartFolderBox.data("smartFolder", smartFolder);
}
