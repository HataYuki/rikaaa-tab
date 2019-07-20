/**
 * @license
 * rikaaa-tab.js
 *
 * Generated : 2019-07-21
 * Version : 1.0.3
 * Author : rikaaa.org | Yuki Hata
 * Url : http://rikaaa.org
 *
 *
 * The MIT License (MIT)
 *
 * Copyright 2019 rikaaa.org | Yuki Hata
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function () {
    'use strict';

    var ready = (function (fn) {
      if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        setTimeout(function () {
          fn();
        }, 0);
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    });

    /*jshint esversion: 8 */
    ready(function () {
      var tab = document.getElementById('ex1');
      tab.addEventListener('load', function () {
        console.log('loaded');
        tab.next(); // Change next tab
        // tab.prev(); // Change prev tab

        tab.addEventListener('onfade', function (e) {
          console.log('fade');
          console.log("seed is : " + e.detail.seed); //return seed value.

          console.log("fade is : " + e.detail.fade); //return array. This is switching status of each tab.
        });
      });
    });

}());
