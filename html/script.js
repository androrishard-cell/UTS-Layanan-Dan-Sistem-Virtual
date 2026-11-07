/* =============================================
   EduVirtual LMS – script.js
   Interaktivitas: animasi, upload, jam, auth UI
   ============================================= */

/* ── PROTEKSI HALAMAN ── */
// Pastikan user sudah login; redirect ke login.html jika belum
const session = requireAuth();

/* ── ISI INFO USER DI NAVBAR & HERO ── */
if (session) {
  const navAvatar = document.getElementById('navAvatar');
  const navName   = document.getElementById('navName');
  const greeting  = document.getElementById('heroGreeting');
  const namaInput = document.getElementById('namaInput');
  const nimInput  = document.getElementById('nimInput');

  if (navAvatar) navAvatar.textContent = session.name.charAt(0).toUpperCase();
  if (navName)   navName.textContent   = session.name;

  // Greeting berdasarkan waktu
  const hour = new Date().getHours();
  const sapa = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam';
  if (greeting) greeting.textContent = `${sapa}, ${session.name} 👋`;

  // Auto-isi form tugas
  if (namaInput) namaInput.value = session.name;
  if (nimInput && session.nim) nimInput.value = session.nim;
}


/* ── 1. ANIMASI ANGKA STATISTIK ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      clearInterval(timer);
      el.textContent = target;
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));


/* ── 2. PROGRESS BAR ANIMASI SAAT SCROLL ── */
const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target;
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => { bar.style.width = targetWidth; });
        progressObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll('.progress').forEach(el => progressObserver.observe(el));


/* ── 3. FILE UPLOAD – DRAG & DROP + INPUT ── */
const dropZone  = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo  = document.getElementById('fileInfo');

function showFileInfo(file) {
  const mb = (file.size / (1024 * 1024)).toFixed(2);
  fileInfo.innerHTML = `📄 <strong>${file.name}</strong> &nbsp;|&nbsp; ${mb} MB`;
  fileInfo.classList.remove('hidden');
}

if (fileInput) {
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) showFileInfo(file);
  });
}

if (dropZone) {
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragging');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (file) showFileInfo(file);
  });
}


/* ── 4. SUBMIT TUGAS (simulasi) ── */
function submitTugas() {
  const nama    = document.getElementById('namaInput');
  const nim     = document.getElementById('nimInput');
  const matkul  = document.getElementById('matkulSelect');
  const successMsg = document.getElementById('successMsg');

  if (!nama || !nama.value.trim()) { alert('⚠️ Nama lengkap harus diisi!'); return; }
  if (!nim  || !nim.value.trim())  { alert('⚠️ NIM harus diisi!'); return; }
  if (!matkul || matkul.value === '-- Pilih Mata Kuliah --') {
    alert('⚠️ Pilih mata kuliah terlebih dahulu!'); return;
  }
  if (!fileInfo || fileInfo.classList.contains('hidden')) {
    alert('⚠️ Pilih file tugas terlebih dahulu!'); return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Mengirim...';

  setTimeout(() => {
    successMsg.classList.remove('hidden');
    btn.textContent = '✅ Terkirim';

    setTimeout(() => {
      matkul.selectedIndex = 0;
      fileInfo.classList.add('hidden');
      successMsg.classList.add('hidden');
      btn.disabled = false;
      btn.textContent = '📤 Kumpulkan Tugas';
    }, 3000);
  }, 1200);
}


/* ── 5. JAM DIGITAL REAL-TIME ── */
function updateClock() {
  const now = new Date();
  const hh  = String(now.getHours()).padStart(2, '0');
  const mm  = String(now.getMinutes()).padStart(2, '0');
  const ss  = String(now.getSeconds()).padStart(2, '0');

  const clockEl = document.getElementById('clock');
  if (clockEl) clockEl.textContent = `${hh}:${mm}:${ss}`;

  const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const dateEl = document.getElementById('clockDate');
  if (dateEl) dateEl.textContent = dateStr;
}
updateClock();
setInterval(updateClock, 1000);


/* ── 6. NAVBAR – ACTIVE LINK PADA SCROLL ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let currentId = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) currentId = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
});


/* ── 7. FADE‑IN SAAT HALAMAN DIMUAT ── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
