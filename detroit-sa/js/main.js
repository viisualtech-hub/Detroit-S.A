document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ duration: 800, once: true, offset: 60 });

  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  // Gallery filter
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.remove('active')); b.classList.add('active');
    const f = b.dataset.filter;
    document.querySelectorAll('.g-item').forEach(i => i.classList.toggle('hide', f !== 'all' && i.dataset.cat !== f));
  }));

  // Booking form -> PHP
  const form = document.getElementById('bookingForm');
  if (form) {
    const box = document.getElementById('formAlert');
    const show = (msg, ok) => { box.className = 'alert ' + (ok ? 'alert-success' : 'alert-danger'); box.textContent = msg; };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      form.querySelectorAll('.is-invalid').forEach(f => f.classList.remove('is-invalid'));
      const bad = [...form.querySelectorAll('[required]')].filter(f => !f.value.trim());
      if (bad.length) { bad.forEach(f => f.classList.add('is-invalid')); return show('Please fill in the highlighted fields.', false); }
      const btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
        const data = await res.json();
        show(data.message, data.success);
        if (data.success) form.reset();
      } catch { show('Could not send. Please call 031 577 0160 or WhatsApp us.', false); }
      btn.disabled = false; btn.textContent = 'Send request';
    });
  }
});

// Gallery lightbox
document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('lightbox');
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl), img = document.getElementById('lightboxImg');
  document.querySelectorAll('.g-link').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); img.src = a.getAttribute('href'); img.alt = a.dataset.title; modal.show();
  }));
});

// Gallery lightbox
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('lightbox'); if (!el) return;
  const modal = new bootstrap.Modal(el);
  const img = document.getElementById('lbImg'), cap = document.getElementById('lbCap');
  let list = [], idx = 0;
  const show = () => { const a = list[idx]; img.src = a.href; img.alt = a.dataset.caption; cap.textContent = a.dataset.caption; };
  document.querySelectorAll('.g-thumb').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    list = [...document.querySelectorAll('.g-item:not(.hide) .g-thumb')];
    idx = list.indexOf(a); show(); modal.show();
  }));
  const step = n => { idx = (idx + n + list.length) % list.length; show(); };
  document.getElementById('lbPrev').addEventListener('click', () => step(-1));
  document.getElementById('lbNext').addEventListener('click', () => step(1));
  el.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
});
