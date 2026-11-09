/* =============================================
   auth.js – Login / Logout / Session handler
   EduVirtual LMS (pure HTML+JS, localStorage)
   ============================================= */

/* ── DAFTAR AKUN ── */
const USERS = {
  mahasiswa: [
    { id: '248111057', password: 'mhs123', name: 'Andro Rishard Imanuel Nailebas', role: 'mahasiswa', nim: '248111057', prodi: 'Teknik Informatika' },
    { id: '248111067', password: 'mhs123', name: 'Elluan',                          role: 'mahasiswa', nim: '248111067', prodi: 'Teknik Informatika' },
    { id: '248111053', password: 'mhs123', name: 'Erkes Thon Neno',                 role: 'mahasiswa', nim: '248111053', prodi: 'Teknik Informatika' },
    { id: '24811048',  password: 'mhs123', name: 'Stiven Dju',                      role: 'mahasiswa', nim: '24811048',  prodi: 'Teknik Informatika' },
    { id: '248111056', password: 'mhs123', name: 'Odi Kase',                        role: 'mahasiswa', nim: '248111056', prodi: 'Teknik Informatika' },
    { id: '2024001',   password: 'mhs123', name: 'Budi Santoso',                    role: 'mahasiswa', nim: '2024001',   prodi: 'Teknik Informatika' },
    { id: '2024002',   password: 'mhs123', name: 'Siti Rahayu',                     role: 'mahasiswa', nim: '2024002',   prodi: 'Sistem Informasi'   },
  ],
  dosen: [
    { id: 'dosen01', password: 'dsn123', name: 'Dr. Hendra, M.Kom',   role: 'dosen', nip: 'NIP001', matkul: 'Layanan Virtual'   },
    { id: 'dosen02', password: 'dsn123', name: 'Prof. Lestari, Ph.D', role: 'dosen', nip: 'NIP002', matkul: 'Jaringan Komputer' },
  ]
};

/* ── STATE ── */
let currentRole = 'mahasiswa';

/* ── SWITCH ROLE TAB ── */
function switchRole(role) {
  currentRole = role;
  const tabM   = document.getElementById('tabMahasiswa');
  const tabD   = document.getElementById('tabDosen');
  const label  = document.getElementById('labelUsername');
  const usrInp = document.getElementById('username');

  tabM.classList.toggle('active', role === 'mahasiswa');
  tabD.classList.toggle('active', role === 'dosen');

  if (role === 'mahasiswa') {
    label.textContent    = 'NIM / Username';
    usrInp.placeholder   = 'Masukkan NIM Anda';
  } else {
    label.textContent    = 'ID Dosen';
    usrInp.placeholder   = 'Masukkan ID Dosen';
  }
  hideAlerts();
}

/* ── TOGGLE PASSWORD VISIBILITY ── */
const togglePass = document.getElementById('togglePass');
const passInput  = document.getElementById('password');
if (togglePass && passInput) {
  togglePass.addEventListener('click', () => {
    if (passInput.type === 'password') {
      passInput.type = 'text';
      togglePass.textContent = '🙈';
    } else {
      passInput.type = 'password';
      togglePass.textContent = '👁️';
    }
  });
}

/* ── LUPA PASSWORD ── */
function showForgot() {
  showInfo('Hubungi administrator kampus untuk mereset password Anda.');
}

/* ── ALERT HELPERS ── */
function showError(msg) {
  const el = document.getElementById('alertError');
  document.getElementById('alertMsg').textContent = msg;
  el.classList.add('show');
  document.getElementById('alertInfo').classList.remove('show');
}
function showInfo(msg) {
  const el = document.getElementById('alertInfo');
  document.getElementById('alertInfoMsg').textContent = msg;
  el.classList.add('show');
  document.getElementById('alertError').classList.remove('show');
}
function hideAlerts() {
  document.getElementById('alertError').classList.remove('show');
  document.getElementById('alertInfo').classList.remove('show');
}

/* ── HANDLE LOGIN ── */
function handleLogin(e) {
  e.preventDefault();
  hideAlerts();

  const userId   = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.getElementById('rememberMe').checked;
  const btn      = document.getElementById('btnLogin');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Memverifikasi...';

  setTimeout(() => {
    const userList = USERS[currentRole];
    const found    = userList.find(u => u.id === userId && u.password === password);

    if (found) {
      const session = {
        ...found,
        loginTime: new Date().toISOString(),
        remember
      };
      sessionStorage.setItem('lms_session', JSON.stringify(session));
      if (remember) localStorage.setItem('lms_remember', JSON.stringify({ id: userId, role: currentRole }));

      btn.innerHTML = '✅ Berhasil! Mengalihkan...';
      showInfo('Login berhasil! Selamat datang, ' + found.name);

      setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    } else {
      showError('NIM / password salah. Periksa kembali dan coba lagi.');
      btn.disabled = false;
      btn.innerHTML = '🔑 Masuk';

      const card = document.querySelector('.login-card');
      card.style.animation = 'none';
      card.style.transform = 'translateX(-8px)';
      setTimeout(() => {
        card.style.transform = 'translateX(8px)';
        setTimeout(() => { card.style.transform = ''; }, 100);
      }, 100);
    }
  }, 1000);
}

/* ── CEK REMEMBER ME SAAT HALAMAN DIBUKA ── */
(function checkRemember() {
  const rem = localStorage.getItem('lms_remember');
  if (rem) {
    try {
      const { id, role } = JSON.parse(rem);
      document.getElementById('username').value  = id;
      document.getElementById('rememberMe').checked = true;
      switchRole(role);
    } catch {}
  }
})();

/* ── LOGOUT ── */
function logout() {
  sessionStorage.removeItem('lms_session');
  localStorage.removeItem('lms_remember');
  window.location.href = 'login.html';
}

/* ── PROTEKSI HALAMAN ── */
function requireAuth() {
  const session = sessionStorage.getItem('lms_session');
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return JSON.parse(session);
}
