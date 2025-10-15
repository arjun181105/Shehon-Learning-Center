
// ============ Config (replace phone numbers) ============
const SLC_PHONE = '+61XXXXXXXXX'; // TODO: replace
const WHATSAPP = 'https://wa.me/61XXXXXXXXX?text=Hi%20I%27d%20like%20a%20free%20trial%20for%20my%20child'; // TODO: replace

// ============ iPhone-safe helpers ============
let __scrollY = 0;
function setVhVar(){
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
function setHeaderVar(){
  const header = document.querySelector('.site-header');
  const h = header ? header.offsetHeight : 64;
  document.documentElement.style.setProperty('--header-h', `${h}px`);
}
window.addEventListener('resize', ()=>{ setVhVar(); setHeaderVar(); });
window.addEventListener('orientationchange', ()=>{ setTimeout(()=>{ setVhVar(); setHeaderVar(); }, 150); });
document.addEventListener('DOMContentLoaded', ()=>{ setVhVar(); setHeaderVar(); });

function ensureBackdrop(){
  let backdrop = document.querySelector('.nav-backdrop');
  if(!backdrop){
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', closeMenu);
  }
  return backdrop;
}
function lockScroll(){
  __scrollY = window.scrollY || window.pageYOffset;
  document.body.classList.add('no-scroll');
  document.body.style.top = `-${__scrollY}px`;
}
function unlockScroll(){
  document.body.classList.remove('no-scroll');
  const y = __scrollY;
  document.body.style.top = '';
  window.scrollTo(0, y);
}

// ============ Menu toggle ============
function toggleMenu(){
  const panel = document.querySelector('.nav__links');
  const btn = document.querySelector('.nav__toggle');
  if(!panel || !btn) return;

  const backdrop = ensureBackdrop();
  const opening = !panel.classList.contains('is-open');

  panel.classList.toggle('is-open', opening);
  backdrop.classList.toggle('is-active', opening);
  btn.setAttribute('aria-expanded', String(opening));

  if(opening){
    lockScroll();
    const firstLink = panel.querySelector('a, button');
    if(firstLink) firstLink.focus();
    document.addEventListener('keydown', escHandler);
  } else {
    unlockScroll();
    document.removeEventListener('keydown', escHandler);
    btn.focus();
  }

  function escHandler(e){ if(e.key === 'Escape'){ closeMenu(); } }
}

function closeMenu(){
  document.querySelector('.nav__links')?.classList.remove('is-open');
  document.querySelector('.nav-backdrop')?.classList.remove('is-active');
  document.querySelector('.nav__toggle')?.setAttribute('aria-expanded', 'false');
  unlockScroll();
}

// Auto-close if resized to desktop
window.addEventListener('resize', ()=>{
  if(window.innerWidth > 920){
    closeMenu();
  }
});

// ============ Animations ============
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('is-visible'); } });
}, {threshold: .22});
document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

function animateCounts(){
  document.querySelectorAll('.stat__num').forEach(el => {
    const target = parseInt(el.dataset.count,10);
    let n = 0;
    const step = Math.max(1, Math.round(target/60));
    const tick = setInterval(() => {
      n += step;
      if(n >= target){ n = target; clearInterval(tick); }
      el.textContent = n;
    }, 18);
  });
}
window.addEventListener('load', animateCounts);

// ============ Utilities ============
function scrollToTop(){ window.scrollTo({top:0, behavior:'smooth'}); }
document.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
  // Update tel/whatsapp links if placeholders changed
  document.querySelectorAll('a[href^="tel:+61"]').forEach(a => a.href = `tel:${SLC_PHONE}`);
  document.querySelectorAll('a[href*="wa.me/61"]').forEach(a => a.href = WHATSAPP);
});

// ============ Simple analytics hooks (optional GA4) ============
function track(event, params){ if(window.gtag){ window.gtag('event', event, params || {}); } }
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a');
  if(!a) return;
  if(a.href.startsWith('tel:')) track('click_tel', {location:'link'});
  if(a.href.startsWith('mailto:')) track('click_mailto', {location:'contact'});
  if(a.href.includes('wa.me')) track('click_whatsapp', {location:'contact'});
});

// ============ Form submit -> mailto ============
function onSubmit(e){
  e.preventDefault();
  const f = e.target;
  const data = new FormData(f);
  const interests = data.getAll('interest').join(', ');
  const subject = encodeURIComponent('SLC Trial Enquiry');
  const body = encodeURIComponent(
    `Phone: ${data.get('phone')}
Parent: ${data.get('parent')}
Year: ${data.get('year')}
Interested in: ${interests}
Notes: ${data.get('notes') || ''}`
  );
  const to = 'info@shehonlearning.com';
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  const status = document.getElementById('form-status');
  if(status) status.textContent = 'Opening your email app…';
  track('submit_lead', {source:'web_form'});
  return false;
}
