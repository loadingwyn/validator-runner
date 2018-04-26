function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),e}function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,t=new Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}var Validator=function(){function e(r){var t=this;_classCallCheck(this,e),this.transformToPromise=function(e,r,n,a){var o=r.validator.apply(r,_toConsumableArray(n)),i=!0;o&&o.then&&o.catch||(i=!1,o=o?Promise.resolve(o):Promise.reject(o));var l={errors:a,fieldName:e,target:n,isAsync:i};return o.then(function(e){return Object.assign(l,{promiseValue:e})},function(e){return l.errors=t.messageHandler(a,r.message,n,e),Promise.reject(Object.assign(l,{promiseValue:e}))})},this.lastValidator={},this.descriptor=r}return _createClass(e,[{key:"validateItem",value:function(e,r,t){var n,a=this,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{traversal:!1,retention:!1,concurrent:!1},i=[],l=(arguments.length>4?arguments[4]:void 0)||this.descriptor[r];if(l&&!(l.length<1))return Array.isArray(l)||(l=[l]),n=o.concurrent?Promise.all(l.map(function(t){var n=[r].concat(_toConsumableArray(t.join||[])).map(function(r){return e[r]});return a.transformToPromise(r,t,n,i).then(function(e){return e},o.traversal?function(e){return e}:null)})):l.reduce(function(t,n){var l=[r].concat(_toConsumableArray(n.join||[])).map(function(r){return e[r]});return t.then(function(){return a.transformToPromise(r,n,l,i)},o.traversal?function(){return a.transformToPromise(r,n,l,i)}:null)},Promise.resolve()),this.lastValidator[r]=n,n.then(function(e){return(o.retention||a.lastValidator[r]===n)&&t&&t(i,e),e},function(e){return(o.retention||a.lastValidator[r]===n)&&t&&t(i,e),Promise.reject(e)});t(i,{})}},{key:"validate",value:function(e,r){var t=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=!1,o={},i=[];return(n.specificField||Object.keys(this.descriptor)).forEach(function(r){i.push(t.validateItem(e,r,function(e){o[r]=e,n.fieldCallback&&n.fieldCallback(r,e)},n))}),Promise.all(i.map(function(e){return e.catch(function(e){return a=!0,e})})).then(function(){return r(o,!a),a?Promise.reject(o):o})}},{key:"messageHandler",value:function(e,r,t,n){return"function"==typeof r?e.push("".concat(r.apply(void 0,_toConsumableArray(t).concat([n]))||"Error!").trim()):e.push("".concat(r||"Error!").trim()),e}},{key:"cancelItem",value:function(e){this.lastValidator[e]=null}},{key:"cancelAll",value:function(){this.lastValidator={}}},{key:"addRule",value:function(e){this.ruleSet=Object.assign(this.ruleSet,e)}},{key:"updateRuleSet",value:function(e){this.ruleSet=e}},{key:"deleteRule",value:function(e){delete this.ruleSet[e]}}]),e}();export default Validator;
//# sourceMappingURL=bundle.esm.js.map
