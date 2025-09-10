
function toggleMenu(){
  const links = document.querySelector('.nav__links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
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

function scrollToTop(){ window.scrollTo({top:0, behavior:'smooth'}); }
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
