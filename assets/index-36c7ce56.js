(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();const s={API_KEY:"apiKey",CHANNEL_ID:"channelId"},d=`
<article>
    <h1>Invalid configuration</h1>
    <p>Required parameters "${s.API_KEY}" or "${s.CHANNEL_ID}" missing from URL.</p>
    <p>Please configure these parameters to use the redirect.</p>
</article>
`,a=new URLSearchParams(window.location.search);function u(r){var o;return a.has(r)&&((o=a.get(r))==null?void 0:o.length)!==0}function p(){if(![s.API_KEY,s.CHANNEL_ID].every(u))throw document.body.innerHTML=document.body.innerHTML+d,new Error("Missing configuration parameters.");return{apiKey:a.get(s.API_KEY),channelId:a.get(s.CHANNEL_ID)}}const f=r=>`
<article>
    <h1>Error while contacting Holodex API</h1>
    <p>Unable to retrieve latest scheduled and live stream information from the Holodex API.</p>
    <p>The following error occurred:</p>
    <pre>${JSON.stringify(r,Object.getOwnPropertyNames(r),4)}</pre>
</article>
`;async function h(r,o){const n=new URLSearchParams({channel_id:o,type:"stream",status:["upcoming","live"].join(","),include:"live_info",max_upcoming_hours:"24"}),i=await fetch(`https://holodex.net/api/v2/live?${n.toString()}`,{headers:{"X-APIKEY":r,"Content-Type":"application/json"}}).then(e=>e.json());if(i.length===0)throw new Error("No results");return i}async function m(r,o){try{const n=await h(r,o),i=n.find(t=>t.status==="live");if(i){window.location.href="https://www.youtube.com/live_chat?is_popout=1&v="+i.id;return}const e=n.sort((t,c)=>new Date(t.start_scheduled).getTime()-new Date(c.start_scheduled).getTime());window.location.href="https://www.youtube.com/live_chat?is_popout=1&v="+e[0].id}catch(n){throw document.body.innerHTML=document.body.innerHTML+f(n),n}}const l=p();m(l.apiKey,l.channelId);
