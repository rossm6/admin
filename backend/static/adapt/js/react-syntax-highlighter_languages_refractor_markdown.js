"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["react-syntax-highlighter_languages_refractor_markdown"],{

/***/ "./node_modules/refractor/lang/markdown.js":
/*!*************************************************!*\
  !*** ./node_modules/refractor/lang/markdown.js ***!
  \*************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = markdown\nmarkdown.displayName = 'markdown'\nmarkdown.aliases = ['md']\nfunction markdown(Prism) {\n  ;(function(Prism) {\n    // Allow only one line break\n    var inner = /(?:\\\\.|[^\\\\\\n\\r]|(?:\\r?\\n|\\r)(?!\\r?\\n|\\r))/.source\n    /**\n     * This function is intended for the creation of the bold or italic pattern.\n     *\n     * This also adds a lookbehind group to the given pattern to ensure that the pattern is not backslash-escaped.\n     *\n     * _Note:_ Keep in mind that this adds a capturing group.\n     *\n     * @param {string} pattern\n     * @param {boolean} starAlternative Whether to also add an alternative where all `_`s are replaced with `*`s.\n     * @returns {RegExp}\n     */\n    function createInline(pattern, starAlternative) {\n      pattern = pattern.replace(/<inner>/g, inner)\n      if (starAlternative) {\n        pattern = pattern + '|' + pattern.replace(/_/g, '\\\\*')\n      }\n      return RegExp(/((?:^|[^\\\\])(?:\\\\{2})*)/.source + '(?:' + pattern + ')')\n    }\n    var tableCell = /(?:\\\\.|``.+?``|`[^`\\r\\n]+`|[^\\\\|\\r\\n`])+/.source\n    var tableRow = /\\|?__(?:\\|__)+\\|?(?:(?:\\r?\\n|\\r)|$)/.source.replace(\n      /__/g,\n      tableCell\n    )\n    var tableLine = /\\|?[ \\t]*:?-{3,}:?[ \\t]*(?:\\|[ \\t]*:?-{3,}:?[ \\t]*)+\\|?(?:\\r?\\n|\\r)/\n      .source\n    Prism.languages.markdown = Prism.languages.extend('markup', {})\n    Prism.languages.insertBefore('markdown', 'prolog', {\n      blockquote: {\n        // > ...\n        pattern: /^>(?:[\\t ]*>)*/m,\n        alias: 'punctuation'\n      },\n      table: {\n        pattern: RegExp(\n          '^' + tableRow + tableLine + '(?:' + tableRow + ')*',\n          'm'\n        ),\n        inside: {\n          'table-data-rows': {\n            pattern: RegExp(\n              '^(' + tableRow + tableLine + ')(?:' + tableRow + ')*$'\n            ),\n            lookbehind: true,\n            inside: {\n              'table-data': {\n                pattern: RegExp(tableCell),\n                inside: Prism.languages.markdown\n              },\n              punctuation: /\\|/\n            }\n          },\n          'table-line': {\n            pattern: RegExp('^(' + tableRow + ')' + tableLine + '$'),\n            lookbehind: true,\n            inside: {\n              punctuation: /\\||:?-{3,}:?/\n            }\n          },\n          'table-header-row': {\n            pattern: RegExp('^' + tableRow + '$'),\n            inside: {\n              'table-header': {\n                pattern: RegExp(tableCell),\n                alias: 'important',\n                inside: Prism.languages.markdown\n              },\n              punctuation: /\\|/\n            }\n          }\n        }\n      },\n      code: [\n        {\n          // Prefixed by 4 spaces or 1 tab and preceded by an empty line\n          pattern: /(^[ \\t]*(?:\\r?\\n|\\r))(?: {4}|\\t).+(?:(?:\\r?\\n|\\r)(?: {4}|\\t).+)*/m,\n          lookbehind: true,\n          alias: 'keyword'\n        },\n        {\n          // `code`\n          // ``code``\n          pattern: /``.+?``|`[^`\\r\\n]+`/,\n          alias: 'keyword'\n        },\n        {\n          // ```optional language\n          // code block\n          // ```\n          pattern: /^```[\\s\\S]*?^```$/m,\n          greedy: true,\n          inside: {\n            'code-block': {\n              pattern: /^(```.*(?:\\r?\\n|\\r))[\\s\\S]+?(?=(?:\\r?\\n|\\r)^```$)/m,\n              lookbehind: true\n            },\n            'code-language': {\n              pattern: /^(```).+/,\n              lookbehind: true\n            },\n            punctuation: /```/\n          }\n        }\n      ],\n      title: [\n        {\n          // title 1\n          // =======\n          // title 2\n          // -------\n          pattern: /\\S.*(?:\\r?\\n|\\r)(?:==+|--+)(?=[ \\t]*$)/m,\n          alias: 'important',\n          inside: {\n            punctuation: /==+$|--+$/\n          }\n        },\n        {\n          // # title 1\n          // ###### title 6\n          pattern: /(^\\s*)#+.+/m,\n          lookbehind: true,\n          alias: 'important',\n          inside: {\n            punctuation: /^#+|#+$/\n          }\n        }\n      ],\n      hr: {\n        // ***\n        // ---\n        // * * *\n        // -----------\n        pattern: /(^\\s*)([*-])(?:[\\t ]*\\2){2,}(?=\\s*$)/m,\n        lookbehind: true,\n        alias: 'punctuation'\n      },\n      list: {\n        // * item\n        // + item\n        // - item\n        // 1. item\n        pattern: /(^\\s*)(?:[*+-]|\\d+\\.)(?=[\\t ].)/m,\n        lookbehind: true,\n        alias: 'punctuation'\n      },\n      'url-reference': {\n        // [id]: http://example.com \"Optional title\"\n        // [id]: http://example.com 'Optional title'\n        // [id]: http://example.com (Optional title)\n        // [id]: <http://example.com> \"Optional title\"\n        pattern: /!?\\[[^\\]]+\\]:[\\t ]+(?:\\S+|<(?:\\\\.|[^>\\\\])+>)(?:[\\t ]+(?:\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'|\\((?:\\\\.|[^)\\\\])*\\)))?/,\n        inside: {\n          variable: {\n            pattern: /^(!?\\[)[^\\]]+/,\n            lookbehind: true\n          },\n          string: /(?:\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'|\\((?:\\\\.|[^)\\\\])*\\))$/,\n          punctuation: /^[\\[\\]!:]|[<>]/\n        },\n        alias: 'url'\n      },\n      bold: {\n        // **strong**\n        // __strong__\n        // allow one nested instance of italic text using the same delimiter\n        pattern: createInline(\n          /__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__/.source,\n          true\n        ),\n        lookbehind: true,\n        greedy: true,\n        inside: {\n          content: {\n            pattern: /(^..)[\\s\\S]+(?=..$)/,\n            lookbehind: true,\n            inside: {} // see below\n          },\n          punctuation: /\\*\\*|__/\n        }\n      },\n      italic: {\n        // *em*\n        // _em_\n        // allow one nested instance of bold text using the same delimiter\n        pattern: createInline(\n          /_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_/.source,\n          true\n        ),\n        lookbehind: true,\n        greedy: true,\n        inside: {\n          content: {\n            pattern: /(^.)[\\s\\S]+(?=.$)/,\n            lookbehind: true,\n            inside: {} // see below\n          },\n          punctuation: /[*_]/\n        }\n      },\n      strike: {\n        // ~~strike through~~\n        // ~strike~\n        pattern: createInline(/(~~?)(?:(?!~)<inner>)+?\\2/.source, false),\n        lookbehind: true,\n        greedy: true,\n        inside: {\n          content: {\n            pattern: /(^~~?)[\\s\\S]+(?=\\1$)/,\n            lookbehind: true,\n            inside: {} // see below\n          },\n          punctuation: /~~?/\n        }\n      },\n      url: {\n        // [example](http://example.com \"Optional title\")\n        // [example][id]\n        // [example] [id]\n        pattern: createInline(\n          /!?\\[(?:(?!\\])<inner>)+\\](?:\\([^\\s)]+(?:[\\t ]+\"(?:\\\\.|[^\"\\\\])*\")?\\)| ?\\[(?:(?!\\])<inner>)+\\])/\n            .source,\n          false\n        ),\n        lookbehind: true,\n        greedy: true,\n        inside: {\n          variable: {\n            pattern: /(\\[)[^\\]]+(?=\\]$)/,\n            lookbehind: true\n          },\n          content: {\n            pattern: /(^!?\\[)[^\\]]+(?=\\])/,\n            lookbehind: true,\n            inside: {} // see below\n          },\n          string: {\n            pattern: /\"(?:\\\\.|[^\"\\\\])*\"(?=\\)$)/\n          }\n        }\n      }\n    })\n    ;['url', 'bold', 'italic', 'strike'].forEach(function(token) {\n      ;['url', 'bold', 'italic', 'strike'].forEach(function(inside) {\n        if (token !== inside) {\n          Prism.languages.markdown[token].inside.content.inside[inside] =\n            Prism.languages.markdown[inside]\n        }\n      })\n    })\n    Prism.hooks.add('after-tokenize', function(env) {\n      if (env.language !== 'markdown' && env.language !== 'md') {\n        return\n      }\n      function walkTokens(tokens) {\n        if (!tokens || typeof tokens === 'string') {\n          return\n        }\n        for (var i = 0, l = tokens.length; i < l; i++) {\n          var token = tokens[i]\n          if (token.type !== 'code') {\n            walkTokens(token.content)\n            continue\n          }\n          /*\n           * Add the correct `language-xxxx` class to this code block. Keep in mind that the `code-language` token\n           * is optional. But the grammar is defined so that there is only one case we have to handle:\n           *\n           * token.content = [\n           *     <span class=\"punctuation\">```</span>,\n           *     <span class=\"code-language\">xxxx</span>,\n           *     '\\n', // exactly one new lines (\\r or \\n or \\r\\n)\n           *     <span class=\"code-block\">...</span>,\n           *     '\\n', // exactly one new lines again\n           *     <span class=\"punctuation\">```</span>\n           * ];\n           */\n          var codeLang = token.content[1]\n          var codeBlock = token.content[3]\n          if (\n            codeLang &&\n            codeBlock &&\n            codeLang.type === 'code-language' &&\n            codeBlock.type === 'code-block' &&\n            typeof codeLang.content === 'string'\n          ) {\n            // this might be a language that Prism does not support\n            var alias =\n              'language-' +\n              codeLang.content\n                .trim()\n                .split(/\\s+/)[0]\n                .toLowerCase() // add alias\n            if (!codeBlock.alias) {\n              codeBlock.alias = [alias]\n            } else if (typeof codeBlock.alias === 'string') {\n              codeBlock.alias = [codeBlock.alias, alias]\n            } else {\n              codeBlock.alias.push(alias)\n            }\n          }\n        }\n      }\n      walkTokens(env.tokens)\n    })\n    Prism.hooks.add('wrap', function(env) {\n      if (env.type !== 'code-block') {\n        return\n      }\n      var codeLang = ''\n      for (var i = 0, l = env.classes.length; i < l; i++) {\n        var cls = env.classes[i]\n        var match = /language-(.+)/.exec(cls)\n        if (match) {\n          codeLang = match[1]\n          break\n        }\n      }\n      var grammar = Prism.languages[codeLang]\n      if (!grammar) {\n        if (codeLang && codeLang !== 'none' && Prism.plugins.autoloader) {\n          var id =\n            'md-' +\n            new Date().valueOf() +\n            '-' +\n            Math.floor(Math.random() * 1e16)\n          env.attributes['id'] = id\n          Prism.plugins.autoloader.loadLanguages(codeLang, function() {\n            var ele = document.getElementById(id)\n            if (ele) {\n              ele.innerHTML = Prism.highlight(\n                ele.textContent,\n                Prism.languages[codeLang],\n                codeLang\n              )\n            }\n          })\n        }\n      } else {\n        // reverse Prism.util.encode\n        var code = env.content.value\n          .replace(/&lt;/g, '<')\n          .replace(/&amp;/g, '&')\n        env.content = Prism.highlight(code, grammar, codeLang)\n      }\n    })\n    Prism.languages.md = Prism.languages.markdown\n  })(Prism)\n}\n\n\n//# sourceURL=webpack://frontend/./node_modules/refractor/lang/markdown.js?");

/***/ })

}]);