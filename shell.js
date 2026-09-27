/* =========================================================
   Shell — sidebar & topbar dipakai di semua halaman internal
   ========================================================= */
const LMS_NAV = {
  guru: [
    { id: "dashboard-guru", label: "Dashboard", href: "dashboard-guru.html", ic: "◧" },
    { id: "kursus-topik", label: "Kursus & Topik", href: "kursus-topik.html", ic: "📘" },
    { id: "bank-soal", label: "Bank Soal & Kuis", href: "bank-soal.html", ic: "🗂" },
    { id: "pengumuman", label: "Pengumuman", href: "pengumuman.html", ic: "📣" },
    { id: "buku-nilai", label: "Buku Nilai", href: "buku-nilai.html", ic: "★" },
    { id: "laporan", label: "Laporan & Analitik", href: "laporan.html", ic: "📊" },
    { id: "pengaturan", label: "Pengaturan", href: "pengaturan.html", ic: "⚙" }
  ],
  siswa: [
    { id: "jalur-belajar", label: "Dashboard", href: "jalur-belajar.html", ic: "◧" },
    { id: "jalur-belajar", label: "Jalur Belajar", href: "jalur-belajar.html", ic: "🧭" },
    { id: "buku-nilai", label: "Nilai Saya", href: "buku-nilai.html", ic: "★" },
    { id: "pengaturan", label: "Pengaturan", href: "pengaturan.html", ic: "⚙" }
  ],
  superadmin: [
    { id: "superadmin", label: "Dashboard Superadmin", href: "superadmin.html", ic: "◧" },
    { id: "kelola-pengguna", label: "Kelola Pengguna", href: "kelola-pengguna.html", ic: "👤" },
    { id: "kelola-kelas", label: "Kelola Kelas", href: "kelola-kelas.html", ic: "🏫" },
    { id: "pengumuman", label: "Pengumuman", href: "pengumuman.html", ic: "📣" },
    { id: "log-sistem", label: "Log Sistem & Keamanan", href: "log-sistem.html", ic: "🛡" },
    { id: "buku-nilai", label: "Rekap Nilai Sekolah", href: "buku-nilai.html", ic: "★" },
    { id: "pengaturan", label: "Pengaturan Sekolah", href: "pengaturan.html", ic: "⚙" }
  ]
};

function lmsInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

function lmsRenderShell({ activeId, title }) {
  const user = LMS_AUTH.requireRole(null);
  if (!user) return null;

  const nav = LMS_NAV[user.role] || [];
  const cfg = window.LMS_CONFIG;

  const navHtml = nav.map(n => `
    <a href="${n.href}" class="${n.id === activeId ? "active" : ""}">
      <span class="ic">${n.ic}</span><span>${n.label}</span>
    </a>`).join("");

  const roleLabel = { guru: "Guru Matematika", siswa: "Siswa", superadmin: "Administrator Sekolah" }[user.role] || user.role;

  document.body.insertAdjacentHTML("afterbegin", `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="mark">Σ</div>
          <div>
            <div class="name">${cfg.APP_NAME}</div>
            <div class="sub">${cfg.SCHOOL_NAME}</div>
          </div>
        </div>
        <div class="user">
          <div class="avatar">${lmsInitials(user.name)}</div>
          <div class="who">
            <div class="n">${user.name}</div>
            <div class="r">${roleLabel}${user.kelas ? " · " + user.kelas : ""}</div>
          </div>
        </div>
        <nav>${navHtml}</nav>
        <div class="logout">
          <a href="#" id="lms-logout-btn"><span class="ic">⎋</span><span>Keluar Sistem</span></a>
        </div>
      </aside>
      <div class="main">
        <div class="topbar">
          <div class="greet">
            <span class="text-label-lg">Selamat datang, ${user.name.split(" ")[0]}!</span>
          </div>
          <span class="pill">Semester Genap 2024/2025</span>
          <div class="search"><span>🔍</span><span>Cari materi, siswa, topik…</span></div>
          <div class="icons">
            <div class="icon-btn" title="Notifikasi">🔔</div>
            <div class="avatar">${lmsInitials(user.name)}</div>
          </div>
        </div>
        <div class="content" id="lms-page-content"></div>
      </div>
    </div>
  `);

  document.getElementById("lms-logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    LMS_AUTH.logout();
    window.location.href = "index.html";
  });

  document.title = `${title} — ${cfg.APP_NAME}`;
  return document.getElementById("lms-page-content");
}
