import constrain from '../js/_Constrain';
import map from '../js/_Map';
import './mdn-polyfill.Array.keys';
export default class MultiFade{
    constructor(length) {
        this._len = (length && length > 1) ? length : 2;
        // this._result = new Array(this._len).fill(0);
        this._arrival = 1 / this._len;      
    }
    get(seed,options = {}){
        const peakX = (options.peakX >= 0 && options.peakX <= 1) ? options.peakX : 0.5;
        const smooth = (options.smooth >= 0 && options.smooth <= 1) ? options.smooth : 0.3;
        const dissolve = (options.dissolve >= 0 && options.dissolve <= 1) ? options.dissolve : 0.5;
        const edge = (options.edge >= 0 && options.edge <= 1) ? options.edge : 1;
        return this.calcMult(constrain(seed, 0, 1), constrain(peakX, 0, 1), constrain(smooth, 0, 1), constrain(dissolve, 0, 1),constrain(edge,0,1));
    }
    calcMult(seed, peakX, smooth, dissolve,edge){
        const _dissolve = constrain(dissolve, 0, 1);
        const __dissolve = 1.0 - _dissolve;
        const distance = map(seed, 0, 1, 0.5 * edge, __dissolve * (this._len - 1) + map(edge,0,1,1,0.5));
        return [...Array(this._len).keys()].reduce((a, c) => {
            const seedCalc = Math.max(Math.min(distance - __dissolve * c, 1), 0);
            return a.concat([
                this.calc(seedCalc, peakX, smooth)
            ]);
        },[]);
    }
    calc(seed,peakX,smooth){
        const _seed = constrain(seed, 0, 1);
        const _peakX = constrain(peakX, 0, 1);
        const _smooth = (smooth) ? map(constrain(smooth,0,1), 0, 1, 0, 0.5) : 0;
        const x = this.method(_seed, _peakX);
        if (_smooth === 0) {
            return x;
        } else {
            return this.smoothstep(0 + _smooth, 1 - _smooth/2, x);
        }
    }
    method(x, a){
        return Math.max(Math.min(Math.min(x / a, 1.0 - ((x - a) / (1.0 - a))), 1), 0);
    }
    smoothstep(edge0,edge1,x){
        const t = constrain((x - edge0) / (edge1 - edge0), 0, 1);
        return Math.pow(t, 2) * (3 - 2 * t);
    }
}