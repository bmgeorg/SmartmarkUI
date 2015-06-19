var backend = {
    // folderId - string
    isSmartFolder: function(folderId) {
        return folderId%2 == 0;
    },
    getSmartFolders: function() {
        // name - string
        // tagsString - array of string
        function SmartFolder(name, tagsString) {
            /* Public API */
            this.name = function() { return this._name; };
            this.tagsString = function() { return this._tagsString; };

            /* Private API */
            this._name = name;
            this._tagsString = tagsString;
        }

        var smartFolders = [];
        smartFolders.push(new SmartFolder("Programming", ["C", "C++", "Class", "Java"]));
        smartFolders.push(new SmartFolder("Racquetball", ["Racquet", "tennis", "warehouse", "shoe"]));
        return smartFolders;
    },
};
