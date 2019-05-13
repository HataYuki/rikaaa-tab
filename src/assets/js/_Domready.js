export default (fn) => {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        setTimeout(() => { fn(); }, 0);
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};