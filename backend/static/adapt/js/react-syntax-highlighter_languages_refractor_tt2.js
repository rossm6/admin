"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["react-syntax-highlighter_languages_refractor_tt2"],{

/***/ "./node_modules/refractor/lang/markup-templating.js":
/*!**********************************************************!*\
  !*** ./node_modules/refractor/lang/markup-templating.js ***!
  \**********************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = markupTemplating\nmarkupTemplating.displayName = 'markupTemplating'\nmarkupTemplating.aliases = []\nfunction markupTemplating(Prism) {\n  ;(function(Prism) {\n    /**\n     * Returns the placeholder for the given language id and index.\n     *\n     * @param {string} language\n     * @param {string|number} index\n     * @returns {string}\n     */\n    function getPlaceholder(language, index) {\n      return '___' + language.toUpperCase() + index + '___'\n    }\n    Object.defineProperties((Prism.languages['markup-templating'] = {}), {\n      buildPlaceholders: {\n        /**\n         * Tokenize all inline templating expressions matching `placeholderPattern`.\n         *\n         * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns\n         * `true` will be replaced.\n         *\n         * @param {object} env The environment of the `before-tokenize` hook.\n         * @param {string} language The language id.\n         * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.\n         * @param {(match: string) => boolean} [replaceFilter]\n         */\n        value: function(env, language, placeholderPattern, replaceFilter) {\n          if (env.language !== language) {\n            return\n          }\n          var tokenStack = (env.tokenStack = [])\n          env.code = env.code.replace(placeholderPattern, function(match) {\n            if (typeof replaceFilter === 'function' && !replaceFilter(match)) {\n              return match\n            }\n            var i = tokenStack.length\n            var placeholder // Check for existing strings\n            while (\n              env.code.indexOf((placeholder = getPlaceholder(language, i))) !==\n              -1\n            )\n              ++i // Create a sparse array\n            tokenStack[i] = match\n            return placeholder\n          }) // Switch the grammar to markup\n          env.grammar = Prism.languages.markup\n        }\n      },\n      tokenizePlaceholders: {\n        /**\n         * Replace placeholders with proper tokens after tokenizing.\n         *\n         * @param {object} env The environment of the `after-tokenize` hook.\n         * @param {string} language The language id.\n         */\n        value: function(env, language) {\n          if (env.language !== language || !env.tokenStack) {\n            return\n          } // Switch the grammar back\n          env.grammar = Prism.languages[language]\n          var j = 0\n          var keys = Object.keys(env.tokenStack)\n          function walkTokens(tokens) {\n            for (var i = 0; i < tokens.length; i++) {\n              // all placeholders are replaced already\n              if (j >= keys.length) {\n                break\n              }\n              var token = tokens[i]\n              if (\n                typeof token === 'string' ||\n                (token.content && typeof token.content === 'string')\n              ) {\n                var k = keys[j]\n                var t = env.tokenStack[k]\n                var s = typeof token === 'string' ? token : token.content\n                var placeholder = getPlaceholder(language, k)\n                var index = s.indexOf(placeholder)\n                if (index > -1) {\n                  ++j\n                  var before = s.substring(0, index)\n                  var middle = new Prism.Token(\n                    language,\n                    Prism.tokenize(t, env.grammar),\n                    'language-' + language,\n                    t\n                  )\n                  var after = s.substring(index + placeholder.length)\n                  var replacement = []\n                  if (before) {\n                    replacement.push.apply(replacement, walkTokens([before]))\n                  }\n                  replacement.push(middle)\n                  if (after) {\n                    replacement.push.apply(replacement, walkTokens([after]))\n                  }\n                  if (typeof token === 'string') {\n                    tokens.splice.apply(tokens, [i, 1].concat(replacement))\n                  } else {\n                    token.content = replacement\n                  }\n                }\n              } else if (\n                token.content\n                /* && typeof token.content !== 'string' */\n              ) {\n                walkTokens(token.content)\n              }\n            }\n            return tokens\n          }\n          walkTokens(env.tokens)\n        }\n      }\n    })\n  })(Prism)\n}\n\n\n//# sourceURL=webpack://frontend/./node_modules/refractor/lang/markup-templating.js?");

/***/ }),

/***/ "./node_modules/refractor/lang/tt2.js":
/*!********************************************!*\
  !*** ./node_modules/refractor/lang/tt2.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nvar refractorMarkupTemplating = __webpack_require__(/*! ./markup-templating.js */ \"./node_modules/refractor/lang/markup-templating.js\")\nmodule.exports = tt2\ntt2.displayName = 'tt2'\ntt2.aliases = []\nfunction tt2(Prism) {\n  Prism.register(refractorMarkupTemplating)\n  ;(function(Prism) {\n    Prism.languages.tt2 = Prism.languages.extend('clike', {\n      comment: /#.*|\\[%#[\\s\\S]*?%\\]/,\n      keyword: /\\b(?:BLOCK|CALL|CASE|CATCH|CLEAR|DEBUG|DEFAULT|ELSE|ELSIF|END|FILTER|FINAL|FOREACH|GET|IF|IN|INCLUDE|INSERT|LAST|MACRO|META|NEXT|PERL|PROCESS|RAWPERL|RETURN|SET|STOP|TAGS|THROW|TRY|SWITCH|UNLESS|USE|WHILE|WRAPPER)\\b/,\n      punctuation: /[[\\]{},()]/\n    })\n    Prism.languages.insertBefore('tt2', 'number', {\n      operator: /=[>=]?|!=?|<=?|>=?|&&|\\|\\|?|\\b(?:and|or|not)\\b/,\n      variable: {\n        pattern: /[a-z]\\w*(?:\\s*\\.\\s*(?:\\d+|\\$?[a-z]\\w*))*/i\n      }\n    })\n    Prism.languages.insertBefore('tt2', 'keyword', {\n      delimiter: {\n        pattern: /^(?:\\[%|%%)-?|-?%]$/,\n        alias: 'punctuation'\n      }\n    })\n    Prism.languages.insertBefore('tt2', 'string', {\n      'single-quoted-string': {\n        pattern: /'[^\\\\']*(?:\\\\[\\s\\S][^\\\\']*)*'/,\n        greedy: true,\n        alias: 'string'\n      },\n      'double-quoted-string': {\n        pattern: /\"[^\\\\\"]*(?:\\\\[\\s\\S][^\\\\\"]*)*\"/,\n        greedy: true,\n        alias: 'string',\n        inside: {\n          variable: {\n            pattern: /\\$(?:[a-z]\\w*(?:\\.(?:\\d+|\\$?[a-z]\\w*))*)/i\n          }\n        }\n      }\n    }) // The different types of TT2 strings \"replace\" the C-like standard string\n    delete Prism.languages.tt2.string\n    Prism.hooks.add('before-tokenize', function(env) {\n      var tt2Pattern = /\\[%[\\s\\S]+?%\\]/g\n      Prism.languages['markup-templating'].buildPlaceholders(\n        env,\n        'tt2',\n        tt2Pattern\n      )\n    })\n    Prism.hooks.add('after-tokenize', function(env) {\n      Prism.languages['markup-templating'].tokenizePlaceholders(env, 'tt2')\n    })\n  })(Prism)\n}\n\n\n//# sourceURL=webpack://frontend/./node_modules/refractor/lang/tt2.js?");

/***/ })

}]);