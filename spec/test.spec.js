const assert = require('power-assert');
const ready = (fn) => {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        setTimeout(() => {
            fn();
        }, 0);
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
mocha.setup({
    delay: true,
     ui: 'bdd'
});

before(function () {
    document.body.innerHTML = __html__['index.html']; //view html
});

ready(() => {
    describe('rikaaa-tab test', function () {
        it('write your test', () => {
            assert(0 === 0);
        });
    });
    run();
});




