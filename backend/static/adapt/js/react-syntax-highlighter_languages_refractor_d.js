"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["react-syntax-highlighter_languages_refractor_d"],{

/***/ "./node_modules/refractor/lang/d.js":
/*!******************************************!*\
  !*** ./node_modules/refractor/lang/d.js ***!
  \******************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = d\nd.displayName = 'd'\nd.aliases = []\nfunction d(Prism) {\n  Prism.languages.d = Prism.languages.extend('clike', {\n    string: [\n      // r\"\", x\"\"\n      /\\b[rx]\"(?:\\\\[\\s\\S]|[^\\\\\"])*\"[cwd]?/, // q\"[]\", q\"()\", q\"<>\", q\"{}\"\n      /\\bq\"(?:\\[[\\s\\S]*?\\]|\\([\\s\\S]*?\\)|<[\\s\\S]*?>|\\{[\\s\\S]*?\\})\"/, // q\"IDENT\n      // ...\n      // IDENT\"\n      /\\bq\"([_a-zA-Z][_a-zA-Z\\d]*)(?:\\r?\\n|\\r)[\\s\\S]*?(?:\\r?\\n|\\r)\\1\"/, // q\"//\", q\"||\", etc.\n      /\\bq\"(.)[\\s\\S]*?\\1\"/, // Characters\n      /'(?:\\\\'|\\\\?[^']+)'/,\n      /([\"`])(?:\\\\[\\s\\S]|(?!\\1)[^\\\\])*\\1[cwd]?/\n    ],\n    number: [\n      // The lookbehind and the negative look-ahead try to prevent bad highlighting of the .. operator\n      // Hexadecimal numbers must be handled separately to avoid problems with exponent \"e\"\n      /\\b0x\\.?[a-f\\d_]+(?:(?!\\.\\.)\\.[a-f\\d_]*)?(?:p[+-]?[a-f\\d_]+)?[ulfi]*/i,\n      {\n        pattern: /((?:\\.\\.)?)(?:\\b0b\\.?|\\b|\\.)\\d[\\d_]*(?:(?!\\.\\.)\\.[\\d_]*)?(?:e[+-]?\\d[\\d_]*)?[ulfi]*/i,\n        lookbehind: true\n      }\n    ],\n    // In order: $, keywords and special tokens, globally defined symbols\n    keyword: /\\$|\\b(?:abstract|alias|align|asm|assert|auto|body|bool|break|byte|case|cast|catch|cdouble|cent|cfloat|char|class|const|continue|creal|dchar|debug|default|delegate|delete|deprecated|do|double|else|enum|export|extern|false|final|finally|float|for|foreach|foreach_reverse|function|goto|idouble|if|ifloat|immutable|import|inout|int|interface|invariant|ireal|lazy|long|macro|mixin|module|new|nothrow|null|out|override|package|pragma|private|protected|public|pure|real|ref|return|scope|shared|short|static|struct|super|switch|synchronized|template|this|throw|true|try|typedef|typeid|typeof|ubyte|ucent|uint|ulong|union|unittest|ushort|version|void|volatile|wchar|while|with|__(?:(?:FILE|MODULE|LINE|FUNCTION|PRETTY_FUNCTION|DATE|EOF|TIME|TIMESTAMP|VENDOR|VERSION)__|gshared|traits|vector|parameters)|string|wstring|dstring|size_t|ptrdiff_t)\\b/,\n    operator: /\\|[|=]?|&[&=]?|\\+[+=]?|-[-=]?|\\.?\\.\\.|=[>=]?|!(?:i[ns]\\b|<>?=?|>=?|=)?|\\bi[ns]\\b|(?:<[<>]?|>>?>?|\\^\\^|[*\\/%^~])=?/\n  })\n  Prism.languages.d.comment = [\n    // Shebang\n    /^\\s*#!.+/, // /+ +/\n    {\n      // Allow one level of nesting\n      pattern: /(^|[^\\\\])\\/\\+(?:\\/\\+[\\s\\S]*?\\+\\/|[\\s\\S])*?\\+\\//,\n      lookbehind: true\n    }\n  ].concat(Prism.languages.d.comment)\n  Prism.languages.insertBefore('d', 'comment', {\n    'token-string': {\n      // Allow one level of nesting\n      pattern: /\\bq\\{(?:\\{[^}]*\\}|[^}])*\\}/,\n      alias: 'string'\n    }\n  })\n  Prism.languages.insertBefore('d', 'keyword', {\n    property: /\\B@\\w*/\n  })\n  Prism.languages.insertBefore('d', 'function', {\n    register: {\n      // Iasm registers\n      pattern: /\\b(?:[ABCD][LHX]|E[ABCD]X|E?(?:BP|SP|DI|SI)|[ECSDGF]S|CR[0234]|DR[012367]|TR[3-7]|X?MM[0-7]|R[ABCD]X|[BS]PL|R[BS]P|[DS]IL|R[DS]I|R(?:[89]|1[0-5])[BWD]?|XMM(?:[89]|1[0-5])|YMM(?:1[0-5]|\\d))\\b|\\bST(?:\\([0-7]\\)|\\b)/,\n      alias: 'variable'\n    }\n  })\n}\n\n\n//# sourceURL=webpack://frontend/./node_modules/refractor/lang/d.js?");

/***/ })

}]);