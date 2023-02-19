(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))l(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerpolicy&&(r.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?r.credentials="include":i.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function l(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();function E(){}function $e(t){return t()}function ne(){return Object.create(null)}function S(t){t.forEach($e)}function be(t){return typeof t=="function"}function J(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let K;function I(t,e){return K||(K=document.createElement("a")),K.href=e,t===K.href}function Le(t){return Object.keys(t).length===0}function le(t){return t??""}function _(t,e){t.appendChild(e)}function N(t,e,n){t.insertBefore(e,n||null)}function L(t){t.parentNode&&t.parentNode.removeChild(t)}function we(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function y(t){return document.createElement(t)}function A(t){return document.createTextNode(t)}function w(){return A(" ")}function Ne(){return A("")}function B(t,e,n,l){return t.addEventListener(e,n,l),()=>t.removeEventListener(e,n,l)}function c(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Pe(t){return Array.from(t.childNodes)}function O(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function F(t,e){t.value=e??""}let x;function j(t){x=t}const T=[],ie=[],V=[],re=[],Ee=Promise.resolve();let Y=!1;function Ae(){Y||(Y=!0,Ee.then(Ce))}function Z(t){V.push(t)}const R=new Set;let H=0;function Ce(){if(H!==0)return;const t=x;do{try{for(;H<T.length;){const e=T[H];H++,j(e),Me(e.$$)}}catch(e){throw T.length=0,H=0,e}for(j(null),T.length=0,H=0;ie.length;)ie.pop()();for(let e=0;e<V.length;e+=1){const n=V[e];R.has(n)||(R.add(n),n())}V.length=0}while(T.length);for(;re.length;)re.pop()();Y=!1,R.clear(),j(t)}function Me(t){if(t.fragment!==null){t.update(),S(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(Z)}}const D=new Set;let q;function U(){q={r:0,c:[],p:q}}function X(){q.r||S(q.c),q=q.p}function P(t,e){t&&t.i&&(D.delete(t),t.i(e))}function M(t,e,n,l){if(t&&t.o){if(D.has(t))return;D.add(t),q.c.push(()=>{D.delete(t),l&&(n&&t.d(1),l())}),t.o(e)}else l&&l()}function ee(t){t&&t.c()}function W(t,e,n,l){const{fragment:i,after_update:r}=t.$$;i&&i.m(e,n),l||Z(()=>{const o=t.$$.on_mount.map($e).filter(be);t.$$.on_destroy?t.$$.on_destroy.push(...o):S(o),t.$$.on_mount=[]}),r.forEach(Z)}function z(t,e){const n=t.$$;n.fragment!==null&&(S(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function qe(t,e){t.$$.dirty[0]===-1&&(T.push(t),Ae(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function G(t,e,n,l,i,r,o,u=[-1]){const f=x;j(t);const s=t.$$={fragment:null,ctx:[],props:r,update:E,not_equal:i,bound:ne(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(f?f.$$.context:[])),callbacks:ne(),dirty:u,skip_bound:!1,root:e.target||f.$$.root};o&&o(s.root);let $=!1;if(s.ctx=n?n(t,e.props||{},(g,h,...v)=>{const k=v.length?v[0]:h;return s.ctx&&i(s.ctx[g],s.ctx[g]=k)&&(!s.skip_bound&&s.bound[g]&&s.bound[g](k),$&&qe(t,g)),h}):[],s.update(),$=!0,S(s.before_update),s.fragment=l?l(s.ctx):!1,e.target){if(e.hydrate){const g=Pe(e.target);s.fragment&&s.fragment.l(g),g.forEach(L)}else s.fragment&&s.fragment.c();e.intro&&P(t.$$.fragment),W(t,e.target,e.anchor,e.customElement),Ce()}j(f)}class Q{$destroy(){z(this,1),this.$destroy=E}$on(e,n){if(!be(n))return E;const l=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return l.push(n),()=>{const i=l.indexOf(n);i!==-1&&l.splice(i,1)}}$set(e){this.$$set&&!Le(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function oe(t,e,n){const l=t.slice();return l[9]=e[n],l[11]=n,l}function se(t){let e,n,l,i,r,o,u,f,s,$=t[9].countryName+"",g,h,v,k,d=t[9].capital&&ue(t),m=t[9].population&&ce(t),a=t[9].continentName&&fe(t);return{c(){e=y("div"),n=y("div"),l=y("img"),o=w(),u=y("div"),f=y("div"),s=y("span"),g=A($),h=w(),d&&d.c(),v=w(),m&&m.c(),k=w(),a&&a.c(),c(l,"class","flag-svg svelte-1i0nukp"),I(l.src,i="https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/"+t[9].countryCode.toLowerCase()+".svg")||c(l,"src",i),c(l,"alt",r="flag of "+t[9].countryName),c(n,"class","flag f svelte-1i0nukp"),c(s,"class","country-name svelte-1i0nukp"),c(f,"class","logo-and-property svelte-1i0nukp"),c(u,"class","country-info fc  svelte-1i0nukp"),c(e,"class","country f svelte-1i0nukp")},m(p,b){N(p,e,b),_(e,n),_(n,l),_(e,o),_(e,u),_(u,f),_(f,s),_(s,g),_(u,h),d&&d.m(u,null),_(u,v),m&&m.m(u,null),_(u,k),a&&a.m(u,null)},p(p,b){b&4&&!I(l.src,i="https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/"+p[9].countryCode.toLowerCase()+".svg")&&c(l,"src",i),b&4&&r!==(r="flag of "+p[9].countryName)&&c(l,"alt",r),b&4&&$!==($=p[9].countryName+"")&&O(g,$),p[9].capital?d?d.p(p,b):(d=ue(p),d.c(),d.m(u,v)):d&&(d.d(1),d=null),p[9].population?m?m.p(p,b):(m=ce(p),m.c(),m.m(u,k)):m&&(m.d(1),m=null),p[9].continentName?a?a.p(p,b):(a=fe(p),a.c(),a.m(u,null)):a&&(a.d(1),a=null)},d(p){p&&L(e),d&&d.d(),m&&m.d(),a&&a.d()}}}function ue(t){let e,n,l,i,r,o=t[9].capital+"",u;return{c(){e=y("div"),n=y("img"),i=w(),r=y("span"),u=A(o),c(n,"class","icon svelte-1i0nukp"),I(n.src,l="./icons/capital.svg")||c(n,"src",l),c(n,"alt","capital icon"),c(r,"class","country-capital svelte-1i0nukp"),c(e,"class","logo-and-property svelte-1i0nukp"),c(e,"title","Capital")},m(f,s){N(f,e,s),_(e,n),_(e,i),_(e,r),_(r,u)},p(f,s){s&4&&o!==(o=f[9].capital+"")&&O(u,o)},d(f){f&&L(e)}}}function ce(t){let e,n,l,i,r,o=pe(t[9].population)+"",u;return{c(){e=y("div"),n=y("img"),i=w(),r=y("span"),u=A(o),c(n,"class","icon svelte-1i0nukp"),I(n.src,l="./icons/population.svg")||c(n,"src",l),c(n,"alt","population icon"),c(r,"class","country-population svelte-1i0nukp"),c(e,"class","logo-and-property svelte-1i0nukp"),c(e,"title","Population")},m(f,s){N(f,e,s),_(e,n),_(e,i),_(e,r),_(r,u)},p(f,s){s&4&&o!==(o=pe(f[9].population)+"")&&O(u,o)},d(f){f&&L(e)}}}function fe(t){let e,n,l,i,r,o=t[9].continentName+"",u;return{c(){e=y("div"),n=y("img"),i=w(),r=y("span"),u=A(o),c(n,"class","icon svelte-1i0nukp"),I(n.src,l="./icons/earth.svg")||c(n,"src",l),c(n,"alt","earth icon"),c(r,"class","continent-name svelte-1i0nukp"),c(e,"class","logo-and-property svelte-1i0nukp"),c(e,"title","Continent")},m(f,s){N(f,e,s),_(e,n),_(e,i),_(e,r),_(r,u)},p(f,s){s&4&&o!==(o=f[9].continentName+"")&&O(u,o)},d(f){f&&L(e)}}}function ae(t){let e,n=t[11]<t[3]&&se(t);return{c(){n&&n.c(),e=Ne()},m(l,i){n&&n.m(l,i),N(l,e,i)},p(l,i){l[11]<l[3]?n?n.p(l,i):(n=se(l),n.c(),n.m(e.parentNode,e)):n&&(n.d(1),n=null)},d(l){n&&n.d(l),l&&L(e)}}}function de(t){let e,n,l,i,r;return{c(){e=y("button"),e.textContent="Load more...",n=w(),l=y("button"),l.textContent="Load all",c(e,"class","load-more-button svelte-1i0nukp"),c(l,"class","load-more-button svelte-1i0nukp")},m(o,u){N(o,e,u),N(o,n,u),N(o,l,u),i||(r=[B(e,"click",t[5]),B(l,"click",t[6])],i=!0)},p:E,d(o){o&&L(e),o&&L(n),o&&L(l),i=!1,S(r)}}}function He(t){let e,n,l,i,r,o=t[2].length+"",u,f,s,$,g,h,v,k,d=t[2],m=[];for(let p=0;p<d.length;p+=1)m[p]=ae(oe(t,d,p));let a=t[3]<t[2].length-1&&de(t);return{c(){e=y("div"),n=y("div"),l=y("input"),i=w(),r=y("span"),u=A(o),f=A("/"),s=A(t[1]),$=w(),g=y("div");for(let p=0;p<m.length;p+=1)m[p].c();h=w(),a&&a.c(),c(l,"class","search svelte-1i0nukp"),c(l,"type","text"),c(l,"placeholder","Search"),c(r,"class","indicator svelte-1i0nukp"),c(n,"class","input-and-info f svelte-1i0nukp"),c(g,"class","country-list fc svelte-1i0nukp"),c(e,"class","country-container fc svelte-1i0nukp")},m(p,b){N(p,e,b),_(e,n),_(n,l),F(l,t[0]),_(n,i),_(n,r),_(r,u),_(r,f),_(r,s),_(e,$),_(e,g);for(let C=0;C<m.length;C+=1)m[C].m(g,null);_(g,h),a&&a.m(g,null),v||(k=B(l,"input",t[4]),v=!0)},p(p,[b]){if(b&1&&l.value!==p[0]&&F(l,p[0]),b&4&&o!==(o=p[2].length+"")&&O(u,o),b&2&&O(s,p[1]),b&12){d=p[2];let C;for(C=0;C<d.length;C+=1){const te=oe(p,d,C);m[C]?m[C].p(te,b):(m[C]=ae(te),m[C].c(),m[C].m(g,h))}for(;C<m.length;C+=1)m[C].d(1);m.length=d.length}p[3]<p[2].length-1?a?a.p(p,b):(a=de(p),a.c(),a.m(g,null)):a&&(a.d(1),a=null)},i:E,o:E,d(p){p&&L(e),we(m,p),a&&a.d(),v=!1,k()}}}function pe(t){const e=t.length;return e<=3?t:e<=6?t.substring(0,e-3)+","+t.charAt(e-3)+"K":e<=9?t.substring(0,e-6)+","+t.charAt(e-6)+"M":e<=12?t.substring(0,e-9)+","+t.charAt(e-9)+"B":t}function Te(t,e,n){let l=[],i,r="",o=[],u=24;function f(h){return l.filter(v=>v.countryName.toLowerCase().includes(h.toLowerCase())||v.continentName.toLowerCase().includes(h.toLowerCase())||v.capital.toLowerCase().includes(h.toLowerCase())).sort((v,k)=>parseInt(v.population)<parseInt(k.population)?1:-1)}fetch("./countries.json").then(h=>h.json()).then(h=>{l=h,n(1,i=h.length),n(2,o=f(""))});function s(){r=this.value,n(0,r)}const $=()=>n(3,u+=24),g=()=>n(3,u+=i);return t.$$.update=()=>{t.$$.dirty&1&&n(2,o=f(r))},[r,i,o,u,s,$,g]}class Oe extends Q{constructor(e){super(),G(this,e,Te,He,J,{})}}function Se(t){let e,n,l,i,r,o,u;return{c(){e=y("div"),n=y("div"),l=y("textarea"),i=w(),r=y("div"),c(l,"class","textarea svelte-1n7aoav"),c(n,"class","left svelte-1n7aoav"),c(r,"class","right svelte-1n7aoav"),c(e,"class","container f svelte-1n7aoav")},m(f,s){N(f,e,s),_(e,n),_(n,l),F(l,t[0]),_(e,i),_(e,r),r.innerHTML=t[0],o||(u=B(l,"input",t[1]),o=!0)},p(f,[s]){s&1&&F(l,f[0]),s&1&&(r.innerHTML=f[0])},i:E,o:E,d(f){f&&L(e),o=!1,u()}}}function je(t,e,n){let i=`<div style="display: flex; flex-direction: column; align-items: center">
  <h1>Title</h1>
  <button onclick="alert('Javascript is working')">Click me</button>
  <input type="date">
  <img src="https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/fr.svg" width="144" />
</div>`;function r(){i=this.value,n(0,i)}return[i,r]}class Ie extends Q{constructor(e){super(),G(this,e,je,Se,J,{})}}function Be(t){let e;return{c(){e=y("div"),e.innerHTML='<span class="svelte-1dx3uy4">Mario&#39;s personal website</span>',c(e,"class","home fc svelte-1dx3uy4")},m(n,l){N(n,e,l)},p:E,i:E,o:E,d(n){n&&L(e)}}}class Ke extends Q{constructor(e){super(),G(this,e,null,Be,J,{})}}function _e(t,e,n){const l=t.slice();return l[4]=e[n],l}function me(t){let e,n=t[4]+"",l,i,r,o,u;function f(){return t[3](t[4])}return{c(){e=y("button"),l=A(n),i=w(),c(e,"class",r=le(t[0]===t[4]?"link curr f":"link f")+" svelte-164qlv8")},m(s,$){N(s,e,$),_(e,l),_(e,i),o||(u=B(e,"click",f),o=!0)},p(s,$){t=s,$&1&&r!==(r=le(t[0]===t[4]?"link curr f":"link f")+" svelte-164qlv8")&&c(e,"class",r)},d(s){s&&L(e),o=!1,u()}}}function ge(t){let e,n;return e=new Ke({}),{c(){ee(e.$$.fragment)},m(l,i){W(e,l,i),n=!0},i(l){n||(P(e.$$.fragment,l),n=!0)},o(l){M(e.$$.fragment,l),n=!1},d(l){z(e,l)}}}function he(t){let e,n;return e=new Ie({}),{c(){ee(e.$$.fragment)},m(l,i){W(e,l,i),n=!0},i(l){n||(P(e.$$.fragment,l),n=!0)},o(l){M(e.$$.fragment,l),n=!1},d(l){z(e,l)}}}function ve(t){let e,n;return e=new Oe({}),{c(){ee(e.$$.fragment)},m(l,i){W(e,l,i),n=!0},i(l){n||(P(e.$$.fragment,l),n=!0)},o(l){M(e.$$.fragment,l),n=!1},d(l){z(e,l)}}}function Ve(t){let e,n,l,i,r,o,u,f,s;document.title=e=ke;let $=t[1],g=[];for(let d=0;d<$.length;d+=1)g[d]=me(_e(t,$,d));let h=t[0]==="Home"&&ge(),v=t[0]==="Playground"&&he(),k=t[0]==="Countries"&&ve();return{c(){n=w(),l=y("div"),i=y("div");for(let d=0;d<g.length;d+=1)g[d].c();r=w(),o=y("div"),h&&h.c(),u=w(),v&&v.c(),f=w(),k&&k.c(),c(i,"class","navbar f svelte-164qlv8"),c(o,"class","content fc svelte-164qlv8"),c(l,"class","all fc svelte-164qlv8")},m(d,m){N(d,n,m),N(d,l,m),_(l,i);for(let a=0;a<g.length;a+=1)g[a].m(i,null);_(l,r),_(l,o),h&&h.m(o,null),_(o,u),v&&v.m(o,null),_(o,f),k&&k.m(o,null),s=!0},p(d,[m]){if((!s||m&0)&&e!==(e=ke)&&(document.title=e),m&7){$=d[1];let a;for(a=0;a<$.length;a+=1){const p=_e(d,$,a);g[a]?g[a].p(p,m):(g[a]=me(p),g[a].c(),g[a].m(i,null))}for(;a<g.length;a+=1)g[a].d(1);g.length=$.length}d[0]==="Home"?h?m&1&&P(h,1):(h=ge(),h.c(),P(h,1),h.m(o,u)):h&&(U(),M(h,1,1,()=>{h=null}),X()),d[0]==="Playground"?v?m&1&&P(v,1):(v=he(),v.c(),P(v,1),v.m(o,f)):v&&(U(),M(v,1,1,()=>{v=null}),X()),d[0]==="Countries"?k?m&1&&P(k,1):(k=ve(),k.c(),P(k,1),k.m(o,null)):k&&(U(),M(k,1,1,()=>{k=null}),X())},i(d){s||(P(h),P(v),P(k),s=!0)},o(d){M(h),M(v),M(k),s=!1},d(d){d&&L(n),d&&L(l),we(g,d),h&&h.d(),v&&v.d(),k&&k.d()}}}const ye="MarioVieilledentPersonalWebsitePage";let ke="Mario Vieilledent";function De(t,e,n){const l=["Home","Playground","Countries"];let i=window.localStorage.getItem(ye);i||(i="Countries");function r(u){n(0,i=u),window.localStorage.setItem(ye,u)}return[i,l,r,u=>r(u)]}class Fe extends Q{constructor(e){super(),G(this,e,De,Ve,J,{})}}new Fe({target:document.getElementById("app")});
