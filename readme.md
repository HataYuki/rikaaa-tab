# `<rikaaa-tab>`
The Custom Element in order to impliment simple tab function.

![](rikaaa-tab.gif)



## Installation
```bash
#script tag
<script src="rikaaa-tab.js"></script>

#esm
import 'rikaaa-tab.js'
```
If you want to use browser that does not support webcomponent.
```bash
#script tag
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
<script src="node_modules/@webcomponents/shadycss/scoping-shim.min.js"></script>

#ems
import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import '@webcomponents/shadycss/scoping-shim.min';
```
## Usage 
```bash
#HTML
<rikaaa-tab>
    <button slot="tab">button1</button>
    <button slot="tab">button2</button>
    <button slot="tab">button3</button>
    <div slot="bar"><span class="bar">seek bar</span></div>
    <section>panel 1:write in your contents 1</section>
    <section>panel 2:write in your contents 2</section>
    <section>panel 3:write in your contents 3</section>
</rikaaa-tab>
```
* elective tag
    * ``` bash
        <button slot="tab">button1</button>
         ```
    * ``` bash
        <div slot="bar"><span class="bar">seek bar</span></div>
         ```
* require tag
    * ``` bash
        <section>panel 1:write in your contents 1</section>
         ```

## Options
```bash
#Attribute
<rikaaa-tab seekbarh="3" seed="0" index="0" tabchangeduration="200" horizon="false" opmin="0">
```
1. seekbarh="int" : The parameter to set the height of SeekBar. default value is 3.

1. seed="float(0. 〜 1.)" : The parameter to set the condition of switching of tabs by floating decimal point. The range of parameter is 0 to 1. default value is 0.

1. index="int(0 〜 panel length)" : The parameter to set the condition of switching of tabs by integral number. The range of parameter is 0 to Number of tabs. default value is 0.


1. tabchangeduration="milliseconds" : The parameter to set the velocity of swiching tab. The unit is millisecond. default value is 200.

1. horizon="boolean" : The parameter to set the display of tabs by truth value. default is 'false'.

1.  opmin="float(0. 〜 1.)" : The parameter to set the opacity that is not selected tabs by floating decimal point. The parameter is effective in case of above parameter is 'true'. The range of parameter is 0 to 1. default value is 0.


```bash
#Event and Function
const tab = document.getElementsByTagName("rikaaa-tab")[0];

tab.next(); // Change next tab

tab.prev();// Change prev tab

tab.addEventListener("onfade", function (e) { // Fires while tab is fading.

    console.log(e.detail.seed); //return seed value.

    console.log(e.detail.fade); //return array. This is switching status of each tab.

});
```

## Browser Support
- Google Chrome  
- Safari  
- Firefox  
- Edge  
- IE 11+ (When using polyfill)

## License
MIT © [rikaaa.org](http://rikaaa.org/)
