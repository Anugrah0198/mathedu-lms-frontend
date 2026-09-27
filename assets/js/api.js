/* =========================================================
   API client — memanggil Google Apps Script Web App
   Catatan penting: kita kirim POST dengan body teks biasa
   (bukan header Content-Type: application/json) supaya browser
   TIDAK mengirim preflight OPTIONS — Apps Script Web App tidak
   bisa merespons preflight dengan benar. Ini trik standar untuk
   GAS + frontend di domain lain (Vercel).
   ========================================================= */
const LMS_API = {
  async call(action, payload = {}) {
    const body = JSON.stringify({
      action,
      token: LMS_AUTH.getToken() || "",
      ...payload
    });

    let res;
    try {
      res = await fetch(window.LMS_CONFIG.API_URL, {
        method: "POST",
        redirect: "follow", // GAS mengirim redirect 302 sebelum ke respons asli
        body
      });
    } catch (err) {
      throw new Error("Tidak bisa menghubungi server. Periksa koneksi atau URL backend di config.js.");
    }

    let json;
    try {
      json = await res.json();
    } catch (err) {
      throw new Error("Respons server tidak valid. Pastikan Web App sudah di-deploy dengan akses 'Anyone'.");
    }

    if (!json.ok) {
      if (json.code === "AUTH_REQUIRED") {
        LMS_AUTH.logout();
        window.location.href = "index.html";
      }
      throw new Error(json.message || "Terjadi kesalahan pada server.");
    }
    return json.data;
  }
};

const LMS_AUTH = {
  getToken() { return localStorage.getItem("lms_token"); },
  getUser() {
    try { return JSON.parse(localStorage.getItem("lms_user") || "null"); }
    catch (e) { return null; }
  },
  setSession(token, user) {
    localStorage.setItem("lms_token", token);
    localStorage.setItem("lms_user", JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
  },
  requireRole(roles) {
    const u = this.getUser();
    if (!u || !this.getToken()) {
      window.location.href = "index.html";
      return null;
    }
    if (roles && !roles.includes(u.role)) {
      window.location.href = "index.html";
      return null;
    }
    return u;
  }
};

function lmsToast(msg, isError = false) {
  let el = document.getElementById("lms-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "lms-toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = "toast show" + (isError ? " error" : "");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 3200);
}
