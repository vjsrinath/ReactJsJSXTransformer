ReactJsJSXTransformer
=====================

An extension for Brackets to manage reactjs components.

Warning: this extension doesn not provide any extra features other that compiling jsx files to js.

The html part of jsx files must be placed in seperate html file and relative path of the html file should be
kept in the place where the transformer jsx content should come.


For example, please refer "comp.jsx" and "comp.js" files in the repository.

**/**
 * @jsx React.DOM
 */
require('react-with-addons', function () {
   return /*<transform>template.html</transform>*/;
}); **

will be transformed to


**/**
 * @jsx React.DOM
 */
require('react-with-addons', function() {
    return React.DOM.div(null,
        React.DOM.span(null),
        React.DOM.div(null)
    );
});**


The transformation is automatically trigger whenever either of the files are changed. (jsx or html)



To compile currrently opened JSX file, press Ctrl-Shift-T or select File -> Compile Component.
