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
