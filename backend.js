// Enable strict mode for entire script
"use strict";

var BACKEND = (function() {
var module = {};

var smartFolders = [];
smartFolders.push(new SmartFolder('Programming', 'C, C++, Class, Java'));
smartFolders.push(new SmartFolder('Racquetball', 'Racquet, tennis, warehouse, shoe'));
smartFolders.push(new SmartFolder('Racquetball', 'Racquet, tennis, warehouse, shoe'));
smartFolders.push(new SmartFolder('Racquetball', 'Racquet, tennis, warehouse, shoe'));
smartFolders.push(new SmartFolder('Racquetball', 'Racquet, tennis, warehouse, shoe'));
smartFolders.push(new SmartFolder('Racquetball', 'Racquet, tennis, warehouse, shoe'));
smartFolders.push(new SmartFolder('Racquetball', 'Racquet, tennis, warehouse, shoe'));

// folderId - string
module.isSmartFolder = function(folderId) {
    // TODO: real check for smartness
    return folderId%2 == 0;
};

// returns SmartFolder
module.smartFolders = function() {
    return smartFolders;
};

// folder - SmartFolder
module.delete = function(folder) {
    for(var i = 0; i < smartFolders.length; i++) {
        if(smartFolders[i] === folder) {
            // TODO: delete folder from real backend
            smartFolders.splice(i, 1);
            return;
        }
    }
};

// name - string
// tagsString - array of string
function SmartFolder(name, tagsString) {
    /* Public API */
    this.name = function() { return this._name; };
    this.tagsString = function() { return this._tagsString; };
    this.changeName = function(newName) { this._name = newName; };
    this.changeTagsString = function(newTagsString) { this._tagsString = newTagsString; };
    /* End */

    this._name = name;
    this._tagsString = tagsString;
}

return module;
}());
