(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function i(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(t){if(t.ep)return;t.ep=!0;const r=i(t);fetch(t.href,r)}})();var c=(e=>(e[e.UNKNOWN=0]="UNKNOWN",e[e.MISSING_CONFIG=1]="MISSING_CONFIG",e[e.NO_RESULTS=2]="NO_RESULTS",e[e.NETWORK=3]="NETWORK",e))(c||{});const d={0:`
<article class="error">
    <h1>Unknown Error</h1>
    <p>An unexpected error has occurred.</p>
</article>
`,1:`
<article class="error">
    <h1>Invalid configuration</h1>
    <p>Required parameters missing from URL.</p>
    <p>Please configure these parameters to use the redirect.</p>
</article>
    `,2:`
<article class="error">
    <h1>No streams founds</h1>
    <p>No upcoming streams found to redirect towards.</p>
</article>`,3:`
<article class="error">
    <h1>Error while contacting Holodex API</h1>
    <p>Unable to retrieve latest scheduled and live stream information from the Holodex API.</p>
</article>`};class l extends Error{code;constructor(o,i){super(i),this.code=o}}const a={API_KEY:"apiKey",CHANNEL_ID:"channelId"},u=new URLSearchParams(window.location.search);function h(e){return u.has(e)&&u.get(e)?.length!==0}function p(){if(![a.API_KEY,a.CHANNEL_ID].every(h))throw new l(c.MISSING_CONFIG,"Missing configuration parameters.");return{apiKey:u.get(a.API_KEY),channelId:u.get(a.CHANNEL_ID)}}async function f(e,o){const i=new URLSearchParams({channel_id:o,type:"stream",status:["upcoming","live"].join(","),include:"live_info",max_upcoming_hours:"24"});let n;try{n=await fetch(`https://holodex.net/api/v2/live?${i.toString()}`,{headers:{"X-APIKEY":e,"Content-Type":"application/json"}}).then(t=>t.json())}catch{throw new l(c.NETWORK,"Network error occurred")}if(n.length===0)throw new l(c.NO_RESULTS,"No results");return n}async function m(e,o){const i=await f(e,o),n=i.find(r=>r.status==="live");if(n){window.location.href="https://www.youtube.com/live_chat?is_popout=1&v="+n.id;return}const t=i.sort((r,s)=>new Date(r.start_scheduled).getTime()-new Date(s.start_scheduled).getTime());window.location.href="https://www.youtube.com/live_chat?is_popout=1&v="+t[0].id}try{const e=p();await m(e.apiKey,e.channelId)}catch(e){let o;e instanceof l?o=d[e.code]:o=d[c.UNKNOWN],document.body.innerHTML=document.body.innerHTML+o}
