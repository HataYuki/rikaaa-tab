export default class Ease{
    constructor(typestr, duration) {
        this._type = (typestr) ? typestr : 'linear';
        this._t = 0;
        this._d = duration;
    }
    set duration(n) {
        this._d = n;
    }
    set type(n) {
        this._type = n;
    }
    get duration() {
        return this._d;
    }
    Convarsion(val) {
        return (val >= 1) ? 1.0 : val;
    }
    ease_in() {
        return this._t * this._t;
    }
    ease_out() {
        return this._t * (2 - this._t);
    }
    ease_in_out() {
        return this._t < .5 ? 2 * this._t * this._t : -1 + (4 - 2 * this._t) * this._t;
    }
    linear() {
        return this._t;
    }
    Start(func) { 
        this._now = performance.now();
        let that = this;

        requestAnimationFrame(loop);
        function loop(timedamp) {
            that.requ = requestAnimationFrame(loop);
            that._t = that.Convarsion((timedamp - that._now) / that._d);
            
            switch (that._type.replace(/-/g, '_')) {
                case 'linear': func(that.linear()); break;
                case 'ease_in': func(that.ease_in()); break;
                case 'ease_out': func(that.ease_out()); break;
                case 'ease_in_out': func(that.ease_in_out()); break;
                default:break;
            }
            
            if (that._t >= 1.0) {
                cancelAnimationFrame(that.requ);
                if (typeof that._endFunc === 'function') that._endFunc();
            }
        };
        return this;
    }
    End(func) {
        this._endFunc = func;
    }
    Stop(func) {
        cancelAnimationFrame(this.requ);
        if (typeof func === 'function') func();
    }
}