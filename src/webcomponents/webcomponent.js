import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import Multfader from '../assets/js/_MultiFader';
import Ease from '../assets/js/_Ease';
import map from '../assets/js/_Map';
import ready from '../assets/js/_Domready';
import rikaaaResizeObserver from '../assets/js/rikaaa-ResizeWatcher';
import Onebang from '../assets/js/_Onebang';
import ValueObserver from '../assets/js/_ValueObserver';
import '../assets/js/Element.prototype.closest';


const _css = '${{{src/webcomponents/webcomponent.scss}}}';
const _style = `<style>${_css}</style>`;
const _shadowdomHTML = `
    ${_style}
    <div class="wp">
        <div class="tab">
            <slot class="tab_slot" name="tab"></slot>
        </div>
        <slot class="seekbar_slot" name="bar"></slot>
        <div class="panel">
            <slot class="panel_slot"></slot>
        </div>
    </div>
`;
const template = document.createElement('template');
template.id = 'rikaaatab';
template.innerHTML = _shadowdomHTML;
if (window.ShadyCSS) ShadyCSS.prepareTemplate(template, 'rikaaa-tab');

export default class rikaaatab extends HTMLElement {
    constructor() {
        super();
        if (window.ShadyCSS) ShadyCSS.styleElement(this);
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.style.visibility = 'hidden';
        const init = () => {
            this._ease = new Ease('ease_in_out');

            this._tab = this.shadowRoot.querySelector('.tab');
            this._panel = this.shadowRoot.querySelector('.panel');
            this._wp = this.shadowRoot.querySelector('.wp');
            this._tabslot = this.shadowRoot.querySelector('.tab_slot');
            this._panelslot = this.shadowRoot.querySelector('.panel_slot');
            this._seekbarslot = this.shadowRoot.querySelector('.seekbar_slot');

            if (!window.ResizeObserver && !window.WcRikaaaResizeObserver) {
                Object.defineProperty(window, 'WcRikaaaResizeObserver', {
                    value: rikaaaResizeObserver
                });
            }
            const resizeobserver = window.ResizeObserver || window.WcRikaaaResizeObserver;
            
            this._tabs = this._tabslot.assignedNodes({
                flattern: true
            }).filter(n => n.nodeType === n.ELEMENT_NODE);
            this._panels = this._panelslot.assignedNodes({
                flatten: true
            }).filter(n => n.nodeType === n.ELEMENT_NODE);
            this._bar = this._seekbarslot.assignedNodes({
                flatten: true
            }).filter(n => n.nodeType === n.ELEMENT_NODE)[0];

            this._panelsH = Array.from(this._panels).reduce((a, c) => a.concat(c.offsetHeight), []);

            // touch slide panel
            let m_x, prevSeed;
            const slide = (e) => {
                const x = e.pageX;
                const m_diff = (this.horizon) ? x - m_x : m_x - x;
                const node = this._panels;
                const step = 1 / node.length;
                const m_ratio = m_diff / this.offsetWidth;
                if (this.horizon) {
                    this.seed = prevSeed + m_ratio;
                } else {
                    this.seed = prevSeed + step * m_ratio * 2;
                }
            };
            this.attachslide = (e) => {
                this._panel.addEventListener('mousemove', slide);
                this._panel.addEventListener('touchmove', slide);
                m_x = e.pageX;
                prevSeed = this.seed;
                this.sliding = true;
                this._panel.classList.add('us-none');
            };
            this.releaseslide = () => {
                this._panel.removeEventListener('mousemove', slide);
                this._panel.removeEventListener('touchmove', slide);
                const nowIndex = this.index;
                const roundIndex = Math.round(nowIndex);
                const diff = roundIndex - nowIndex;
                if (diff !== 0) {
                    this._ease.Start(e => {
                        this.index = nowIndex + diff * e;
                    }).End(() => {
                        this.sliding = false;
                        this._panel.classList.remove('us-none');
                    });
                }
            };

            this._panel.addEventListener('mousedown', this.attachslide);
            this._panel.addEventListener('touchstart', this.attachslide);
            this._panel.addEventListener('mouseup', this.releaseslide);
            this._panel.addEventListener('touchend', this.releaseslide);
            this._panel.addEventListener('mouseleave', this.releaseslide);
            this._panel.addEventListener('touchleave', this.releaseslide);

            // touch slide bar 
            let m_x_b, prevSeed_b;
            const slide_b = (e) => {
                const x = e.pageX;
                // const m_diff = (this.horizon) ? m_x_b - x : x - m_x_b;
                const m_diff = x - m_x_b;
                const m_ratio = m_diff / this.offsetWidth;
                this.seed = prevSeed_b + m_ratio;
            };
            this.attachslide_b = (e) => {
                this._bar.addEventListener('mousemove', slide_b);
                this._bar.addEventListener('touchmove', slide_b);
                const attachseed = (e.pageX - this.offsetLeft) / this.offsetWidth - 1 / this._panels.length;
                this.seed = attachseed;
                prevSeed_b = attachseed;
                m_x_b = e.pageX;
                this.sliding = true;
                this._panel.classList.add('us-none');
            };
            this.releaseslide_b = () => {
                this._bar.removeEventListener('mousemove', slide_b);
                this._bar.removeEventListener('touchmove', slide_b);
                const nowIndex = this.index;
                const roundIndex = Math.round(nowIndex);
                const diff = roundIndex - nowIndex;
                if (diff !== 0) {
                    this._ease.Start(e => {
                        this.index = nowIndex + diff * e;
                    }).End(() => {
                        this.sliding = false;
                        this._panel.classList.remove('us-none');
                    });
                }
            };

            if (this._bar) {
                this._bar.addEventListener('mousedown', this.attachslide_b);
                this._bar.addEventListener('touchstart', this.attachslide_b);
                window.addEventListener('mouseup', this.releaseslide_b);
                window.addEventListener('touchend', this.releaseslide_b);
                window.addEventListener('mouseleave', this.releaseslide_b);
                window.addEventListener('touchleave', this.releaseslide_b);
            }

            if (this.seed === null) this.seed = 0;
            if (this.seekbarH === null) this.seekbarH = 3;
            if (this.tabChangeDuration === null) this.tabChangeDuration = 200;
            if (this.horizon === null) this.horizon = false;
            if (this.opmin === null) this.opmin = 0;

            this.tabChangeDuration = this.tabChangeDuration;
            this.seekbarH = this.seekbarH;
            this.horizon = this.horizon;
            this.seed = this.seed;
            this.opmin = this.opmin;

            Array.from(this._tabs).forEach(n => n.classList.add('tabs'));

            this.tabclick = (e) => {
                console.log('tabclick');
                
                const node = this._tabs;
                const index = node.indexOf(e.target.closest('.tabs'));
                const diff = index - this.index;
                const step = 1 / node.length;
                const now_seed = this.seed;
                this._ease.type = 'ease_out';
                this._ease.Start(e => {
                    this.seed = now_seed + step * (diff * e);
                });
            };
            if (this._tabs.length) this._tabslot.addEventListener('click', this.tabclick);

            const createValuChangeObserver = () => {
                this.seedchangeObserver = ValueObserver(this.seed, (fn) => {
                    fn();
                });
            }
            let resizeOnce = Onebang(createValuChangeObserver);
            let resizeTimer = null;
            this.resizeRedraw = () => {
                resizeOnce();
                this.redraw();
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    resizeOnce = Onebang(createValuChangeObserver);
                }, 1);
            };
            this.resizeOb = new resizeobserver(this.resizeRedraw);
            this.resizeOb.observe(this);
        }
        this.imgonload(() => {
            init();
            this.style.visibility = '';
            this.dispatchEvent(new CustomEvent('load'));
        });
    }
    disconnectedCallback() {
        const bar = this.shadowRoot.querySelector('.seekbar_slot').assignedNodes({ flatten: true }).filter(n => n.nodeType === n.ELEMENT_NODE)[0];
        const panel = this.shadowRoot.querySelector('.panel');
        const tabslot = this.shadowRoot.querySelector('.tab_slot');
        this.imgonload(() => {
            bar.removeEventListener('mousedown', this.attachslide_b);
            bar.removeEventListener('touchstart', this.attachslide_b);
            window.removeEventListener('mouseup', this.releaseslide_b);
            window.removeEventListener('touchend', this.releaseslide_b);
            window.removeEventListener('mouseleave', this.releaseslide_b);
            window.removeEventListener('touchleave', this.releaseslide_b);
            
            panel.removeEventListener('mousedown', this.attachslide);
            panel.removeEventListener('touchstart', this.attachslide);
            panel.removeEventListener('mouseup', this.releaseslide);
            panel.removeEventListener('touchend', this.releaseslide);
            panel.removeEventListener('mouseleave', this.releaseslide);
            panel.removeEventListener('touchleave', this.releaseslide);

            tabslot.removeEventListener('click', this.tabclick);

            this.resizeOb.disconnect(this);
            
        });
    }
    get seed() {
        const attr = this.getAttribute('seed');
        return (attr === null) ? attr : Number(attr);
    }
    set seed(n) {
        n = n - Math.floor(n);
        this.setAttribute('seed', n);
        this.fade(n);
        this.seek(n);
        this.fadeH(n);
        this.addtabproperty();
        const node = this._panels;
        const step = 1 / node.length;
        let index = n / step;
        if (index >= node.length + 1) index = 0;
        if (index <= -1) index = node.length - 1;
        this.setAttribute('index', index);
    }
    get index() {
        const attr = this.getAttribute('index');
        return (attr === null) ? attr : Number(attr);
    }
    set index(n) {
        let node = this._tabs;
        if (!node.length) node = this._panels;
        const step = 1 / node.length;
        this.seed = step * n;
    }
    get tabChangeDuration() {
        const attr = this.getAttribute('tabChangeDuration');
        return (attr === null) ? attr : Number(attr);
    }
    set tabChangeDuration(n) {
        this.setAttribute('tabChangeDuration', n);
        this._ease.duration = n;
    }
    get seekbarH() {
        const attr = this.getAttribute('seekbarH');
        return (attr === null) ? attr : Number(attr);
    }
    set seekbarH(n) {
        this.setAttribute('seekbarH', n);
        if (this._bar) this._bar.querySelector('.bar').style.height = `${n}px`;
    }
    get horizon() {
        const attr = this.getAttribute('horizon');
        return (attr === null) ? attr : (attr.toLowerCase() === 'true');
    }
    set horizon(n) {
        if (typeof n !== 'boolean') throw new TypeError('need boolean');
        this.setAttribute('horizon', n);
        const node = this._panels;
        if (n) {
            this._panel.classList.add('horizon');
            Array.from(node).map(n => n.style.width = `${100 * 1 / node.length}%`);
        } else {
            this._panel.classList.remove('horizon');
            Array.from(node).map(n => n.style.width = '');
        }
        this.redraw();
    }
    get opmin() {
        const attr = this.getAttribute('opmin');
        return (attr === null) ? attr : Number(attr);
    }
    set opmin(n) {
        this.setAttribute('opmin', n);
        this.fade(this.seed);
    }
    addtabproperty() {
        if (this._tabs.length) {
            this._farray.forEach((v, i) => {
                if (map(v, this.opmin, 1, 0, 1) >= 0.5) this._tabs[i].classList.add('select');
                else this._tabs[i].classList.remove('select');
            });
        }
    }
    forLoopCalc(seed, fadeArray, tabpanelLen) {
        const step = 1 / tabpanelLen;
        const fa_copy = [...fadeArray];
        fa_copy.reverse();
        const [rest, ...fa_use] = fa_copy;
        fa_use.reverse();
        if (seed >= step * (tabpanelLen - 1)) fa_use[0] = rest;
        return [...fa_use];
    }
    fade(seed) {
        const s = seed - Math.floor(seed);
        const node = this._panels;
        const mf = new Multfader(node.length + 1); //!!!
        const fa = mf.get(s);
        const fa_use = this.forLoopCalc(s, fa, node.length);
        const fa_use_ = fa_use.map(v => Math.max(Math.min(v + this.opmin, 1), 0));
        node.forEach((elem, index) => elem.style.opacity = fa_use_[index]);
        node.forEach((elem, index) => {
            if (fa_use_[index] >= 0.5) elem.classList.add('select');
            else elem.classList.remove('select');
        });
        this._farray = fa_use_;
        
        if (typeof this.seedchangeObserver === 'function') {
            this.seedchangeObserver(() => {
                this.onfade(fa_use_);
            }, {
                watch: seed,
            });
        }
    }
    onfade(f) {
        const onfade = new CustomEvent('onfade', {
            detail: {
                seed: this.seed,
                fade: f,
            }
        });
        this.dispatchEvent(onfade);
    }
    fadeH(seed) {
        const s = seed - Math.floor(seed);
        const node = this._panels;
        const H_arry = this._panelsH;
        const mf = new Multfader(node.length + 1); //!!!
        const fa = mf.get(s, {
            smooth: 0
        });
        const fa_use = this.forLoopCalc(s, fa, node.length);
        const H_array_f = H_arry.map((h, index) => h * fa_use[index]);
        let h = H_array_f.reduce((a, c) => a + c);
        if (this.horizon) this._panel.style.height = '';
        else this._panel.style.height = `${h}px`;
    }
    seek(seed) {
        const node = this._panels;
        const s = seed;
        const step = 1 / node.length;
        const diff = step * (node.length - 1) + 0.00000000000001;
        const seek = (s - diff) - Math.floor(s - diff);
        if (this._bar) this._bar.querySelector('.bar').style.width = `${100 * seek}%`;
    }
    redraw() {
        this._panelsH = Array.from(this._panels).reduce((a, c) => a.concat(c.offsetHeight), []);
        this.fade(this.seed);
        this.fadeH(this.seed);
    }
    next() {
        const node = this._panels;
        const step = 1 / node.length;
        const nowSeed = this.seed;
        this._ease.Start(e => {
            if (!this.sliding) this.seed = nowSeed + (step * e);
        });
    }
    prev() {
        const node = this._panels;
        const step = 1 / node.length;
        const nowSeed = this.seed;
        this._ease.Start(e => {
            if (!this.sliding) this.seed = nowSeed - (step * e);
        });
    }
    imgonload(fn) {
        const readyAct = () => {
            const tab = this;
            const imgNode = Array.from(tab.querySelectorAll('img'));
            const imgloaded = Promise.all(
                imgNode.map(i => {
                    return new Promise((resolve, reject) => {
                        if (i === null) {
                            resolve();
                        } else {
                            const i_src = i.src;
                            i.src = '';
                            i.addEventListener('load', () => {
                                resolve();
                            });
                            i.src = i_src;
                        }
                    });
                })
            );
            imgloaded.then(() => {
                // this.redraw();
                fn();
            });
        };

        ready(() => {
            readyAct(); 
        });
    }
}

