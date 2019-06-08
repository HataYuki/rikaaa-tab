export default (func) => {
    let _func,
        allow = true;
        return function () {
            if (!allow) {
                func = null;
                return false;
            }
            _func = func.apply(this, arguments); 
            allow = false;
            return _func;
        }
}