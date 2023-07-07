(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const h of c.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function n(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerPolicy&&(c.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?c.credentials="include":r.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(r){if(r.ep)return;r.ep=!0;const c=n(r);fetch(r.href,c)}})();function L(){}function Z(e){return e()}function H(){return Object.create(null)}function P(e){e.forEach(Z)}function z(e){return typeof e=="function"}function Y(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function ee(e){return Object.keys(e).length===0}function J(e){return e??""}function a(e,t){e.appendChild(t)}function F(e,t,n){e.insertBefore(t,n||null)}function j(e){e.parentNode&&e.parentNode.removeChild(e)}function W(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function v(e){return document.createElement(e)}function S(e){return document.createTextNode(e)}function w(){return S(" ")}function G(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function _(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function te(e){return Array.from(e.childNodes)}let B;function E(e){B=e}const q=[],R=[];let C=[];const T=[],ne=Promise.resolve();let I=!1;function re(){I||(I=!0,ne.then(X))}function N(e){C.push(e)}const D=new Set;let x=0;function X(){if(x!==0)return;const e=B;do{try{for(;x<q.length;){const t=q[x];x++,E(t),le(t.$$)}}catch(t){throw q.length=0,x=0,t}for(E(null),q.length=0,x=0;R.length;)R.pop()();for(let t=0;t<C.length;t+=1){const n=C[t];D.has(n)||(D.add(n),n())}C.length=0}while(q.length);for(;T.length;)T.pop()();I=!1,D.clear(),E(e)}function le(e){if(e.fragment!==null){e.update(),P(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(N)}}function se(e){const t=[],n=[];C.forEach(s=>e.indexOf(s)===-1?t.push(s):n.push(s)),n.forEach(s=>s()),C=t}const oe=new Set;function ie(e,t){e&&e.i&&(oe.delete(e),e.i(t))}function ae(e,t,n,s){const{fragment:r,after_update:c}=e.$$;r&&r.m(t,n),s||N(()=>{const h=e.$$.on_mount.map(Z).filter(z);e.$$.on_destroy?e.$$.on_destroy.push(...h):P(h),e.$$.on_mount=[]}),c.forEach(N)}function ce(e,t){const n=e.$$;n.fragment!==null&&(se(n.after_update),P(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ue(e,t){e.$$.dirty[0]===-1&&(q.push(e),re(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function fe(e,t,n,s,r,c,h,y=[-1]){const b=B;E(e);const l=e.$$={fragment:null,ctx:[],props:c,update:L,not_equal:r,bound:H(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(b?b.$$.context:[])),callbacks:H(),dirty:y,skip_bound:!1,root:t.target||b.$$.root};h&&h(l.root);let i=!1;if(l.ctx=n?n(e,t.props||{},(f,O,...$)=>{const m=$.length?$[0]:O;return l.ctx&&r(l.ctx[f],l.ctx[f]=m)&&(!l.skip_bound&&l.bound[f]&&l.bound[f](m),i&&ue(e,f)),O}):[],l.update(),i=!0,P(l.before_update),l.fragment=s?s(l.ctx):!1,t.target){if(t.hydrate){const f=te(t.target);l.fragment&&l.fragment.l(f),f.forEach(j)}else l.fragment&&l.fragment.c();t.intro&&ie(e.$$.fragment),ae(e,t.target,t.anchor,t.customElement),X()}E(b)}class de{$destroy(){ce(this,1),this.$destroy=L}$on(t,n){if(!z(n))return L;const s=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return s.push(n),()=>{const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}$set(t){this.$$set&&!ee(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}let k={JavaScript:[40.15,57.83],Python:[39.81,65.52],TypeScript:[36.92,71.7],HTML_CSS:[34.34,61.9],SQL:[33.9,64.26],Rust:[30.56,84.66],Csharp:[21.3,62.87],Bash_Shell:[20.91,60.39],Go:[20.59,62.45],Java:[16.53,44.11],Cpp:[16.35,49.77],Kotlin:[12.1,60.77],C:[11.51,43.29],PHP:[9.22,41.83],PowerShell:[7.05,43.32],Dart:[6.94,58.56],Swift:[6.18,61.42],Ruby:[4.92,47.69],Lua:[4.68,47.98],Elixir:[4.45,72.13],Assembly:[4.4,39.45],Zig:[4.18,71.33],Haskell:[3.85,52.21],R:[3.53,38.98],Scala:[3.18,52.27],Julia:[2.51,62.77],Fsharp:[2.41,57.36],Delphi:[2.24,62.77],Clojure:[2.2,68.51],Lisp:[1.96,54.55],Solidity:[1.84,46.4],GDScript:[1.81,62.94],Erlang:[1.63,55.18],VisualBasic_DotNet:[1.58,23.26],Groovy:[1.41,29.97],MATLAB:[1.32,18.33],Perl:[1.25,34.68],OCaml:[1.25,53.91],Objective_C:[1.11,22.59],VBA:[1.1,23.82],Nim:[.94,53.78],Ada:[.83,40.92],Crystal:[.7,48.07],Prolog:[.65,23.97],Fortran:[.59,24.37],Apex:[.58,48.01],APL:[.49,44.89],Cobol:[.47,20.31],SAS:[.43,37.47],Raku:[.33,65.38],Flow:[.22,24.77]};function V(e,t,n){const s=e.slice();return s[7]=t[n],s}function K(e,t,n){const s=e.slice();return s[10]=t[n][0],s[11]=t[n][1],s[13]=n,s}function Q(e){let t,n,s=e[13]+1+"",r,c,h,y,b=e[10]+"",l,i,f,O=e[11][e[7].indexInArray].toFixed(2)+"",$,m,d,u,p;function o(){return e[4](e[10])}return{c(){t=v("div"),n=v("span"),r=S(s),c=S(")"),h=w(),y=v("span"),l=S(b),i=w(),f=v("span"),$=S(O),m=S("%"),_(n,"class","svelte-1rqgu0p"),_(y,"class","svelte-1rqgu0p"),_(f,"class","svelte-1rqgu0p"),_(t,"class",d=J("lang"+(e[10]===e[0]?" selected":"")+" tier"+Math.floor(e[13]/10+1))+" svelte-1rqgu0p")},m(A,g){F(A,t,g),a(t,n),a(n,r),a(n,c),a(t,h),a(t,y),a(y,l),a(t,i),a(t,f),a(f,$),a(f,m),u||(p=[G(t,"mouseenter",o),G(t,"mouseleave",e[5])],u=!0)},p(A,g){e=A,g&1&&d!==(d=J("lang"+(e[10]===e[0]?" selected":"")+" tier"+Math.floor(e[13]/10+1))+" svelte-1rqgu0p")&&_(t,"class",d)},d(A){A&&j(t),u=!1,P(p)}}}function U(e){let t,n,s=e[7].title+"",r,c,h,y=e[7].desc+"",b,l,i,f=e[7].formula+"",O,$,m;function d(...o){return e[3](e[7],...o)}let u=Object.entries(k).sort(d),p=[];for(let o=0;o<u.length;o+=1)p[o]=Q(K(e,u,o));return{c(){t=v("div"),n=v("h2"),r=S(s),c=w(),h=v("span"),b=S(y),l=w(),i=v("span"),O=S(f),$=w();for(let o=0;o<p.length;o+=1)p[o].c();m=w(),_(n,"class","svelte-1rqgu0p"),_(h,"class","desc svelte-1rqgu0p"),_(i,"class","formula svelte-1rqgu0p"),_(t,"class","list svelte-1rqgu0p")},m(o,A){F(o,t,A),a(t,n),a(n,r),a(t,c),a(t,h),a(h,b),a(t,l),a(t,i),a(i,O),a(t,$);for(let g=0;g<p.length;g+=1)p[g]&&p[g].m(t,null);a(t,m)},p(o,A){if(e=o,A&7){u=Object.entries(k).sort(d);let g;for(g=0;g<u.length;g+=1){const M=K(e,u,g);p[g]?p[g].p(M,A):(p[g]=Q(M),p[g].c(),p[g].m(t,m))}for(;g<p.length;g+=1)p[g].d(1);p.length=u.length}},d(o){o&&j(t),W(p,o)}}}function pe(e){let t,n,s,r,c,h,y,b,l,i,f,O,$,m=e[1],d=[];for(let u=0;u<m.length;u+=1)d[u]=U(V(e,m,u));return{c(){t=v("main"),n=v("div");for(let u=0;u<d.length;u+=1)d[u].c();s=w(),r=v("div"),c=v("span"),c.textContent="Better stats for StackOverflow survey",h=w(),y=v("a"),y.textContent="GitHub repo",b=w(),l=v("a"),l.textContent="2023 StackOverflow Survey",i=w(),f=v("span"),f.textContent="JSON of used data:",O=w(),$=v("code"),$.textContent=`${JSON.stringify(k)}`,_(n,"class","top svelte-1rqgu0p"),_(c,"class","svelte-1rqgu0p"),_(y,"href","https://github.com/MarioVieilledent/stackoverflow-better-stats"),_(y,"target","_blank"),_(l,"href","https://survey.stackoverflow.co/2023/"),_(l,"target","_blank"),_(f,"class","svelte-1rqgu0p"),_($,"class","svelte-1rqgu0p"),_(r,"class","bottom svelte-1rqgu0p"),_(t,"class","svelte-1rqgu0p")},m(u,p){F(u,t,p),a(t,n);for(let o=0;o<d.length;o+=1)d[o]&&d[o].m(n,null);a(t,s),a(t,r),a(r,c),a(r,h),a(r,y),a(r,b),a(r,l),a(r,i),a(r,f),a(r,O),a(r,$)},p(u,[p]){if(p&7){m=u[1];let o;for(o=0;o<m.length;o+=1){const A=V(u,m,o);d[o]?d[o].p(A,p):(d[o]=U(A),d[o].c(),d[o].m(n,null))}for(;o<d.length;o+=1)d[o].d(1);d.length=m.length}},i:L,o:L,d(u){u&&j(t),W(d,u)}}}function he(e,t,n){let s=[{title:"Desired",desc:"From StackOverflow 2023's survey",formula:"% of respondents who want to use it",indexInArray:0},{title:"Average focus on desired",desc:"First quartile",formula:"(3*Desired + 1*Admired) / 4",indexInArray:2},{title:"Average",desc:"Point in between Desired and Admired",formula:"(Desired + Admired) / 2",indexInArray:3},{title:"Average focus on admired",desc:"Third quartile",formula:"(1*Desired + 3*Admired) / 4",indexInArray:4},{title:"Admired",desc:"From StackOverflow 2023's survey",formula:"% of respondents who want to continue using it",indexInArray:1},{title:"Underestimated",desc:"Highest distance between Admired and Desired",formula:"Admired - Desired",indexInArray:5}];for(const[l,i]of Object.entries(k))i.push((i[0]*3+i[1])/4);for(const[l,i]of Object.entries(k))i.push((i[0]+i[1])/2);for(const[l,i]of Object.entries(k))i.push((i[0]+i[1]*3)/4);for(const[l,i]of Object.entries(k))i.push(i[1]-i[0]);let r="";function c(l,i){n(0,r=i)}return[r,s,c,(l,i,f)=>f[1][l.indexInArray]-i[1][l.indexInArray],l=>c("Desired",l),()=>c("","")]}class ge extends de{constructor(t){super(),fe(this,t,he,pe,Y,{})}}new ge({target:document.getElementById("app")});