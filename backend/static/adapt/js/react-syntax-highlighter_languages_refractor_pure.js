"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["react-syntax-highlighter_languages_refractor_pure"],{

/***/ "./node_modules/refractor/lang/c.js":
/*!******************************************!*\
  !*** ./node_modules/refractor/lang/c.js ***!
  \******************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = c\nc.displayName = 'c'\nc.aliases = []\nfunction c(Prism) {\n  Prism.languages.c = Prism.languages.extend('clike', {\n    'class-name': {\n      pattern: /(\\b(?:enum|struct)\\s+)\\w+/,\n      lookbehind: true\n    },\n    keyword: /\\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\\b/,\n    operator: />>=?|<<=?|->|([-+&|:])\\1|[?:~]|[-+*/%&|^!=<>]=?/,\n    number: /(?:\\b0x(?:[\\da-f]+\\.?[\\da-f]*|\\.[\\da-f]+)(?:p[+-]?\\d+)?|(?:\\b\\d+\\.?\\d*|\\B\\.\\d+)(?:e[+-]?\\d+)?)[ful]*/i\n  })\n  Prism.languages.insertBefore('c', 'string', {\n    macro: {\n      // allow for multiline macro definitions\n      // spaces after the # character compile fine with gcc\n      pattern: /(^\\s*)#\\s*[a-z]+(?:[^\\r\\n\\\\]|\\\\(?:\\r\\n|[\\s\\S]))*/im,\n      lookbehind: true,\n      alias: 'property',\n      inside: {\n        // highlight the path of the include statement as a string\n        string: {\n          pattern: /(#\\s*include\\s*)(?:<.+?>|(\"|')(?:\\\\?.)+?\\2)/,\n          lookbehind: true\n        },\n        // highlight macro directives as keywords\n        directive: {\n          pattern: /(#\\s*)\\b(?:define|defined|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\\b/,\n          lookbehind: true,\n          alias: 'keyword'\n        }\n      }\n    },\n    // highlight predefined macros as constants\n    constant: /\\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\\b/\n  })\n  delete Prism.languages.c['boolean']\n}\n\n\n//# sourceURL=webpack://frontend/./node_modules/refractor/lang/c.js?");

/***/ }),

/***/ "./node_modules/refractor/lang/pure.js":
/*!*********************************************!*\
  !*** ./node_modules/refractor/lang/pure.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nvar refractorC = __webpack_require__(/*! ./c.js */ \"./node_modules/refractor/lang/c.js\")\nmodule.exports = pure\npure.displayName = 'pure'\npure.aliases = []\nfunction pure(Prism) {\n  Prism.register(refractorC)\n  ;(function(Prism) {\n    Prism.languages.pure = {\n      comment: [\n        {\n          pattern: /(^|[^\\\\])\\/\\*[\\s\\S]*?\\*\\//,\n          lookbehind: true\n        },\n        {\n          pattern: /(^|[^\\\\:])\\/\\/.*/,\n          lookbehind: true\n        },\n        /#!.+/\n      ],\n      'inline-lang': {\n        pattern: /%<[\\s\\S]+?%>/,\n        greedy: true,\n        inside: {\n          lang: {\n            pattern: /(^%< *)-\\*-.+?-\\*-/,\n            lookbehind: true,\n            alias: 'comment'\n          },\n          delimiter: {\n            pattern: /^%<.*|%>$/,\n            alias: 'punctuation'\n          }\n        }\n      },\n      string: {\n        pattern: /\"(?:\\\\.|[^\"\\\\\\r\\n])*\"/,\n        greedy: true\n      },\n      number: {\n        // The look-behind prevents wrong highlighting of the .. operator\n        pattern: /((?:\\.\\.)?)(?:\\b(?:inf|nan)\\b|\\b0x[\\da-f]+|(?:\\b(?:0b)?\\d+(?:\\.\\d)?|\\B\\.\\d)\\d*(?:e[+-]?\\d+)?L?)/i,\n        lookbehind: true\n      },\n      keyword: /\\b(?:ans|break|bt|case|catch|cd|clear|const|def|del|dump|else|end|exit|extern|false|force|help|if|infix[lr]?|interface|let|ls|mem|namespace|nonfix|NULL|of|otherwise|outfix|override|postfix|prefix|private|public|pwd|quit|run|save|show|stats|then|throw|trace|true|type|underride|using|when|with)\\b/,\n      function: /\\b(?:abs|add_(?:(?:fundef|interface|macdef|typedef)(?:_at)?|addr|constdef|vardef)|all|any|applp?|arity|bigintp?|blob(?:_crc|_size|p)?|boolp?|byte_(?:matrix|pointer)|byte_c?string(?:_pointer)?|calloc|cat|catmap|ceil|char[ps]?|check_ptrtag|chr|clear_sentry|clearsym|closurep?|cmatrixp?|cols?|colcat(?:map)?|colmap|colrev|colvector(?:p|seq)?|complex(?:_float_(?:matrix|pointer)|_matrix(?:_view)?|_pointer|p)?|conj|cookedp?|cst|cstring(?:_(?:dup|list|vector))?|curry3?|cyclen?|del_(?:constdef|fundef|interface|macdef|typedef|vardef)|delete|diag(?:mat)?|dim|dmatrixp?|do|double(?:_matrix(?:_view)?|_pointer|p)?|dowith3?|drop|dropwhile|eval(?:cmd)?|exactp|filter|fix|fixity|flip|float(?:_matrix|_pointer)|floor|fold[lr]1?|frac|free|funp?|functionp?|gcd|get(?:_(?:byte|constdef|double|float|fundef|int(?:64)?|interface(?:_typedef)?|long|macdef|pointer|ptrtag|short|sentry|string|typedef|vardef))?|globsym|hash|head|id|im|imatrixp?|index|inexactp|infp|init|insert|int(?:_matrix(?:_view)?|_pointer|p)?|int64_(?:matrix|pointer)|integerp?|iteraten?|iterwhile|join|keys?|lambdap?|last(?:err(?:pos)?)?|lcd|list[2p]?|listmap|make_ptrtag|malloc|map|matcat|matrixp?|max|member|min|nanp|nargs|nmatrixp?|null|numberp?|ord|pack(?:ed)?|pointer(?:_cast|_tag|_type|p)?|pow|pred|ptrtag|put(?:_(?:byte|double|float|int(?:64)?|long|pointer|short|string))?|rationalp?|re|realp?|realloc|recordp?|redim|reduce(?:_with)?|refp?|repeatn?|reverse|rlistp?|round|rows?|rowcat(?:map)?|rowmap|rowrev|rowvector(?:p|seq)?|same|scan[lr]1?|sentry|sgn|short_(?:matrix|pointer)|slice|smatrixp?|sort|split|str|strcat|stream|stride|string(?:_(?:dup|list|vector)|p)?|subdiag(?:mat)?|submat|subseq2?|substr|succ|supdiag(?:mat)?|symbolp?|tail|take|takewhile|thunkp?|transpose|trunc|tuplep?|typep|ubyte|uint(?:64)?|ulong|uncurry3?|unref|unzip3?|update|ushort|vals?|varp?|vector(?:p|seq)?|void|zip3?|zipwith3?)\\b/,\n      special: {\n        pattern: /\\b__[a-z]+__\\b/i,\n        alias: 'builtin'\n      },\n      // Any combination of operator chars can be an operator\n      operator: /(?=\\b_|[^_])[!\"#$%&'*+,\\-.\\/:<=>?@\\\\^_`|~\\u00a1-\\u00bf\\u00d7-\\u00f7\\u20d0-\\u2bff]+|\\b(?:and|div|mod|not|or)\\b/,\n      // FIXME: How can we prevent | and , to be highlighted as operator when they are used alone?\n      punctuation: /[(){}\\[\\];,|]/\n    }\n    var inlineLanguages = [\n      'c',\n      {\n        lang: 'c++',\n        alias: 'cpp'\n      },\n      'fortran'\n    ]\n    var inlineLanguageRe = /%< *-\\*- *{lang}\\d* *-\\*-[\\s\\S]+?%>/.source\n    inlineLanguages.forEach(function(lang) {\n      var alias = lang\n      if (typeof lang !== 'string') {\n        alias = lang.alias\n        lang = lang.lang\n      }\n      if (Prism.languages[alias]) {\n        var o = {}\n        o['inline-lang-' + alias] = {\n          pattern: RegExp(\n            inlineLanguageRe.replace(\n              '{lang}',\n              lang.replace(/([.+*?\\/\\\\(){}\\[\\]])/g, '\\\\$1')\n            ),\n            'i'\n          ),\n          inside: Prism.util.clone(Prism.languages.pure['inline-lang'].inside)\n        }\n        o['inline-lang-' + alias].inside.rest = Prism.util.clone(\n          Prism.languages[alias]\n        )\n        Prism.languages.insertBefore('pure', 'inline-lang', o)\n      }\n    }) // C is the default inline language\n    if (Prism.languages.c) {\n      Prism.languages.pure['inline-lang'].inside.rest = Prism.util.clone(\n        Prism.languages.c\n      )\n    }\n  })(Prism)\n}\n\n\n//# sourceURL=webpack://frontend/./node_modules/refractor/lang/pure.js?");

/***/ })

}]);