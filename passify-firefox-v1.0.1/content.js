const f=typeof browser<"u"?browser:chrome;function h(){document.querySelectorAll('input[type="password"]').forEach(e=>{e.hasAttribute("data-passify-detected")||(e.setAttribute("data-passify-detected","true"),v(e))})}function v(t){if(t.parentElement?.querySelector(".passify-autofill-btn"))return;const e=document.createElement("button");e.className="passify-autofill-btn",e.textContent="🔐",e.title="Autofill with Passify",e.type="button",e.style.cssText=`
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    border: 1px solid rgba(37, 99, 235, 0.3);
    border-radius: 6px;
    background: #2563eb;
    color: white;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
  `,e.addEventListener("mouseenter",()=>{e.style.transform="translateY(-50%) scale(1.05)",e.style.background="#1d4ed8",e.style.boxShadow="0 4px 12px rgba(37, 99, 235, 0.3)",e.style.borderColor="rgba(37, 99, 235, 0.5)"}),e.addEventListener("mouseleave",()=>{e.style.transform="translateY(-50%) scale(1)",e.style.background="#2563eb",e.style.boxShadow="0 2px 8px rgba(0, 0, 0, 0.15)",e.style.borderColor="rgba(37, 99, 235, 0.3)"}),e.addEventListener("click",async o=>{o.preventDefault(),o.stopPropagation(),E()});const s=t.parentElement;s&&(window.getComputedStyle(s).position==="static"&&(s.style.position="relative"),s.appendChild(e))}function E(){const t=document.getElementById("passify-inline-popup");if(t){t.remove();return}const e=document.createElement("iframe");e.id="passify-inline-popup",e.src=f.runtime.getURL("popup.html"),e.style.cssText=`
    position: fixed;
    top: 80px;
    right: 20px;
    width: 400px;
    height: 600px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
    z-index: 10003;
    background: transparent;
    animation: slideIn 0.3s ease-out;
  `,document.body.appendChild(e);const s=o=>{e.contains(o.target)||(e.remove(),document.removeEventListener("click",s))};setTimeout(()=>{document.addEventListener("click",s)},100),setTimeout(()=>{e.parentElement&&(e.remove(),document.removeEventListener("click",s))},3e4)}f.runtime.onMessage.addListener((t,e,s)=>(t.action==="autofill"&&(g(t.username,t.password),s({success:!0})),!0));window.addEventListener("message",t=>{if(t.data&&t.data.type){if(t.data.type==="PASSIFY_AUTOFILL"){g(t.data.username,t.data.password);const e=document.getElementById("passify-inline-popup");e&&e.remove()}else if(t.data.type==="PASSIFY_OPEN_MANAGER"){f.runtime.sendMessage({action:"openManager"});const e=document.getElementById("passify-inline-popup");e&&e.remove()}}});function g(t,e){document.querySelectorAll('input[type="password"]').forEach(o=>{const n=o;n.value=e,n.dispatchEvent(new Event("input",{bubbles:!0})),n.dispatchEvent(new Event("change",{bubbles:!0}));const r=n.closest("form");if(r){const i=r.querySelector('input[type="email"], input[type="text"], input[name*="user"], input[name*="email"]');i&&(i.value=t,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})))}}),C("Credentials autofilled successfully! 🎉")}function C(t){const e=document.createElement("div");e.className="passify-notification",e.textContent=t,e.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 14px 20px;
    background: rgba(30, 30, 35, 0.98);
    backdrop-filter: blur(16px);
    color: #f8fafc;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 10001;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `,document.body.appendChild(e),setTimeout(()=>{e.style.animation="slideOut 0.3s ease-out",setTimeout(()=>e.remove(),300)},3e3)}async function k(){try{const t=window.location.hostname,o=((await f.storage.local.get("passify_passwords")).passify_passwords||[]).filter(n=>n.website.includes(t)||t.includes(n.website));o.length>0&&document.querySelectorAll('input[type="password"]').length>0&&I(o)}catch(t){console.error("Error checking for saved passwords:",t)}}function I(t){const e=document.getElementById("passify-autofill-popup");e&&e.remove();const s=document.createElement("div");s.id="passify-autofill-popup",s.className="passify-autofill-popup";const o=document.createElement("div");o.className="passify-popup-header";const n=document.createElement("div");n.className="passify-popup-title";const r=document.createElement("span");r.className="passify-popup-icon",r.textContent="🔐";const i=document.createElement("span");i.textContent="Passify - Saved Passwords",n.appendChild(r),n.appendChild(i);const d=document.createElement("button");d.className="passify-popup-close",d.id="passify-close-popup",d.textContent="✕",d.addEventListener("click",()=>s.remove()),o.appendChild(n),o.appendChild(d);const c=document.createElement("div");c.className="passify-popup-content";const m=document.createElement("p");m.className="passify-popup-subtitle",m.textContent=`Found ${t.length} saved ${t.length===1?"password":"passwords"} for this site`;const b=document.createElement("div");b.className="passify-credentials-list",t.forEach(a=>{const l=document.createElement("div");l.className="passify-credential-item",l.setAttribute("data-id",a.id);const u=document.createElement("div");u.className="passify-credential-info";const y=document.createElement("div");y.className="passify-credential-username",y.textContent=`👤 ${a.username}`;const x=document.createElement("div");x.className="passify-credential-password",x.textContent=`🔒 ${"•".repeat(12)}`,u.appendChild(y),u.appendChild(x);const p=document.createElement("button");p.className="passify-autofill-btn-small",p.textContent="⚡ Autofill",p.setAttribute("data-username",a.username),p.setAttribute("data-password",a.password),p.addEventListener("click",()=>{g(a.username,a.password),s.remove()}),l.appendChild(u),l.appendChild(p),b.appendChild(l)}),c.appendChild(m),c.appendChild(b),s.appendChild(o),s.appendChild(c),document.body.appendChild(s),s.addEventListener("click",a=>{a.target===s&&s.remove()}),setTimeout(()=>{s.parentElement&&(s.style.animation="slideOut 0.3s ease-out",setTimeout(()=>s.remove(),300))},1e4)}const w=document.createElement("style");w.textContent=`
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .passify-autofill-popup {
    position: fixed;
    top: 80px;
    right: 20px;
    width: 360px;
    background: rgba(30, 30, 35, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 10002;
    animation: slideIn 0.3s ease-out;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .passify-popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 18px;
    background: rgba(37, 99, 235, 0.15);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .passify-popup-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 13px;
    color: #f8fafc;
    letter-spacing: -0.01em;
  }

  .passify-popup-icon {
    font-size: 16px;
  }

  .passify-popup-close {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #cbd5e1;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .passify-popup-close:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.15);
    color: #f8fafc;
  }

  .passify-popup-content {
    padding: 18px;
  }

  .passify-popup-subtitle {
    margin: 0 0 14px 0;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 400;
  }

  .passify-credentials-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .passify-credential-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background: rgba(40, 40, 50, 0.5);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    transition: all 0.2s;
  }

  .passify-credential-item:hover {
    background: rgba(50, 50, 60, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .passify-credential-info {
    flex: 1;
    min-width: 0;
  }

  .passify-credential-username {
    font-size: 13px;
    font-weight: 600;
    color: #f8fafc;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: -0.01em;
  }

  .passify-credential-password {
    font-size: 11px;
    color: #94a3b8;
    font-family: 'SF Mono', 'Monaco', monospace;
    letter-spacing: 0.05em;
  }

  .passify-autofill-btn-small {
    background: #2563eb;
    color: white;
    border: 1px solid rgba(37, 99, 235, 0.5);
    padding: 7px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .passify-autofill-btn-small:hover {
    background: #1d4ed8;
    border-color: rgba(37, 99, 235, 0.8);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;document.head.appendChild(w);h();const S=new MutationObserver(()=>{h()});S.observe(document.body,{childList:!0,subtree:!0});setTimeout(k,1e3);console.log("Passify content script loaded");
