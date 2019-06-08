/*jshint esversion: 8 */
import ready from './assets/js/_Domready';

ready(() => {
    const tab = document.getElementById('ex1');
    tab.addEventListener('load', () => {
        console.log('loaded');
        // tab.index = 2;
        // tab.horizon = true;
        // tab.opmin = 0.5;
        tab.addEventListener('onfade', e => {
            console.log('fade');
            console.log(`seed is : ${e.detail.seed}`);
            console.log(`fade is : ${e.detail.fade}`);
        });
    });
    const parent = tab.parentNode;
    // parent.removeChild(tab);
});




