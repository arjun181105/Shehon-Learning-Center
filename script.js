
function toggleMenu(){
  const links = document.querySelector('.nav__links');
  if(!links) return;

  let backdrop = document.querySelector('.nav-backdrop');
  if(!backdrop){
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', closeMenu);
  }

  const isOpen = links.classList.toggle('is-open');
  backdrop.classList.toggle('is-active', isOpen);
  document.body.classList.toggle('no-scroll', isOpen);

  if(isOpen){
    document.addEventListener('keydown', escHandler);
  }else{
    document.removeEventListener('keydown', escHandler);
  }

  function escHandler(e){ if(e.key === 'Escape'){ closeMenu(); } }
  function closeMenu(){
    links.classList.remove('is-open');
    backdrop.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', escHandler);
  }
}

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

document.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
});

function onSubmit(e){
  e.preventDefault();
  const f = e.target;
  const data = new FormData(f);
  const interests = data.getAll('interest').join(', ');
  const subject = encodeURIComponent('SLC Trial Enquiry');
  const body = encodeURIComponent(
    `Parent: ${data.get('parent')}
Phone: ${data.get('phone')}
Student: ${data.get('student')}
Year: ${data.get('year')}
Interested in: ${interests}
Notes: ${data.get('notes') || ''}`
  );
  const to = 'hello@shehonlearning.com';
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  const status = document.getElementById('form-status');
  if(status) status.textContent = 'Opening your email app…';
  return false;
}

function scrollToTop(){ window.scrollTo({top:0, behavior:'smooth'}); }
