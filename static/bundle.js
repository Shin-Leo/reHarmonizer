(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AbcNotation = {}, global.core));
}(this, (function (exports, core) { 'use strict';

  var fillStr = function (character, times) {
      return Array(times + 1).join(character);
  };
  var REGEX = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;
  function tokenize(str) {
      var m = REGEX.exec(str);
      if (!m) {
          return ["", "", ""];
      }
      return [m[1], m[2], m[3]];
  }
  /**
   * Convert a (string) note in ABC notation into a (string) note in scientific notation
   *
   * @example
   * abcToScientificNotation("c") // => "C5"
   */
  function abcToScientificNotation(str) {
      var _a = tokenize(str), acc = _a[0], letter = _a[1], oct = _a[2];
      if (letter === "") {
          return "";
      }
      var o = 4;
      for (var i = 0; i < oct.length; i++) {
          o += oct.charAt(i) === "," ? -1 : 1;
      }
      var a = acc[0] === "_"
          ? acc.replace(/_/g, "b")
          : acc[0] === "^"
              ? acc.replace(/\^/g, "#")
              : "";
      return letter.charCodeAt(0) > 96
          ? letter.toUpperCase() + a + (o + 1)
          : letter + a + o;
  }
  /**
   * Convert a (string) note in scientific notation into a (string) note in ABC notation
   *
   * @example
   * scientificToAbcNotation("C#4") // => "^C"
   */
  function scientificToAbcNotation(str) {
      var n = core.note(str);
      if (n.empty || (!n.oct && n.oct !== 0)) {
          return "";
      }
      var letter = n.letter, acc = n.acc, oct = n.oct;
      var a = acc[0] === "b" ? acc.replace(/b/g, "_") : acc.replace(/#/g, "^");
      var l = oct > 4 ? letter.toLowerCase() : letter;
      var o = oct === 5 ? "" : oct > 4 ? fillStr("'", oct - 5) : fillStr(",", 4 - oct);
      return a + l + o;
  }
  function transpose(note, interval) {
      return scientificToAbcNotation(core.transpose(abcToScientificNotation(note), interval));
  }
  function distance(from, to) {
      return core.distance(abcToScientificNotation(from), abcToScientificNotation(to));
  }
  var index = {
      abcToScientificNotation: abcToScientificNotation,
      scientificToAbcNotation: scientificToAbcNotation,
      tokenize: tokenize,
      transpose: transpose,
      distance: distance,
  };

  exports.abcToScientificNotation = abcToScientificNotation;
  exports.default = index;
  exports.distance = distance;
  exports.scientificToAbcNotation = scientificToAbcNotation;
  exports.tokenize = tokenize;
  exports.transpose = transpose;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7}],2:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Array = {}, global.core));
}(this, (function (exports, core) { 'use strict';

  // ascending range
  function ascR(b, n) {
      var a = [];
      // tslint:disable-next-line:curly
      for (; n--; a[n] = n + b)
          ;
      return a;
  }
  // descending range
  function descR(b, n) {
      var a = [];
      // tslint:disable-next-line:curly
      for (; n--; a[n] = b - n)
          ;
      return a;
  }
  /**
   * Creates a numeric range
   *
   * @param {number} from
   * @param {number} to
   * @return {Array<number>}
   *
   * @example
   * range(-2, 2) // => [-2, -1, 0, 1, 2]
   * range(2, -2) // => [2, 1, 0, -1, -2]
   */
  function range(from, to) {
      return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
  }
  /**
   * Rotates a list a number of times. It"s completly agnostic about the
   * contents of the list.
   *
   * @param {Integer} times - the number of rotations
   * @param {Array} array
   * @return {Array} the rotated array
   *
   * @example
   * rotate(1, [1, 2, 3]) // => [2, 3, 1]
   */
  function rotate(times, arr) {
      var len = arr.length;
      var n = ((times % len) + len) % len;
      return arr.slice(n, len).concat(arr.slice(0, n));
  }
  /**
   * Return a copy of the array with the null values removed
   * @function
   * @param {Array} array
   * @return {Array}
   *
   * @example
   * compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
   */
  function compact(arr) {
      return arr.filter(function (n) { return n === 0 || n; });
  }
  /**
   * Sort an array of notes in ascending order. Pitch classes are listed
   * before notes. Any string that is not a note is removed.
   *
   * @param {string[]} notes
   * @return {string[]} sorted array of notes
   *
   * @example
   * sortedNoteNames(['c2', 'c5', 'c1', 'c0', 'c6', 'c'])
   * // => ['C', 'C0', 'C1', 'C2', 'C5', 'C6']
   * sortedNoteNames(['c', 'F', 'G', 'a', 'b', 'h', 'J'])
   * // => ['C', 'F', 'G', 'A', 'B']
   */
  function sortedNoteNames(notes) {
      var valid = notes.map(function (n) { return core.note(n); }).filter(function (n) { return !n.empty; });
      return valid.sort(function (a, b) { return a.height - b.height; }).map(function (n) { return n.name; });
  }
  /**
   * Get sorted notes with duplicates removed. Pitch classes are listed
   * before notes.
   *
   * @function
   * @param {string[]} array
   * @return {string[]} unique sorted notes
   *
   * @example
   * Array.sortedUniqNoteNames(['a', 'b', 'c2', '1p', 'p2', 'c2', 'b', 'c', 'c3' ])
   * // => [ 'C', 'A', 'B', 'C2', 'C3' ]
   */
  function sortedUniqNoteNames(arr) {
      return sortedNoteNames(arr).filter(function (n, i, a) { return i === 0 || n !== a[i - 1]; });
  }
  /**
   * Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.
   *
   * @function
   * @param {Array} array
   * @return {Array} the array shuffled
   *
   * @example
   * shuffle(["C", "D", "E", "F"]) // => [...]
   */
  function shuffle(arr, rnd) {
      if (rnd === void 0) { rnd = Math.random; }
      var i;
      var t;
      var m = arr.length;
      while (m) {
          i = Math.floor(rnd() * m--);
          t = arr[m];
          arr[m] = arr[i];
          arr[i] = t;
      }
      return arr;
  }
  /**
   * Get all permutations of an array
   *
   * @param {Array} array - the array
   * @return {Array<Array>} an array with all the permutations
   * @example
   * permutations(["a", "b", "c"])) // =>
   * [
   *   ["a", "b", "c"],
   *   ["b", "a", "c"],
   *   ["b", "c", "a"],
   *   ["a", "c", "b"],
   *   ["c", "a", "b"],
   *   ["c", "b", "a"]
   * ]
   */
  function permutations(arr) {
      if (arr.length === 0) {
          return [[]];
      }
      return permutations(arr.slice(1)).reduce(function (acc, perm) {
          return acc.concat(arr.map(function (e, pos) {
              var newPerm = perm.slice();
              newPerm.splice(pos, 0, arr[0]);
              return newPerm;
          }));
      }, []);
  }

  exports.compact = compact;
  exports.permutations = permutations;
  exports.range = range;
  exports.rotate = rotate;
  exports.shuffle = shuffle;
  exports.sortedNoteNames = sortedNoteNames;
  exports.sortedUniqNoteNames = sortedUniqNoteNames;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7}],3:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/chord-type'), require('@tonaljs/core'), require('@tonaljs/pcset')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/chord-type', '@tonaljs/core', '@tonaljs/pcset'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ChordDetect = {}, global.chordType, global.core, global.pcset));
}(this, (function (exports, chordType, core, pcset) { 'use strict';

  var namedSet = function (notes) {
      var pcToName = notes.reduce(function (record, n) {
          var chroma = core.note(n).chroma;
          if (chroma !== undefined) {
              record[chroma] = record[chroma] || core.note(n).name;
          }
          return record;
      }, {});
      return function (chroma) { return pcToName[chroma]; };
  };
  function detect(source) {
      var notes = source.map(function (n) { return core.note(n).pc; }).filter(function (x) { return x; });
      if (core.note.length === 0) {
          return [];
      }
      var found = findExactMatches(notes, 1);
      return found
          .filter(function (chord) { return chord.weight; })
          .sort(function (a, b) { return b.weight - a.weight; })
          .map(function (chord) { return chord.name; });
  }
  function findExactMatches(notes, weight) {
      var tonic = notes[0];
      var tonicChroma = core.note(tonic).chroma;
      var noteName = namedSet(notes);
      // we need to test all chormas to get the correct baseNote
      var allModes = pcset.modes(notes, false);
      var found = [];
      allModes.forEach(function (mode, index) {
          // some chords could have the same chroma but different interval spelling
          var chordTypes = chordType.all().filter(function (chordType) { return chordType.chroma === mode; });
          chordTypes.forEach(function (chordType) {
              var chordName = chordType.aliases[0];
              var baseNote = noteName(index);
              var isInversion = index !== tonicChroma;
              if (isInversion) {
                  found.push({
                      weight: 0.5 * weight,
                      name: "" + baseNote + chordName + "/" + tonic,
                  });
              }
              else {
                  found.push({ weight: 1 * weight, name: "" + baseNote + chordName });
              }
          });
      });
      return found;
  }
  var index = { detect: detect };

  exports.default = index;
  exports.detect = detect;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/chord-type":4,"@tonaljs/core":7,"@tonaljs/pcset":14}],4:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core'), require('@tonaljs/pcset')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core', '@tonaljs/pcset'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ChordType = {}, global.core, global.pcset));
}(this, (function (exports, core, pcset) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * @private
     * Chord List
     * Source: https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
     * Format: ["intervals", "full name", "abrv1 abrv2"]
     */
    var CHORDS = [
        // ==Major==
        ["1P 3M 5P", "major", "M ^ "],
        ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"],
        ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"],
        ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
        ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
        ["1P 3M 5P 6M 9M", "sixth/ninth", "6/9 69 M69"],
        ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
        [
            "1P 3M 5P 7M 11A",
            "major seventh sharp eleventh",
            "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11",
        ],
        // ==Minor==
        // '''Normal'''
        ["1P 3m 5P", "minor", "m min -"],
        ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
        [
            "1P 3m 5P 7M",
            "minor/major seventh",
            "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7",
        ],
        ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
        ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
        ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
        ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
        ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
        // '''Diminished'''
        ["1P 3m 5d", "diminished", "dim ° o"],
        ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"],
        ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"],
        // ==Dominant/Seventh==
        // '''Normal'''
        ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
        ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
        ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
        ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
        // '''Altered'''
        ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
        ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
        ["1P 3M 7m 9m", "altered", "alt7"],
        // '''Suspended'''
        ["1P 4P 5P", "suspended fourth", "sus4 sus"],
        ["1P 2M 5P", "suspended second", "sus2"],
        ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
        ["1P 5P 7m 9M 11P", "eleventh", "11"],
        [
            "1P 4P 5P 7m 9m",
            "suspended fourth flat ninth",
            "b9sus phryg 7b9sus 7b9sus4",
        ],
        // ==Other==
        ["1P 5P", "fifth", "5"],
        ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
        ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
        ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
        [
            "1P 3M 5P 7M 9M 11A",
            "major sharp eleventh (lydian)",
            "maj9#11 Δ9#11 ^9#11",
        ],
        // ==Legacy==
        ["1P 2M 4P 5P", "", "sus24 sus4add9"],
        ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
        ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
        ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
        ["1P 3M 5A 7m 9M", "", "9#5 9+"],
        ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
        ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
        ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
        ["1P 3M 5A 9A", "", "+add#9"],
        ["1P 3M 5A 9M", "", "M#5add9 +add9"],
        ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
        ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
        ["1P 3M 5P 6M 9M 11A", "", "69#11"],
        ["1P 3m 5P 6M 9M", "", "m69 -69"],
        ["1P 3M 5P 6m 7m", "", "7b6"],
        ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
        ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
        ["1P 3M 5P 7M 9m", "", "M7b9"],
        ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
        ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
        ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
        ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
        ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
        ["1P 3M 5P 7m 9A 13M", "", "13#9"],
        ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
        ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
        ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
        ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
        ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
        ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
        ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
        ["1P 3M 5P 7m 9m 13M", "", "13b9"],
        ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
        ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
        ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
        ["1P 3M 5P 9m", "", "Maddb9"],
        ["1P 3M 5d", "", "Mb5"],
        ["1P 3M 5d 6M 7m 9M", "", "13b5"],
        ["1P 3M 5d 7M", "", "M7b5"],
        ["1P 3M 5d 7M 9M", "", "M9b5"],
        ["1P 3M 5d 7m", "", "7b5"],
        ["1P 3M 5d 7m 9M", "", "9b5"],
        ["1P 3M 7m", "", "7no5"],
        ["1P 3M 7m 13m", "", "7b13"],
        ["1P 3M 7m 9M", "", "9no5"],
        ["1P 3M 7m 9M 13M", "", "13no5"],
        ["1P 3M 7m 9M 13m", "", "9b13"],
        ["1P 3m 4P 5P", "", "madd4"],
        ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
        ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
        ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
        ["1P 3m 5P 9M", "", "madd9"],
        ["1P 3m 5d 6M 7M", "", "o7M7"],
        ["1P 3m 5d 7M", "", "oM7"],
        ["1P 3m 6m 7M", "", "mb6M7"],
        ["1P 3m 6m 7m", "", "m7#5"],
        ["1P 3m 6m 7m 9M", "", "m9#5"],
        ["1P 3m 5A 7m 9M 11P", "", "m11A"],
        ["1P 3m 6m 9m", "", "mb6b9"],
        ["1P 2M 3m 5d 7m", "", "m9b5"],
        ["1P 4P 5A 7M", "", "M7#5sus4"],
        ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
        ["1P 4P 5A 7m", "", "7#5sus4"],
        ["1P 4P 5P 7M", "", "M7sus4"],
        ["1P 4P 5P 7M 9M", "", "M9sus4"],
        ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
        ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
        ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
        ["1P 4P 7m 10m", "", "4 quartal"],
        ["1P 5P 7m 9m 11P", "", "11b9"],
    ];

    var NoChordType = __assign(__assign({}, pcset.EmptyPcset), { name: "", quality: "Unknown", intervals: [], aliases: [] });
    var dictionary = [];
    var index = {};
    /**
     * Given a chord name or chroma, return the chord properties
     * @param {string} source - chord name or pitch class set chroma
     * @example
     * import { get } from 'tonaljs/chord-type'
     * get('major') // => { name: 'major', ... }
     */
    function get(type) {
        return index[type] || NoChordType;
    }
    var chordType = core.deprecate("ChordType.chordType", "ChordType.get", get);
    /**
     * Get all chord (long) names
     */
    function names() {
        return dictionary.map(function (chord) { return chord.name; }).filter(function (x) { return x; });
    }
    /**
     * Get all chord symbols
     */
    function symbols() {
        return dictionary.map(function (chord) { return chord.aliases[0]; }).filter(function (x) { return x; });
    }
    /**
     * Keys used to reference chord types
     */
    function keys() {
        return Object.keys(index);
    }
    /**
     * Return a list of all chord types
     */
    function all() {
        return dictionary.slice();
    }
    var entries = core.deprecate("ChordType.entries", "ChordType.all", all);
    /**
     * Clear the dictionary
     */
    function removeAll() {
        dictionary = [];
        index = {};
    }
    /**
     * Add a chord to the dictionary.
     * @param intervals
     * @param aliases
     * @param [fullName]
     */
    function add(intervals, aliases, fullName) {
        var quality = getQuality(intervals);
        var chord = __assign(__assign({}, pcset.get(intervals)), { name: fullName || "", quality: quality, intervals: intervals, aliases: aliases });
        dictionary.push(chord);
        if (chord.name) {
            index[chord.name] = chord;
        }
        index[chord.setNum] = chord;
        index[chord.chroma] = chord;
        chord.aliases.forEach(function (alias) { return addAlias(chord, alias); });
    }
    function addAlias(chord, alias) {
        index[alias] = chord;
    }
    function getQuality(intervals) {
        var has = function (interval) { return intervals.indexOf(interval) !== -1; };
        return has("5A")
            ? "Augmented"
            : has("3M")
                ? "Major"
                : has("5d")
                    ? "Diminished"
                    : has("3m")
                        ? "Minor"
                        : "Unknown";
    }
    CHORDS.forEach(function (_a) {
        var ivls = _a[0], fullName = _a[1], names = _a[2];
        return add(ivls.split(" "), names.split(" "), fullName);
    });
    dictionary.sort(function (a, b) { return a.setNum - b.setNum; });
    var index$1 = {
        names: names,
        symbols: symbols,
        get: get,
        all: all,
        add: add,
        removeAll: removeAll,
        keys: keys,
        // deprecated
        entries: entries,
        chordType: chordType,
    };

    exports.add = add;
    exports.addAlias = addAlias;
    exports.all = all;
    exports.chordType = chordType;
    exports.default = index$1;
    exports.entries = entries;
    exports.get = get;
    exports.keys = keys;
    exports.names = names;
    exports.removeAll = removeAll;
    exports.symbols = symbols;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7,"@tonaljs/pcset":14}],5:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/chord-detect'), require('@tonaljs/chord-type'), require('@tonaljs/core'), require('@tonaljs/pcset'), require('@tonaljs/scale-type')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/chord-detect', '@tonaljs/chord-type', '@tonaljs/core', '@tonaljs/pcset', '@tonaljs/scale-type'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Chord = {}, global.chordDetect, global.chordType, global.core, global.pcset, global.scaleType));
}(this, (function (exports, chordDetect, chordType, core, pcset, scaleType) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var NoChord = {
        empty: true,
        name: "",
        symbol: "",
        root: "",
        rootDegree: 0,
        type: "",
        tonic: null,
        setNum: NaN,
        quality: "Unknown",
        chroma: "",
        normalized: "",
        aliases: [],
        notes: [],
        intervals: [],
    };
    // 6, 64, 7, 9, 11 and 13 are consider part of the chord
    // (see https://github.com/danigb/tonal/issues/55)
    var NUM_TYPES = /^(6|64|7|9|11|13)$/;
    /**
     * Tokenize a chord name. It returns an array with the tonic and chord type
     * If not tonic is found, all the name is considered the chord name.
     *
     * This function does NOT check if the chord type exists or not. It only tries
     * to split the tonic and chord type.
     *
     * @function
     * @param {string} name - the chord name
     * @return {Array} an array with [tonic, type]
     * @example
     * tokenize("Cmaj7") // => [ "C", "maj7" ]
     * tokenize("C7") // => [ "C", "7" ]
     * tokenize("mMaj7") // => [ null, "mMaj7" ]
     * tokenize("Cnonsense") // => [ null, "nonsense" ]
     */
    function tokenize(name) {
        var _a = core.tokenizeNote(name), letter = _a[0], acc = _a[1], oct = _a[2], type = _a[3];
        if (letter === "") {
            return ["", name];
        }
        // aug is augmented (see https://github.com/danigb/tonal/issues/55)
        if (letter === "A" && type === "ug") {
            return ["", "aug"];
        }
        // see: https://github.com/tonaljs/tonal/issues/70
        if (!type && (oct === "4" || oct === "5")) {
            return [letter + acc, oct];
        }
        if (NUM_TYPES.test(oct)) {
            return [letter + acc, oct + type];
        }
        else {
            return [letter + acc + oct, type];
        }
    }
    /**
     * Get a Chord from a chord name.
     */
    function get(src) {
        if (src === "") {
            return NoChord;
        }
        if (Array.isArray(src) && src.length === 2) {
            return getChord(src[1], src[0]);
        }
        else {
            var _a = tokenize(src), tonic = _a[0], type = _a[1];
            var chord_1 = getChord(type, tonic);
            return chord_1.empty ? getChord(src) : chord_1;
        }
    }
    /**
     * Get chord properties
     *
     * @param typeName - the chord type name
     * @param [tonic] - Optional tonic
     * @param [root]  - Optional root (requires a tonic)
     */
    function getChord(typeName, optionalTonic, optionalRoot) {
        var type = chordType.get(typeName);
        var tonic = core.note(optionalTonic || "");
        var root = core.note(optionalRoot || "");
        if (type.empty ||
            (optionalTonic && tonic.empty) ||
            (optionalRoot && root.empty)) {
            return NoChord;
        }
        var rootInterval = core.distance(tonic.pc, root.pc);
        var rootDegree = type.intervals.indexOf(rootInterval) + 1;
        if (!root.empty && !rootDegree) {
            return NoChord;
        }
        var intervals = Array.from(type.intervals);
        for (var i = 1; i < rootDegree; i++) {
            var num = intervals[0][0];
            var quality = intervals[0][1];
            var newNum = parseInt(num, 10) + 7;
            intervals.push("" + newNum + quality);
            intervals.shift();
        }
        var notes = tonic.empty
            ? []
            : intervals.map(function (i) { return core.transpose(tonic, i); });
        typeName = type.aliases.indexOf(typeName) !== -1 ? typeName : type.aliases[0];
        var symbol = "" + (tonic.empty ? "" : tonic.pc) + typeName + (root.empty || rootDegree <= 1 ? "" : "/" + root.pc);
        var name = "" + (optionalTonic ? tonic.pc + " " : "") + type.name + (rootDegree > 1 && optionalRoot ? " over " + root.pc : "");
        return __assign(__assign({}, type), { name: name, symbol: symbol, type: type.name, root: root.name, intervals: intervals, rootDegree: rootDegree, tonic: tonic.name, notes: notes });
    }
    var chord = core.deprecate("Chord.chord", "Chord.get", get);
    /**
     * Transpose a chord name
     *
     * @param {string} chordName - the chord name
     * @return {string} the transposed chord
     *
     * @example
     * transpose('Dm7', 'P4') // => 'Gm7
     */
    function transpose(chordName, interval) {
        var _a = tokenize(chordName), tonic = _a[0], type = _a[1];
        if (!tonic) {
            return chordName;
        }
        return core.transpose(tonic, interval) + type;
    }
    /**
     * Get all scales where the given chord fits
     *
     * @example
     * chordScales('C7b9')
     * // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
     */
    function chordScales(name) {
        var s = get(name);
        var isChordIncluded = pcset.isSupersetOf(s.chroma);
        return scaleType.all()
            .filter(function (scale) { return isChordIncluded(scale.chroma); })
            .map(function (scale) { return scale.name; });
    }
    /**
     * Get all chords names that are a superset of the given one
     * (has the same notes and at least one more)
     *
     * @function
     * @example
     * extended("CMaj7")
     * // => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
     */
    function extended(chordName) {
        var s = get(chordName);
        var isSuperset = pcset.isSupersetOf(s.chroma);
        return chordType.all()
            .filter(function (chord) { return isSuperset(chord.chroma); })
            .map(function (chord) { return s.tonic + chord.aliases[0]; });
    }
    /**
     * Find all chords names that are a subset of the given one
     * (has less notes but all from the given chord)
     *
     * @example
     */
    function reduced(chordName) {
        var s = get(chordName);
        var isSubset = pcset.isSubsetOf(s.chroma);
        return chordType.all()
            .filter(function (chord) { return isSubset(chord.chroma); })
            .map(function (chord) { return s.tonic + chord.aliases[0]; });
    }
    var index = {
        getChord: getChord,
        get: get,
        detect: chordDetect.detect,
        chordScales: chordScales,
        extended: extended,
        reduced: reduced,
        tokenize: tokenize,
        transpose: transpose,
        // deprecate
        chord: chord,
    };

    Object.defineProperty(exports, 'detect', {
        enumerable: true,
        get: function () {
            return chordDetect.detect;
        }
    });
    exports.chord = chord;
    exports.chordScales = chordScales;
    exports.default = index;
    exports.extended = extended;
    exports.get = get;
    exports.getChord = getChord;
    exports.reduced = reduced;
    exports.tokenize = tokenize;
    exports.transpose = transpose;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/chord-detect":3,"@tonaljs/chord-type":4,"@tonaljs/core":7,"@tonaljs/pcset":14,"@tonaljs/scale-type":18}],6:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Collection = {}));
}(this, (function (exports) { 'use strict';

  // ascending range
  function ascR(b, n) {
      var a = [];
      // tslint:disable-next-line:curly
      for (; n--; a[n] = n + b)
          ;
      return a;
  }
  // descending range
  function descR(b, n) {
      var a = [];
      // tslint:disable-next-line:curly
      for (; n--; a[n] = b - n)
          ;
      return a;
  }
  /**
   * Creates a numeric range
   *
   * @param {number} from
   * @param {number} to
   * @return {Array<number>}
   *
   * @example
   * range(-2, 2) // => [-2, -1, 0, 1, 2]
   * range(2, -2) // => [2, 1, 0, -1, -2]
   */
  function range(from, to) {
      return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
  }
  /**
   * Rotates a list a number of times. It"s completly agnostic about the
   * contents of the list.
   *
   * @param {Integer} times - the number of rotations
   * @param {Array} collection
   * @return {Array} the rotated collection
   *
   * @example
   * rotate(1, [1, 2, 3]) // => [2, 3, 1]
   */
  function rotate(times, arr) {
      var len = arr.length;
      var n = ((times % len) + len) % len;
      return arr.slice(n, len).concat(arr.slice(0, n));
  }
  /**
   * Return a copy of the collection with the null values removed
   * @function
   * @param {Array} collection
   * @return {Array}
   *
   * @example
   * compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
   */
  function compact(arr) {
      return arr.filter(function (n) { return n === 0 || n; });
  }
  /**
   * Randomizes the order of the specified collection in-place, using the Fisher–Yates shuffle.
   *
   * @function
   * @param {Array} collection
   * @return {Array} the collection shuffled
   *
   * @example
   * shuffle(["C", "D", "E", "F"]) // => [...]
   */
  function shuffle(arr, rnd) {
      if (rnd === void 0) { rnd = Math.random; }
      var i;
      var t;
      var m = arr.length;
      while (m) {
          i = Math.floor(rnd() * m--);
          t = arr[m];
          arr[m] = arr[i];
          arr[i] = t;
      }
      return arr;
  }
  /**
   * Get all permutations of an collection
   *
   * @param {Array} collection - the collection
   * @return {Array<Array>} an collection with all the permutations
   * @example
   * permutations(["a", "b", "c"])) // =>
   * [
   *   ["a", "b", "c"],
   *   ["b", "a", "c"],
   *   ["b", "c", "a"],
   *   ["a", "c", "b"],
   *   ["c", "a", "b"],
   *   ["c", "b", "a"]
   * ]
   */
  function permutations(arr) {
      if (arr.length === 0) {
          return [[]];
      }
      return permutations(arr.slice(1)).reduce(function (acc, perm) {
          return acc.concat(arr.map(function (e, pos) {
              var newPerm = perm.slice();
              newPerm.splice(pos, 0, arr[0]);
              return newPerm;
          }));
      }, []);
  }
  var index = {
      compact: compact,
      permutations: permutations,
      range: range,
      rotate: rotate,
      shuffle: shuffle,
  };

  exports.compact = compact;
  exports.default = index;
  exports.permutations = permutations;
  exports.range = range;
  exports.rotate = rotate;
  exports.shuffle = shuffle;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],7:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Core = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Fill a string with a repeated character
   *
   * @param character
   * @param repetition
   */
  var fillStr = function (s, n) { return Array(Math.abs(n) + 1).join(s); };
  function deprecate(original, alternative, fn) {
      return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          // tslint:disable-next-line
          console.warn(original + " is deprecated. Use " + alternative + ".");
          return fn.apply(this, args);
      };
  }

  function isNamed(src) {
      return src !== null && typeof src === "object" && typeof src.name === "string"
          ? true
          : false;
  }

  function isPitch(pitch) {
      return pitch !== null &&
          typeof pitch === "object" &&
          typeof pitch.step === "number" &&
          typeof pitch.alt === "number"
          ? true
          : false;
  }
  // The number of fifths of [C, D, E, F, G, A, B]
  var FIFTHS = [0, 2, 4, -1, 1, 3, 5];
  // The number of octaves it span each step
  var STEPS_TO_OCTS = FIFTHS.map(function (fifths) {
      return Math.floor((fifths * 7) / 12);
  });
  function encode(pitch) {
      var step = pitch.step, alt = pitch.alt, oct = pitch.oct, _a = pitch.dir, dir = _a === void 0 ? 1 : _a;
      var f = FIFTHS[step] + 7 * alt;
      if (oct === undefined) {
          return [dir * f];
      }
      var o = oct - STEPS_TO_OCTS[step] - 4 * alt;
      return [dir * f, dir * o];
  }
  // We need to get the steps from fifths
  // Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
  // We add 1 to fifths to avoid negative numbers, so:
  // for ["F", "C", "G", "D", "A", "E", "B"] we have:
  var FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];
  function decode(coord) {
      var f = coord[0], o = coord[1], dir = coord[2];
      var step = FIFTHS_TO_STEPS[unaltered(f)];
      var alt = Math.floor((f + 1) / 7);
      if (o === undefined) {
          return { step: step, alt: alt, dir: dir };
      }
      var oct = o + 4 * alt + STEPS_TO_OCTS[step];
      return { step: step, alt: alt, oct: oct, dir: dir };
  }
  // Return the number of fifths as if it were unaltered
  function unaltered(f) {
      var i = (f + 1) % 7;
      return i < 0 ? 7 + i : i;
  }

  var NoNote = { empty: true, name: "", pc: "", acc: "" };
  var cache$1 = new Map();
  var stepToLetter = function (step) { return "CDEFGAB".charAt(step); };
  var altToAcc = function (alt) {
      return alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
  };
  var accToAlt = function (acc) {
      return acc[0] === "b" ? -acc.length : acc.length;
  };
  /**
   * Given a note literal (a note name or a note object), returns the Note object
   * @example
   * note('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
   */
  function note(src) {
      var cached = cache$1.get(src);
      if (cached) {
          return cached;
      }
      var value = typeof src === "string"
          ? parse$1(src)
          : isPitch(src)
              ? note(pitchName$1(src))
              : isNamed(src)
                  ? note(src.name)
                  : NoNote;
      cache$1.set(src, value);
      return value;
  }
  var REGEX$1 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
  /**
   * @private
   */
  function tokenizeNote(str) {
      var m = REGEX$1.exec(str);
      return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
  }
  /**
   * @private
   */
  function coordToNote(noteCoord) {
      return note(decode(noteCoord));
  }
  var mod = function (n, m) { return ((n % m) + m) % m; };
  var SEMI = [0, 2, 4, 5, 7, 9, 11];
  function parse$1(noteName) {
      var tokens = tokenizeNote(noteName);
      if (tokens[0] === "" || tokens[3] !== "") {
          return NoNote;
      }
      var letter = tokens[0];
      var acc = tokens[1];
      var octStr = tokens[2];
      var step = (letter.charCodeAt(0) + 3) % 7;
      var alt = accToAlt(acc);
      var oct = octStr.length ? +octStr : undefined;
      var coord = encode({ step: step, alt: alt, oct: oct });
      var name = letter + acc + octStr;
      var pc = letter + acc;
      var chroma = (SEMI[step] + alt + 120) % 12;
      var height = oct === undefined
          ? mod(SEMI[step] + alt, 12) - 12 * 99
          : SEMI[step] + alt + 12 * (oct + 1);
      var midi = height >= 0 && height <= 127 ? height : null;
      var freq = oct === undefined ? null : Math.pow(2, (height - 69) / 12) * 440;
      return {
          empty: false,
          acc: acc,
          alt: alt,
          chroma: chroma,
          coord: coord,
          freq: freq,
          height: height,
          letter: letter,
          midi: midi,
          name: name,
          oct: oct,
          pc: pc,
          step: step,
      };
  }
  function pitchName$1(props) {
      var step = props.step, alt = props.alt, oct = props.oct;
      var letter = stepToLetter(step);
      if (!letter) {
          return "";
      }
      var pc = letter + altToAcc(alt);
      return oct || oct === 0 ? pc + oct : pc;
  }

  var NoInterval = { empty: true, name: "", acc: "" };
  // shorthand tonal notation (with quality after number)
  var INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
  // standard shorthand notation (with quality before number)
  var INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
  var REGEX = new RegExp("^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$");
  /**
   * @private
   */
  function tokenizeInterval(str) {
      var m = REGEX.exec("" + str);
      if (m === null) {
          return ["", ""];
      }
      return m[1] ? [m[1], m[2]] : [m[4], m[3]];
  }
  var cache = {};
  /**
   * Get interval properties. It returns an object with:
   *
   * - name: the interval name
   * - num: the interval number
   * - type: 'perfectable' or 'majorable'
   * - q: the interval quality (d, m, M, A)
   * - dir: interval direction (1 ascending, -1 descending)
   * - simple: the simplified number
   * - semitones: the size in semitones
   * - chroma: the interval chroma
   *
   * @param {string} interval - the interval name
   * @return {Object} the interval properties
   *
   * @example
   * import { interval } from '@tonaljs/core'
   * interval('P5').semitones // => 7
   * interval('m3').type // => 'majorable'
   */
  function interval(src) {
      return typeof src === "string"
          ? cache[src] || (cache[src] = parse(src))
          : isPitch(src)
              ? interval(pitchName(src))
              : isNamed(src)
                  ? interval(src.name)
                  : NoInterval;
  }
  var SIZES = [0, 2, 4, 5, 7, 9, 11];
  var TYPES = "PMMPPMM";
  function parse(str) {
      var tokens = tokenizeInterval(str);
      if (tokens[0] === "") {
          return NoInterval;
      }
      var num = +tokens[0];
      var q = tokens[1];
      var step = (Math.abs(num) - 1) % 7;
      var t = TYPES[step];
      if (t === "M" && q === "P") {
          return NoInterval;
      }
      var type = t === "M" ? "majorable" : "perfectable";
      var name = "" + num + q;
      var dir = num < 0 ? -1 : 1;
      var simple = num === 8 || num === -8 ? num : dir * (step + 1);
      var alt = qToAlt(type, q);
      var oct = Math.floor((Math.abs(num) - 1) / 7);
      var semitones = dir * (SIZES[step] + alt + 12 * oct);
      var chroma = (((dir * (SIZES[step] + alt)) % 12) + 12) % 12;
      var coord = encode({ step: step, alt: alt, oct: oct, dir: dir });
      return {
          empty: false,
          name: name,
          num: num,
          q: q,
          step: step,
          alt: alt,
          dir: dir,
          type: type,
          simple: simple,
          semitones: semitones,
          chroma: chroma,
          coord: coord,
          oct: oct,
      };
  }
  /**
   * @private
   */
  function coordToInterval(coord) {
      var f = coord[0], _a = coord[1], o = _a === void 0 ? 0 : _a;
      var isDescending = f * 7 + o * 12 < 0;
      var ivl = isDescending ? [-f, -o, -1] : [f, o, 1];
      return interval(decode(ivl));
  }
  function qToAlt(type, q) {
      return (q === "M" && type === "majorable") ||
          (q === "P" && type === "perfectable")
          ? 0
          : q === "m" && type === "majorable"
              ? -1
              : /^A+$/.test(q)
                  ? q.length
                  : /^d+$/.test(q)
                      ? -1 * (type === "perfectable" ? q.length : q.length + 1)
                      : 0;
  }
  // return the interval name of a pitch
  function pitchName(props) {
      var step = props.step, alt = props.alt, _a = props.oct, oct = _a === void 0 ? 0 : _a, dir = props.dir;
      if (!dir) {
          return "";
      }
      var num = step + 1 + 7 * oct;
      var d = dir < 0 ? "-" : "";
      var type = TYPES[step] === "M" ? "majorable" : "perfectable";
      var name = d + num + altToQ(type, alt);
      return name;
  }
  function altToQ(type, alt) {
      if (alt === 0) {
          return type === "majorable" ? "M" : "P";
      }
      else if (alt === -1 && type === "majorable") {
          return "m";
      }
      else if (alt > 0) {
          return fillStr("A", alt);
      }
      else {
          return fillStr("d", type === "perfectable" ? alt : alt + 1);
      }
  }

  /**
   * Transpose a note by an interval.
   *
   * @param {string} note - the note or note name
   * @param {string} interval - the interval or interval name
   * @return {string} the transposed note name or empty string if not valid notes
   * @example
   * import { tranpose } from "@tonaljs/core"
   * transpose("d3", "3M") // => "F#3"
   * transpose("D", "3M") // => "F#"
   * ["C", "D", "E", "F", "G"].map(pc => transpose(pc, "M3)) // => ["E", "F#", "G#", "A", "B"]
   */
  function transpose(noteName, intervalName) {
      var note$1 = note(noteName);
      var interval$1 = interval(intervalName);
      if (note$1.empty || interval$1.empty) {
          return "";
      }
      var noteCoord = note$1.coord;
      var intervalCoord = interval$1.coord;
      var tr = noteCoord.length === 1
          ? [noteCoord[0] + intervalCoord[0]]
          : [noteCoord[0] + intervalCoord[0], noteCoord[1] + intervalCoord[1]];
      return coordToNote(tr).name;
  }
  /**
   * Find the interval distance between two notes or coord classes.
   *
   * To find distance between coord classes, both notes must be coord classes and
   * the interval is always ascending
   *
   * @param {Note|string} from - the note or note name to calculate distance from
   * @param {Note|string} to - the note or note name to calculate distance to
   * @return {string} the interval name or empty string if not valid notes
   *
   */
  function distance(fromNote, toNote) {
      var from = note(fromNote);
      var to = note(toNote);
      if (from.empty || to.empty) {
          return "";
      }
      var fcoord = from.coord;
      var tcoord = to.coord;
      var fifths = tcoord[0] - fcoord[0];
      var octs = fcoord.length === 2 && tcoord.length === 2
          ? tcoord[1] - fcoord[1]
          : -Math.floor((fifths * 7) / 12);
      return coordToInterval([fifths, octs]).name;
  }

  exports.accToAlt = accToAlt;
  exports.altToAcc = altToAcc;
  exports.coordToInterval = coordToInterval;
  exports.coordToNote = coordToNote;
  exports.decode = decode;
  exports.deprecate = deprecate;
  exports.distance = distance;
  exports.encode = encode;
  exports.fillStr = fillStr;
  exports.interval = interval;
  exports.isNamed = isNamed;
  exports.isPitch = isPitch;
  exports.note = note;
  exports.stepToLetter = stepToLetter;
  exports.tokenizeInterval = tokenizeInterval;
  exports.tokenizeNote = tokenizeNote;
  exports.transpose = transpose;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],8:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DurationValue = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    // source: https://en.wikipedia.org/wiki/Note_value
    var DATA = [
        [
            0.125,
            "dl",
            ["large", "duplex longa", "maxima", "octuple", "octuple whole"],
        ],
        [0.25, "l", ["long", "longa"]],
        [0.5, "d", ["double whole", "double", "breve"]],
        [1, "w", ["whole", "semibreve"]],
        [2, "h", ["half", "minim"]],
        [4, "q", ["quarter", "crotchet"]],
        [8, "e", ["eighth", "quaver"]],
        [16, "s", ["sixteenth", "semiquaver"]],
        [32, "t", ["thirty-second", "demisemiquaver"]],
        [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]],
        [128, "h", ["hundred twenty-eighth"]],
        [256, "th", ["two hundred fifty-sixth"]],
    ];

    var VALUES = [];
    DATA.forEach(function (_a) {
        var denominator = _a[0], shorthand = _a[1], names = _a[2];
        return add(denominator, shorthand, names);
    });
    var NoDuration = {
        empty: true,
        name: "",
        value: 0,
        fraction: [0, 0],
        shorthand: "",
        dots: "",
        names: [],
    };
    function names() {
        return VALUES.reduce(function (names, duration) {
            duration.names.forEach(function (name) { return names.push(name); });
            return names;
        }, []);
    }
    function shorthands() {
        return VALUES.map(function (dur) { return dur.shorthand; });
    }
    var REGEX = /^([^.]+)(\.*)$/;
    function get(name) {
        var _a = REGEX.exec(name) || []; _a[0]; var simple = _a[1], dots = _a[2];
        var base = VALUES.find(function (dur) { return dur.shorthand === simple || dur.names.includes(simple); });
        if (!base) {
            return NoDuration;
        }
        var fraction = calcDots(base.fraction, dots.length);
        var value = fraction[0] / fraction[1];
        return __assign(__assign({}, base), { name: name, dots: dots, value: value, fraction: fraction });
    }
    var value = function (name) { return get(name).value; };
    var fraction = function (name) { return get(name).fraction; };
    var index = { names: names, shorthands: shorthands, get: get, value: value, fraction: fraction };
    //// PRIVATE ////
    function add(denominator, shorthand, names) {
        VALUES.push({
            empty: false,
            dots: "",
            name: "",
            value: 1 / denominator,
            fraction: denominator < 1 ? [1 / denominator, 1] : [1, denominator],
            shorthand: shorthand,
            names: names,
        });
    }
    function calcDots(fraction, dots) {
        var pow = Math.pow(2, dots);
        var numerator = fraction[0] * pow;
        var denominator = fraction[1] * pow;
        var base = numerator;
        // add fractions
        for (var i = 0; i < dots; i++) {
            numerator += base / Math.pow(2, i + 1);
        }
        // simplify
        while (numerator % 2 === 0 && denominator % 2 === 0) {
            numerator /= 2;
            denominator /= 2;
        }
        return [numerator, denominator];
    }

    exports.default = index;
    exports.fraction = fraction;
    exports.get = get;
    exports.names = names;
    exports.shorthands = shorthands;
    exports.value = value;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],9:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Interval = {}, global.core));
}(this, (function (exports, core) { 'use strict';

  /**
   * Get the natural list of names
   */
  function names() {
      return "1P 2M 3M 4P 5P 6m 7m".split(" ");
  }
  /**
   * Get properties of an interval
   *
   * @function
   * @example
   * Interval.get('P4') // => {"alt": 0,  "dir": 1,  "name": "4P", "num": 4, "oct": 0, "q": "P", "semitones": 5, "simple": 4, "step": 3, "type": "perfectable"}
   */
  var get = core.interval;
  /**
   * Get name of an interval
   *
   * @function
   * @example
   * Interval.name('4P') // => "4P"
   * Interval.name('P4') // => "4P"
   * Interval.name('C4') // => ""
   */
  var name = function (name) { return core.interval(name).name; };
  /**
   * Get semitones of an interval
   * @function
   * @example
   * Interval.semitones('P4') // => 5
   */
  var semitones = function (name) { return core.interval(name).semitones; };
  /**
   * Get quality of an interval
   * @function
   * @example
   * Interval.quality('P4') // => "P"
   */
  var quality = function (name) { return core.interval(name).q; };
  /**
   * Get number of an interval
   * @function
   * @example
   * Interval.num('P4') // => 4
   */
  var num = function (name) { return core.interval(name).num; };
  /**
   * Get the simplified version of an interval.
   *
   * @function
   * @param {string} interval - the interval to simplify
   * @return {string} the simplified interval
   *
   * @example
   * Interval.simplify("9M") // => "2M"
   * Interval.simplify("2M") // => "2M"
   * Interval.simplify("-2M") // => "7m"
   * ["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify)
   * // => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
   */
  function simplify(name) {
      var i = core.interval(name);
      return i.empty ? "" : i.simple + i.q;
  }
  /**
   * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
   * of an interval.
   *
   * @function
   * @param {string} interval - the interval to invert in interval shorthand
   * notation or interval array notation
   * @return {string} the inverted interval
   *
   * @example
   * Interval.invert("3m") // => "6M"
   * Interval.invert("2M") // => "7m"
   */
  function invert(name) {
      var i = core.interval(name);
      if (i.empty) {
          return "";
      }
      var step = (7 - i.step) % 7;
      var alt = i.type === "perfectable" ? -i.alt : -(i.alt + 1);
      return core.interval({ step: step, alt: alt, oct: i.oct, dir: i.dir }).name;
  }
  // interval numbers
  var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
  // interval qualities
  var IQ = "P m M m M P d P m M m M".split(" ");
  /**
   * Get interval name from semitones number. Since there are several interval
   * names for the same number, the name it's arbitrary, but deterministic.
   *
   * @param {Integer} num - the number of semitones (can be negative)
   * @return {string} the interval name
   * @example
   * Interval.fromSemitones(7) // => "5P"
   * Interval.fromSemitones(-7) // => "-5P"
   */
  function fromSemitones(semitones) {
      var d = semitones < 0 ? -1 : 1;
      var n = Math.abs(semitones);
      var c = n % 12;
      var o = Math.floor(n / 12);
      return d * (IN[c] + 7 * o) + IQ[c];
  }
  /**
   * Find interval between two notes
   *
   * @example
   * Interval.distance("C4", "G4"); // => "5P"
   */
  var distance = core.distance;
  /**
   * Adds two intervals
   *
   * @function
   * @param {string} interval1
   * @param {string} interval2
   * @return {string} the added interval name
   * @example
   * Interval.add("3m", "5P") // => "7m"
   */
  var add = combinator(function (a, b) { return [a[0] + b[0], a[1] + b[1]]; });
  /**
   * Returns a function that adds an interval
   *
   * @function
   * @example
   * ['1P', '2M', '3M'].map(Interval.addTo('5P')) // => ["5P", "6M", "7M"]
   */
  var addTo = function (interval) { return function (other) {
      return add(interval, other);
  }; };
  /**
   * Subtracts two intervals
   *
   * @function
   * @param {string} minuendInterval
   * @param {string} subtrahendInterval
   * @return {string} the substracted interval name
   * @example
   * Interval.substract('5P', '3M') // => '3m'
   * Interval.substract('3M', '5P') // => '-3m'
   */
  var substract = combinator(function (a, b) { return [a[0] - b[0], a[1] - b[1]]; });
  function transposeFifths(interval, fifths) {
      var ivl = get(interval);
      if (ivl.empty)
          return "";
      var _a = ivl.coord, nFifths = _a[0], nOcts = _a[1], dir = _a[2];
      return core.coordToInterval([nFifths + fifths, nOcts, dir]).name;
  }
  var index = {
      names: names,
      get: get,
      name: name,
      num: num,
      semitones: semitones,
      quality: quality,
      fromSemitones: fromSemitones,
      distance: distance,
      invert: invert,
      simplify: simplify,
      add: add,
      addTo: addTo,
      substract: substract,
      transposeFifths: transposeFifths,
  };
  function combinator(fn) {
      return function (a, b) {
          var coordA = core.interval(a).coord;
          var coordB = core.interval(b).coord;
          if (coordA && coordB) {
              var coord = fn(coordA, coordB);
              return core.coordToInterval(coord).name;
          }
      };
  }

  exports.add = add;
  exports.addTo = addTo;
  exports.default = index;
  exports.distance = distance;
  exports.fromSemitones = fromSemitones;
  exports.get = get;
  exports.invert = invert;
  exports.name = name;
  exports.names = names;
  exports.num = num;
  exports.quality = quality;
  exports.semitones = semitones;
  exports.simplify = simplify;
  exports.substract = substract;
  exports.transposeFifths = transposeFifths;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7}],10:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core'), require('@tonaljs/note'), require('@tonaljs/roman-numeral')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core', '@tonaljs/note', '@tonaljs/roman-numeral'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Key = {}, global.core, global.note, global.romanNumeral));
}(this, (function (exports, core, note, romanNumeral) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var Empty = Object.freeze([]);
    var NoKey = {
        type: "major",
        tonic: "",
        alteration: 0,
        keySignature: "",
    };
    var NoKeyScale = {
        tonic: "",
        grades: Empty,
        intervals: Empty,
        scale: Empty,
        chords: Empty,
        chordsHarmonicFunction: Empty,
        chordScales: Empty,
    };
    var NoMajorKey = __assign(__assign(__assign({}, NoKey), NoKeyScale), { type: "major", minorRelative: "", scale: Empty, secondaryDominants: Empty, secondaryDominantsMinorRelative: Empty, substituteDominants: Empty, substituteDominantsMinorRelative: Empty });
    var NoMinorKey = __assign(__assign({}, NoKey), { type: "minor", relativeMajor: "", natural: NoKeyScale, harmonic: NoKeyScale, melodic: NoKeyScale });
    var mapScaleToType = function (scale, list, sep) {
        if (sep === void 0) { sep = ""; }
        return list.map(function (type, i) { return "" + scale[i] + sep + type; });
    };
    function keyScale(grades, chords, harmonicFunctions, chordScales) {
        return function (tonic) {
            var intervals = grades.map(function (gr) { return romanNumeral.get(gr).interval || ""; });
            var scale = intervals.map(function (interval) { return core.transpose(tonic, interval); });
            return {
                tonic: tonic,
                grades: grades,
                intervals: intervals,
                scale: scale,
                chords: mapScaleToType(scale, chords),
                chordsHarmonicFunction: harmonicFunctions.slice(),
                chordScales: mapScaleToType(scale, chordScales, " "),
            };
        };
    }
    var distInFifths = function (from, to) {
        var f = core.note(from);
        var t = core.note(to);
        return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
    };
    var MajorScale = keyScale("I II III IV V VI VII".split(" "), "maj7 m7 m7 maj7 7 m7 m7b5".split(" "), "T SD T SD D T D".split(" "), "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(","));
    var NaturalScale = keyScale("I II bIII IV V bVI bVII".split(" "), "m7 m7b5 maj7 m7 m7 maj7 7".split(" "), "T SD T SD D SD SD".split(" "), "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(","));
    var HarmonicScale = keyScale("I II bIII IV V bVI VII".split(" "), "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "), "T SD T SD D SD D".split(" "), "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(","));
    var MelodicScale = keyScale("I II bIII IV V VI VII".split(" "), "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "), "T SD T SD D  ".split(" "), "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(","));
    /**
     * Get a major key properties in a given tonic
     * @param tonic
     */
    function majorKey(tonic) {
        var pc = core.note(tonic).pc;
        if (!pc)
            return NoMajorKey;
        var keyScale = MajorScale(pc);
        var alteration = distInFifths("C", pc);
        var romanInTonic = function (src) {
            var r = romanNumeral.get(src);
            if (r.empty)
                return "";
            return core.transpose(tonic, r.interval) + r.chordType;
        };
        return __assign(__assign({}, keyScale), { type: "major", minorRelative: core.transpose(pc, "-3m"), alteration: alteration, keySignature: core.altToAcc(alteration), secondaryDominants: "- VI7 VII7 I7 II7 III7 -".split(" ").map(romanInTonic), secondaryDominantsMinorRelative: "- IIIm7b5 IV#m7 Vm7 VIm7 VIIm7b5 -"
                .split(" ")
                .map(romanInTonic), substituteDominants: "- bIII7 IV7 bV7 bVI7 bVII7 -"
                .split(" ")
                .map(romanInTonic), substituteDominantsMinorRelative: "- IIIm7 Im7 IIbm7 VIm7 IVm7 -"
                .split(" ")
                .map(romanInTonic) });
    }
    /**
     * Get minor key properties in a given tonic
     * @param tonic
     */
    function minorKey(tnc) {
        var pc = core.note(tnc).pc;
        if (!pc)
            return NoMinorKey;
        var alteration = distInFifths("C", pc) - 3;
        return {
            type: "minor",
            tonic: pc,
            relativeMajor: core.transpose(pc, "3m"),
            alteration: alteration,
            keySignature: core.altToAcc(alteration),
            natural: NaturalScale(pc),
            harmonic: HarmonicScale(pc),
            melodic: MelodicScale(pc),
        };
    }
    /**
     * Given a key signature, returns the tonic of the major key
     * @param sigature
     * @example
     * majorTonicFromKeySignature('###') // => 'A'
     */
    function majorTonicFromKeySignature(sig) {
        if (typeof sig === "number") {
            return note.transposeFifths("C", sig);
        }
        else if (typeof sig === "string" && /^b+|#+$/.test(sig)) {
            return note.transposeFifths("C", core.accToAlt(sig));
        }
        return null;
    }
    var index = { majorKey: majorKey, majorTonicFromKeySignature: majorTonicFromKeySignature, minorKey: minorKey };

    exports.default = index;
    exports.majorKey = majorKey;
    exports.majorTonicFromKeySignature = majorTonicFromKeySignature;
    exports.minorKey = minorKey;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7,"@tonaljs/note":13,"@tonaljs/roman-numeral":17}],11:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Midi = {}, global.core));
}(this, (function (exports, core) { 'use strict';

  function isMidi(arg) {
      return +arg >= 0 && +arg <= 127;
  }
  /**
   * Get the note midi number (a number between 0 and 127)
   *
   * It returns undefined if not valid note name
   *
   * @function
   * @param {string|number} note - the note name or midi number
   * @return {Integer} the midi number or undefined if not valid note
   * @example
   * import { toMidi } from '@tonaljs/midi'
   * toMidi("C4") // => 60
   * toMidi(60) // => 60
   * toMidi('60') // => 60
   */
  function toMidi(note) {
      if (isMidi(note)) {
          return +note;
      }
      var n = core.note(note);
      return n.empty ? null : n.midi;
  }
  /**
   * Get the frequency in hertzs from midi number
   *
   * @param {number} midi - the note midi number
   * @param {number} [tuning = 440] - A4 tuning frequency in Hz (440 by default)
   * @return {number} the frequency or null if not valid note midi
   * @example
   * import { midiToFreq} from '@tonaljs/midi'
   * midiToFreq(69) // => 440
   */
  function midiToFreq(midi, tuning) {
      if (tuning === void 0) { tuning = 440; }
      return Math.pow(2, (midi - 69) / 12) * tuning;
  }
  var L2 = Math.log(2);
  var L440 = Math.log(440);
  /**
   * Get the midi number from a frequency in hertz. The midi number can
   * contain decimals (with two digits precission)
   *
   * @param {number} frequency
   * @return {number}
   * @example
   * import { freqToMidi} from '@tonaljs/midi'
   * freqToMidi(220)); //=> 57
   * freqToMidi(261.62)); //=> 60
   * freqToMidi(261)); //=> 59.96
   */
  function freqToMidi(freq) {
      var v = (12 * (Math.log(freq) - L440)) / L2 + 69;
      return Math.round(v * 100) / 100;
  }
  var SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
  var FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
  /**
   * Given a midi number, returns a note name. The altered notes will have
   * flats unless explicitly set with the optional `useSharps` parameter.
   *
   * @function
   * @param {number} midi - the midi note number
   * @param {Object} options = default: `{ sharps: false, pitchClass: false }`
   * @param {boolean} useSharps - (Optional) set to true to use sharps instead of flats
   * @return {string} the note name
   * @example
   * import { midiToNoteName } from '@tonaljs/midi'
   * midiToNoteName(61) // => "Db4"
   * midiToNoteName(61, { pitchClass: true }) // => "Db"
   * midiToNoteName(61, { sharps: true }) // => "C#4"
   * midiToNoteName(61, { pitchClass: true, sharps: true }) // => "C#"
   * // it rounds to nearest note
   * midiToNoteName(61.7) // => "D4"
   */
  function midiToNoteName(midi, options) {
      if (options === void 0) { options = {}; }
      if (isNaN(midi) || midi === -Infinity || midi === Infinity)
          return "";
      midi = Math.round(midi);
      var pcs = options.sharps === true ? SHARPS : FLATS;
      var pc = pcs[midi % 12];
      if (options.pitchClass) {
          return pc;
      }
      var o = Math.floor(midi / 12) - 1;
      return pc + o;
  }
  var index = { isMidi: isMidi, toMidi: toMidi, midiToFreq: midiToFreq, midiToNoteName: midiToNoteName, freqToMidi: freqToMidi };

  exports.default = index;
  exports.freqToMidi = freqToMidi;
  exports.isMidi = isMidi;
  exports.midiToFreq = midiToFreq;
  exports.midiToNoteName = midiToNoteName;
  exports.toMidi = toMidi;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7}],12:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/collection'), require('@tonaljs/core'), require('@tonaljs/interval'), require('@tonaljs/pcset')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/collection', '@tonaljs/core', '@tonaljs/interval', '@tonaljs/pcset'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Mode = {}, global.collection, global.core, global.interval, global.pcset));
}(this, (function (exports, collection, core, interval, pcset) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var MODES = [
        [0, 2773, 0, "ionian", "", "Maj7", "major"],
        [1, 2902, 2, "dorian", "m", "m7"],
        [2, 3418, 4, "phrygian", "m", "m7"],
        [3, 2741, -1, "lydian", "", "Maj7"],
        [4, 2774, 1, "mixolydian", "", "7"],
        [5, 2906, 3, "aeolian", "m", "m7", "minor"],
        [6, 3434, 5, "locrian", "dim", "m7b5"],
    ];
    var NoMode = __assign(__assign({}, pcset.EmptyPcset), { name: "", alt: 0, modeNum: NaN, triad: "", seventh: "", aliases: [] });
    var modes = MODES.map(toMode);
    var index = {};
    modes.forEach(function (mode) {
        index[mode.name] = mode;
        mode.aliases.forEach(function (alias) {
            index[alias] = mode;
        });
    });
    /**
     * Get a Mode by it's name
     *
     * @example
     * get('dorian')
     * // =>
     * // {
     * //   intervals: [ '1P', '2M', '3m', '4P', '5P', '6M', '7m' ],
     * //   modeNum: 1,
     * //   chroma: '101101010110',
     * //   normalized: '101101010110',
     * //   name: 'dorian',
     * //   setNum: 2902,
     * //   alt: 2,
     * //   triad: 'm',
     * //   seventh: 'm7',
     * //   aliases: []
     * // }
     */
    function get(name) {
        return typeof name === "string"
            ? index[name.toLowerCase()] || NoMode
            : name && name.name
                ? get(name.name)
                : NoMode;
    }
    var mode = core.deprecate("Mode.mode", "Mode.get", get);
    /**
     * Get a list of all modes
     */
    function all() {
        return modes.slice();
    }
    var entries = core.deprecate("Mode.mode", "Mode.all", all);
    /**
     * Get a list of all mode names
     */
    function names() {
        return modes.map(function (mode) { return mode.name; });
    }
    function toMode(mode) {
        var modeNum = mode[0], setNum = mode[1], alt = mode[2], name = mode[3], triad = mode[4], seventh = mode[5], alias = mode[6];
        var aliases = alias ? [alias] : [];
        var chroma = Number(setNum).toString(2);
        var intervals = pcset.chromaToIntervals(chroma);
        return {
            empty: false,
            intervals: intervals,
            modeNum: modeNum,
            chroma: chroma,
            normalized: chroma,
            name: name,
            setNum: setNum,
            alt: alt,
            triad: triad,
            seventh: seventh,
            aliases: aliases,
        };
    }
    function notes(modeName, tonic) {
        return get(modeName).intervals.map(function (ivl) { return core.transpose(tonic, ivl); });
    }
    function chords(chords) {
        return function (modeName, tonic) {
            var mode = get(modeName);
            if (mode.empty)
                return [];
            var triads = collection.rotate(mode.modeNum, chords);
            var tonics = mode.intervals.map(function (i) { return core.transpose(tonic, i); });
            return triads.map(function (triad, i) { return tonics[i] + triad; });
        };
    }
    var triads = chords(MODES.map(function (x) { return x[4]; }));
    var seventhChords = chords(MODES.map(function (x) { return x[5]; }));
    function distance(destination, source) {
        var from = get(source);
        var to = get(destination);
        if (from.empty || to.empty)
            return "";
        return interval.simplify(interval.transposeFifths("1P", to.alt - from.alt));
    }
    function relativeTonic(destination, source, tonic) {
        return core.transpose(tonic, distance(destination, source));
    }
    var index$1 = {
        get: get,
        names: names,
        all: all,
        distance: distance,
        relativeTonic: relativeTonic,
        notes: notes,
        triads: triads,
        seventhChords: seventhChords,
        // deprecated
        entries: entries,
        mode: mode,
    };

    exports.all = all;
    exports.default = index$1;
    exports.distance = distance;
    exports.entries = entries;
    exports.get = get;
    exports.mode = mode;
    exports.names = names;
    exports.notes = notes;
    exports.relativeTonic = relativeTonic;
    exports.seventhChords = seventhChords;
    exports.triads = triads;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/collection":6,"@tonaljs/core":7,"@tonaljs/interval":9,"@tonaljs/pcset":14}],13:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core'), require('@tonaljs/midi')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core', '@tonaljs/midi'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Note = {}, global.core, global.midi$1));
}(this, (function (exports, core, midi$1) { 'use strict';

  var NAMES = ["C", "D", "E", "F", "G", "A", "B"];
  var toName = function (n) { return n.name; };
  var onlyNotes = function (array) {
      return array.map(core.note).filter(function (n) { return !n.empty; });
  };
  /**
   * Return the natural note names without octave
   * @function
   * @example
   * Note.names(); // => ["C", "D", "E", "F", "G", "A", "B"]
   */
  function names(array) {
      if (array === undefined) {
          return NAMES.slice();
      }
      else if (!Array.isArray(array)) {
          return [];
      }
      else {
          return onlyNotes(array).map(toName);
      }
  }
  /**
   * Get a note from a note name
   *
   * @function
   * @example
   * Note.get('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
   */
  var get = core.note;
  /**
   * Get the note name
   * @function
   */
  var name = function (note) { return get(note).name; };
  /**
   * Get the note pitch class name
   * @function
   */
  var pitchClass = function (note) { return get(note).pc; };
  /**
   * Get the note accidentals
   * @function
   */
  var accidentals = function (note) { return get(note).acc; };
  /**
   * Get the note octave
   * @function
   */
  var octave = function (note) { return get(note).oct; };
  /**
   * Get the note midi
   * @function
   */
  var midi = function (note) { return get(note).midi; };
  /**
   * Get the note midi
   * @function
   */
  var freq = function (note) { return get(note).freq; };
  /**
   * Get the note chroma
   * @function
   */
  var chroma = function (note) { return get(note).chroma; };
  /**
   * Given a midi number, returns a note name. Uses flats for altered notes.
   *
   * @function
   * @param {number} midi - the midi note number
   * @return {string} the note name
   * @example
   * Note.fromMidi(61) // => "Db4"
   * Note.fromMidi(61.7) // => "D4"
   */
  function fromMidi(midi) {
      return midi$1.midiToNoteName(midi);
  }
  /**
   * Given a midi number, returns a note name. Uses flats for altered notes.
   */
  function fromFreq(freq) {
      return midi$1.midiToNoteName(midi$1.freqToMidi(freq));
  }
  /**
   * Given a midi number, returns a note name. Uses flats for altered notes.
   */
  function fromFreqSharps(freq) {
      return midi$1.midiToNoteName(midi$1.freqToMidi(freq), { sharps: true });
  }
  /**
   * Given a midi number, returns a note name. Uses flats for altered notes.
   *
   * @function
   * @param {number} midi - the midi note number
   * @return {string} the note name
   * @example
   * Note.fromMidiSharps(61) // => "C#4"
   */
  function fromMidiSharps(midi) {
      return midi$1.midiToNoteName(midi, { sharps: true });
  }
  /**
   * Transpose a note by an interval
   */
  var transpose = core.transpose;
  var tr = core.transpose;
  /**
   * Transpose by an interval.
   * @function
   * @param {string} interval
   * @return {function} a function that transposes by the given interval
   * @example
   * ["C", "D", "E"].map(Note.transposeBy("5P"));
   * // => ["G", "A", "B"]
   */
  var transposeBy = function (interval) { return function (note) {
      return transpose(note, interval);
  }; };
  var trBy = transposeBy;
  /**
   * Transpose from a note
   * @function
   * @param {string} note
   * @return {function}  a function that transposes the the note by an interval
   * ["1P", "3M", "5P"].map(Note.transposeFrom("C"));
   * // => ["C", "E", "G"]
   */
  var transposeFrom = function (note) { return function (interval) {
      return transpose(note, interval);
  }; };
  var trFrom = transposeFrom;
  /**
   * Transpose a note by a number of perfect fifths.
   *
   * @function
   * @param {string} note - the note name
   * @param {number} fifhts - the number of fifths
   * @return {string} the transposed note name
   *
   * @example
   * import { transposeFifths } from "@tonaljs/note"
   * transposeFifths("G4", 1) // => "D"
   * [0, 1, 2, 3, 4].map(fifths => transposeFifths("C", fifths)) // => ["C", "G", "D", "A", "E"]
   */
  function transposeFifths(noteName, fifths) {
      var note = get(noteName);
      if (note.empty) {
          return "";
      }
      var _a = note.coord, nFifths = _a[0], nOcts = _a[1];
      var transposed = nOcts === undefined
          ? core.coordToNote([nFifths + fifths])
          : core.coordToNote([nFifths + fifths, nOcts]);
      return transposed.name;
  }
  var trFifths = transposeFifths;
  var ascending = function (a, b) { return a.height - b.height; };
  var descending = function (a, b) { return b.height - a.height; };
  function sortedNames(notes, comparator) {
      comparator = comparator || ascending;
      return onlyNotes(notes).sort(comparator).map(toName);
  }
  function sortedUniqNames(notes) {
      return sortedNames(notes, ascending).filter(function (n, i, a) { return i === 0 || n !== a[i - 1]; });
  }
  /**
   * Simplify a note
   *
   * @function
   * @param {string} note - the note to be simplified
   * - sameAccType: default true. Use same kind of accidentals that source
   * @return {string} the simplified note or '' if not valid note
   * @example
   * simplify("C##") // => "D"
   * simplify("C###") // => "D#"
   * simplify("C###")
   * simplify("B#4") // => "C5"
   */
  var simplify = function (noteName) {
      var note = get(noteName);
      if (note.empty) {
          return "";
      }
      return midi$1.midiToNoteName(note.midi || note.chroma, {
          sharps: note.alt > 0,
          pitchClass: note.midi === null,
      });
  };
  /**
   * Get enharmonic of a note
   *
   * @function
   * @param {string} note
   * @param [string] - [optional] Destination pitch class
   * @return {string} the enharmonic note name or '' if not valid note
   * @example
   * Note.enharmonic("Db") // => "C#"
   * Note.enharmonic("C") // => "C"
   * Note.enharmonic("F2","E#") // => "E#2"
   */
  function enharmonic(noteName, destName) {
      var src = get(noteName);
      if (src.empty) {
          return "";
      }
      // destination: use given or generate one
      var dest = get(destName ||
          midi$1.midiToNoteName(src.midi || src.chroma, {
              sharps: src.alt < 0,
              pitchClass: true,
          }));
      // ensure destination is valid
      if (dest.empty || dest.chroma !== src.chroma) {
          return "";
      }
      // if src has no octave, no need to calculate anything else
      if (src.oct === undefined) {
          return dest.pc;
      }
      // detect any octave overflow
      var srcChroma = src.chroma - src.alt;
      var destChroma = dest.chroma - dest.alt;
      var destOctOffset = srcChroma > 11 || destChroma < 0
          ? -1
          : srcChroma < 0 || destChroma > 11
              ? +1
              : 0;
      // calculate the new octave
      var destOct = src.oct + destOctOffset;
      return dest.pc + destOct;
  }
  var index = {
      names: names,
      get: get,
      name: name,
      pitchClass: pitchClass,
      accidentals: accidentals,
      octave: octave,
      midi: midi,
      ascending: ascending,
      descending: descending,
      sortedNames: sortedNames,
      sortedUniqNames: sortedUniqNames,
      fromMidi: fromMidi,
      fromMidiSharps: fromMidiSharps,
      freq: freq,
      fromFreq: fromFreq,
      fromFreqSharps: fromFreqSharps,
      chroma: chroma,
      transpose: transpose,
      tr: tr,
      transposeBy: transposeBy,
      trBy: trBy,
      transposeFrom: transposeFrom,
      trFrom: trFrom,
      transposeFifths: transposeFifths,
      trFifths: trFifths,
      simplify: simplify,
      enharmonic: enharmonic,
  };

  exports.accidentals = accidentals;
  exports.ascending = ascending;
  exports.chroma = chroma;
  exports.default = index;
  exports.descending = descending;
  exports.enharmonic = enharmonic;
  exports.freq = freq;
  exports.fromFreq = fromFreq;
  exports.fromFreqSharps = fromFreqSharps;
  exports.fromMidi = fromMidi;
  exports.fromMidiSharps = fromMidiSharps;
  exports.get = get;
  exports.midi = midi;
  exports.name = name;
  exports.names = names;
  exports.octave = octave;
  exports.pitchClass = pitchClass;
  exports.simplify = simplify;
  exports.sortedNames = sortedNames;
  exports.sortedUniqNames = sortedUniqNames;
  exports.tr = tr;
  exports.trBy = trBy;
  exports.trFifths = trFifths;
  exports.trFrom = trFrom;
  exports.transpose = transpose;
  exports.transposeBy = transposeBy;
  exports.transposeFifths = transposeFifths;
  exports.transposeFrom = transposeFrom;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7,"@tonaljs/midi":11}],14:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/collection'), require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/collection', '@tonaljs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Pcset = {}, global.collection, global.core));
}(this, (function (exports, collection, core) { 'use strict';

  var _a;
  var EmptyPcset = {
      empty: true,
      name: "",
      setNum: 0,
      chroma: "000000000000",
      normalized: "000000000000",
      intervals: [],
  };
  // UTILITIES
  var setNumToChroma = function (num) { return Number(num).toString(2); };
  var chromaToNumber = function (chroma) { return parseInt(chroma, 2); };
  var REGEX = /^[01]{12}$/;
  function isChroma(set) {
      return REGEX.test(set);
  }
  var isPcsetNum = function (set) {
      return typeof set === "number" && set >= 0 && set <= 4095;
  };
  var isPcset = function (set) { return set && isChroma(set.chroma); };
  var cache = (_a = {}, _a[EmptyPcset.chroma] = EmptyPcset, _a);
  /**
   * Get the pitch class set of a collection of notes or set number or chroma
   */
  function get(src) {
      var chroma = isChroma(src)
          ? src
          : isPcsetNum(src)
              ? setNumToChroma(src)
              : Array.isArray(src)
                  ? listToChroma(src)
                  : isPcset(src)
                      ? src.chroma
                      : EmptyPcset.chroma;
      return (cache[chroma] = cache[chroma] || chromaToPcset(chroma));
  }
  /**
   * Use Pcset.properties
   * @function
   * @deprecated
   */
  var pcset = core.deprecate("Pcset.pcset", "Pcset.get", get);
  /**
   * Get pitch class set chroma
   * @function
   * @example
   * Pcset.chroma(["c", "d", "e"]); //=> "101010000000"
   */
  var chroma = function (set) { return get(set).chroma; };
  /**
   * Get intervals (from C) of a set
   * @function
   * @example
   * Pcset.intervals(["c", "d", "e"]); //=>
   */
  var intervals = function (set) { return get(set).intervals; };
  /**
   * Get pitch class set number
   * @function
   * @example
   * Pcset.num(["c", "d", "e"]); //=> 2192
   */
  var num = function (set) { return get(set).setNum; };
  var IVLS = [
      "1P",
      "2m",
      "2M",
      "3m",
      "3M",
      "4P",
      "5d",
      "5P",
      "6m",
      "6M",
      "7m",
      "7M",
  ];
  /**
   * @private
   * Get the intervals of a pcset *starting from C*
   * @param {Set} set - the pitch class set
   * @return {IntervalName[]} an array of interval names or an empty array
   * if not a valid pitch class set
   */
  function chromaToIntervals(chroma) {
      var intervals = [];
      for (var i = 0; i < 12; i++) {
          // tslint:disable-next-line:curly
          if (chroma.charAt(i) === "1")
              intervals.push(IVLS[i]);
      }
      return intervals;
  }
  /**
   * Get a list of all possible pitch class sets (all possible chromas) *having
   * C as root*. There are 2048 different chromas. If you want them with another
   * note you have to transpose it
   *
   * @see http://allthescales.org/
   * @return {Array<PcsetChroma>} an array of possible chromas from '10000000000' to '11111111111'
   */
  function chromas() {
      return collection.range(2048, 4095).map(setNumToChroma);
  }
  /**
   * Given a a list of notes or a pcset chroma, produce the rotations
   * of the chroma discarding the ones that starts with "0"
   *
   * This is used, for example, to get all the modes of a scale.
   *
   * @param {Array|string} set - the list of notes or pitchChr of the set
   * @param {boolean} normalize - (Optional, true by default) remove all
   * the rotations that starts with "0"
   * @return {Array<string>} an array with all the modes of the chroma
   *
   * @example
   * Pcset.modes(["C", "D", "E"]).map(Pcset.intervals)
   */
  function modes(set, normalize) {
      if (normalize === void 0) { normalize = true; }
      var pcs = get(set);
      var binary = pcs.chroma.split("");
      return collection.compact(binary.map(function (_, i) {
          var r = collection.rotate(i, binary);
          return normalize && r[0] === "0" ? null : r.join("");
      }));
  }
  /**
   * Test if two pitch class sets are numentical
   *
   * @param {Array|string} set1 - one of the pitch class sets
   * @param {Array|string} set2 - the other pitch class set
   * @return {boolean} true if they are equal
   * @example
   * Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
   */
  function isEqual(s1, s2) {
      return get(s1).setNum === get(s2).setNum;
  }
  /**
   * Create a function that test if a collection of notes is a
   * subset of a given set
   *
   * The function is curryfied.
   *
   * @param {PcsetChroma|NoteName[]} set - the superset to test against (chroma or
   * list of notes)
   * @return{function(PcsetChroma|NoteNames[]): boolean} a function accepting a set
   * to test against (chroma or list of notes)
   * @example
   * const inCMajor = Pcset.isSubsetOf(["C", "E", "G"])
   * inCMajor(["e6", "c4"]) // => true
   * inCMajor(["e6", "c4", "d3"]) // => false
   */
  function isSubsetOf(set) {
      var s = get(set).setNum;
      return function (notes) {
          var o = get(notes).setNum;
          // tslint:disable-next-line: no-bitwise
          return s && s !== o && (o & s) === o;
      };
  }
  /**
   * Create a function that test if a collection of notes is a
   * superset of a given set (it contains all notes and at least one more)
   *
   * @param {Set} set - an array of notes or a chroma set string to test against
   * @return {(subset: Set): boolean} a function that given a set
   * returns true if is a subset of the first one
   * @example
   * const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
   * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
   * extendsCMajor(["c6", "e4", "g3"]) // => false
   */
  function isSupersetOf(set) {
      var s = get(set).setNum;
      return function (notes) {
          var o = get(notes).setNum;
          // tslint:disable-next-line: no-bitwise
          return s && s !== o && (o | s) === o;
      };
  }
  /**
   * Test if a given pitch class set includes a note
   *
   * @param {Array<string>} set - the base set to test against
   * @param {string} note - the note to test
   * @return {boolean} true if the note is included in the pcset
   *
   * Can be partially applied
   *
   * @example
   * const isNoteInCMajor = isNoteIncludedIn(['C', 'E', 'G'])
   * isNoteInCMajor('C4') // => true
   * isNoteInCMajor('C#4') // => false
   */
  function isNoteIncludedIn(set) {
      var s = get(set);
      return function (noteName) {
          var n = core.note(noteName);
          return s && !n.empty && s.chroma.charAt(n.chroma) === "1";
      };
  }
  /** @deprecated use: isNoteIncludedIn */
  var includes = isNoteIncludedIn;
  /**
   * Filter a list with a pitch class set
   *
   * @param {Array|string} set - the pitch class set notes
   * @param {Array|string} notes - the note list to be filtered
   * @return {Array} the filtered notes
   *
   * @example
   * Pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
   * Pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
   */
  function filter(set) {
      var isIncluded = isNoteIncludedIn(set);
      return function (notes) {
          return notes.filter(isIncluded);
      };
  }
  var index = {
      get: get,
      chroma: chroma,
      num: num,
      intervals: intervals,
      chromas: chromas,
      isSupersetOf: isSupersetOf,
      isSubsetOf: isSubsetOf,
      isNoteIncludedIn: isNoteIncludedIn,
      isEqual: isEqual,
      filter: filter,
      modes: modes,
      // deprecated
      pcset: pcset,
  };
  //// PRIVATE ////
  function chromaRotations(chroma) {
      var binary = chroma.split("");
      return binary.map(function (_, i) { return collection.rotate(i, binary).join(""); });
  }
  function chromaToPcset(chroma) {
      var setNum = chromaToNumber(chroma);
      var normalizedNum = chromaRotations(chroma)
          .map(chromaToNumber)
          .filter(function (n) { return n >= 2048; })
          .sort()[0];
      var normalized = setNumToChroma(normalizedNum);
      var intervals = chromaToIntervals(chroma);
      return {
          empty: false,
          name: "",
          setNum: setNum,
          chroma: chroma,
          normalized: normalized,
          intervals: intervals,
      };
  }
  function listToChroma(set) {
      if (set.length === 0) {
          return EmptyPcset.chroma;
      }
      var pitch;
      var binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      // tslint:disable-next-line:prefer-for-of
      for (var i = 0; i < set.length; i++) {
          pitch = core.note(set[i]);
          // tslint:disable-next-line: curly
          if (pitch.empty)
              pitch = core.interval(set[i]);
          // tslint:disable-next-line: curly
          if (!pitch.empty)
              binary[pitch.chroma] = 1;
      }
      return binary.join("");
  }

  exports.EmptyPcset = EmptyPcset;
  exports.chromaToIntervals = chromaToIntervals;
  exports.chromas = chromas;
  exports.default = index;
  exports.filter = filter;
  exports.get = get;
  exports.includes = includes;
  exports.isEqual = isEqual;
  exports.isNoteIncludedIn = isNoteIncludedIn;
  exports.isSubsetOf = isSubsetOf;
  exports.isSupersetOf = isSupersetOf;
  exports.modes = modes;
  exports.pcset = pcset;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/collection":6,"@tonaljs/core":7}],15:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/chord'), require('@tonaljs/core'), require('@tonaljs/roman-numeral')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/chord', '@tonaljs/core', '@tonaljs/roman-numeral'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Progression = {}, global.chord, global.core, global.romanNumeral));
}(this, (function (exports, chord, core, romanNumeral) { 'use strict';

  /**
   * Given a tonic and a chord list expressed with roman numeral notation
   * returns the progression expressed with leadsheet chords symbols notation
   * @example
   * fromRomanNumerals("C", ["I", "IIm7", "V7"]);
   * // => ["C", "Dm7", "G7"]
   */
  function fromRomanNumerals(tonic, chords) {
      var romanNumerals = chords.map(romanNumeral.get);
      return romanNumerals.map(function (rn) { return core.transpose(tonic, core.interval(rn)) + rn.chordType; });
  }
  /**
   * Given a tonic and a chord list with leadsheet symbols notation,
   * return the chord list with roman numeral notation
   * @example
   * toRomanNumerals("C", ["CMaj7", "Dm7", "G7"]);
   * // => ["IMaj7", "IIm7", "V7"]
   */
  function toRomanNumerals(tonic, chords) {
      return chords.map(function (chord$1) {
          var _a = chord.tokenize(chord$1), note = _a[0], chordType = _a[1];
          var intervalName = core.distance(tonic, note);
          var roman = romanNumeral.get(core.interval(intervalName));
          return roman.name + chordType;
      });
  }
  var index = { fromRomanNumerals: fromRomanNumerals, toRomanNumerals: toRomanNumerals };

  exports.default = index;
  exports.fromRomanNumerals = fromRomanNumerals;
  exports.toRomanNumerals = toRomanNumerals;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/chord":5,"@tonaljs/core":7,"@tonaljs/roman-numeral":17}],16:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/collection'), require('@tonaljs/midi')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/collection', '@tonaljs/midi'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Range = {}, global.collection, global.midi));
}(this, (function (exports, collection, midi) { 'use strict';

  /**
   * Create a numeric range. You supply a list of notes or numbers and it will
   * be connected to create complex ranges.
   *
   * @param {Array} notes - the list of notes or midi numbers used
   * @return {Array} an array of numbers or empty array if not valid parameters
   *
   * @example
   * numeric(["C5", "C4"]) // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
   * // it works midi notes
   * numeric([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
   * // complex range
   * numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
   */
  function numeric(notes) {
      var midi$1 = collection.compact(notes.map(midi.toMidi));
      if (!notes.length || midi$1.length !== notes.length) {
          // there is no valid notes
          return [];
      }
      return midi$1.reduce(function (result, note) {
          var last = result[result.length - 1];
          return result.concat(collection.range(last, note).slice(1));
      }, [midi$1[0]]);
  }
  /**
   * Create a range of chromatic notes. The altered notes will use flats.
   *
   * @function
   * @param {Array} notes - the list of notes or midi note numbers to create a range from
   * @param {Object} options - The same as `midiToNoteName` (`{ sharps: boolean, pitchClass: boolean }`)
   * @return {Array} an array of note names
   *
   * @example
   * Range.chromatic(["C2, "E2", "D2"]) // => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
   * // with sharps
   * Range.chromatic(["C2", "C3"], { sharps: true }) // => [ "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3" ]
   */
  function chromatic(notes, options) {
      return numeric(notes).map(function (midi$1) { return midi.midiToNoteName(midi$1, options); });
  }
  var index = { numeric: numeric, chromatic: chromatic };

  exports.chromatic = chromatic;
  exports.default = index;
  exports.numeric = numeric;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/collection":6,"@tonaljs/midi":11}],17:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RomanNumeral = {}, global.core));
}(this, (function (exports, core) { 'use strict';

  var NoRomanNumeral = { empty: true, name: "", chordType: "" };
  var cache = {};
  /**
   * Get properties of a roman numeral string
   *
   * @function
   * @param {string} - the roman numeral string (can have type, like: Imaj7)
   * @return {Object} - the roman numeral properties
   * @param {string} name - the roman numeral (tonic)
   * @param {string} type - the chord type
   * @param {string} num - the number (1 = I, 2 = II...)
   * @param {boolean} major - major or not
   *
   * @example
   * romanNumeral("VIIb5") // => { name: "VII", type: "b5", num: 7, major: true }
   */
  function get(src) {
      return typeof src === "string"
          ? cache[src] || (cache[src] = parse(src))
          : typeof src === "number"
              ? get(NAMES[src] || "")
              : core.isPitch(src)
                  ? fromPitch(src)
                  : core.isNamed(src)
                      ? get(src.name)
                      : NoRomanNumeral;
  }
  var romanNumeral = core.deprecate("RomanNumeral.romanNumeral", "RomanNumeral.get", get);
  /**
   * Get roman numeral names
   *
   * @function
   * @param {boolean} [isMajor=true]
   * @return {Array<String>}
   *
   * @example
   * names() // => ["I", "II", "III", "IV", "V", "VI", "VII"]
   */
  function names(major) {
      if (major === void 0) { major = true; }
      return (major ? NAMES : NAMES_MINOR).slice();
  }
  function fromPitch(pitch) {
      return get(core.altToAcc(pitch.alt) + NAMES[pitch.step]);
  }
  var REGEX = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
  function tokenize(str) {
      return (REGEX.exec(str) || ["", "", "", ""]);
  }
  var ROMANS = "I II III IV V VI VII";
  var NAMES = ROMANS.split(" ");
  var NAMES_MINOR = ROMANS.toLowerCase().split(" ");
  function parse(src) {
      var _a = tokenize(src), name = _a[0], acc = _a[1], roman = _a[2], chordType = _a[3];
      if (!roman) {
          return NoRomanNumeral;
      }
      var upperRoman = roman.toUpperCase();
      var step = NAMES.indexOf(upperRoman);
      var alt = core.accToAlt(acc);
      var dir = 1;
      return {
          empty: false,
          name: name,
          roman: roman,
          interval: core.interval({ step: step, alt: alt, dir: dir }).name,
          acc: acc,
          chordType: chordType,
          alt: alt,
          step: step,
          major: roman === upperRoman,
          oct: 0,
          dir: dir,
      };
  }
  var index = {
      names: names,
      get: get,
      // deprecated
      romanNumeral: romanNumeral,
  };

  exports.default = index;
  exports.get = get;
  exports.names = names;
  exports.tokenize = tokenize;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7}],18:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/core'), require('@tonaljs/pcset')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/core', '@tonaljs/pcset'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ScaleType = {}, global.core, global.pcset));
}(this, (function (exports, core, pcset) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    // SCALES
    // Format: ["intervals", "name", "alias1", "alias2", ...]
    var SCALES = [
        // 5-note scales
        ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
        ["1P 3M 4P 5P 7M", "ionian pentatonic"],
        ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
        ["1P 2M 4P 5P 6M", "ritusen"],
        ["1P 2M 4P 5P 7m", "egyptian"],
        ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"],
        ["1P 3m 4P 5P 6m", "vietnamese 1"],
        ["1P 2m 3m 5P 6m", "pelog"],
        ["1P 2m 4P 5P 6m", "kumoijoshi"],
        ["1P 2M 3m 5P 6m", "hirajoshi"],
        ["1P 2m 4P 5d 7m", "iwato"],
        ["1P 2m 4P 5P 7m", "in-sen"],
        ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
        ["1P 3m 4P 6m 7m", "malkos raga"],
        ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
        ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
        ["1P 3m 4P 5P 6M", "minor six pentatonic"],
        ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
        ["1P 2M 3M 5P 6m", "flat six pentatonic"],
        ["1P 2m 3M 5P 6M", "scriabin"],
        ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
        ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"],
        ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
        ["1P 3m 4P 5P 7M", "minor #7M pentatonic"],
        ["1P 3m 4d 5d 7m", "super locrian pentatonic"],
        // 6-note scales
        ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
        ["1P 2A 3M 5P 5A 7M", "augmented"],
        ["1P 2M 3m 3M 5P 6M", "major blues"],
        ["1P 2M 4P 5P 6M 7m", "piongio"],
        ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"],
        ["1P 2M 3M 4A 6M 7m", "prometheus"],
        ["1P 2m 3M 5d 6m 7m", "mystery #1"],
        ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
        ["1P 2M 3M 4A 5A 7m", "whole tone", "messiaen's mode #1"],
        ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],
        ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
        // 7-note scales
        ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
        ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
        ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
        [
            "1P 2m 2A 3M 4A 6m 7m",
            "altered",
            "super locrian",
            "diminished whole tone",
            "pomeroy",
        ],
        ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
        [
            "1P 2M 3M 4P 5P 6m 7m",
            "mixolydian b6",
            "melodic minor fifth mode",
            "hindu",
        ],
        ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
        ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
        ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
        [
            "1P 2m 3m 4P 5P 6M 7m",
            "dorian b2",
            "phrygian #6",
            "melodic minor second mode",
        ],
        ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
        ["1P 2m 3m 4P 5d 6m 7m", "locrian"],
        [
            "1P 2m 3m 4d 5d 6m 7d",
            "ultralocrian",
            "superlocrian bb7",
            "·superlocrian diminished",
        ],
        ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
        ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
        ["1P 2M 3m 5d 5P 6M 7m", "romanian minor"],
        ["1P 2M 3m 4A 5P 6M 7m", "dorian #4"],
        ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"],
        ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
        ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"],
        ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
        ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"],
        ["1P 2m 3m 4P 5P 6m 7M", "balinese"],
        ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"],
        ["1P 2M 3m 4P 5P 6m 7m", "aeolian", "minor"],
        ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
        ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"],
        ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
        ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
        ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
        ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
        ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
        ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
        ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
        ["1P 2m 3M 4P 5d 6m 7M", "persian"],
        ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
        ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
        [
            "1P 2M 3M 4P 5A 6M 7M",
            "major augmented",
            "major #5",
            "ionian augmented",
            "ionian #5",
        ],
        ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],
        // 8-note scales
        ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
        ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
        ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
        ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
        ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
        ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
        ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
        ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
        ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],
        ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
        ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
        [
            "1P 2m 3m 3M 4A 5P 6M 7m",
            "half-whole diminished",
            "dominant diminished",
            "messiaen's mode #2",
        ],
        ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
        ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],
        // 9-note scales
        ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
        ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],
        // 10-note scales
        ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],
        // 12-note scales
        ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"],
    ];

    var NoScaleType = __assign(__assign({}, pcset.EmptyPcset), { intervals: [], aliases: [] });
    var dictionary = [];
    var index = {};
    function names() {
        return dictionary.map(function (scale) { return scale.name; });
    }
    /**
     * Given a scale name or chroma, return the scale properties
     *
     * @param {string} type - scale name or pitch class set chroma
     * @example
     * import { get } from 'tonaljs/scale-type'
     * get('major') // => { name: 'major', ... }
     */
    function get(type) {
        return index[type] || NoScaleType;
    }
    var scaleType = core.deprecate("ScaleDictionary.scaleType", "ScaleType.get", get);
    /**
     * Return a list of all scale types
     */
    function all() {
        return dictionary.slice();
    }
    var entries = core.deprecate("ScaleDictionary.entries", "ScaleType.all", all);
    /**
     * Keys used to reference scale types
     */
    function keys() {
        return Object.keys(index);
    }
    /**
     * Clear the dictionary
     */
    function removeAll() {
        dictionary = [];
        index = {};
    }
    /**
     * Add a scale into dictionary
     * @param intervals
     * @param name
     * @param aliases
     */
    function add(intervals, name, aliases) {
        if (aliases === void 0) { aliases = []; }
        var scale = __assign(__assign({}, pcset.get(intervals)), { name: name, intervals: intervals, aliases: aliases });
        dictionary.push(scale);
        index[scale.name] = scale;
        index[scale.setNum] = scale;
        index[scale.chroma] = scale;
        scale.aliases.forEach(function (alias) { return addAlias(scale, alias); });
        return scale;
    }
    function addAlias(scale, alias) {
        index[alias] = scale;
    }
    SCALES.forEach(function (_a) {
        var ivls = _a[0], name = _a[1], aliases = _a.slice(2);
        return add(ivls.split(" "), name, aliases);
    });
    var index$1 = {
        names: names,
        get: get,
        all: all,
        add: add,
        removeAll: removeAll,
        keys: keys,
        // deprecated
        entries: entries,
        scaleType: scaleType,
    };

    exports.NoScaleType = NoScaleType;
    exports.add = add;
    exports.addAlias = addAlias;
    exports.all = all;
    exports.default = index$1;
    exports.entries = entries;
    exports.get = get;
    exports.keys = keys;
    exports.names = names;
    exports.removeAll = removeAll;
    exports.scaleType = scaleType;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/core":7,"@tonaljs/pcset":14}],19:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/chord-type'), require('@tonaljs/collection'), require('@tonaljs/core'), require('@tonaljs/note'), require('@tonaljs/pcset'), require('@tonaljs/scale-type')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/chord-type', '@tonaljs/collection', '@tonaljs/core', '@tonaljs/note', '@tonaljs/pcset', '@tonaljs/scale-type'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Scale = {}, global.chordType, global.collection, global.core, global.note, global.pcset, global.scaleType));
}(this, (function (exports, chordType, collection, core, note, pcset, scaleType) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var NoScale = {
        empty: true,
        name: "",
        type: "",
        tonic: null,
        setNum: NaN,
        chroma: "",
        normalized: "",
        aliases: [],
        notes: [],
        intervals: [],
    };
    /**
     * Given a string with a scale name and (optionally) a tonic, split
     * that components.
     *
     * It retuns an array with the form [ name, tonic ] where tonic can be a
     * note name or null and name can be any arbitrary string
     * (this function doesn"t check if that scale name exists)
     *
     * @function
     * @param {string} name - the scale name
     * @return {Array} an array [tonic, name]
     * @example
     * tokenize("C mixolydean") // => ["C", "mixolydean"]
     * tokenize("anything is valid") // => ["", "anything is valid"]
     * tokenize() // => ["", ""]
     */
    function tokenize(name) {
        if (typeof name !== "string") {
            return ["", ""];
        }
        var i = name.indexOf(" ");
        var tonic = core.note(name.substring(0, i));
        if (tonic.empty) {
            var n = core.note(name);
            return n.empty ? ["", name] : [n.name, ""];
        }
        var type = name.substring(tonic.name.length + 1);
        return [tonic.name, type.length ? type : ""];
    }
    /**
     * Get all scale names
     * @function
     */
    var names = scaleType.names;
    /**
     * Get a Scale from a scale name.
     */
    function get(src) {
        var tokens = Array.isArray(src) ? src : tokenize(src);
        var tonic = core.note(tokens[0]).name;
        var st = scaleType.get(tokens[1]);
        if (st.empty) {
            return NoScale;
        }
        var type = st.name;
        var notes = tonic
            ? st.intervals.map(function (i) { return core.transpose(tonic, i); })
            : [];
        var name = tonic ? tonic + " " + type : type;
        return __assign(__assign({}, st), { name: name, type: type, tonic: tonic, notes: notes });
    }
    var scale = core.deprecate("Scale.scale", "Scale.get", get);
    /**
     * Get all chords that fits a given scale
     *
     * @function
     * @param {string} name - the scale name
     * @return {Array<string>} - the chord names
     *
     * @example
     * scaleChords("pentatonic") // => ["5", "64", "M", "M6", "Madd9", "Msus2"]
     */
    function scaleChords(name) {
        var s = get(name);
        var inScale = pcset.isSubsetOf(s.chroma);
        return chordType.all()
            .filter(function (chord) { return inScale(chord.chroma); })
            .map(function (chord) { return chord.aliases[0]; });
    }
    /**
     * Get all scales names that are a superset of the given one
     * (has the same notes and at least one more)
     *
     * @function
     * @param {string} name
     * @return {Array} a list of scale names
     * @example
     * extended("major") // => ["bebop", "bebop dominant", "bebop major", "chromatic", "ichikosucho"]
     */
    function extended(name) {
        var s = get(name);
        var isSuperset = pcset.isSupersetOf(s.chroma);
        return scaleType.all()
            .filter(function (scale) { return isSuperset(scale.chroma); })
            .map(function (scale) { return scale.name; });
    }
    /**
     * Find all scales names that are a subset of the given one
     * (has less notes but all from the given scale)
     *
     * @function
     * @param {string} name
     * @return {Array} a list of scale names
     *
     * @example
     * reduced("major") // => ["ionian pentatonic", "major pentatonic", "ritusen"]
     */
    function reduced(name) {
        var isSubset = pcset.isSubsetOf(get(name).chroma);
        return scaleType.all()
            .filter(function (scale) { return isSubset(scale.chroma); })
            .map(function (scale) { return scale.name; });
    }
    /**
     * Given an array of notes, return the scale: a pitch class set starting from
     * the first note of the array
     *
     * @function
     * @param {string[]} notes
     * @return {string[]} pitch classes with same tonic
     * @example
     * scaleNotes(['C4', 'c3', 'C5', 'C4', 'c4']) // => ["C"]
     * scaleNotes(['D4', 'c#5', 'A5', 'F#6']) // => ["D", "F#", "A", "C#"]
     */
    function scaleNotes(notes) {
        var pcset = notes.map(function (n) { return core.note(n).pc; }).filter(function (x) { return x; });
        var tonic = pcset[0];
        var scale = note.sortedUniqNames(pcset);
        return collection.rotate(scale.indexOf(tonic), scale);
    }
    /**
     * Find mode names of a scale
     *
     * @function
     * @param {string} name - scale name
     * @example
     * modeNames("C pentatonic") // => [
     *   ["C", "major pentatonic"],
     *   ["D", "egyptian"],
     *   ["E", "malkos raga"],
     *   ["G", "ritusen"],
     *   ["A", "minor pentatonic"]
     * ]
     */
    function modeNames(name) {
        var s = get(name);
        if (s.empty) {
            return [];
        }
        var tonics = s.tonic ? s.notes : s.intervals;
        return pcset.modes(s.chroma)
            .map(function (chroma, i) {
            var modeName = get(chroma).name;
            return modeName ? [tonics[i], modeName] : ["", ""];
        })
            .filter(function (x) { return x[0]; });
    }
    function getNoteNameOf(scale) {
        var names = Array.isArray(scale) ? scaleNotes(scale) : get(scale).notes;
        var chromas = names.map(function (name) { return core.note(name).chroma; });
        return function (noteOrMidi) {
            var currNote = typeof noteOrMidi === "number"
                ? core.note(note.fromMidi(noteOrMidi))
                : core.note(noteOrMidi);
            var height = currNote.height;
            if (height === undefined)
                return undefined;
            var chroma = height % 12;
            var position = chromas.indexOf(chroma);
            if (position === -1)
                return undefined;
            return note.enharmonic(currNote.name, names[position]);
        };
    }
    function rangeOf(scale) {
        var getName = getNoteNameOf(scale);
        return function (fromNote, toNote) {
            var from = core.note(fromNote).height;
            var to = core.note(toNote).height;
            if (from === undefined || to === undefined)
                return [];
            return collection.range(from, to)
                .map(getName)
                .filter(function (x) { return x; });
        };
    }
    var index = {
        get: get,
        names: names,
        extended: extended,
        modeNames: modeNames,
        reduced: reduced,
        scaleChords: scaleChords,
        scaleNotes: scaleNotes,
        tokenize: tokenize,
        rangeOf: rangeOf,
        // deprecated
        scale: scale,
    };

    exports.default = index;
    exports.extended = extended;
    exports.get = get;
    exports.modeNames = modeNames;
    exports.names = names;
    exports.rangeOf = rangeOf;
    exports.reduced = reduced;
    exports.scale = scale;
    exports.scaleChords = scaleChords;
    exports.scaleNotes = scaleNotes;
    exports.tokenize = tokenize;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/chord-type":4,"@tonaljs/collection":6,"@tonaljs/core":7,"@tonaljs/note":13,"@tonaljs/pcset":14,"@tonaljs/scale-type":18}],20:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TimeSignature = {}));
}(this, (function (exports) { 'use strict';

  // CONSTANTS
  var NONE = {
      empty: true,
      name: "",
      upper: undefined,
      lower: undefined,
      type: undefined,
      additive: [],
  };
  var NAMES = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"];
  // PUBLIC API
  function names() {
      return NAMES.slice();
  }
  var REGEX = /^(\d?\d(?:\+\d)*)\/(\d)$/;
  var CACHE = new Map();
  function get(literal) {
      var cached = CACHE.get(literal);
      if (cached) {
          return cached;
      }
      var ts = build(parse(literal));
      CACHE.set(literal, ts);
      return ts;
  }
  function parse(literal) {
      if (typeof literal === "string") {
          var _a = REGEX.exec(literal) || []; _a[0]; var up_1 = _a[1], low = _a[2];
          return parse([up_1, low]);
      }
      var up = literal[0], down = literal[1];
      var denominator = +down;
      if (typeof up === "number") {
          return [up, denominator];
      }
      var list = up.split("+").map(function (n) { return +n; });
      return list.length === 1 ? [list[0], denominator] : [list, denominator];
  }
  var index = { names: names, parse: parse, get: get };
  // PRIVATE
  function build(_a) {
      var up = _a[0], down = _a[1];
      var upper = Array.isArray(up) ? up.reduce(function (a, b) { return a + b; }, 0) : up;
      var lower = down;
      if (upper === 0 || lower === 0) {
          return NONE;
      }
      var name = Array.isArray(up) ? up.join("+") + "/" + down : up + "/" + down;
      var additive = Array.isArray(up) ? up : [];
      var type = lower === 4 || lower === 2
          ? "simple"
          : lower === 8 && upper % 3 === 0
              ? "compound"
              : "irregular";
      return {
          empty: false,
          name: name,
          type: type,
          upper: upper,
          lower: lower,
          additive: additive,
      };
  }

  exports.default = index;
  exports.get = get;
  exports.names = names;
  exports.parse = parse;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],21:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tonaljs/abc-notation'), require('@tonaljs/array'), require('@tonaljs/chord'), require('@tonaljs/chord-type'), require('@tonaljs/collection'), require('@tonaljs/core'), require('@tonaljs/duration-value'), require('@tonaljs/interval'), require('@tonaljs/key'), require('@tonaljs/midi'), require('@tonaljs/mode'), require('@tonaljs/note'), require('@tonaljs/pcset'), require('@tonaljs/progression'), require('@tonaljs/range'), require('@tonaljs/roman-numeral'), require('@tonaljs/scale'), require('@tonaljs/scale-type'), require('@tonaljs/time-signature')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tonaljs/abc-notation', '@tonaljs/array', '@tonaljs/chord', '@tonaljs/chord-type', '@tonaljs/collection', '@tonaljs/core', '@tonaljs/duration-value', '@tonaljs/interval', '@tonaljs/key', '@tonaljs/midi', '@tonaljs/mode', '@tonaljs/note', '@tonaljs/pcset', '@tonaljs/progression', '@tonaljs/range', '@tonaljs/roman-numeral', '@tonaljs/scale', '@tonaljs/scale-type', '@tonaljs/time-signature'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Tonal = {}, global.abcNotation, global.array, global.chord, global.ChordType, global.collection, global.Core, global.durationValue, global.interval, global.key, global.midi, global.mode, global.note, global.Pcset, global.progression, global.range, global.romanNumeral, global.scale, global.ScaleType, global.timeSignature));
}(this, (function (exports, abcNotation, array, chord, ChordType, collection, Core, durationValue, interval, key, midi, mode, note, Pcset, progression, range, romanNumeral, scale, ScaleType, timeSignature) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var abcNotation__default = /*#__PURE__*/_interopDefaultLegacy(abcNotation);
  var array__namespace = /*#__PURE__*/_interopNamespace(array);
  var chord__default = /*#__PURE__*/_interopDefaultLegacy(chord);
  var ChordType__default = /*#__PURE__*/_interopDefaultLegacy(ChordType);
  var collection__default = /*#__PURE__*/_interopDefaultLegacy(collection);
  var Core__namespace = /*#__PURE__*/_interopNamespace(Core);
  var durationValue__default = /*#__PURE__*/_interopDefaultLegacy(durationValue);
  var interval__default = /*#__PURE__*/_interopDefaultLegacy(interval);
  var key__default = /*#__PURE__*/_interopDefaultLegacy(key);
  var midi__default = /*#__PURE__*/_interopDefaultLegacy(midi);
  var mode__default = /*#__PURE__*/_interopDefaultLegacy(mode);
  var note__default = /*#__PURE__*/_interopDefaultLegacy(note);
  var Pcset__default = /*#__PURE__*/_interopDefaultLegacy(Pcset);
  var progression__default = /*#__PURE__*/_interopDefaultLegacy(progression);
  var range__default = /*#__PURE__*/_interopDefaultLegacy(range);
  var romanNumeral__default = /*#__PURE__*/_interopDefaultLegacy(romanNumeral);
  var scale__default = /*#__PURE__*/_interopDefaultLegacy(scale);
  var ScaleType__default = /*#__PURE__*/_interopDefaultLegacy(ScaleType);
  var timeSignature__default = /*#__PURE__*/_interopDefaultLegacy(timeSignature);

  // deprecated (backwards compatibility)
  var Tonal = Core__namespace;
  var PcSet = Pcset__default['default'];
  var ChordDictionary = ChordType__default['default'];
  var ScaleDictionary = ScaleType__default['default'];

  Object.defineProperty(exports, 'AbcNotation', {
    enumerable: true,
    get: function () {
      return abcNotation__default['default'];
    }
  });
  exports.Array = array__namespace;
  Object.defineProperty(exports, 'Chord', {
    enumerable: true,
    get: function () {
      return chord__default['default'];
    }
  });
  Object.defineProperty(exports, 'ChordType', {
    enumerable: true,
    get: function () {
      return ChordType__default['default'];
    }
  });
  Object.defineProperty(exports, 'Collection', {
    enumerable: true,
    get: function () {
      return collection__default['default'];
    }
  });
  exports.Core = Core__namespace;
  Object.defineProperty(exports, 'DurationValue', {
    enumerable: true,
    get: function () {
      return durationValue__default['default'];
    }
  });
  Object.defineProperty(exports, 'Interval', {
    enumerable: true,
    get: function () {
      return interval__default['default'];
    }
  });
  Object.defineProperty(exports, 'Key', {
    enumerable: true,
    get: function () {
      return key__default['default'];
    }
  });
  Object.defineProperty(exports, 'Midi', {
    enumerable: true,
    get: function () {
      return midi__default['default'];
    }
  });
  Object.defineProperty(exports, 'Mode', {
    enumerable: true,
    get: function () {
      return mode__default['default'];
    }
  });
  Object.defineProperty(exports, 'Note', {
    enumerable: true,
    get: function () {
      return note__default['default'];
    }
  });
  Object.defineProperty(exports, 'Pcset', {
    enumerable: true,
    get: function () {
      return Pcset__default['default'];
    }
  });
  Object.defineProperty(exports, 'Progression', {
    enumerable: true,
    get: function () {
      return progression__default['default'];
    }
  });
  Object.defineProperty(exports, 'Range', {
    enumerable: true,
    get: function () {
      return range__default['default'];
    }
  });
  Object.defineProperty(exports, 'RomanNumeral', {
    enumerable: true,
    get: function () {
      return romanNumeral__default['default'];
    }
  });
  Object.defineProperty(exports, 'Scale', {
    enumerable: true,
    get: function () {
      return scale__default['default'];
    }
  });
  Object.defineProperty(exports, 'ScaleType', {
    enumerable: true,
    get: function () {
      return ScaleType__default['default'];
    }
  });
  Object.defineProperty(exports, 'TimeSignature', {
    enumerable: true,
    get: function () {
      return timeSignature__default['default'];
    }
  });
  exports.ChordDictionary = ChordDictionary;
  exports.PcSet = PcSet;
  exports.ScaleDictionary = ScaleDictionary;
  exports.Tonal = Tonal;
  Object.keys(Core).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () {
        return Core[k];
      }
    });
  });

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"@tonaljs/abc-notation":1,"@tonaljs/array":2,"@tonaljs/chord":5,"@tonaljs/chord-type":4,"@tonaljs/collection":6,"@tonaljs/core":7,"@tonaljs/duration-value":8,"@tonaljs/interval":9,"@tonaljs/key":10,"@tonaljs/midi":11,"@tonaljs/mode":12,"@tonaljs/note":13,"@tonaljs/pcset":14,"@tonaljs/progression":15,"@tonaljs/range":16,"@tonaljs/roman-numeral":17,"@tonaljs/scale":19,"@tonaljs/scale-type":18,"@tonaljs/time-signature":20}],22:[function(require,module,exports){
let rendererArray = []
let vexContextArray = []
let staveArray = []
let svgArray = []


function projectNote(xPos, rectangle, availableWidth, id) {
    if (xPos === "none" && (rectangle.attributes[0].id !== ("note-projection-" + id))) {
        return
    }
    let divOffset = document.querySelector("#center-col").offsetLeft
    let rect = rectangle.attributes
    let rectId = rect[0].value.split("-")[1]
    let start = parseInt(rect[1].value) * rectId + divOffset + 3
    let barOffset = (parseInt(rectId) - 1) * (availableWidth + parseInt(rect[1].value) + 40)
    let subdivision = document.querySelector('#subdivision').attributes.getNamedItem('value').value
    let yPos = rect[2].value - 2.5
    if (subdivision[0] === "Q") {

    }
    let selector = "note-projection-" + (id)
    let projected_note = document.getElementById(selector)
    projected_note.setAttribute("cx", String(xPos))
    projected_note.setAttribute("cy", String(yPos))
}

function newStave() {
    let div = document.getElementById("boo")
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    let rendererHeight = 200
    let rendererWidth = 460
    renderer.resize(rendererWidth, rendererHeight);
    let vexContext = renderer.getContext();
    let staveX = 440
    let staveY = 50
    let stave = new VF.Stave(10, staveY, staveX);
    return {renderer, rendererHeight, rendererWidth, vexContext, staveX, staveY, stave};
}

function addNoteBoundaries(id, yRectWidth, staveX, index, letters, inc, xRectHeight, multiplier, staveY, svg, xRectangles, pt, numBar) {
    let yRectangles = []
    let rectWidth = yRectWidth - 20
    for (let i = 0; i < 16; i++) {
        rectWidth += 21.875
        let rectId = "yRectangleHtml-" + String(id) + String(i + 1)
        let yRectangleHtml = `<rect id=\"${rectId}\" x=\"${rectWidth + staveX * 0.2}\" y=\"60\" width=\"21.875\" height=\"100\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n"+"</rect>`
        svg.insertAdjacentHTML('beforeEnd', yRectangleHtml)
        let yRectangle = document.getElementById(letters[index] + inc + "-" + id + "-")
        yRectangles.push(yRectangle)
    }
    for (let i = 0; i < 16; i++) {
        let xRectangleHtml;
        index = i % letters.length;
        if (i % 2) {
            xRectangleHtml = `<rect id=\"${letters[index] + String(inc) + "-" + String(id) + "-"}\" x=\"${staveX * 0.2}\" y=\"${xRectHeight + multiplier * staveY}\" width=\"350\" height=\"6\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n"+"</rect>`
            xRectHeight += 6
        } else {
            xRectangleHtml = `<rect id=\"${letters[index] + String(inc) + "-" + String(id) + "-"}\" x=\"${staveX * 0.2}\" y=\"${xRectHeight + multiplier * staveY}\" width=\"350\" height=\"4\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n"+"</rect>`
            xRectHeight += 4
        }
        svg.insertAdjacentHTML('beforeend', xRectangleHtml)
        let xRectangle = document.getElementById(letters[index] + inc + "-" + id + "-")
        xRectangles.push(xRectangle)
        if (letters[index] === letters[0]) {
            inc--;
        }
    }
}

function setupBoundaryParams(svg) {
    let yRectWidth = 0
    let xRectHeight = 0
    let id = 1
    let inc = 6
    let index = 0
    let yRectangles = []
    let xRectangles = []
    let multiplier = 1.47
    let letters = ['c/', 'b/', 'a/', 'g/', 'f/', 'e/', 'd/']
    let pt = svg.createSVGPoint();
    return {yRectWidth, xRectHeight, id, inc, index, xRectangles, multiplier, letters, pt};
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    inp.innerHTML = this.getElementsByTagName("input")[0].value
                    // inp.attributes.setAttribute("value", this.getElementsByTagName("input")[0].value)
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

$(document).ready(function () {
    VF = Vex.Flow;
    let allChords = scribble.chords()
    const {ChordType} = require("@tonaljs/tonal");
    let chordsAutofillInput = document.querySelector("#chord-autocomplete")
    autocomplete(chordsAutofillInput, allChords)
    let {renderer, rendererHeight, rendererWidth, vexContext, staveX, staveY, stave} = newStave();
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(vexContext).draw();
    let svg = document.querySelector("#boo").lastChild
    rendererArray.push(renderer)
    vexContextArray.push(vexContext)
    staveArray.push(stave)
    svgArray.push(svg)
    let {yRectWidth, xRectHeight, id, inc, index, xRectangles, multiplier, letters, pt} = setupBoundaryParams(svg);
    addNoteBoundaries(id, yRectWidth, staveX, index, letters, inc, xRectHeight, multiplier, staveY, svg, xRectangles, pt);

    svg.insertAdjacentHTML('beforeend', '<g id="note-group-1"></g>')
    svg.insertAdjacentHTML('beforeend', `<ellipse id="note-projection-1" cx=\"400\" cy=\"400\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)

    svg.addEventListener("click", function (e) {
        let projectionX = document.querySelector("#note-projection-1").attributes[1].value
        let projectionY = document.querySelector("#note-projection-1").attributes[2].value
        drawNote(projectionX, projectionY, xRectangles, vexContext, stave, svg, renderer, rendererWidth, rendererHeight, staveX, staveY)
        getMousePosition(e, pt)
    })

    svg.addEventListener("mousemove", function (evt) {
        let svgIndex = parseInt(evt.target.attributes[0].value.split("-")[1]) - 1
        let elementList = document.elementsFromPoint(evt.clientX, evt.clientY)
        let subdivision = document.querySelector('#subdivision').attributes.getNamedItem('value').value
        if ((elementList.length === 10 || elementList.length === 11) && elementList[0].attributes.length > 3 && elementList[0].nodeName && elementList[0].nodeName !== "ellipse") {
            let hBar = elementList[0]
            let vBar = elementList[1]
            let rectangleNumber = parseInt(vBar.attributes[0].value.split("-")[1].substring(1,))
            if (subdivision[0] === "Q") {
                if (rectangleNumber !== 16) {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 4) * 4 + 2))
                } else {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + "14")
                }
            } else if (subdivision[0] === "H") {
                if (rectangleNumber !== 16) {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 8) * 8 + 4))
                } else {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + "12")
                }
            } else if (subdivision[0] === "E") {
                if (rectangleNumber !== 16) {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 2) * 2 + 2))
                } else {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + "15")
                }
            }
            let xposition = vBar.attributes[1].value
            projectNote(xposition, hBar, staveX, 1)
        }
    })

    document.querySelector("#play-button").addEventListener("click", () => {

        function timeFromDurations(value, i, arr) {
            let prevTime = arr[i - 1]?.time;
            value.time = prevTime + arr[i - 1]?.duration || 0;
            return value;
        }

        let totalTime = 0

        let drawnNotesString = document.querySelector("#drawn-notes").getAttribute("value")
        let drawnChordsString = document.querySelector("#drawn-chords").getAttribute("value")
        let drawnChords = drawnChordsString.split("-")
        console.log(drawnChords)
        drawnChords.pop()
        let notesAndDurations = []
        let drawnNotes = drawnNotesString.split(",")
        drawnNotes.pop()
        for (let note of drawnNotes) {
            let relativeLength = note.split(":")[0] + "n"
            if (note.split(":")[0] === "W") {
                relativeLength = "1n"
            } else if (note.split(":")[0] === "H") {
                relativeLength = "2n"
            } else if (note.split(":")[0] === "Q") {
                relativeLength = "4n"
            } else if (note.split(":")[0] === "E") {
                relativeLength = "8n"
            } else if (note.split(":")[0] === "S") {
                relativeLength = "16n"
            }
            let pitch = note.split(":")[1].split("-")[0]
            notesAndDurations.push({"note": pitch.replace("/", ""), "duration": Tone.Time(relativeLength).toSeconds()})
            totalTime += Tone.Time(relativeLength).toSeconds()
        }

        notesAndDurations.map(timeFromDurations)

        let chordArray = []
        let durationArray = []

        drawnChords.forEach((item, index) => {
            let chord = item.split(",")
            let duration = chord.pop()
            chord.shift()
            durationArray.push(duration)
            chordArray.push(chord)
        })

        let inc = 0
        let mainChords = []
        chordArray.forEach((item, index) => {
            let temp = {"time": inc, 'note': item, 'duration': parseInt(durationArray[index]) / 2}
            inc += parseInt(durationArray[index]) / 2
            mainChords.push(temp)
        })
        console.log(mainChords)

        const polySynth = new Tone.PolySynth().toDestination();

        let chordPart = new Tone.Part((time, value) => {
            polySynth.triggerAttackRelease(value.note, value.duration, time);
        }, mainChords).start(Tone.now());
        console.log(notesAndDurations)

        let synth = new Tone.Synth().toDestination();
        let part = new Tone.Part((time, value) => {
            synth.triggerAttackRelease(value.note, value.duration, time);
        }, notesAndDurations).start(Tone.now());
        Tone.Transport.start(Tone.now());
    })

    function processChordInput() {
        let rootPitch = document.getElementById("root-pitch").value.split(":")
        let root = rootPitch[0]
        let pitch = rootPitch[1]
        let chordModifier = document.getElementById("chord-autocomplete").value
        return root + pitch + " " + chordModifier
    }

    document.querySelector("#add-chord").addEventListener("click", function () {
        let chord = processChordInput()
        let drawnChords = document.querySelector("#drawn-chords")
        let chordDuration = document.getElementById("chord-duration").value
        drawnChords.setAttribute("value", drawnChords.value + chord + "," + scribble.chord(chord).toString() + "," + chordDuration + "-")
    })

    document.querySelector("#remove-chord").addEventListener("click", function () {
        let drawnChords = document.getElementById("drawn-chords").value
        if (drawnChords.length > 0) {
            let drawnChordArray = drawnChords.split("-")
            drawnChordArray.pop()
            drawnChordArray.pop()
            if (drawnChordArray.length > 0) {
                let retVal = drawnChordArray.join("-") + "-"
                document.getElementById("drawn-chords").setAttribute("value", retVal)
            } else {
                document.getElementById("drawn-chords").setAttribute("value", "")
            }
        }
    })
    document.querySelector("#preview-chord").addEventListener("click", function () {
        let chord = processChordInput()
        let chordDuration = document.getElementById("chord-duration").value
        let chordNoteArray = scribble.chord(chord)
        let mainChords = [{"time": 0, 'note': chordNoteArray, 'duration': parseInt(chordDuration) / 2}]
        const polySynth = new Tone.PolySynth().toDestination();
        let chordPart = new Tone.Part((time, value) => {
            polySynth.triggerAttackRelease(value.note, value.duration, time);
        }, mainChords).start(Tone.now());
    })

    let noteButtons = [...document.querySelector("#note-buttons").children]

    noteButtons.forEach((button) => {
        if (button.nodeName === "BUTTON" && button.attributes[1].value !== "play-button") {
            button.addEventListener("click", () => {
                let value = button.attributes[1].value
                document.querySelector("#subdivision").setAttribute("value", value)
            })
        }
    })
})

function cursorPoint(evt, pt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt;
}

function getMousePosition(evt, pt) {
    let cursorPt = cursorPoint(evt, pt);
    return cursorPt
}

function evalNoteLength(noteLength) {
    let context = {}
    if (noteLength === "Q") {
        context["dec"] = 1
        context["duration"] = "q"
    } else if (noteLength === "H") {
        context["dec"] = 2
        context["duration"] = "h"
    } else if (noteLength === "E") {
        context["dec"] = 0.5
        context["duration"] = "8"
    } else if (noteLength === "W") {
        context["dec"] = 4
        context["duration"] = "w"
    } else if (noteLength === "S") {
        context["dec"] = 0.25
        context["duration"] = "16"
    }
    return context
}

function incFillCount(subdivision, fillCount, fillCountValue) {
    let note = ""
    if (subdivision === "Quarter Note") {
        note = subdivision[0]
        fillCount.setAttribute("value", String(fillCountValue + 1))
    } else if (subdivision === "Half Note") {
        note = subdivision[0]
        fillCount.setAttribute("value", String(fillCountValue + 2))
    } else if (subdivision === "Eighth Note") {
        note = subdivision[0]
        fillCount.setAttribute("value", String(fillCountValue + 0.5))
    } else if (subdivision === "Whole Note") {
        note = subdivision[0]
        fillCount.setAttribute("value", String(fillCountValue + 4))
    } else if (subdivision === "Sixteenth Note") {
        note = subdivision[0]
        fillCount.setAttribute("value", String(fillCountValue + 0.25))
    }
    return note
}

function evalFillLength(remainder) {
    let context = {}
    if (remainder % 0.25 === 0) {
        context["dec"] = 0.25
        context["duration"] = "16"
    } else if (remainder % 0.5 === 0) {
        context["dec"] = 0.5
        context["duration"] = "8"
    } else if (remainder % 1 === 0) {
        context["dec"] = 1
        context["duration"] = "q"
    } else if (remainder % 1 === 0) {
        context["dec"] = 2
        context["duration"] = "h"
    } else if (remainder % 4 === 0) {
        context["dec"] = 4
        context["duration"] = "w"
    }
    return context
}

function parseDrawnnNotes(drawnNotesValue, fillCapacity) {
    let drawnNoteAndLengthList = drawnNotesValue.split(",")
    drawnNoteAndLengthList.pop()
    let drawnNoteLengthValues = []
    let drawnNoteKeyValues = []
    for (let i = drawnNoteAndLengthList.length - 1; i > -1; i--) {
        if (drawnNoteAndLengthList[i].split("-")[1] === String(((fillCapacity / 4)))) {
            let timeValue = drawnNoteAndLengthList[i].split(":")[0]
            let noteAndMeasureKey = drawnNoteAndLengthList[i].split(":")[1]
            let noteKey = noteAndMeasureKey.split("-")[0]
            drawnNoteLengthValues.push(timeValue)
            drawnNoteKeyValues.push(noteKey)
        } else {
            break
        }
    }
    return {drawnNoteLengthValues, drawnNoteKeyValues};
}

function eraseProjectedNotes(fillCapacity) {
    let svgChildNodes = svgArray[((fillCapacity / 4) - 1)].childNodes
    let staticLength = svgChildNodes.length
    for (let i = 0; i < staticLength; i++) {
        let element = svgChildNodes[i]
        if (element !== null && element.nodeName === "g" && element.className !== "vf-stavenote" && element.attributes !== null && element.attributes[0].value !== "note-projection") {
            element.childNodes.forEach((item) => {
                item.attributes[3].value = "0"
            })
        }
    }
}

function drawNote(pX, pY, rects, vexContext, stave, svg, renderer, rendererWidth, rendererHeight, staveX, staveY) {
    let subdivision = document.querySelector("#subdivision").getAttribute("value")
    let fillCount = document.querySelector("#fill-count")
    let fillCapacity = parseInt(document.querySelector("#fill-capacity").getAttribute("value"))
    let drawnNotes = document.getElementById("drawn-notes")
    let drawnNotesValue = ""
    let fillCountValue = parseFloat(fillCount.attributes[1].value)
    let note = ""

    note = incFillCount(subdivision, fillCount, fillCountValue)

    fillCountValue = parseInt(fillCount.attributes[1].value)
    let temp = parseInt(pY)
    for (let rect of rects) {
        if (temp < parseInt(rect.attributes[2].value)) {
            note += ":" + String(rect.attributes[0].value)
            temp = Number.MAX_SAFE_INTEGER
        }
    }

    document.querySelector('#note-group-' + note.split("-")[1]).insertAdjacentHTML('beforeend', `<ellipse id=\"${fillCountValue + note}\" cx=\"0\" cy=\"0\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)

    drawnNotesValue = drawnNotes.attributes[1].value + (note + ",")
    let drawnNote = document.getElementById(fillCountValue + note)
    drawnNote.setAttribute("cx", pX)
    drawnNote.setAttribute("cy", pY)

    drawnNotes.attributes[1].value = drawnNotesValue


    let notes = [];
    let dec = 0;
    let duration = ""
    let startIndex = ((fillCapacity / 4) - 1) * 4
    let i = startIndex;
    if (fillCountValue >= fillCapacity) {
        let {drawnNoteLengthValues, drawnNoteKeyValues} = parseDrawnnNotes(drawnNotesValue, fillCapacity);
        eraseProjectedNotes(fillCapacity);

        drawnNoteKeyValues.forEach((note, i) => {
            duration = evalNoteLength(drawnNoteLengthValues[i])['duration']
            let newNote = new VF.StaveNote({clef: "treble", keys: [note], duration: duration})
            notes.unshift(newNote)
        })

        document.querySelector("#fill-capacity").setAttribute("value", String(fillCapacity + 4))
        let voice = new VF.Voice({num_beats: 4, beat_value: 4});
        voice.addTickables(notes);
        let formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);


        vexContext = rendererArray[((fillCapacity / 4) - 1)].getContext()
        let newStaveAttributes = newStave()
        let nStave = newStaveAttributes['stave']
        let nVexContext = newStaveAttributes['vexContext']

        let numberOfSvgs = fillCapacity / 4
        if (numberOfSvgs === 1) {
            document.getElementById("inner-row").style.width = String(rendererWidth * (numberOfSvgs + 1)) + "px"
            document.getElementById("elements").style.width = String(rendererWidth * (numberOfSvgs + 1)) + "px"
        }

        voice.draw(vexContextArray[((fillCapacity / 4) - 1)], staveArray[((fillCapacity / 4) - 1)]);
        nStave.setContext(nVexContext).draw();
        let newSvg = document.querySelector("#boo").lastChild

        rendererArray.push(renderer)
        vexContextArray.push(nVexContext)
        staveArray.push(nStave)
        svgArray.push(newSvg)
        newSvg.addEventListener("click", function (e) {
            let svgNumber = parseInt(e.target.id.split("-")[1]) - 1
            if (!svgNumber) {
                return
            }
            let selector = "#note-projection-" + String(svgNumber + 1)
            let projectionX = document.querySelector(selector).attributes[1].value
            let projectionY = document.querySelector(selector).attributes[2].value
            drawNote(projectionX, projectionY, xRectangles, vexContext, stave, svg, renderer, rendererWidth, rendererHeight, staveX, staveY)
            getMousePosition(e, pt)
        })

        let viewBox = ""

        for (let childSvg of document.querySelector("#boo").childNodes) {
            let bbox = childSvg.getBBox();
            viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
            childSvg.setAttribute("viewBox", viewBox);
        }

        document.querySelector("#boo").children[0].setAttribute("viewBox", viewBox)

        let {
            yRectWidth,
            xRectHeight,
            id,
            inc,
            index,
            xRectangles,
            multiplier,
            letters,
            pt
        } = setupBoundaryParams(newSvg);
        id = numberOfSvgs
        letters = ['c/', 'b/', 'a/', 'g/', 'f/', 'e/', 'd/']
        addNoteBoundaries(numberOfSvgs + 1, yRectWidth, staveX, index, letters, inc, xRectHeight, multiplier, staveY, newSvg, xRectangles, pt);
        let prevNoteProjection = document.getElementById("note-projection-" + String(numberOfSvgs))
        prevNoteProjection.attributes[5].value = 0
        let noteGroupId = "note-group-" + String(numberOfSvgs + 1)
        newSvg.insertAdjacentHTML('beforeend', `<g id=${noteGroupId}></g>`)
        newSvg.insertAdjacentHTML('beforeend', `<ellipse id=${"note-projection-" + String(numberOfSvgs + 1)} cx=\"400\" cy=\"400\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)

        newSvg.addEventListener("mousemove", function (evt) {
            let svgIndex = parseInt(evt.target.attributes[0].value.split("-")[1])
            let svg = document.querySelector("#boo").childNodes[0]
            let subdivision = document.querySelector('#subdivision').attributes.getNamedItem('value').value
            let elementList = document.elementsFromPoint(evt.clientX, evt.clientY)
            if ((elementList.length === 10 || elementList.length === 11) && elementList[0].attributes.length > 3 && elementList[0].nodeName && elementList[0].nodeName !== "ellipse") {
                let hBar = elementList[0]
                let vBar = elementList[1]
                let rectangleNumber = parseInt(vBar.attributes[0].value.split("-")[1].substring(1,))
                if (subdivision[0] === "Q") {
                    if (rectangleNumber !== 16) {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 4) * 4 + 2))
                    } else {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + "14")
                    }
                } else if (subdivision[0] === "H") {
                    if (rectangleNumber !== 16) {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 8) * 8 + 4))
                    } else {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + "12")
                    }
                } else if (subdivision[0] === "E") {
                    if (rectangleNumber !== 16) {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 2) * 2 + 2))
                    } else {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + "15")
                    }
                }
                let xposition = vBar.attributes[1].value
                projectNote(xposition, hBar, staveX, String(numberOfSvgs + 1))
            }
        })
    }
}


},{"@tonaljs/tonal":21}]},{},[22]);
