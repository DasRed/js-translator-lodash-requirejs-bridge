# translator-lodash-requirejs-bridge
## Install
```
npm install js-translator-lodash-requirejs-bridge --save
```

# How To
This bridge register a new plugin into requirejs with the prefix "tpl" to load templates
for lodash and implements a auto parsing of translation keys in template file after generating
the template string. The templates will be loaded by requirejs. You can define the file suffix. If
no suffix is defined, the suffix ".html" will be appended. The given template is the lodash template function,
returned by lodash.template(template):
```
define(['tpl!my/fancy/template', 'tpl!my/fancy/other/template.html'], function(fancyTemplate, fancyOtherTemplate) {
    console.log(
});
```

Translations keys will be written into braces.

```
<a href="www.heise.de">{heise}</a>
<a href="www.heise.de">{heise}</a>
```
It needs the default translator from npm "js-translator".

This plugins improves the requirejs plugin "text".

## Configure the Translator
```
import translator from 'js-translator'
// configure the default translator with
translator.setTranslations({});
```
