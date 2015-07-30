var RiseVision = RiseVision || {};

RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Utilities = (function() {

  function getFontCssStyle(className, fontObj) {
    var family = "font-family:" + fontObj.font.family + "; ";
    var color = "color: " + fontObj.color + "; ";
    var size = "font-size: " + fontObj.size + "px; ";
    var weight = "font-weight: " + (fontObj.bold ? "bold" : "normal") + "; ";
    var italic = "font-style: " + (fontObj.italic ? "italic" : "normal") + "; ";
    var underline = "text-decoration: " + (fontObj.underline ? "underline" : "none") + "; ";
    var highlight = "background-color: " + fontObj.highlightColor + "; ";

    return "." + className + " {" + family + color + size + weight + italic + underline + highlight + "}";
  }

  function addCSSRules(rules) {
    var style = document.createElement("style");

    for (var i = 0, length = rules.length; i < length; i++) {
      style.appendChild(document.createTextNode(rules[i]));
    }

    document.head.appendChild(style);
  }

  /*
   * Loads Google or custom fonts, if applicable, and injects CSS styles
   * into the head of the document.
   *
   * @param    array    settings    Array of objects with the following form:
 *                                   [{
 *                                     "class": "date",
 *                                     "fontSetting": {
 *                                         bold: true,
 *                                         color: "black",
 *                                         font: {
 *                                           family: "Akronim",
 *                                           font: "Akronim",
 *                                           name: "Verdana",
 *                                           type: "google",
 *                                           url: "http://custom-font-url"
 *                                         },
 *                                         highlightColor: "transparent",
 *                                         italic: false,
 *                                         size: "20",
 *                                         underline: false
 *                                     }
 *                                   }]
   *
   *           object   contentDoc    Document object into which to inject styles
   *                                  and load fonts (optional).
   */
  function loadFonts(settings, contentDoc) {
    settings.forEach(function(item) {
      if (item.class && item.fontSetting) {
        addCSSRules([ getFontCssStyle(item.class, item.fontSetting) ]);
      }

      if (item.fontSetting.font.type) {
        if (item.fontSetting.font.type === "custom" && item.fontSetting.font.family &&
          item.fontSetting.font.url) {
          loadCustomFont(item.fontSetting.font.family, item.fontSetting.font.url,
            contentDoc);
        }
        else if (item.fontSetting.font.type === "google" && item.fontSetting.font.family) {
          loadGoogleFont(item.fontSetting.font.family, contentDoc);
        }
      }
    });
  }

  function loadCustomFont(family, url, contentDoc) {
    var sheet = null;
    var rule = "font-family: " + family + "; " + "src: url('" + url + "');";

    contentDoc = contentDoc || document;

    sheet = contentDoc.styleSheets[0];

    if (sheet !== null) {
      sheet.addRule("@font-face", rule);
    }
  }

  function loadGoogleFont(family, contentDoc) {
    var stylesheet = document.createElement("link");

    contentDoc = contentDoc || document;

    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("type", "text/css");
    stylesheet.setAttribute("href", "https://fonts.googleapis.com/css?family=" +
      family);

    if (stylesheet !== null) {
      contentDoc.getElementsByTagName("head")[0].appendChild(stylesheet);
    }
  }

  function preloadImages(urls) {
    var length = urls.length,
      images = [];

    for (var i = 0; i < length; i++) {
      images[i] = new Image();
      images[i].src = urls[i];
    }
  }

  function getQueryParameter(param) {
    var query = window.location.search.substring(1),
      vars = query.split("&"),
      pair;

    for (var i = 0; i < vars.length; i++) {
      pair = vars[i].split("=");

      if (pair[0] == param) {
        return decodeURIComponent(pair[1]);
      }
    }

    return "";
  }

  return {
    getQueryParameter: getQueryParameter,
    getFontCssStyle:  getFontCssStyle,
    addCSSRules:      addCSSRules,
    loadFonts:        loadFonts,
    loadCustomFont:   loadCustomFont,
    loadGoogleFont:   loadGoogleFont,
    preloadImages:    preloadImages
  };
})();

// -----
// The `timezoneJS.Date` object gives you full-blown timezone support, independent from the timezone set on the end-user's machine running the browser. It uses the Olson zoneinfo files for its timezone data.
//
// The constructor function and setter methods use proxy JavaScript Date objects behind the scenes, so you can use strings like '10/22/2006' with the constructor. You also get the same sensible wraparound behavior with numeric parameters (like setting a value of 14 for the month wraps around to the next March).
//
// The other significant difference from the built-in JavaScript Date is that `timezoneJS.Date` also has named properties that store the values of year, month, date, etc., so it can be directly serialized to JSON and used for data transfer.

/*
 * Copyright 2010 Matthew Eernisse (mde@fleegix.org)
 * and Open Source Applications Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Credits: Ideas included from incomplete JS implementation of Olson
 * parser, 'XMLDAte' by Philippe Goetz (philippe.goetz@wanadoo.fr)
 *
 * Contributions:
 * Jan Niehusmann
 * Ricky Romero
 * Preston Hunt (prestonhunt@gmail.com)
 * Dov. B Katz (dov.katz@morganstanley.com)
 * Peter Bergström (pbergstr@mac.com)
 * Long Ho
 */

 /*jshint laxcomma:true, laxbreak:true, expr:true*/
