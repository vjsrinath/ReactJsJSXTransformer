/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
   "use strict";

   var react = require("react-tools"),
      path = require('path'),
      grunt = require('grunt'),
      beautify = require('js-beautify').js_beautify,
      exp = new RegExp("(< *transform[ *>|:(.|\n)*>| (.|\n)*>](.|\n)*</transform *>)");


   var compileComp = function (filepath) {
         if (filepath.indexOf('.jsx') < 0) return false;
         var dirName = path.dirname(filepath);
         console.log('reading component:' + filepath);
         var content = grunt.file.read(filepath);
         console.log('read component');
         var matches = content.match(exp);
         matches.forEach(function (mat) {
            if (exp.test(mat)) {
               console.log('compiling component');

               var templ = mat.replace('<transform>', '').replace('</transform>', '');
               var templContent = grunt.file.read(path.join(dirName, templ));
               content = transform(content.replace('/*' + mat + '*/', templContent));

               var fname = path.join(dirName, path.basename(filepath).replace('.jsx', '.js'));
               grunt.file.write(fname, content);
            }
         });
         return true;
      },
      transform = function (content) {
         return beautify(react.transform(content));
      };

   /**
    * Initializes the test domain with several test commands.
    * @param {DomainManager} domainManager The DomainManager for the server
    */
   function init(domainManager) {
      if (!domainManager.hasDomain("JSXTransformer")) {
         domainManager.registerDomain("JSXTransformer", {
            major: 0,
            minor: 1
         });
      }
      domainManager.registerCommand(
         "JSXTransformer", // domain name
         "transform", // command name
         compileComp, // command handler function
         false, // this command is synchronous in Node
         "", [{
            name: "filepath", // parameters
            type: "string",
            description: "Path to *.jsx file that would be transformed to *.js"
            }], [{
            name: "result", // return values
            type: "boolean",
            description: "The result of compilation. true if success, false in case of any failiure"
            }]
      );
   }

   exports.init = init;

}());