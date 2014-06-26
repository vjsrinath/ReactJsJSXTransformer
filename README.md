ReactJs-JSXTransformer
=====================

An extension for Brackets to manage reactjs components.

**Warning: this extension doesn not provide any extra features other than compiling jsx files to js.**

The html part of jsx files must be placed in seperate html file and relative (to jsx file) path  of the same file should be
kept in the place where the transformed jsx content should come.

The template file path must be enclosed in the following format
```js
/*<transform>{RELATIVE_PATH_TO_HTML_FILE}</transform>*/
```

For example, a jsx file **comp.jsx** like below 

```js
/**
 * @jsx React.DOM
 */
require('react-with-addons', function () {
   return /*<transform>template.html</transform>*/;
}); 
```
with **template.html** content like 

```html
<div>
   <span> 
   </span>
   <div>
   </div>
</div>
```

will be transformed to **comp.js** as shown below

```js
/**
 * @jsx React.DOM
 */
require('react-with-addons', function() {
    return React.DOM.div(null,
        React.DOM.span(null),
        React.DOM.div(null)
    );
});
```

Making brackets to treat jsx file as a js would make managing jsx files lot easier. To do so save the below mention code as
**bracket.json** file

```json
{
    "language.fileExtensions": {
        "jsx": "javascript"
    }
}
```


The transformation is automatically triggered whenever either of the files are changed. (jsx or html)
The transformed files are beatified before saved to disk.

**To compile currrently opened JSX file, press Ctrl-Shift-T or select File -> Compile Component.**

License
----

MIT