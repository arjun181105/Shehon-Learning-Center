
// Mobile nav
function toggleMenu(){
  const links = document.querySelector('.nav__links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
}

// Intersection-driven fade-ins
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('is-visible'); }
  });
}, {threshold: .22});
document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

// Count-up stats
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

// Back to top
function scrollToTop(){ window.scrollTo({top:0, behavior:'smooth'}); }
document.getElementById('year').textContent = new Date().getFullYear();

// Lightweight form handler (no backend): open mail client with prefilled body
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
  // Change the email address below if needed
  const to = 'hello@shehonlearning.com';
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  document.getElementById('form-status').textContent = 'Opening your email app…';
  return false;
}
