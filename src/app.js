/*jshint esversion: 8 */
import ready from './assets/js/_Domready';

ready(() => {
    var tab = document.getElementById('ex1');
    tab.addEventListener('load', function() {
        console.log('loaded');
        tab.next(); // Change next tab
        // tab.prev(); // Change prev tab
        tab.addEventListener('onfade', function(e){
            console.log('fade');
            console.log("seed is : " + e.detail.seed); //return seed value.
            console.log("fade is : " + e.detail.fade);  //return array. This is switching status of each tab.
        });
    });
});




