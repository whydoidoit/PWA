webpackJsonp([0],{187:function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function a(){p(this).catch(console.error)}function i(){this.options.data.child&&this.options.data.child.teardown()}function o(t,e){var n;return{c:function(){n=(0,_.createElement)("ui-view")},l:function(t){n=(0,_.claimElement)(t,"UI-VIEW",{},!1),(0,_.children)(n).forEach(_.detachNode)},m:function(t,r){(0,_.insertNode)(n,t,r),e.refs.container=n},p:_.noop,u:function(){(0,_.detachNode)(n)},d:function(){e.refs.container===n&&(e.refs.container=null)}}}function s(t){(0,_.init)(this,t),this.refs={},this._state=t.data||{},this._handlers.destroy=[i];var e=a.bind(this);if(t._root?this._root._oncreate.push(e):this._oncreate=[e],this._fragment=o(this._state,this),t.target){var n=(0,_.children)(t.target);t.hydrate?this._fragment.l(n):this._fragment.c(),n.forEach(_.detachNode),this._fragment.m(t.target,t.anchor||null),(0,_.callAll)(this._oncreate)}}Object.defineProperty(e,"__esModule",{value:!0});var c=n(56),u=r(c),f=n(18),d=r(f),h=n(57),l=r(h),p=function(){var t=(0,l.default)(u.default.mark(function t(e){var n,r;return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,g.default)(e.options.data.src);case 2:n=t.sent,r=n.default,e.options.data.child=new r((0,d.default)(e.options,{target:e.refs.container}));case 5:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),_=n(183),m=n(91),g=r(m);(0,_.assign)(s.prototype,_.proto),e.default=s}});