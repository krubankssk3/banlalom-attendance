/* ============================================================
 *  ระบบเช็คชื่อนักเรียนโรงเรียนบ้านละลม
 *  ไฟล์: app-ui.js  (ไฟล์กลาง - ใส่ในทุกหน้า)
 *  หน้าที่:
 *    1) Loading overlay แบบ SweetAlert (เบลอพื้นหลัง + วงแหวน + โลโก้)
 *    2) ดักจับ fetch อัตโนมัติ -> ขึ้น/ปิด loading เอง ทุกจุดที่โหลดข้อมูล
 *    3) แคชข้อมูลที่ไม่ค่อยเปลี่ยน -> โหลดไวขึ้นมาก
 *    4) Scroll reveal - เนื้อหาค่อยๆ เลื่อนขึ้นมาตอนเลื่อนหน้าจอ
 * ============================================================ */
(function () {
  'use strict';

  var LOGO = 'https://lh3.googleusercontent.com/d/1cMO_KlWt3kFBgj2RQ0vVbi9PBDZ-Toaq=w256';

  /* ---------- 1. CSS ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes bl-spin{to{transform:rotate(360deg)}}',
    '@keyframes bl-pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}',
    '@keyframes bl-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}',
    '#bl-loading{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;',
    'background:rgba(241,245,249,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}',
    '#bl-loading.show{display:flex}',
    '#bl-box{animation:bl-pop .25s ease both;background:#fff;border-radius:20px;padding:26px 34px;',
    'box-shadow:0 18px 45px rgba(4,44,83,.18);text-align:center;min-width:210px}',
    '#bl-ring{position:relative;width:78px;height:78px;margin:0 auto}',
    '#bl-ring::before{content:"";position:absolute;inset:0;border-radius:50%;',
    'border:4px solid #E6F1FB;border-top-color:#185FA5;border-right-color:#EF9F27;',
    'animation:bl-spin .85s linear infinite}',
    '#bl-ring img{position:absolute;inset:13px;width:52px;height:52px;object-fit:contain}',
    '#bl-text{margin-top:14px;font-size:13px;color:#334155;font-weight:500}',
    '#bl-sub{margin-top:2px;font-size:11px;color:#94a3b8}',
    '.sr-item{opacity:0;transform:translateY(22px)}',
    '.sr-in{animation:bl-up .55s cubic-bezier(.22,.9,.3,1) forwards}'
  ].join('');
  document.head.appendChild(css);

  /* ---------- 2. Overlay ---------- */
  var overlay, textEl, subEl;
  function buildOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'bl-loading';
    overlay.innerHTML =
      '<div id="bl-box">' +
        '<div id="bl-ring"><img src="' + LOGO + '" alt="" ' +
          'onerror="this.style.display=\'none\'"></div>' +
        '<p id="bl-text">กำลังโหลดข้อมูล...</p>' +
        '<p id="bl-sub">โรงเรียนบ้านละลม</p>' +
      '</div>';
    document.body.appendChild(overlay);
    textEl = overlay.querySelector('#bl-text');
    subEl = overlay.querySelector('#bl-sub');
  }

  window.showLoading = function (text, sub) {
    buildOverlay();
    textEl.textContent = text || 'กำลังโหลดข้อมูล...';
    subEl.textContent = sub || 'โรงเรียนบ้านละลม';
    overlay.classList.add('show');
  };
  window.hideLoading = function () {
    if (overlay) overlay.classList.remove('show');
  };

  /* ---------- 3. ชื่อฟังก์ชันภาษาไทย (แสดงบน overlay) ---------- */
  var LABEL = {
    login: 'กำลังเข้าสู่ระบบ...',
    changePassword: 'กำลังเปลี่ยนรหัสผ่าน...',
    requestReset: 'กำลังส่งรหัส OTP...',
    confirmReset: 'กำลังตั้งรหัสผ่านใหม่...',
    updateMyProfile: 'กำลังบันทึกโปรไฟล์...',
    getStudents: 'กำลังโหลดรายชื่อนักเรียน...',
    getStudentsByClass: 'กำลังโหลดรายชื่อนักเรียน...',
    getStudentsManage: 'กำลังโหลดรายชื่อนักเรียน...',
    addStudent: 'กำลังบันทึกนักเรียน...',
    updateStudent: 'กำลังบันทึกการแก้ไข...',
    deleteStudent: 'กำลังลบนักเรียน...',
    bulkAddStudents: 'กำลังเพิ่มนักเรียนหลายคน...',
    getTeachers: 'กำลังโหลดข้อมูลครู...',
    getTeachersManage: 'กำลังโหลดข้อมูลครู...',
    addTeacher: 'กำลังบันทึกข้อมูลครู...',
    updateTeacher: 'กำลังบันทึกการแก้ไข...',
    deleteTeacher: 'กำลังลบข้อมูลครู...',
    resetTeacherPassword: 'กำลังรีเซ็ตรหัสผ่าน...',
    getClasses: 'กำลังโหลดห้องเรียน...',
    getClassesManage: 'กำลังโหลดห้องเรียน...',
    getMyClasses: 'กำลังโหลดห้องที่รับผิดชอบ...',
    addClass: 'กำลังบันทึกห้องเรียน...',
    updateClass: 'กำลังบันทึกการแก้ไข...',
    deleteClass: 'กำลังลบห้องเรียน...',
    getSubjects: 'กำลังโหลดรายวิชา...',
    addSubject: 'กำลังบันทึกรายวิชา...',
    updateSubject: 'กำลังบันทึกการแก้ไข...',
    deleteSubject: 'กำลังลบรายวิชา...',
    getSchedule: 'กำลังโหลดตารางสอน...',
    getTodaySchedule: 'กำลังโหลดคาบสอนวันนี้...',
    addSchedule: 'กำลังบันทึกคาบสอน...',
    deleteSchedule: 'กำลังลบคาบสอน...',
    getAttendance: 'กำลังโหลดข้อมูลการเช็คชื่อ...',
    saveAttendance: 'กำลังบันทึกการเช็คชื่อ...',
    openSession: 'กำลังเปิดรอบสแกน...',
    closeSession: 'กำลังปิดรอบสแกน...',
    getSessionStatus: 'กำลังตรวจสอบรอบสแกน...',
    getSessionAttendance: 'กำลังโหลดผลการสแกน...',
    scanCheckin: 'กำลังบันทึกการสแกน...',
    registerFace: 'กำลังลงทะเบียนใบหน้า...',
    scanFace: 'กำลังตรวจใบหน้า...',
    deleteFace: 'กำลังลบข้อมูลใบหน้า...',
    getFaceStatus: 'กำลังโหลดสถานะใบหน้า...',
    reportDaily: 'กำลังสร้างรายงานรายวัน...',
    reportStudent: 'กำลังสร้างรายงานรายคน...',
    reportClass: 'กำลังสร้างรายงานรายห้อง...',
    reportSubject: 'กำลังสร้างรายงานรายคาบ...',
    reportSubjectDay: 'กำลังสร้างรายงานรายคาบ...',
    dashboardStats: 'กำลังโหลดแดชบอร์ด...',
    publicStats: 'กำลังโหลดสถิติ...',
    getTodayStats: 'กำลังโหลดสถิติวันนี้...',
    getSettings: 'กำลังโหลดการตั้งค่า...',
    updateSettings: 'กำลังบันทึกการตั้งค่า...',
    getLineGroups: 'กำลังโหลดกลุ่ม LINE...',
    linkGroupClass: 'กำลังผูกกลุ่ม LINE...',
    notifyClass: 'กำลังส่งแจ้งเตือน LINE...',
    lookupStudent: 'กำลังค้นหานักเรียน...'
  };

  function actionOf(url, options) {
    try {
      var m = String(url).match(/[?&]action=([a-zA-Z]+)/);
      if (m) return m[1];
      if (options && options.body) {
        var b = JSON.parse(options.body);
        if (b && b.action) return b.action;
      }
    } catch (e) {}
    return '';
  }

  /* ---------- 4. แคช (โหลดไวขึ้น) ---------- */
  // ข้อมูลที่ไม่ค่อยเปลี่ยนระหว่างใช้งาน -> เก็บไว้ 90 วินาที
  var CACHEABLE = ['getClasses', 'getMyClasses', 'getTeachers', 'getSubjects',
                   'getSchedule', 'getSettings', 'getConfig'];
  var TTL = 90 * 1000;
  var CACHE_PREFIX = 'bl_c_';

  function cacheGet(key) {
    try {
      var raw = sessionStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (Date.now() - obj.t > TTL) { sessionStorage.removeItem(CACHE_PREFIX + key); return null; }
      return obj.v;
    } catch (e) { return null; }
  }
  function cacheSet(key, val) {
    try { sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ t: Date.now(), v: val })); } catch (e) {}
  }
  window.clearAppCache = function () {
    try {
      Object.keys(sessionStorage).forEach(function (k) {
        if (k.indexOf(CACHE_PREFIX) === 0) sessionStorage.removeItem(k);
      });
    } catch (e) {}
  };

  /* ---------- 5. ดักจับ fetch ---------- */
  var pending = 0, showTimer = null;
  var nativeFetch = window.fetch.bind(window);

  window.fetch = function (url, options) {
    var isApi = String(url).indexOf('script.google.com') !== -1;
    if (!isApi) return nativeFetch(url, options);

    var action = actionOf(url, options);
    var isPost = options && String(options.method || '').toUpperCase() === 'POST';

    // อ่านจากแคชถ้ามี (เฉพาะ GET ที่แคชได้) -> ตอบทันที ไม่ต้องรอเน็ต
    if (!isPost && CACHEABLE.indexOf(action) !== -1) {
      var hit = cacheGet(String(url));
      if (hit !== null) {
        return Promise.resolve(new Response(hit, {
          status: 200, headers: { 'Content-Type': 'application/json' }
        }));
      }
    }

    // บันทึก/แก้ไขอะไรก็ตาม -> ล้างแคช กันข้อมูลเก่าค้าง
    if (isPost) window.clearAppCache();

    pending++;
    // หน่วง 200ms ก่อนโชว์ - ถ้าโหลดเร็วจะไม่กะพริบรบกวนสายตา
    // window.BL_SILENT = true -> ไม่ต้องขึ้น overlay (เช่น สแกนใบหน้าอัตโนมัติทุก 3 วิ)
    if (pending === 1 && !window.BL_SILENT) {
      clearTimeout(showTimer);
      showTimer = setTimeout(function () {
        if (pending > 0) window.showLoading(LABEL[action] || 'กำลังโหลดข้อมูล...');
      }, 200);
    }

    function done() {
      pending = Math.max(0, pending - 1);
      if (pending === 0) { clearTimeout(showTimer); window.hideLoading(); }
    }

    return nativeFetch(url, options).then(function (res) {
      // เก็บแคช
      if (!isPost && CACHEABLE.indexOf(action) !== -1 && res.ok) {
        var clone = res.clone();
        clone.text().then(function (t) { cacheSet(String(url), t); }).catch(function () {});
      }
      done();
      return res;
    }).catch(function (err) {
      done();
      throw err;
    });
  };

  /* ---------- 6. Scroll reveal ---------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;

    var sel = [
      'main .bg-white.rounded-xl',
      'main .bg-white.rounded-2xl',
      'main .bg-white.rounded-lg',
      'body > div .bg-white.rounded-xl',
      'body > div .bg-white.rounded-2xl'
    ].join(',');

    var nodes = [];
    try { nodes = Array.prototype.slice.call(document.querySelectorAll(sel)); } catch (e) { return; }

    var items = nodes.filter(function (el) {
      if (el.closest('#bl-loading')) return false;
      if (el.closest('aside')) return false;
      // ข้ามอันที่มี animation อยู่แล้ว (fade-up / reveal ที่ทำไว้ก่อนหน้า)
      if (el.classList.contains('fade-up') || el.classList.contains('reveal')) return false;
      return true;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('sr-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el, i) {
      el.classList.add('sr-item');
      el.style.animationDelay = Math.min(i * 60, 300) + 'ms';
      io.observe(el);
    });

    // กันพลาด: ถ้า 2.5 วิยังไม่โผล่ ให้แสดงทั้งหมด
    setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains('sr-in')) el.classList.add('sr-in');
      });
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { buildOverlay(); initReveal(); });
  } else {
    buildOverlay(); initReveal();
  }
})();
