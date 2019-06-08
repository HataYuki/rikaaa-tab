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
        console.log('loaded'); // tab.index = 2;
        // tab.horizon = true;
        // tab.opmin = 0.5;

        tab.addEventListener('onfade', function (e) {
          console.log('fade');
          console.log("seed is : ".concat(e.detail.seed));
          console.log("fade is : ".concat(e.detail.fade));
        });
      });
      var parent = tab.parentNode; // parent.removeChild(tab);
    });

}());
