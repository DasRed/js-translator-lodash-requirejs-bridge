'use strict';

define(['lodash', 'text', 'translator'], function (lodash, text, Translator) {
    var htmlStripWhitespacesRegEx = {
        ' ': /(\n)|(\r)/gi,
        '': /(\t)/gi,
        '><': />\s*</gi
    };

    return {
        /**
         * @param {String} name
         * @param {Function} parentRequire
         * @param {Function} onLoad
         * @param {Object} config
         */
        load: function (name, parentRequire, onLoad, config) {
            if (config.isBuild == true) {
                onLoad(null);
                return;
            }

            if (name.lastIndexOf('.') === -1) {
                name += '.html';
            }

            text.load(name, parentRequire, function (content) {
                var contentReplaced = content;

                // convert whitespaces between html tags to nothing and remove Tabs and Linebreaks
                for (var replacement in htmlStripWhitespacesRegEx) {
                    contentReplaced = contentReplaced.replace(htmlStripWhitespacesRegEx[replacement], replacement);
                }

                // convert template into lodash.template function
                var templatePrepared = lodash.template(contentReplaced);

                // create function for Translator AFTER template executing
                var template = function (obj) {
                    return Translator.default.translateInline(templatePrepared(obj));
                };

                // return it
                onLoad(template);
            }, config);
        },

        /**
         *
         * @param {String} pluginName
         * @param {String} moduleName
         * @param {Function} write
         */
        write: function (pluginName, moduleName, write) {
            var moduleNameWithExtension = moduleName;
            if (moduleNameWithExtension.lastIndexOf('.') === -1) {
                moduleNameWithExtension += '.html';
            }

            text.load(moduleNameWithExtension, require, function (content) {
                var contentReplaced = content;

                // convert whitespaces between html tags to nothing and remove Tabs and Linebreaks
                for (var replacement in htmlStripWhitespacesRegEx) {
                    contentReplaced = contentReplaced.replace(htmlStripWhitespacesRegEx[replacement], replacement);
                }

                write([
                    'define("' + pluginName + '!' + moduleName + '", ["translator"], function (Translator) {',
                    'return ' + String(lodash.template(contentReplaced)).replace('return __p', 'return Translator.default.translateInline(__p);') + ';',
                    '});'
                ].join('\n'));
            }, {
                isBuild: false
            });
        }
    };
});