(function () {
  // Standard initialization stuff to make sure the library is
  // usable on both client and server (node) side.
  'use strict';
  var root = this;

  // Export the timezoneJS object for Node.js, with backwards-compatibility for the old `require()` API
  var timezoneJS = {};
  if (typeof define === 'function' && define.amd) { // AMD
    define(function() {
     return timezoneJS;
    });
  } else if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = timezoneJS;
    }
    exports.timezoneJS = timezoneJS;
  } else {
    root.timezoneJS = timezoneJS;
  }

  timezoneJS.VERSION = '0.4.13';

  // Grab the ajax library from global context.
  // This can be jQuery, Zepto or fleegix.
  // You can also specify your own transport mechanism by declaring
  // `timezoneJS.timezone.transport` to a `function`. More details will follow
  var ajax_lib = root.$ || root.jQuery || root.Zepto
    , fleegix = root.fleegix
    // Declare constant list of days and months. Unfortunately this doesn't leave room for i18n due to the Olson data being in English itself
    , DAYS = timezoneJS.Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    , MONTHS = timezoneJS.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    , SHORT_MONTHS = {}
    , SHORT_DAYS = {}
    , EXACT_DATE_TIME = {};

  //`{ 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 }`
  for (var i = 0; i < MONTHS.length; i++) {
    SHORT_MONTHS[MONTHS[i].substr(0, 3)] = i;
  }

  //`{ 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 }`
  for (i = 0; i < DAYS.length; i++) {
    SHORT_DAYS[DAYS[i].substr(0, 3)] = i;
  }


  //Handle array indexOf in IE
  //From https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
  //Extending Array prototype causes IE to iterate thru extra element
  var _arrIndexOf = Array.prototype.indexOf || function (el) {
    if (this === null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === el) {
        return k;
      }
    }
    return -1;
  };

  // Format a number to the length = digits. For ex:
  //
  // `_fixWidth(2, 2) = '02'`
  //
  // `_fixWidth(1998, 2) = '98'`  // year, shorten it to the 2 digit representation
  //
  // `_fixWidth(23, 1) = '23'`  // hour, even with 1 digit specified, do not trim
  //
  // This is used to pad numbers in converting date to string in ISO standard.
  var _fixWidth = function (number, digits) {
    if (typeof number !== 'number') { throw 'not a number: ' + number; }
    var trim = (number > 1000);   // only trim 'year', as the others don't make sense why anyone would want that
    var s = number.toString();
    var s_len = s.length;
    if (trim && s_len > digits) {
      return s.substr(s_len - digits, s_len);
    }
    s = [s];
    while (s_len < digits) {
      s.unshift('0');
      s_len++;
    }
    return s.join('');
  };

  // Abstraction layer for different transport layers, including fleegix/jQuery/Zepto/Node.js
  //
  // Object `opts` include
  //
  // - `url`: url to ajax query
  //
  // - `async`: true for asynchronous, false otherwise. If false, return value will be response from URL. This is true by default
  //
  // - `success`: success callback function
  //
  // - `error`: error callback function
  // Returns response from URL if async is false, otherwise the AJAX request object itself
  var _transport = function (opts) {
    if (!opts) return;
    if (!opts.url) throw new Error ('URL must be specified');
    if (!('async' in opts)) opts.async = true;

    // Server-side (node)
    // if node, require the file system module
    if (typeof window === 'undefined' && typeof require === 'function') {
      var nodefs = require('fs');
      if (opts.async) {
        // No point if there's no success handler
        if (typeof opts.success !== 'function') return;
        opts.error = opts.error || console.error;
        return nodefs.readFile(opts.url, 'utf8', function(err, data) {
          return err ? opts.error(err) : opts.success(data);
        });
      }
      return nodefs.readFileSync(opts.url, 'utf8');
    }

    // Client-side
    if ((!fleegix || typeof fleegix.xhr === 'undefined') && (!ajax_lib || typeof ajax_lib.ajax === 'undefined')) {
      throw new Error('Please use the Fleegix.js XHR module, jQuery ajax, Zepto ajax, or define your own transport mechanism for downloading zone files.');
    }
    if (!opts.async) {
      return fleegix && fleegix.xhr
      ? fleegix.xhr.doReq({ url: opts.url, async: false })
      : ajax_lib.ajax({ url : opts.url, async : false, dataType: 'text' }).responseText;
    }
    return fleegix && fleegix.xhr
    ? fleegix.xhr.send({
      url : opts.url,
      method : 'get',
      handleSuccess : opts.success,
      handleErr : opts.error
    })
    : ajax_lib.ajax({
      url : opts.url,
      dataType: 'text',
      method : 'GET',
      error : opts.error,
      success : opts.success
    });
  };

  // Constructor, which is similar to that of the native Date object itself
  timezoneJS.Date = function () {
    if(this === timezoneJS) {
      throw 'timezoneJS.Date object must be constructed with \'new\'';
    }
    var args = Array.prototype.slice.apply(arguments)
    , dt = null
    , tz = null
    , arr = []
    , valid = false
    ;


    //We support several different constructors, including all the ones from `Date` object
    // with a timezone string at the end.
    //
    //- `[tz]`: Returns object with time in `tz` specified.
    //
    // - `utcMillis`, `[tz]`: Return object with UTC time = `utcMillis`, in `tz`.
    //
    // - `Date`, `[tz]`: Returns object with UTC time = `Date.getTime()`, in `tz`.
    //
    // - `year, month, [date,] [hours,] [minutes,] [seconds,] [millis,] [tz]: Same as `Date` object
    // with tz.
    //
    // - `Array`: Can be any combo of the above.
    //
    //If 1st argument is an array, we can use it as a list of arguments itself
    if (Object.prototype.toString.call(args[0]) === '[object Array]') {
      args = args[0];
    }
    // If the last string argument doesn't parse as a Date, treat it as tz
    if (typeof args[args.length - 1] === 'string') {
      valid = Date.parse(args[args.length - 1].replace(/GMT[\+\-]\d+/, ''));
      if (isNaN(valid) || valid === null) {  // Checking against null is required for compatability with Datejs
        tz = args.pop();
      }
    }
    var is_dt_local = false;
    switch (args.length) {
      case 0:
        dt = new Date();
        break;
      case 1:
        dt = new Date(args[0]);
        // Date strings are local if they do not contain 'Z', 'T' or timezone offsets like '+0200'
        //  - more info below
        if (typeof args[0] == 'string' && args[0].search(/[+-][0-9]{4}/) == -1
                && args[0].search(/Z/) == -1 && args[0].search(/T/) == -1) {
            is_dt_local = true;
        }
        break;
      case 2:
        dt = new Date(args[0], args[1]);
        is_dt_local = true;
        break;
      default:
        for (var i = 0; i < 7; i++) {
          arr[i] = args[i] || 0;
        }
        dt = new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
        is_dt_local = true;
        break;
    }

    this._useCache = false;
    this._tzInfo = {};
    this._day = 0;
    this.year = 0;
    this.month = 0;
    this.date = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
    this.timezone = tz || null;
    // Tricky part:
    // The date is either given as unambiguous UTC date or otherwise the date is assumed
    // to be a date in timezone `tz` or a locale date if `tz` is not provided. Thus, to
    // determine how to use `dt` we distinguish between the following cases:
    //  - UTC   (is_dt_local = false)
    //    `timezoneJS.Date(millis, [tz])`
    //    `timezoneJS.Date(Date, [tz])`
    //    `timezoneJS.Date(dt_str_tz, [tz])`
    //  - local/timezone `tz`   (is_dt_local = true)
    //    `timezoneJS.Date(year, mon, day, [hour], [min], [second], [tz])`
    //    `timezoneJS.Date(dt_str, [tz])`
    //
    // `dt_str_tz` is a date string containing timezone information, i.e. containing 'Z', 'T' or
    // /[+-][0-9]{4}/ (e.g. '+0200'), while `dt_str` is a string which does not contain
    // timezone information. See: http://dygraphs.com/date-formats.html
    if (is_dt_local) {
       this.setFromDateObjProxy(dt);
    } else {
       this.setFromTimeProxy(dt.getTime(), tz);
    }
  };

  // Implements most of the native Date object
  timezoneJS.Date.prototype = {
    getDate: function () { return this.date; },
    getDay: function () { return this._day; },
    getFullYear: function () { return this.year; },
    getMonth: function () { return this.month; },
    getYear: function () { return this.year - 1900; },
    getHours: function () { return this.hours; },
    getMilliseconds: function () { return this.milliseconds; },
    getMinutes: function () { return this.minutes; },
    getSeconds: function () { return this.seconds; },
    getUTCDate: function () { return this.getUTCDateProxy().getUTCDate(); },
    getUTCDay: function () { return this.getUTCDateProxy().getUTCDay(); },
    getUTCFullYear: function () { return this.getUTCDateProxy().getUTCFullYear(); },
    getUTCHours: function () { return this.getUTCDateProxy().getUTCHours(); },
    getUTCMilliseconds: function () { return this.getUTCDateProxy().getUTCMilliseconds(); },
    getUTCMinutes: function () { return this.getUTCDateProxy().getUTCMinutes(); },
    getUTCMonth: function () { return this.getUTCDateProxy().getUTCMonth(); },
    getUTCSeconds: function () { return this.getUTCDateProxy().getUTCSeconds(); },
    // Time adjusted to user-specified timezone
    getTime: function () {
      return this._timeProxy + (this.getTimezoneOffset() * 60 * 1000);
    },
    getTimezone: function () { return this.timezone; },
    getTimezoneOffset: function () { return this.getTimezoneInfo().tzOffset; },
    getTimezoneAbbreviation: function () { return this.getTimezoneInfo().tzAbbr; },
    getTimezoneInfo: function () {
      if (this._useCache) return this._tzInfo;
      var res;
      // If timezone is specified, get the correct timezone info based on the Date given
      if (this.timezone) {
        res = this.timezone === 'Etc/UTC' || this.timezone === 'Etc/GMT'
          ? { tzOffset: 0, tzAbbr: 'UTC' }
          : timezoneJS.timezone.getTzInfo(this._timeProxy, this.timezone);
      }
      // If no timezone was specified, use the local browser offset
      else {
        res = { tzOffset: this.getLocalOffset(), tzAbbr: null };
      }
      this._tzInfo = res;
      this._useCache = true;
      return res;
    },
    getUTCDateProxy: function () {
      var dt = new Date(this._timeProxy);
      dt.setUTCMinutes(dt.getUTCMinutes() + this.getTimezoneOffset());
      return dt;
    },
    setDate: function (date) {
      this.setAttribute('date', date);
      return this.getTime();
    },
    setFullYear: function (year, month, date) {
      if (date !== undefined) { this.setAttribute('date', 1); }
      this.setAttribute('year', year);
      if (month !== undefined) { this.setAttribute('month', month); }
      if (date !== undefined) { this.setAttribute('date', date); }
      return this.getTime();
    },
    setMonth: function (month, date) {
      this.setAttribute('month', month);
      if (date !== undefined) { this.setAttribute('date', date); }
      return this.getTime();
    },
    setYear: function (year) {
      year = Number(year);
      if (0 <= year && year <= 99) { year += 1900; }
      this.setUTCAttribute('year', year);
      return this.getTime();
    },
    setHours: function (hours, minutes, seconds, milliseconds) {
      this.setAttribute('hours', hours);
      if (minutes !== undefined) { this.setAttribute('minutes', minutes); }
      if (seconds !== undefined) { this.setAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setMinutes: function (minutes, seconds, milliseconds) {
      this.setAttribute('minutes', minutes);
      if (seconds !== undefined) { this.setAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setSeconds: function (seconds, milliseconds) {
      this.setAttribute('seconds', seconds);
      if (milliseconds !== undefined) { this.setAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setMilliseconds: function (milliseconds) {
      this.setAttribute('milliseconds', milliseconds);
      return this.getTime();
    },
    setTime: function (n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      this.setFromTimeProxy(n, this.timezone);
      return this.getTime();
    },
    setUTCFullYear: function (year, month, date) {
      if (date !== undefined) { this.setUTCAttribute('date', 1); }
      this.setUTCAttribute('year', year);
      if (month !== undefined) { this.setUTCAttribute('month', month); }
      if (date !== undefined) { this.setUTCAttribute('date', date); }
      return this.getTime();
    },
    setUTCMonth: function (month, date) {
      this.setUTCAttribute('month', month);
      if (date !== undefined) { this.setUTCAttribute('date', date); }
      return this.getTime();
    },
    setUTCDate: function (date) {
      this.setUTCAttribute('date', date);
      return this.getTime();
    },
    setUTCHours: function (hours, minutes, seconds, milliseconds) {
      this.setUTCAttribute('hours', hours);
      if (minutes !== undefined) { this.setUTCAttribute('minutes', minutes); }
      if (seconds !== undefined) { this.setUTCAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setUTCAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setUTCMinutes: function (minutes, seconds, milliseconds) {
      this.setUTCAttribute('minutes', minutes);
      if (seconds !== undefined) { this.setUTCAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setUTCAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setUTCSeconds: function (seconds, milliseconds) {
      this.setUTCAttribute('seconds', seconds);
      if (milliseconds !== undefined) { this.setUTCAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setUTCMilliseconds: function (milliseconds) {
      this.setUTCAttribute('milliseconds', milliseconds);
      return this.getTime();
    },
    setFromDateObjProxy: function (dt) {
      this.year = dt.getFullYear();
      this.month = dt.getMonth();
      this.date = dt.getDate();
      this.hours = dt.getHours();
      this.minutes = dt.getMinutes();
      this.seconds = dt.getSeconds();
      this.milliseconds = dt.getMilliseconds();
      this._day = dt.getDay();
      this._dateProxy = dt;
      this._timeProxy = Date.UTC(this.year, this.month, this.date, this.hours, this.minutes, this.seconds, this.milliseconds);
      this._useCache = false;
    },
    setFromTimeProxy: function (utcMillis, tz) {
      var dt = new Date(utcMillis);
      var tzOffset = tz ? timezoneJS.timezone.getTzInfo(utcMillis, tz, true).tzOffset : dt.getTimezoneOffset();
      dt.setTime(utcMillis + (dt.getTimezoneOffset() - tzOffset) * 60000);
      this.setFromDateObjProxy(dt);
    },
    setAttribute: function (unit, n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      var dt = this._dateProxy;
      var meth = unit === 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() + unit.substr(1);
      dt['set' + meth](n);
      this.setFromDateObjProxy(dt);
    },
    setUTCAttribute: function (unit, n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      var meth = unit === 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() + unit.substr(1);
      var dt = this.getUTCDateProxy();
      dt['setUTC' + meth](n);
      dt.setUTCMinutes(dt.getUTCMinutes() - this.getTimezoneOffset());
      this.setFromTimeProxy(dt.getTime() + this.getTimezoneOffset() * 60000, this.timezone);
    },
    setTimezone: function (tz) {
      var previousOffset = this.getTimezoneInfo().tzOffset;
      this.timezone = tz;
      this._useCache = false;
      // Set UTC minutes offsets by the delta of the two timezones
      this.setUTCMinutes(this.getUTCMinutes() - this.getTimezoneInfo().tzOffset + previousOffset);
    },
    removeTimezone: function () {
      this.timezone = null;
      this._useCache = false;
    },
    valueOf: function () { return this.getTime(); },
    clone: function () {
      return this.timezone ? new timezoneJS.Date(this.getTime(), this.timezone) : new timezoneJS.Date(this.getTime());
    },
    toGMTString: function () { return this.toString('EEE, dd MMM yyyy HH:mm:ss Z', 'Etc/GMT'); },
    toLocaleString: function () {},
    toLocaleDateString: function () {},
    toLocaleTimeString: function () {},
    toSource: function () {},
    toISOString: function () { return this.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'Etc/UTC') + 'Z'; },
    toJSON: function () { return this.toISOString(); },
    toDateString: function () { return this.toString('EEE MMM dd yyyy'); },
    toTimeString: function () { return this.toString('H:mm k'); },
    // Allows different format following ISO8601 format:
    toString: function (format, tz) {
      // Default format is the same as toISOString
      if (!format) format = 'yyyy-MM-dd HH:mm:ss';
      var result = format;
      var tzInfo = tz ? timezoneJS.timezone.getTzInfo(this.getTime(), tz) : this.getTimezoneInfo();
      var _this = this;
      // If timezone is specified, get a clone of the current Date object and modify it
      if (tz) {
        _this = this.clone();
        _this.setTimezone(tz);
      }
      var hours = _this.getHours();
      return result
      // fix the same characters in Month names
      .replace(/a+/g, function () { return 'k'; })
      // `y`: year
      .replace(/y+/g, function (token) { return _fixWidth(_this.getFullYear(), token.length); })
      // `d`: date
      .replace(/d+/g, function (token) { return _fixWidth(_this.getDate(), token.length); })
      // `m`: minute
      .replace(/m+/g, function (token) { return _fixWidth(_this.getMinutes(), token.length); })
      // `s`: second
      .replace(/s+/g, function (token) { return _fixWidth(_this.getSeconds(), token.length); })
      // `S`: millisecond
      .replace(/S+/g, function (token) { return _fixWidth(_this.getMilliseconds(), token.length); })
      // 'h': 12 hour format
      .replace(/h+/g, function (token) { return _fixWidth( ((hours%12) === 0) ? 12 : (hours % 12), token.length); })
      // `M`: month. Note: `MM` will be the numeric representation (e.g February is 02) but `MMM` will be text representation (e.g February is Feb)
      .replace(/M+/g, function (token) {
        var _month = _this.getMonth(),
        _len = token.length;
        if (_len > 3) {
          return timezoneJS.Months[_month];
        } else if (_len > 2) {
          return timezoneJS.Months[_month].substring(0, _len);
        }
        return _fixWidth(_month + 1, _len);
      })
      // `k`: AM/PM
      .replace(/k+/g, function () {
        if (hours >= 12) {
          if (hours > 12) {
            hours -= 12;
          }
          return 'PM';
        }
        return 'AM';
      })
      // `H`: hour
      .replace(/H+/g, function (token) { return _fixWidth(hours, token.length); })
      // `E`: day
      .replace(/E+/g, function (token) { return DAYS[_this.getDay()].substring(0, token.length); })
      // `Z`: timezone abbreviation
      .replace(/Z+/gi, function () { return tzInfo.tzAbbr; });
    },
    toUTCString: function () { return this.toGMTString(); },
    civilToJulianDayNumber: function (y, m, d) {
      var a;
      // Adjust for zero-based JS-style array
      m++;
      if (m > 12) {
        a = parseInt(m/12, 10);
        m = m % 12;
        y += a;
      }
      if (m <= 2) {
        y -= 1;
        m += 12;
      }
      a = Math.floor(y / 100);
      var b = 2 - a + Math.floor(a / 4)
        , jDt = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
      return jDt;
    },
    getLocalOffset: function () {
      return this._dateProxy.getTimezoneOffset();
    }
  };


  timezoneJS.timezone = new function () {
    var _this = this
      , regionMap = {'Etc':'etcetera','EST':'northamerica','MST':'northamerica','HST':'northamerica','EST5EDT':'northamerica','CST6CDT':'northamerica','MST7MDT':'northamerica','PST8PDT':'northamerica','America':['northamerica','southamerica'],'Pacific':'australasia','Atlantic':'europe','Africa':'africa','Indian':'africa','Antarctica':'antarctica','Asia':'asia','Australia':'australasia','Europe':'europe','WET':'europe','CET':'europe','MET':'europe','EET':'europe'}
      , regionExceptions = {'Pacific/Honolulu':'northamerica','Atlantic/Bermuda':'northamerica','Atlantic/Cape_Verde':'africa','Atlantic/St_Helena':'africa','Indian/Kerguelen':'antarctica','Indian/Chagos':'asia','Indian/Maldives':'asia','Indian/Christmas':'australasia','Indian/Cocos':'australasia','America/Danmarkshavn':'europe','America/Scoresbysund':'europe','America/Godthab':'europe','America/Thule':'europe','Asia/Istanbul':'europe','Asia/Yekaterinburg':'europe','Asia/Omsk':'europe','Asia/Novosibirsk':'europe','Asia/Krasnoyarsk':'europe','Asia/Irkutsk':'europe','Asia/Yakutsk':'europe','Asia/Vladivostok':'europe','Asia/Sakhalin':'europe','Asia/Magadan':'europe','Asia/Kamchatka':'europe','Asia/Anadyr':'europe','Africa/Ceuta':'europe','GMT':'etcetera','Europe/Nicosia':'asia'};
    function invalidTZError(t) { throw new Error('Timezone \'' + t + '\' is either incorrect, or not loaded in the timezone registry.'); }
    function builtInLoadZoneFile(fileName, opts) {
      var url = _this.zoneFileBasePath + '/' + fileName;
      return !opts || !opts.async
      ? _this.parseZones(_this.transport({ url : url, async : false }))
      : _this.transport({
        async: true,
        url : url,
        success : function (str) {
          return _this.parseZones(str) && typeof opts.callback === 'function' && opts.callback();
        },
        error : function () {
          throw new Error('Error retrieving \'' + url + '\' zoneinfo files');
        }
      });
    }
    function getRegionForTimezone(tz) {
      var exc = regionExceptions[tz]
        , reg
        , ret;
      if (exc) return exc;
      reg = tz.split('/')[0];
      ret = regionMap[reg];
      // If there's nothing listed in the main regions for this TZ, check the 'backward' links
      if (ret) return ret;
      var link = _this.zones[tz];
      if (typeof link === 'string') {
        return getRegionForTimezone(link);
      }
      // Backward-compat file hasn't loaded yet, try looking in there
      if (!_this.loadedZones.backward) {
        // This is for obvious legacy zones (e.g., Iceland) that don't even have a prefix like 'America/' that look like normal zones
        _this.loadZoneFile('backward');
        return getRegionForTimezone(tz);
      }
      invalidTZError(tz);
    }
    //str has format hh:mm, can be negative
    function parseTimeString(str) {
      var pat = /(\d+)(?::0*(\d*))?(?::0*(\d*))?([wsugz])?$/;
      var hms = str.match(pat);
      hms[1] = parseInt(hms[1], 10);
      hms[2] = hms[2] ? parseInt(hms[2], 10) : 0;
      hms[3] = hms[3] ? parseInt(hms[3], 10) : 0;
      return hms.slice(1, 5);
    }
    //z is something like `[ '-3:44:40', '-', 'LMT', '1911', 'May', '15', '' ]` or `[ '-5:00', '-', 'EST', '1974', 'Apr', '28', '2:00' ]`
    function processZone(z) {
      if (!z[3]) { return; }
      var yea = parseInt(z[3], 10)
        , mon = 11
        , dat = 31;
      //If month is there
      if (z[4]) {
        mon = SHORT_MONTHS[z[4].substr(0, 3)];
        dat = parseInt(z[5], 10) || 1;
      }
      var t = z[6] ? parseTimeString(z[6]) : [0, 0, 0];
      return [yea, mon, dat, t[0], t[1], t[2]];
    }
    function getZone(dt, tz) {
      var utcMillis = typeof dt === 'number' ? dt : new Date(dt).getTime();
      var t = tz;
      var zoneList = _this.zones[t];
      // Follow links to get to an actual zone
      while (typeof zoneList === 'string') {
        t = zoneList;
        zoneList = _this.zones[t];
      }
      if (!zoneList) {
        // Backward-compat file hasn't loaded yet, try looking in there
        if (!_this.loadedZones.backward) {
          //This is for backward entries like 'America/Fort_Wayne' that
          // getRegionForTimezone *thinks* it has a region file and zone
          // for (e.g., America => 'northamerica'), but in reality it's a
          // legacy zone we need the backward file for.
          _this.loadZoneFile('backward');
          return getZone(dt, tz);
        }
        invalidTZError(t);
      }
      if (zoneList.length === 0) {
        throw new Error('No Zone found for \'' + tz + '\' on ' + dt);
      }
      //Do backwards lookup since most use cases deal with newer dates.
      for (var i = zoneList.length - 1; i >= 0; i--) {
        var z = zoneList[i];
        if (z[3] && utcMillis > z[3]) break;
      }
      return zoneList[i+1];
    }
    function getBasicOffset(time) {
      var off = parseTimeString(time)
        , adj = time.charAt(0) === '-' ? -1 : 1;
      off = adj * (((off[0] * 60 + off[1]) * 60 + off[2]) * 1000);
      return off/60/1000;
    }
    function getAdjustedOffset(off, min) {
      return -Math.ceil(min - off);
    }

    //if isUTC is true, date is given in UTC, otherwise it's given
    // in local time (ie. date.getUTC*() returns local time components)
    function getRule(dt, zone, isUTC) {
      var date = typeof dt === 'number' ? new Date(dt) : dt;
      var ruleset = zone[1];
      var basicOffset = zone[0];

      // If the zone has a DST rule like '1:00', create a rule and return it
      // instead of looking it up in the parsed rules
      var staticDstMatch = ruleset.match(/^([0-9]):([0-9][0-9])$/);
      if (staticDstMatch) {
        return [-1000000, 'max', '-', 'Jan', 1, [0, 0, 0], parseInt(staticDstMatch[1],10) * 60 + parseInt(staticDstMatch[2], 10), '-'];
      }

      //Convert a date to UTC. Depending on the 'type' parameter, the date
      // parameter may be:
      //
      // - `u`, `g`, `z`: already UTC (no adjustment).
      //
      // - `s`: standard time (adjust for time zone offset but not for DST)
      //
      // - `w`: wall clock time (adjust for both time zone and DST offset).
      //
      // DST adjustment is done using the rule given as third argument.
      var convertDateToUTC = function (date, type, rule) {
        var offset = 0;

        if (type === 'u' || type === 'g' || type === 'z') { // UTC
          offset = 0;
        } else if (type === 's') { // Standard Time
          offset = basicOffset;
        } else if (type === 'w' || !type) { // Wall Clock Time
          offset = getAdjustedOffset(basicOffset, rule[6]);
        } else {
          throw new Error('unknown type ' + type);
        }
        offset *= 60 * 1000; // to millis

        return new Date(date.getTime() + offset);
      };

      //Step 1:  Find applicable rules for this year.
      //
      //Step 2:  Sort the rules by effective date.
      //
      //Step 3:  Check requested date to see if a rule has yet taken effect this year.  If not,
      //
      //Step 4:  Get the rules for the previous year.  If there isn't an applicable rule for last year, then
      // there probably is no current time offset since they seem to explicitly turn off the offset
      // when someone stops observing DST.
      //
      // FIXME if this is not the case and we'll walk all the way back (ugh).
      //
      //Step 5:  Sort the rules by effective date.
      //Step 6:  Apply the most recent rule before the current time.
      var convertRuleToExactDateAndTime = function (yearAndRule, prevRule) {
        var year = yearAndRule[0]
          , rule = yearAndRule[1];
          // Assume that the rule applies to the year of the given date.

        var hms = rule[5];
        var effectiveDate;

        if (!EXACT_DATE_TIME[year])
          EXACT_DATE_TIME[year] = {};

        // Result for given parameters is already stored
        if (EXACT_DATE_TIME[year][rule])
          effectiveDate = EXACT_DATE_TIME[year][rule];
        else {
          //If we have a specific date, use that!
          if (!isNaN(rule[4])) {
            effectiveDate = new Date(Date.UTC(year, SHORT_MONTHS[rule[3]], rule[4], hms[0], hms[1], hms[2], 0));
          }
          //Let's hunt for the date.
          else {
            var targetDay
              , operator;
            //Example: `lastThu`
            if (rule[4].substr(0, 4) === 'last') {
              // Start at the last day of the month and work backward.
              effectiveDate = new Date(Date.UTC(year, SHORT_MONTHS[rule[3]] + 1, 1, hms[0] - 24, hms[1], hms[2], 0));
              targetDay = SHORT_DAYS[rule[4].substr(4, 3)];
              operator = '<=';
            }
            //Example: `Sun>=15`
            else {
              //Start at the specified date.
              effectiveDate = new Date(Date.UTC(year, SHORT_MONTHS[rule[3]], rule[4].substr(5), hms[0], hms[1], hms[2], 0));
              targetDay = SHORT_DAYS[rule[4].substr(0, 3)];
              operator = rule[4].substr(3, 2);
            }
            var ourDay = effectiveDate.getUTCDay();
            //Go forwards.
            if (operator === '>=') {
              effectiveDate.setUTCDate(effectiveDate.getUTCDate() + (targetDay - ourDay + ((targetDay < ourDay) ? 7 : 0)));
            }
            //Go backwards.  Looking for the last of a certain day, or operator is '<=' (less likely).
            else {
              effectiveDate.setUTCDate(effectiveDate.getUTCDate() + (targetDay - ourDay - ((targetDay > ourDay) ? 7 : 0)));
            }
          }
          EXACT_DATE_TIME[year][rule] = effectiveDate;
        }


        //If previous rule is given, correct for the fact that the starting time of the current
        // rule may be specified in local time.
        if (prevRule) {
          effectiveDate = convertDateToUTC(effectiveDate, hms[3], prevRule);
        }
        return effectiveDate;
      };

      var findApplicableRules = function (year, ruleset) {
        var applicableRules = [];
        for (var i = 0; ruleset && i < ruleset.length; i++) {
          //Exclude future rules.
          if (ruleset[i][0] <= year &&
              (
                // Date is in a set range.
                ruleset[i][1] >= year ||
                // Date is in an 'only' year.
                  (ruleset[i][0] === year && ruleset[i][1] === 'only') ||
                //We're in a range from the start year to infinity.
                    ruleset[i][1] === 'max'
          )
             ) {
               //It's completely okay to have any number of matches here.
               // Normally we should only see two, but that doesn't preclude other numbers of matches.
               // These matches are applicable to this year.
               applicableRules.push([year, ruleset[i]]);
             }
        }
        return applicableRules;
      };

      var compareDates = function (a, b, prev) {
        var year, rule;
        if (!(a instanceof Date)) {
          year = a[0];
          rule = a[1];
          a = (!prev && EXACT_DATE_TIME[year] && EXACT_DATE_TIME[year][rule])
            ? EXACT_DATE_TIME[year][rule]
            : convertRuleToExactDateAndTime(a, prev);
        } else if (prev) {
          a = convertDateToUTC(a, isUTC ? 'u' : 'w', prev);
        }
        if (!(b instanceof Date)) {
          year = b[0];
          rule = b[1];
          b = (!prev && EXACT_DATE_TIME[year] && EXACT_DATE_TIME[year][rule]) ? EXACT_DATE_TIME[year][rule]
            : convertRuleToExactDateAndTime(b, prev);
        } else if (prev) {
          b = convertDateToUTC(b, isUTC ? 'u' : 'w', prev);
        }
        a = Number(a);
        b = Number(b);
        return a - b;
      };

      var year = date.getUTCFullYear();
      var applicableRules;

      applicableRules = findApplicableRules(year, _this.rules[ruleset]);
      applicableRules.push(date);
      //While sorting, the time zone in which the rule starting time is specified
      // is ignored. This is ok as long as the timespan between two DST changes is
      // larger than the DST offset, which is probably always true.
      // As the given date may indeed be close to a DST change, it may get sorted
      // to a wrong position (off by one), which is corrected below.
      applicableRules.sort(compareDates);

      //If there are not enough past DST rules...
      if (_arrIndexOf.call(applicableRules, date) < 2) {
        applicableRules = applicableRules.concat(findApplicableRules(year-1, _this.rules[ruleset]));
        applicableRules.sort(compareDates);
      }
      var pinpoint = _arrIndexOf.call(applicableRules, date);
      if (pinpoint > 1 && compareDates(date, applicableRules[pinpoint-1], applicableRules[pinpoint-2][1]) < 0) {
        //The previous rule does not really apply, take the one before that.
        return applicableRules[pinpoint - 2][1];
      } else if (pinpoint > 0 && pinpoint < applicableRules.length - 1 && compareDates(date, applicableRules[pinpoint+1], applicableRules[pinpoint-1][1]) > 0) {

        //The next rule does already apply, take that one.
        return applicableRules[pinpoint + 1][1];
      } else if (pinpoint === 0) {
        //No applicable rule found in this and in previous year.
        return null;
      }
      return applicableRules[pinpoint - 1][1];
    }
    function getAbbreviation(zone, rule) {
      var base = zone[2];
      if (base.indexOf('%s') > -1) {
        var repl;
        if (rule) {
          repl = rule[7] === '-' ? '' : rule[7];
        }
        //FIXME: Right now just falling back to Standard --
        // apparently ought to use the last valid rule,
        // although in practice that always ought to be Standard
        else {
          repl = 'S';
        }
        return base.replace('%s', repl);
      } else if (base.indexOf('/') > -1) {
        //Chose one of two alternative strings.
        return base.split('/', 2)[rule ? (rule[6] ? 1 : 0) : 0];
      }
      return base;
    }

    this.zoneFileBasePath = null;
    this.zoneFiles = ['africa', 'antarctica', 'asia', 'australasia', 'backward', 'etcetera', 'europe', 'northamerica', 'pacificnew', 'southamerica'];
    this.loadingSchemes = {
      PRELOAD_ALL: 'preloadAll',
      LAZY_LOAD: 'lazyLoad',
      MANUAL_LOAD: 'manualLoad'
    };
    this.getRegionForTimezone = getRegionForTimezone;
    this.loadingScheme = this.loadingSchemes.LAZY_LOAD;
    this.loadedZones = {};
    this.zones = {};
    this.rules = {};

    this.init = function (o) {
      var opts = { async: true }
        , def = this.loadingScheme === this.loadingSchemes.PRELOAD_ALL
          ? this.zoneFiles
          : (this.defaultZoneFile || 'northamerica');
      //Override default with any passed-in opts
      for (var p in o) {
        opts[p] = o[p];
      }
      return this.loadZoneFiles(def, opts);
    };

    //Get a single zone file, or all files in an array
    this.loadZoneFiles = function(fileNames, opts) {
      var callbackFn
        , done = 0;
      if (typeof fileNames === 'string') {
        return this.loadZoneFile(fileNames, opts);
      }
      //Wraps callback function in another one that makes
      // sure all files have been loaded.
      opts = opts || {};
      callbackFn = opts.callback;
      opts.callback = function () {
        done++;
        (done === fileNames.length) && typeof callbackFn === 'function' && callbackFn();
      };
      for (var i = 0; i < fileNames.length; i++) {
        this.loadZoneFile(fileNames[i], opts);
      }
    };
    //Get the zone files via XHR -- if the sync flag
    // is set to true, it's being called by the lazy-loading
    // mechanism, so the result needs to be returned inline.
    this.loadZoneFile = function (fileName, opts) {
      if (typeof this.zoneFileBasePath === 'undefined') {
        throw new Error('Please define a base path to your zone file directory -- timezoneJS.timezone.zoneFileBasePath.');
      }
      //Ignore already loaded zones.
      if (this.loadedZones[fileName]) {
        return;
      }
      this.loadedZones[fileName] = true;
      return builtInLoadZoneFile(fileName, opts);
    };
    this.loadZoneJSONData = function (url, sync) {
      var processData = function (data) {
        data = eval('('+ data +')');
        for (var z in data.zones) {
          _this.zones[z] = data.zones[z];
        }
        for (var r in data.rules) {
          _this.rules[r] = data.rules[r];
        }
      };
      return sync
      ? processData(_this.transport({ url : url, async : false }))
      : _this.transport({ url : url, success : processData });
    };
    this.loadZoneDataFromObject = function (data) {
      if (!data) { return; }
      for (var z in data.zones) {
        _this.zones[z] = data.zones[z];
      }
      for (var r in data.rules) {
        _this.rules[r] = data.rules[r];
      }
    };
    this.getAllZones = function () {
      var arr = [];
      for (var z in this.zones) { arr.push(z); }
      return arr.sort();
    };
    this.parseZones = function (str) {

      if (!str) {
        return false;
      }

      var lines = str.split('\n')
        , arr = []
        , chunk = ''
        , l
        , zone = null
        , rule = null;
      for (var i = 0; i < lines.length; i++) {
        l = lines[i];
        if (l.match(/^\s/)) {
          l = 'Zone ' + zone + l;
        }
        l = l.split('#')[0];
        if (l.length > 3) {
          arr = l.split(/\s+/);
          chunk = arr.shift();
          //Ignore Leap.
          switch (chunk) {
            case 'Zone':
              zone = arr.shift();
              if (!_this.zones[zone]) {
                _this.zones[zone] = [];
              }
              if (arr.length < 3) break;
              //Process zone right here and replace 3rd element with the processed array.
              arr.splice(3, arr.length, processZone(arr));
              if (arr[3]) arr[3] = Date.UTC.apply(null, arr[3]);
              arr[0] = -getBasicOffset(arr[0]);
              _this.zones[zone].push(arr);
              break;
            case 'Rule':
              rule = arr.shift();
              if (!_this.rules[rule]) {
                _this.rules[rule] = [];
              }
              //Parse int FROM year and TO year
              arr[0] = parseInt(arr[0], 10);
              arr[1] = parseInt(arr[1], 10) || arr[1];
              //Parse time string AT
              arr[5] = parseTimeString(arr[5]);
              //Parse offset SAVE
              arr[6] = getBasicOffset(arr[6]);
              _this.rules[rule].push(arr);
              break;
            case 'Link':
              //No zones for these should already exist.
              if (_this.zones[arr[1]]) {
                throw new Error('Error with Link ' + arr[1] + '. Cannot create link of a preexisted zone.');
              }
              //Create the link.
              //Links are saved as strings that are the keys
              //of their referenced values.
              //Ex: "US/Central": "America/Chicago"
              if (isNaN(arr[0])) {
                _this.zones[arr[1]] = arr[0];
              }
              else {
                _this.zones[arr[1]] = parseInt(arr[0], 10);
              }
              break;
          }
        }
      }
      return true;
    };
    //Expose transport mechanism and allow overwrite.
    this.transport = _transport;
    this.getTzInfo = function (dt, tz, isUTC) {
      //Lazy-load any zones not yet loaded.
      if (this.loadingScheme === this.loadingSchemes.LAZY_LOAD) {
        //Get the correct region for the zone.
        var zoneFile = getRegionForTimezone(tz);
        if (!zoneFile) {
          throw new Error('Not a valid timezone ID.');
        }
        //Get the file and parse it -- use synchronous XHR.
        this.loadZoneFiles(zoneFile);
      }
      var z = getZone(dt, tz);
      var off = +z[0];
      //See if the offset needs adjustment.
      var rule = getRule(dt, z, isUTC);
      if (rule) {
        off = getAdjustedOffset(off, rule[6]);
      }
      var abbr = getAbbreviation(z, rule);
      return { tzOffset: off, tzAbbr: abbr };
    };
  }();
}).call(typeof window !== "undefined" ? window : this);

//! moment.js
//! version : 2.8.4
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {
    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = '2.8.4',
        // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        round = Math.round,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for locale config files
        locales = {},

        // extra moment internal properties (plugins register props here)
        momentProperties = [],

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenOffsetMs = /[\+\-]?\d+/, // 1234567890123
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-15', '30']
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            Q : 'quarter',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
            s: 45,  // seconds to minute
            m: 45,  // minutes to hour
            h: 22,  // hours to day
            d: 26,  // days to month
            M: 11   // months to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.localeData().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.localeData().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.localeData().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.localeData().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            x    : function () {
                return this.valueOf();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        deprecations = {},

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error('Implement me');
        }
    }

    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function printMsg(msg) {
        if (moment.suppressDeprecationWarnings === false &&
                typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                printMsg(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            printMsg(msg);
            deprecations[name] = true;
        }
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.localeData().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Locale() {
    }

    // Moment prototype object
    function Moment(config, skipOverflow) {
        if (skipOverflow !== false) {
            checkOverflow(config);
        }
        copyConfig(this, config);
        this._d = new Date(+config._d);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = moment.localeData();

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = makeAs(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = moment.duration(val, period);
            addOrSubtractDurationFromMoment(this, dur, direction);
            return this;
        };
    }

    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' ||
            input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment._locale[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 24 ||
                    (m._a[HOUR] === 24 && (m._a[MINUTE] !== 0 ||
                                           m._a[SECOND] !== 0 ||
                                           m._a[MILLISECOND] !== 0)) ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0 &&
                    m._pf.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && hasModule) {
            try {
                oldLocale = moment.locale();
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                moment.locale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (moment.isMoment(input) || isDate(input) ?
                    +input : +moment(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            moment.updateOffset(res, false);
            return res;
        } else {
            return moment(input).local();
        }
    }

    /************************************
        Locale
    ************************************/


    extend(Locale.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
            // Lenient ordinal parsing accepts just a number in addition to
            // number + (possibly) stuff coming from _ordinalParseLenient.
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
        },

        _months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName, format, strict) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = moment.utc([2000, i]);
                if (strict && !this._longMonthsParse[i]) {
                    this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                    this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                }
                if (!strict && !this._monthsParse[i]) {
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                    return i;
                } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                    return i;
                } else if (!strict && this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LTS : 'h:mm:ss A',
            LT : 'h:mm A',
            L : 'MM/DD/YYYY',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY LT',
            LLLL : 'dddd, MMMM D, YYYY LT'
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom, now) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom, [now]) : output;
        },

        _relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },

        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },

        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace('%d', number);
        },
        _ordinal : '%d',
        _ordinalParse : /\d{1,2}/,

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'Q':
            return parseTokenOneDigit;
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) {
                return parseTokenOneDigit;
            }
            /* falls through */
        case 'SS':
            if (strict) {
                return parseTokenTwoDigits;
            }
            /* falls through */
        case 'SSS':
            if (strict) {
                return parseTokenThreeDigits;
            }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return config._locale._meridiemParse;
        case 'x':
            return parseTokenOffsetMs;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        case 'Do':
            return strict ? config._locale._ordinalParse : config._locale._ordinalParseLenient;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || '';
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // QUARTER
        case 'Q':
            if (input != null) {
                datePartArray[MONTH] = (toInt(input) - 1) * 3;
            }
            break;
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = config._locale.monthsParse(input, token, config._strict);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        case 'Do' :
            if (input != null) {
                datePartArray[DATE] = toInt(parseInt(
                            input.match(/\d{1,2}/)[0], 10));
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = config._locale.isPM(input);
            break;
        // HOUR
        case 'h' : // fall through to hh
        case 'hh' :
            config._pf.bigHour = true;
            /* falls through */
        case 'H' : // fall through to HH
        case 'HH' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX OFFSET (MILLISECONDS)
        case 'x':
            config._d = new Date(toInt(input));
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        // WEEKDAY - human
        case 'dd':
        case 'ddd':
        case 'dddd':
            a = config._locale.weekdaysParse(input);
            // if we didn't get a weekday name, mark the date as invalid
            if (a != null) {
                config._w = config._w || {};
                config._w['d'] = a;
            } else {
                config._pf.invalidWeekday = input;
            }
            break;
        // WEEK, WEEK DAY - numeric
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gggg':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = toInt(input);
            }
            break;
        case 'gg':
        case 'GG':
            config._w = config._w || {};
            config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual zone can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day || normalizedInput.date,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
            config._pf.bigHour = undefined;
        }
        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }
        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += 'Z';
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function makeDateFromInput(config) {
        var input = config._i, matched;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            dateFromConfig(config);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = moment.duration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            years = round(duration.as('y')),

            args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < relativeTimeThresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < relativeTimeThresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

        args[2] = withoutSuffix;
        args[3] = +posNegDuration > 0;
        args[4] = locale;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || moment.localeData(config._l);

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (moment.isMoment(input)) {
            return new Moment(input, true);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        res = new Moment(config);
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    moment = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = locale;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso,
            diffRes;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        } else if (typeof duration === 'object' &&
                ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(moment(duration.from), moment(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {};

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function (threshold, limit) {
        if (relativeTimeThresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return relativeTimeThresholds[threshold];
        }
        relativeTimeThresholds[threshold] = limit;
        return true;
    };

    moment.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        function (key, value) {
            return moment.locale(key, value);
        }
    );

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    moment.locale = function (key, values) {
        var data;
        if (key) {
            if (typeof(values) !== 'undefined') {
                data = moment.defineLocale(key, values);
            }
            else {
                data = moment.localeData(key);
            }

            if (data) {
                moment.duration._locale = moment._locale = data;
            }
        }

        return moment._locale._abbr;
    };

    moment.defineLocale = function (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            moment.locale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    };

    moment.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        function (key) {
            return moment.localeData(key);
        }
    );

    // returns locale data
    moment.localeData = function (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return moment._locale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && hasOwnProp(obj, '_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                if ('function' === typeof Date.prototype.toISOString) {
                    // native implementation is ~50x faster, use it when we can
                    return this.toDate().toISOString();
                } else {
                    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                }
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {
            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function (keepLocalTime) {
            return this.zone(0, keepLocalTime);
        },

        local : function (keepLocalTime) {
            if (this._isUTC) {
                this.zone(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.add(this._dateTzOffset(), 'm');
                }
            }
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },

        add : createAdder(1, 'add'),

        subtract : createAdder(-1, 'subtract'),

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output, daysAdjust;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                daysAdjust = (this - moment(this).startOf('month')) -
                    (that - moment(that).startOf('month'));
                // same as above but with zones, to negate all dst
                daysAdjust -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4;
                output += daysAdjust / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.localeData().calendar(format, this, moment(now)));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf : function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond') {
                return this;
            }
            return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
        },

        isAfter: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this > +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return inputMs < +this.clone().startOf(units);
            }
        },

        isBefore: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this < +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return +this.clone().endOf(units) < inputMs;
            }
        },

        isSame: function (input, units) {
            var inputMs;
            units = normalizeUnits(units || 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this === +input;
            } else {
                inputMs = +moment(input);
                return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
            }
        },

        min: deprecate(
                 'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[zone(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist int zone
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        zone : function (input, keepLocalTime) {
            var offset = this._offset || 0,
                localAdjust;
            if (input != null) {
                if (typeof input === 'string') {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = this._dateTzOffset();
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.subtract(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(offset - input, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
            } else {
                return this._isUTC ? offset : this._dateTzOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? 'UTC' : '';
        },

        zoneName : function () {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        week : function (input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear : function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear : function () {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        locale : function (key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = moment.localeData(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        },

        lang : deprecate(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        ),

        localeData : function () {
            return this._locale;
        },

        _dateTzOffset : function () {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return Math.round(this._d.getTimezoneOffset() / 15) * 15;
        }
    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absRound(years / 4) -
        //     absRound(years / 100) + absRound(years / 400);
        return years * 146097 / 400;
    }

    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years = 0;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);

            // Accurately convert days to years, assume start from year 0.
            years = absRound(daysToYears(days));
            days -= absRound(yearsToDays(years));

            // 30 days to a month
            // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
            months += absRound(days / 30);
            days %= 30;

            // 12 months -> 1 year
            years += absRound(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;
        },

        abs : function () {
            this._milliseconds = Math.abs(this._milliseconds);
            this._days = Math.abs(this._days);
            this._months = Math.abs(this._months);

            this._data.milliseconds = Math.abs(this._data.milliseconds);
            this._data.seconds = Math.abs(this._data.seconds);
            this._data.minutes = Math.abs(this._data.minutes);
            this._data.hours = Math.abs(this._data.hours);
            this._data.months = Math.abs(this._data.months);
            this._data.years = Math.abs(this._data.years);

            return this;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var output = relativeTime(this, !withSuffix, this.localeData());

            if (withSuffix) {
                output = this.localeData().pastFuture(+this, output);
            }

            return this.localeData().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            var days, months;
            units = normalizeUnits(units);

            if (units === 'month' || units === 'year') {
                days = this._days + this._milliseconds / 864e5;
                months = this._months + daysToYears(days) * 12;
                return units === 'month' ? months : months / 12;
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + Math.round(yearsToDays(this._months / 12));
                switch (units) {
                    case 'week': return days / 7 + this._milliseconds / 6048e5;
                    case 'day': return days + this._milliseconds / 864e5;
                    case 'hour': return days * 24 + this._milliseconds / 36e5;
                    case 'minute': return days * 24 * 60 + this._milliseconds / 6e4;
                    case 'second': return days * 24 * 60 * 60 + this._milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                    default: throw new Error('Unknown unit ' + units);
                }
            }
        },

        lang : moment.fn.lang,
        locale : moment.fn.locale,

        toIsoString : deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead ' +
            '(notice the capitals)',
            function () {
                return this.toISOString();
            }
        ),

        toISOString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        },

        localeData : function () {
            return this._locale;
        }
    });

    moment.duration.fn.toString = moment.duration.fn.toISOString;

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    for (i in unitMillisecondFactors) {
        if (hasOwnProp(unitMillisecondFactors, i)) {
            makeDurationGetter(i.toLowerCase());
        }
    }

    moment.duration.fn.asMilliseconds = function () {
        return this.as('ms');
    };
    moment.duration.fn.asSeconds = function () {
        return this.as('s');
    };
    moment.duration.fn.asMinutes = function () {
        return this.as('m');
    };
    moment.duration.fn.asHours = function () {
        return this.as('h');
    };
    moment.duration.fn.asDays = function () {
        return this.as('d');
    };
    moment.duration.fn.asWeeks = function () {
        return this.as('weeks');
    };
    moment.duration.fn.asMonths = function () {
        return this.as('M');
    };
    moment.duration.fn.asYears = function () {
        return this.as('y');
    };

    /************************************
        Default Locale
    ************************************/


    // Set default locale, other locale will inherit from English.
    moment.locale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LOCALES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    'Accessing Moment through the global scope is ' +
                    'deprecated, and will be removed in an upcoming ' +
                    'release.',
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === 'function' && define.amd) {
        define('moment', function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);

/* global config: true */
/* exported config */
if (typeof angular !== "undefined") {
  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "locales/translation_")
    .constant("LOCALES_SUFIX", ".json");
}

if (typeof config === "undefined") {
  var config = {
    zoneFileBasePath: "http://s3.amazonaws.com/widget-world-clock/0.1.0/dist/timezone"
  };
}

/* global gadgets, config, timezoneJS */

var RiseVision = RiseVision || {};
RiseVision.WorldClock = {};

RiseVision.WorldClock = (function (gadgets, config) {
  "use strict";

  var prefs = new gadgets.Prefs(),
    clockType = "digital",
    params = null,
    analog = null,
    digital = null;

  /*
   *  Private Methods
   */
  function init() {
    var $title = "",
      $container = $(".container"),
      placement = params.placement;

    // Title
    if (params.showTitle) {
      $title = $("<div id='title' class='title'></div>");
      $title.text(params.title);
      $title.addClass(clockType + " " + placement);
      $title.css("padding", params.padding + "px");

      if ((placement === "top") || (placement === "bottom")) {
        $title.addClass("halign-" + params.horizontalAlign);

        if (placement === "top") {
          $container.prepend($title);
        }
        else {
          $container.append($title);
        }
      }
      else {
        $title.addClass("valign-" + params.verticalAlign);

        if (params.verticalAlign === "middle") {
          $title.css("line-height", params.rsH - params.padding * 2 + "px");
          $container.css("text-align", "left");
        }

        $container.prepend($title);
      }
    }

    timezoneJS.timezone.zoneFileBasePath = config.zoneFileBasePath;
    timezoneJS.timezone.init({ async : false });

    if (clockType === "analog") {
      analog = new RiseVision.WorldClock.Analog(params);
      analog.init();
      $(".digital-clock").hide();
    }
    else {
      digital = new RiseVision.WorldClock.Digital(params);
      digital.init();
      $(".analog-clock").hide();
    }

    document.body.style.background = params.background.color;

    ready();
  }

  function ready() {
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true,
      true, true, true, false);
  }

  /*
   *  Public Methods
   */
  function setParams(names, values) {
    if (Array.isArray(names) && names.length > 0 && names[0] === "additionalParams") {
      if (Array.isArray(values) && values.length > 0) {
        params = JSON.parse(values[0]);

        clockType = params.clockType;
        params.rsW = prefs.getString("rsW");
        params.rsH = prefs.getString("rsH");
        $(".container").width(params.rsW).height(params.rsH);

        // Load fonts.
        var fontSettings = [
          {
            "class": "title",
            "fontSetting": params.titleFont
          },
          {
            "class": "analog-clock",
            "fontSetting": params.analogFont
          },
          {
            "class": "digital-clock",
            "fontSetting": params.digitalFont
          }
        ];

        RiseVision.Common.Utilities.loadFonts(fontSettings);
        init();
      }
    }
  }

  function play() {
    if (clockType === "analog") {
      analog.drawAnalog();
    }
    else {
      digital.drawDigital();
    }
  }

  function pause() {
    if (clockType === "analog") {
      analog.pause();
    }
    else {
      digital.pause();
    }
  }

  function stop() {
    /* Ideally, the Widget should destroy itself, but unable to do so right now
      since `stop` is being called by RVA instead of `pause` when it's the only
      item in a Playlist. */
    pause();
  }

  return {
    "setParams": setParams,
    "play": play,
    "pause": pause,
    "stop": stop
  };
})(gadgets, config);

/* global timezoneJS */

var RiseVision = RiseVision || {};
RiseVision.WorldClock = RiseVision.WorldClock || {};
RiseVision.WorldClock.Analog = {};

RiseVision.WorldClock.Analog = function(params) {
  "use strict";
  var timeoutID = 0,
    clockSize = 0,
    canvasFont = "";

  /*
   *  Public Methods
   */
  function init() {
    var $container = $(".container"),
      $title = $("#title"),
      $analog = $(".analog-clock"),
      canvas = document.getElementById("analog"),
      placement = params.placement,
      rsW = params.rsW,
      rsH = params.rsH,
      analogFont = params.analogFont;

    $container.width(rsW).height(rsH);

    // Calculate dimensions of clock canvas. Must be a square.
    if (params.showTitle) {
      if ((placement === "top") || (placement === "bottom")) {
        clockSize = rsH - $title.outerHeight();

        if (clockSize > rsW) {
          clockSize = rsW;
        }

        canvas.width = clockSize;
        canvas.height = clockSize;

        $container.addClass("halign-center");
      }
      else {
        if (params.verticalAlign === "middle") {
          clockSize = rsW - $title.outerWidth();

          if (clockSize > rsH) {
            clockSize = rsH;
          }

          // Vertical alignment
          $analog.addClass("valign");
          $analog.css("margin-top", -clockSize / 2 + "px");
        }
        else {
          clockSize = rsH - $title.outerHeight();

          if (clockSize > rsW) {
            clockSize = rsW;
          }

          $container.addClass("halign-center");
        }

        canvas.width = clockSize;
        canvas.height = clockSize;
      }
    }
    else {
      // Ensure clock's canvas is a square.
      // Landscape
      if (rsW > rsH) {
        clockSize = rsH;

        // Center horizontally.
        $container.addClass("halign-center");
      }
      // Portrait
      else if (rsW < rsH) {
        clockSize = rsW;

        // Center vertically.
        $analog.css("margin-top", (rsH / 2) - (clockSize / 2) + "px");
      }
      else {
        clockSize = rsW;
      }

      canvas.width = clockSize;
      canvas.height = clockSize;
    }

    // Set canvas font.
    canvasFont = analogFont.bold ? "bold " : "";
    canvasFont += analogFont.italic ? "italic " : "";
    canvasFont += analogFont.size + "px ";
    canvasFont += analogFont.font.family;
  }

  /* This function is adapted from code located at http://www.neilwallis.com/projects/html5/clock/ */
  function draw() {
    var ang = 0,
      sang = 0,
      cang = 0,
      sx = 0,
      sy = 0,
      ex = 0,
      ey = 0,
      nx = 0,
      ny = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
      c2d = null,
      now = null,
      canvas = document.getElementById("analog");

    if (canvas.getContext) {
      c2d = canvas.getContext("2d");

      c2d.clearRect(0, 0, clockSize, clockSize);

      c2d.font = canvasFont;
      c2d.textBaseline = "middle";
      c2d.textAlign = "center";
      c2d.lineWidth = 1;
      c2d.save();

      // Frame and face
      c2d.strokeStyle = params.frameColor;
      c2d.fillStyle = params.faceColor;
      c2d.lineWidth = params.frameWidth;
      c2d.beginPath();
      c2d.arc(clockSize / 2, clockSize / 2, (clockSize / 2) - (params.frameWidth / 2), 0, Math.PI * 2, true);
      c2d.fill();
      c2d.stroke();

      c2d.strokeStyle = params.analogFont.color;
      c2d.fillStyle = params.analogFont.color;
      c2d.save();

      c2d.translate(clockSize / 2, clockSize / 2);

      // Ticks and numerals
      for (var i = 1; i <= 60; i++) {
        ang = Math.PI / 30 * i;
        sang = Math.sin(ang);
        cang = Math.cos(ang);

        // If modulus of divide by 5 is zero then draw an hour marker/numeral.
        if (i % 5 === 0) {
          c2d.lineWidth = params.hourTickWidth;
          sx = sang * clockSize / 2.9;
          sy = cang * -clockSize / 2.9;
          ex = sang * clockSize / 2.3;
          ey = cang * -clockSize / 2.3;
          nx = sang * clockSize / 3.55;
          ny = cang * -clockSize / 3.55;

          c2d.fillText(i / 5, nx, ny);
        }
        // Minute marker
        else {
          if (params.minuteTickWidth > 0) {
            c2d.lineWidth = params.minuteTickWidth;
            sx = sang * clockSize / 2.5;
            sy = cang * clockSize / 2.5;
            ex = sang * clockSize / 2.3;
            ey = cang * clockSize / 2.3;
          }
        }

        c2d.beginPath();
        c2d.moveTo(sx, sy);
        c2d.lineTo(ex, ey);
        c2d.stroke();
      }

      // Time
      now = params.useLocalTime ? new Date() : new timezoneJS.Date(new Date(), params.timeZone);
      hours = now.getHours();
      minutes = now.getMinutes();
      seconds = now.getSeconds();

      c2d.strokeStyle = params.handColor;
      c2d.lineWidth = params.handWidth;
      c2d.save();

      /* Draw clock pointers but this time rotate the canvas rather than
       calculating x/y start/end positions. */

      // Hour hand
      c2d.rotate(Math.PI / 6 * (hours + (minutes / 60) + (seconds / 3600)));
      c2d.beginPath();
      c2d.moveTo(0, clockSize / 30);
      c2d.lineTo(0, -clockSize / 5);
      c2d.stroke();
      c2d.restore();
      c2d.save();

      // Minute hand
      c2d.rotate(Math.PI / 30 * (minutes + (seconds / 60)));
      c2d.beginPath();
      c2d.moveTo(0, clockSize / 15);
      c2d.lineTo(0, -clockSize / 2.5);
      c2d.stroke();
      c2d.restore();
      c2d.save();

      // Second hand
      if (params.showSecondHand) {
        c2d.rotate(Math.PI / 30 * seconds);
        c2d.strokeStyle = params.secondHandColor;
        c2d.lineWidth = params.secondHandWidth;
        c2d.beginPath();
        c2d.moveTo(0, clockSize / 15);
        c2d.lineTo(0, -clockSize / 2.5);
        c2d.stroke();
      }

      c2d.restore();

      /* Additional restore to go back to state before translate.
         Alternative would be to simply reverse the original translate. */
      c2d.restore();

      timeoutID = setTimeout(function() {
        draw();
      }, 1000);
    }
  }

  function pause() {
    clearTimeout(timeoutID);
  }

  return {
    "init": init,
    "drawAnalog": draw,
    "pause": pause
  };
};

/* global timezoneJS, moment */

var RiseVision = RiseVision || {};
RiseVision.WorldClock = RiseVision.WorldClock || {};
RiseVision.WorldClock.Digital = {};

RiseVision.WorldClock.Digital = function(params) {
  "use strict";

  var timeoutID,
    rsH = params.rsH,
    format = params.format,
    placement = params.placement,
    $title = $("#title"),
    $digitalClock = $(".digital-clock");

  /*
   *  Private Methods
   */
  function setBodyScale() {
    var fontSize = parseInt($digitalClock.css("font-size")),
      width = params.rsW;

    if (((placement === "left") || (placement === "right")) && (params.verticalAlign === "middle")) {
      if ($title.length > 0) {
        width = width - $("#title").outerWidth();
      }
    }

    // Use 00:00:00 AM format to create widest time possible.
    if (format === "standard-seconds") {
      $digitalClock.html("00:00:00 AM");
    }
    else if (format === "standard") {
      $digitalClock.html("00:00 AM");
    }
    else if (format === "military-seconds") {
      $digitalClock.html("00:00:00");
    }
    else {
      $digitalClock.html("00:00");
    }

    // Continually increase the font size until the content grows bigger than the Placeholder.
    while ((document.getElementById("digital").offsetWidth < width) &&
      (document.getElementById("digital").offsetHeight < rsH)) {
      $digitalClock.css("font-size", ++fontSize);
    }

    // It's too big; back up one.
    $digitalClock.css("font-size", --fontSize);
  }

  /*
   *  Public Methods
   */
  function init() {
    setBodyScale();

    // Vertical alignment
    if (params.showTitle) {
      if ((placement === "top") || (placement === "bottom")) {
        if ($title.length > 0) {
          $digitalClock.css("line-height", rsH - $title.outerHeight() + "px");
        }
        else {
          $digitalClock.css("line-height", rsH + "px");
        }
      }
      else {
        $digitalClock.css("line-height", rsH + "px");
      }
    }
    else {
      $digitalClock.css("line-height", rsH + "px");
    }
  }

  function draw() {
    var now = params.useLocalTime ? new Date() : new timezoneJS.Date(new Date(), params.timeZone);

    if (format === "standard-seconds") {
      $digitalClock.html(moment(now).format("h:mm:ss A"));
    }
    else if (format === "standard") {
      $digitalClock.html(moment(now).format("h:mm A"));
    }
    else if (format === "military-seconds") {
      $digitalClock.html(moment(now).format("H:mm:ss"));
    }
    else {
      $digitalClock.html(moment(now).format("H:mm"));
    }

    timeoutID = setTimeout(function() {
      draw();
    }, 1000);
  }

  function pause() {
    clearTimeout(timeoutID);
  }

  return {
    "init": init,
    "drawDigital": draw,
    "pause": pause
  };
};

/* global RiseVision, gadgets */
(function (window, document, gadgets) {
  "use strict";

  var prefs = new gadgets.Prefs(),
    id = prefs.getString("id");

  window.oncontextmenu = function () {
    return false;
  };

  document.body.onmousedown = function() {
    return false;
  };

  function play() {
    RiseVision.WorldClock.play();
  }

  function pause() {
    RiseVision.WorldClock.pause();
  }

  function stop() {
    RiseVision.WorldClock.stop();
  }

  if (id) {
    gadgets.rpc.register("rscmd_play_" + id, play);
    gadgets.rpc.register("rscmd_pause_" + id, pause);
    gadgets.rpc.register("rscmd_stop_" + id, stop);

    gadgets.rpc.register("rsparam_set_" + id, RiseVision.WorldClock.setParams);
    gadgets.rpc.call("", "rsparam_get", null, id, ["additionalParams"]);
  }
})(window, document, gadgets);

/* jshint ignore:start */
var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-57092159-8']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();
/* jshint ignore:end */
