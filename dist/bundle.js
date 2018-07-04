!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):t.validator=r()}(this,function(){"use strict";function t(t,r){for(var e=0;e<r.length;e++){var n=r[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function r(t){return function(t){if(Array.isArray(t)){for(var r=0,e=new Array(t.length);r<t.length;r++)e[r]=t[r];return e}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}return function(){function e(t){var r=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{first:!0,concurrent:!1};!function(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}(this,e),this.transformToPromise=function(t,e,n){for(var a=arguments.length,o=new Array(a>3?a-3:0),i=3;i<a;i++)o[i-3]=arguments[i];if("function"!=typeof t.validator)throw"invalid validator";var l=t.validator.apply(t,[e].concat(o));l&&l.then&&l.catch||(l=l?Promise.resolve(l):Promise.reject(l));var s={errors:n,target:e};return l.then(function(t){return Object.assign(s,{promiseValue:t})},function(a){return s.errors=r.messageHandler.apply(r,[n,t.message,e,a].concat(o)),Promise.reject(Object.assign(s,{promiseValue:a}))})},this.lastValidator={},this.schema=t,this.options=n}var n,a,o;return n=e,(a=[{key:"validate",value:function(t,r){for(var e=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=arguments.length,o=new Array(a>3?a-3:0),i=3;i<a;i++)o[i-3]=arguments[i];var l=[];return!r||r.length<1?Promise.resolve({value:t}):(Array.isArray(r)||(r=[r]),n.concurrent?Promise.all(r.map(function(r){return e.transformToPromise.apply(e,[r,t,l].concat(o)).then(function(t){return t},n.first?function(t){return t}:null)})):r.reduce(function(r,a){return r.then(function(){return e.transformToPromise.apply(e,[a,t,l].concat(o))},n.first?null:function(){return e.transformToPromise.apply(e,[a,t,l].concat(o))})},Promise.resolve()))}},{key:"validateItem",value:function(t,e,n){var a=this,o=this.schema[e],i=t[e];if(o&&o.rules&&(o=o.rules),o&&o.withFields){var l=Array.isArray(o.withFields)?o.withFields:[o.withFields];i=[e].concat(r(l)).map(function(r){return t[r]})}for(var s=arguments.length,u=new Array(s>3?s-3:0),c=3;c<s;c++)u[c-3]=arguments[c];var f=this.validate.apply(this,[i,o,this.options].concat(u));return this.lastValidator[e]=f,f.then(function(t){return n&&a.lastValidator[e]===f&&(a.lastValidator[e]=null,n(null,t.target)),t},function(t){return n&&a.lastValidator[e]===f&&(a.lastValidator[e]=null,n(t.errors,t.target)),t})}},{key:"messageHandler",value:function(t,r,e,n){if("function"==typeof r){for(var a=arguments.length,o=new Array(a>4?a-4:0),i=4;i<a;i++)o[i-4]=arguments[i];t.push("".concat(r.apply(void 0,[e,n].concat(o))||"Error!").trim())}else t.push("".concat(null!=r?r:"Error!").trim());return t}},{key:"cancelItem",value:function(t){this.lastValidator[t]=null}},{key:"cancelAll",value:function(){this.lastValidator={}}},{key:"setSchema",value:function(t){this.schema=t}},{key:"setOptions",value:function(t){this.options=t}}])&&t(n.prototype,a),o&&t(n,o),e}()});
