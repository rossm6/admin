"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["react-syntax-highlighter_languages_refractor_fsharp"],{

/***/ "./node_modules/refractor/lang/fsharp.js":
/*!***********************************************!*\
  !*** ./node_modules/refractor/lang/fsharp.js ***!
  \***********************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = fsharp\nfsharp.displayName = 'fsharp'\nfsharp.aliases = []\nfunction fsharp(Prism) {\n  Prism.languages.fsharp = Prism.languages.extend('clike', {\n    comment: [\n      {\n        pattern: /(^|[^\\\\])\\(\\*[\\s\\S]*?\\*\\)/,\n        lookbehind: true\n      },\n      {\n        pattern: /(^|[^\\\\:])\\/\\/.*/,\n        lookbehind: true\n      }\n    ],\n    string: {\n      pattern: /(?:\"\"\"[\\s\\S]*?\"\"\"|@\"(?:\"\"|[^\"])*\"|\"(?:\\\\[\\s\\S]|[^\\\\\"])*\")B?|'(?:[^\\\\']|\\\\(?:.|\\d{3}|x[a-fA-F\\d]{2}|u[a-fA-F\\d]{4}|U[a-fA-F\\d]{8}))'B?/,\n      greedy: true\n    },\n    'class-name': {\n      pattern: /(\\b(?:exception|inherit|interface|new|of|type)\\s+|\\w\\s*:\\s*|\\s:\\??>\\s*)[.\\w]+\\b(?:\\s*(?:->|\\*)\\s*[.\\w]+\\b)*(?!\\s*[:.])/,\n      lookbehind: true,\n      inside: {\n        operator: /->|\\*/,\n        punctuation: /\\./\n      }\n    },\n    keyword: /\\b(?:let|return|use|yield)(?:!\\B|\\b)|\\b(abstract|and|as|assert|base|begin|class|default|delegate|do|done|downcast|downto|elif|else|end|exception|extern|false|finally|for|fun|function|global|if|in|inherit|inline|interface|internal|lazy|match|member|module|mutable|namespace|new|not|null|of|open|or|override|private|public|rec|select|static|struct|then|to|true|try|type|upcast|val|void|when|while|with|asr|land|lor|lsl|lsr|lxor|mod|sig|atomic|break|checked|component|const|constraint|constructor|continue|eager|event|external|fixed|functor|include|method|mixin|object|parallel|process|protected|pure|sealed|tailcall|trait|virtual|volatile)\\b/,\n    number: [\n      /\\b0x[\\da-fA-F]+(?:un|lf|LF)?\\b/,\n      /\\b0b[01]+(?:y|uy)?\\b/,\n      /(?:\\b\\d+\\.?\\d*|\\B\\.\\d+)(?:[fm]|e[+-]?\\d+)?\\b/i,\n      /\\b\\d+(?:[IlLsy]|u[lsy]?|UL)?\\b/\n    ],\n    operator: /([<>~&^])\\1\\1|([*.:<>&])\\2|<-|->|[!=:]=|<?\\|{1,3}>?|\\??(?:<=|>=|<>|[-+*/%=<>])\\??|[!?^&]|~[+~-]|:>|:\\?>?/\n  })\n  Prism.languages.insertBefore('fsharp', 'keyword', {\n    preprocessor: {\n      pattern: /^[^\\r\\n\\S]*#.*/m,\n      alias: 'property',\n      inside: {\n        directive: {\n          pattern: /(\\s*#)\\b(?:else|endif|if|light|line|nowarn)\\b/,\n          lookbehind: true,\n          alias: 'keyword'\n        }\n      }\n    }\n  })\n  Prism.languages.insertBefore('fsharp', 'punctuation', {\n    'computation-expression': {\n      pattern: /[_a-z]\\w*(?=\\s*\\{)/i,\n      alias: 'keyword'\n    }\n  })\n  Prism.languages.insertBefore('fsharp', 'string', {\n    annotation: {\n      pattern: /\\[<.+?>\\]/,\n      inside: {\n        punctuation: /^\\[<|>\\]$/,\n        'class-name': {\n          pattern: /^\\w+$|(^|;\\s*)[A-Z]\\w*(?=\\()/,\n          lookbehind: true\n        },\n        'annotation-content': {\n          pattern: /[\\s\\S]+/,\n          inside: Prism.languages.fsharp\n        }\n      }\n    }\n  })\n}\n\n\n//# sourceURL=webpack://frontend/./node_modules/refractor/lang/fsharp.js?");

/***/ })

}]);