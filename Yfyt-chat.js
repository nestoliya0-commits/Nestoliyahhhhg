(function() {
  // Load EmailJS
  const emailScript = document.createElement('script');
  emailScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  emailScript.onload = function() {
    emailjs.init('qdmwuWAEmhJNBLgpm');
  };
  document.head.appendChild(emailScript);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.textContent = `
    #yfyt-chat-btn {
      position: fixed; bottom: 28px; right: 28px;
      width: 62px; height: 62px; background: #2C1810;
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; cursor: pointer; z-index: 99999;
      box-shadow: 0 8px 30px rgba(44,24,16,0.35);
      transition: transform 0.2s, box-shadow 0.2s; border: none;
    }
    #yfyt-chat-btn:hover { transform: scale(1.08); }
    #yfyt-chat-btn .yfyt-icon { font-size: 26px; }
    #yfyt-chat-btn .yfyt-close { font-size: 22px; display: none; color: white; }
    #yfyt-chat-btn.open .yfyt-icon { display: none; }
    #yfyt-chat-btn.open .yfyt-close { display: block; }
    #yfyt-notif-dot {
      position: absolute; top: 4px; right: 4px;
      width: 14px; height: 14px; background: #B85C38;
      border-radius: 50%; border: 2px solid white;
      animation: yfyt-pulse 2s infinite;
    }
    @keyframes yfyt-pulse {
      0%,100% { transform: scale(1); opacity:1; }
      50% { transform: scale(1.3); opacity:0.7; }
    }
    #yfyt-chat-panel {
      position: fixed; bottom: 104px; right: 28px;
      width: 370px; height: 580px; border-radius: 20px;
      overflow: hidden; box-shadow: 0 24px 70px rgba(44,24,16,0.22);
      z-index: 99998; display: flex; flex-direction: column;
      border: 1px solid #E2D9C8;
      transform: scale(0.85) translateY(20px);
      transform-origin: bottom right; opacity: 0;
      pointer-events: none;
      transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease;
    }
    #yfyt-chat-panel.visible { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    .yfyt-header { background: #2C1810; padding: 15px 18px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
    .yfyt-hicon { width: 38px; height: 38px; background: #C8A96A; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .yfyt-htxt h2 { font-family: 'Playfair Display', serif; color: #FAF6EE; font-size: 14px; font-weight: 600; }
    .yfyt-htxt p { color: #C8A96A; font-size: 11px; font-weight: 300; margin-top: 1px; }
    .yfyt-sdot { width: 8px; height: 8px; background: #7ED87E; border-radius: 50%; margin-left: auto; box-shadow: 0 0 0 2px rgba(126,216,126,0.3); }
    .yfyt-chat { flex: 1; overflow-y: auto; padding: 16px 14px; display: flex; flex-direction: column; gap: 12px; background: #FAF6EE; }
    .yfyt-chat::-webkit-scrollbar { width: 3px; }
    .yfyt-chat::-webkit-scrollbar-thumb { background: #E2D9C8; border-radius: 3px; }
    .yfyt-msg { display: flex; gap: 8px; max-width: 88%; }
    .yfyt-msg.bot { align-self: flex-start; }
    .yfyt-msg.user { align-self: flex-end; flex-direction: row-reverse; }
    .yfyt-av { width: 26px; height: 26px; background: #2C1810; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; margin-top: 2px; }
    .yfyt-bbl { padding: 10px 13px; border-radius: 14px; font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.55; color: #2C1810; }
    .yfyt-msg.bot .yfyt-bbl { background: #fff; border: 1px solid #E2D9C8; border-bottom-left-radius: 3px; }
    .yfyt-msg.user .yfyt-bbl { background: #2C1810; color: #FAF6EE; border-bottom-right-radius: 3px; }
    .yfyt-chips { display: flex; flex-wrap: wrap; gap: 7px; padding: 0 14px 10px; background: #FAF6EE; }
    .yfyt-chip { background: #fff; border: 1.5px solid #C8A96A; color: #2C1810; font-family: 'Inter', sans-serif; font-size: 12px; padding: 6px 13px; border-radius: 18px; cursor: pointer; transition: all 0.15s; font-weight: 500; }
    .yfyt-chip:hover { background: #C8A96A; color: #fff; }
    .yfyt-typing { display:flex; gap:4px; padding:7px 10px; align-items:center; }
    .yfyt-typing span { width:6px; height:6px; background: #C8A96A; border-radius:50%; animation: yfyt-bounce 1.2s infinite; }
    .yfyt-typing span:nth-child(2){animation-delay:0.2s;}
    .yfyt-typing span:nth-child(3){animation-delay:0.4s;}
    @keyframes yfyt-bounce { 0%,80%,100%{transform:translateY(0);opacity:0.5;} 40%{transform:translateY(-6px);opacity:1;} }
    .yfyt-typing-bbl { background:#fff; border:1px solid #E2D9C8; border-radius:14px; border-bottom-left-radius:3px; display:inline-block; }
    .yfyt-input-area { display: flex; gap: 9px; padding: 12px 14px; background: #fff; border-top: 1px solid #E2D9C8; flex-shrink: 0; }
    .yfyt-input { flex: 1; border: 1.5px solid #E2D9C8; border-radius: 20px; padding: 9px 14px; font-family: 'Inter', sans-serif; font-size: 13px; color: #2C1810; outline: none; background: #FAF6EE; transition: border-color 0.2s; }
    .yfyt-input:focus { border-color: #7A9B6E; }
    .yfyt-input::placeholder { color: #B0A898; }
    .yfyt-send { width: 38px; height: 38px; background: #2C1810; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; flex-shrink: 0; }
    .yfyt-send:hover { background: #B85C38; }
    .yfyt-send svg { width:15px; height:15px; fill:none; stroke:white; stroke-width:2; }
    .yfyt-bcard { background: #EFF4EC; border: 1.5px solid #7A9B6E; border-radius: 12px; padding: 12px 14px; font-family: 'Inter', sans-serif; font-size: 12px; }
    .yfyt-bcard h4 { font-family: 'Playfair Display', serif; color: #2C1810; font-size: 13px; margin-bottom: 9px; }
    .yfyt-brow { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #E2D9C8; color: #2C1810; }
    .yfyt-brow:last-of-type { border-bottom: none; }
    .yfyt-brow span:first-child { color: #6B5744; font-weight: 500; }
    .yfyt-cbtn { margin-top: 10px; width: 100%; background: #B85C38; color: white; border: none; border-radius: 9px; padding: 10px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
    .yfyt-cbtn:hover { background: #9e4a2c; }
    @media (max-width: 480px) {
      #yfyt-chat-panel { width: calc(100vw - 24px); right: 12px; bottom: 90px; height: 70vh; }
      #yfyt-chat-btn { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'yfyt-chat-btn';
  btn.innerHTML = `<span class="yfyt-icon">🌿</span><span class="yfyt-close">✕</span><span id="yfyt-notif-dot"></span>`;

  const panel = document.createElement('div');
  panel.id = 'yfyt-chat-panel';
  panel.innerHTML = `
    <div class="yfyt-header">
      <div class="yfyt-hicon">🌿</div>
      <div class="yfyt-htxt"><h2>YFYT Reservations</h2><p>Restaurant Constance · Charlotte, NC</p></div>
      <div class="yfyt-sdot"></div>
    </div>
    <div class="yfyt-chat" id="yfyt-chat-area"></div>
    <div class="yfyt-chips" id="yfyt-chips"></div>
    <div class="yfyt-input-area">
      <input class="yfyt-input" id="yfyt-input" placeholder="Type your message..." />
      <button class="yfyt-send" id="yfyt-send-btn">
        <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(panel);
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    const isOpen = panel.classList.contains('visible');
    if (isOpen) { panel.classList.remove('visible'); btn.classList.remove('open'); }
    else {
      panel.classList.add('visible'); btn.classList.add('open');
      const dot = document.getElementById('yfyt-notif-dot');
      if (dot) dot.remove();
      if (!window._yfytInited) { window._yfytInited = true; initChat(); }
    }
  });

  const SYSTEM = `You are a warm, knowledgeable booking assistant for Your Farms Your Table Group (YFYT) — a beloved farm-to-table dining group in Charlotte, NC. Your main role is Restaurant Constance reservations, but you also handle catering inquiries, personal chef experiences, and private events.

RESTAURANT INFO:
- Restaurant Constance — flagship farm-to-table restaurant, Charlotte NC
- Address: 2200 Thrift Road, Charlotte, NC 28208
- Phone: 980-549-1999
- Email: foodteam@yfytgroup.com
- Reservation link: https://tables.toasttab.com/restaurants/ee050f6c-7e01-42f7-9836-460ede1edb20/reserve
- Private events / catering: jill@yfytgroup.com

BOOKING FLOW:
Step 1: Ask preferred date
Step 2: Ask party size
Step 3: Ask preferred time
Step 4: Ask for name and special requests
Step 5: Provide summary

TONE: Warm, welcoming, farm-to-table elegance. Keep responses concise (2-3 sentences). Light emojis occasionally.

When you have all booking details output ONLY at the end:
BOOKING_DATA:{"name":"...","date":"...","time":"...","party":...,"special":"..."}`;

  let history = [];
  let pendingBooking = null;

  async function callAI(msg) {
    history.push({ role: 'user', content: msg });
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM, messages: history })
    });
    const data = await res.json();
    const raw = data.content?.[0]?.text || 'Sorry, please try again.';
    let display = raw;
    if (raw.includes('BOOKING_DATA:')) {
      const parts = raw.split('BOOKING_DATA:');
      display = parts[0].trim();
      try { pendingBooking = JSON.parse(parts[1].trim()); } catch(e){}
    }
    history.push({ role: 'assistant', content: raw });
    return display;
  }

  async function sendEmail(b) {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingData: b,
          system: SYSTEM,
          messages: []
        })
      });
      console.log('Email sent!');
    } catch(e) {
      console.log('Email error:', e);
    }
  }

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function addMsg(text, who) {
    const area = document.getElementById('yfyt-chat-area');
    const d = document.createElement('div');
    d.className = `yfyt-msg ${who}`;
    if (who === 'bot') {
      d.innerHTML = `<div class="yfyt-av">🌿</div><div class="yfyt-bbl">${esc(text).replace(/\n/g,'<br>')}</div>`;
    } else {
      d.innerHTML = `<div class="yfyt-bbl">${esc(text)}</div>`;
    }
    area.appendChild(d); area.scrollTop = area.scrollHeight;
  }

  function showTyping() {
    const area = document.getElementById('yfyt-chat-area');
    const d = document.createElement('div');
    d.className = 'yfyt-msg bot'; d.id = 'yfyt-typing';
    d.innerHTML = `<div class="yfyt-av">🌿</div><div class="yfyt-typing-bbl"><div class="yfyt-typing"><span></span><span></span><span></span></div></div>`;
    area.appendChild(d); area.scrollTop = area.scrollHeight;
  }
  function hideTyping() { const el = document.getElementById('yfyt-typing'); if(el) el.remove(); }

  function showCard(b) {
    const area = document.getElementById('yfyt-chat-area');
    const d = document.createElement('div');
    d.className = 'yfyt-msg bot';
    d.innerHTML = `
      <div class="yfyt-av">🌿</div>
      <div class="yfyt-bcard">
        <h4>🌾 Reservation Summary</h4>
        <div class="yfyt-brow"><span>Guest</span><span>${esc(b.name)}</span></div>
        <div class="yfyt-brow"><span>Date</span><span>${esc(b.date)}</span></div>
        <div class="yfyt-brow"><span>Time</span><span>${esc(b.time)}</span></div>
        <div class="yfyt-brow"><span>Party</span><span>${b.party} guests</span></div>
        ${b.special ? `<div class="yfyt-brow"><span>Notes</span><span>${esc(b.special)}</span></div>` : ''}
        <button class="yfyt-cbtn" onclick="window.open('https://tables.toasttab.com/restaurants/ee050f6c-7e01-42f7-9836-460ede1edb20/reserve','_blank')">Complete Reservation →</button>
      </div>
    `;
    area.appendChild(d); area.scrollTop = area.scrollHeight;
    sendEmail(b);
  }

  function setChips(opts) {
    const c = document.getElementById('yfyt-chips');
    c.innerHTML = '';
    opts.forEach(o => {
      const b = document.createElement('button');
      b.className = 'yfyt-chip'; b.textContent = o;
      b.onclick = () => { c.innerHTML = ''; process(o); };
      c.appendChild(b);
    });
  }

  async function process(text) {
    addMsg(text, 'user'); showTyping();
    try {
      const reply = await callAI(text);
      hideTyping(); addMsg(reply, 'bot');
      if (pendingBooking) {
        showCard(pendingBooking); pendingBooking = null;
        setChips(['Book another table', 'Catering inquiry', 'Private event']);
      } else {
        const low = (text + reply).toLowerCase();
        if (low.includes('cater') || low.includes('event')) setChips(['Tell me more', 'Get a quote', 'Contact team']);
        else if (low.includes('chef') || low.includes('home')) setChips(['Book personal chef', 'Other services']);
        else if (low.includes('date') || low.includes('when')) setChips(['Tonight', 'This weekend', 'Next week']);
        else if (low.includes('how many') || low.includes('party')) setChips(['2 guests', '4 guests', 'Large group (6+)']);
        else setChips([]);
      }
    } catch(e) {
      hideTyping();
      addMsg('Having a little trouble. Please call us at 980-549-1999 🌿', 'bot');
    }
  }

  async function initChat() {
    showTyping();
    await new Promise(r => setTimeout(r, 900));
    hideTyping();
    addMsg('Welcome to Your Farms Your Table! 🌿\n\nI\'m here to help you reserve a table at Restaurant Constance, arrange catering, or book a private event.\n\nHow can I help you today?', 'bot');
    setChips(['Reserve a table', 'Catering & events', 'Personal chef', 'Private event']);
  }

  document.getElementById('yfyt-send-btn').addEventListener('click', sendMsg);
  document.getElementById('yfyt-input').addEventListener('keydown', e => { if(e.key==='Enter') sendMsg(); });

  function sendMsg() {
    const inp = document.getElementById('yfyt-input');
    const val = inp.value.trim();
    if (!val) return;
    inp.value = '';
    document.getElementById('yfyt-chips').innerHTML = '';
    process(val);
  }

})();
    
