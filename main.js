define(function (require, exports, module) {
   "use strict";

   var ProjectManager = brackets.getModule("project/ProjectManager"),
      Menus = brackets.getModule("command/Menus"),
      CommandManager = brackets.getModule("command/CommandManager"),
      DocumentManager = brackets.getModule("document/DocumentManager"),
      ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
      NodeConnection = brackets.getModule("utils/NodeConnection"),
      FileSystem = brackets.getModule("filesystem/FileSystem"),
      FileUtils = brackets.getModule("file/FileUtils"),
      PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
      preferences = PreferencesManager.getExtensionPrefs("vjsrinath.ReactJsTransformer"),
      // Then create a menu item bound to the command
      // The label of the menu item is the name we gave the command (see above)
      menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU),
      ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
      NodeDomain = brackets.getModule("utils/NodeDomain");

   var COMPILE_COMP = 'vjsrinath.ReactJsTransformer.compileCurrentDoc',
      COMPILE_SHORTCUT = 'Ctrl-Shift-T',
      compileCurrentDoc = function () {
         compileDoc(DocumentManager.getCurrentDocument());
      },
      addMenuItems = function () {
         menu.addMenuItem(COMPILE_COMP, COMPILE_SHORTCUT);
      },
      removeMenuItems = function () {
         menu.removeMenuItem(COMPILE_COMP);
      },
      jsxDomain = new NodeDomain("JSXTransformer", ExtensionUtils.getModulePath(module, "lib/JSXTransformerDomain")),
      compileDoc = function (doc) {
         if (!doc) return;
         var path = doc.file.fullPath;
         try {
            if (path.indexOf('.jsx') < 0) return;
            compileComp(path);
         } catch (e) {
            console.log(e);
         }

      },
      compileComp = function (path) {
         jsxDomain.exec("transform", path)
            .done(function (result) {
               console.log(path + result ? ' successfully compiled' : ' - compilation failed');
            }).fail(function (err) {
               console.error("Failed to compile file: " + path, err);
            });
      };

   // First, register a command - a UI-less object associating an id to a handler
   // package-style naming to avoid collisions

   CommandManager.register("Compile Component", COMPILE_COMP, compileCurrentDoc);



   //Bind event handlers
   $(DocumentManager).on('documentSaved documentRefreshed', function (e, doc) {
      var path = doc.file.fullPath,
         dir = FileSystem.getDirectoryForPath(doc.file.parentPath),
         fileName = doc.file.name;
      try {
         switch (FileUtils.getFileExtension(path)) {
         case 'jsx':
            compileComp(path);
            break;
         case 'html': 
            dir.getContents(function (err, files) {
               (!err) && files && files.forEach(function (file) {
                  var ext = FileUtils.getFileExtension(file.fullPath);
                  (ext == 'jsx') && compileComp(file.fullPath);
               });
            });

            break;
         }

      } catch (e) {
         console.log(e);
      }
   }).on('currentDocumentChange', function (e, doc) {
      var path = doc.file.fullPath;
      try {
         (path.indexOf('.jsx') < 0) ? removeMenuItems() : addMenuItems();
      } catch (e) {}
   }).on('fileNameChange', function (e, oldName, newName) {
      try {
         (newName.indexOf('.jsx') < 0) ? removeMenuItems() : addMenuItems();
      } catch (e) {}
   });





   console.log('ReactJsTransformer initalized.');
   console.info('Press ' + COMPILE_SHORTCUT + ' to compile current component');

});