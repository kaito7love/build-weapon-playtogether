/* PT Build - giao diện tra cứu. Dữ liệu: window.PT_DATA (js/data.js), công thức: window.PTCalc (js/calc.js). */
(() => {
  "use strict";
  const D = window.PT_DATA;
  const C = window.PTCalc;
  // Website chỉ dùng dòng bậc S. Bỏ dòng bậc khác và các build mẫu có dùng dòng đó.
  const KEEP_TIERS = ["S"];
  D.lines = D.lines.filter((l) => !l.tier || KEEP_TIERS.includes(l.tier));
  const keptNames = new Set(D.lines.map((l) => l.name));
  D.builds = D.builds.filter((b) => b.lines.every((n) => keptNames.has(n)));
  D.guns.forEach((g) => Object.assign(g, (window.PT_GUN_META || {})[g.id] || {}));
  (window.PT_EXTRA_GUNS || []).forEach((g) => { if (!D.guns.some((x) => x.id === g.id)) D.guns.push({ ...g, measured: { speed: false, dame: false } }); });
  // dùng tên đầy đủ trong game (gameName) cho mọi trang; cập nhật luôn tên súng trong build mẫu
  const RENAMED = new Map();
  D.guns.forEach((g) => { if (g.gameName && g.gameName !== g.name) { RENAMED.set(g.name, g.gameName); g.name = g.gameName; } });
  D.builds.forEach((b) => { if (RENAMED.has(b.gun)) b.gun = RENAMED.get(b.gun); });
  const renameText = (t) => { let o = String(t ?? ""); RENAMED.forEach((nw, old) => { o = o.split(old).join(nw); }); return o; };
  const PET_OPTIONS = [0.5, 0.25]; // pet chỉ có 2 mức cộng Tấn công
  const petOf = (x) => PET_OPTIONS.find((o) => Math.abs(o - x) < 1e-6) ?? PET_OPTIONS[0];
  const P = D.params;
  P.maxSpdFlat = 2; // cho phép tối đa 2 dòng +0,5/giây (Excel để 1 vì chưa kiểm chứng game có ra trùng); trang hiển thị cảnh báo khi build dùng 2 dòng
  const SF_VERIFIED = 1;
  const OPT_TIERS = ["S"]; // tìm tối ưu chỉ xét dòng bậc S, giống file Excel
  const NO_LINE = "(không có dòng)";
  const FPS_CHOICES = [30, 60, 90, 120];
  const GUN_COLORS = ["#ef4565", "#2fa4ff", "#22b07d", "#f59f00", "#9b5de5", "#ff7a3d", "#14b8a6", "#e11d93"];

  // ---------- tiện ích ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n, d = 2) => (typeof n === "number" && isFinite(n)) ? n.toLocaleString("vi-VN", { maximumFractionDigits: d, useGrouping: true }) : "—";
  const pct = (x) => fmt(x * 100, 1) + "%";
  const signed = (n, d = 2) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmt(Math.abs(n), d);
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const fmtTime = (s) => (!isFinite(s) ? "chưa rõ" : s >= 60 ? `${Math.floor(s / 60)} phút ${Math.round(s % 60)} giây` : `${fmt(s, 1)} giây`);
  const norm = (s) => String(s ?? "").toLowerCase().replace(/đ/g, "d").normalize("NFD").replace(/[̀-ͯ]/g, "");
  const paras = (t) => String(t ?? "").split("\n").map((x) => `<p>${esc(x)}</p>`).join("");

  // ---------- tra cứu dữ liệu ----------
  const gunById = new Map(D.guns.map((g) => [g.id, g]));
  const gunByName = new Map(D.guns.map((g) => [g.name, g]));
  const lineBy = new Map(D.lines.map((l) => [l.name, l]));
  const lineIdx = new Map(D.lines.map((l, i) => [l.name, i]));
  const lineLabel = (n) => String(n).replace(/^[A-Z]+\s·\s/, "");
  const tiers = [...new Set(D.lines.map((l) => l.tier).filter(Boolean))];
  const multiTier = tiers.length > 1; // chỉ còn bậc S thì ẩn mọi nhãn bậc
  const gunColor = (g) => GUN_COLORS[D.guns.indexOf(g) % GUN_COLORS.length];
  const buildsOf = (g) => D.builds.filter((b) => b.gun === g.name);
  const currentBuild = (g) => buildsOf(g).find((b) => b.name === "Hiện tại");
  const recommendedBuild = (g) => buildsOf(g).find((b) => /^Nên build/.test(b.name));
  const candidates = () => D.lines.filter((l) => OPT_TIERS.includes(l.tier) && C.isEffective(l));
  const toObjs = (names) => names.map((n) => lineBy.get(n));
  const evalBuild = (g, names, pet = P.petBonus) => C.evaluate(g, toObjs(names), pet);
  const optOpts = (pet, usePet, extra = {}) => ({ petBonus: pet, usePet, maxSpdFlat: P.maxSpdFlat, maxAtkFlat: P.maxAtkFlat, rows: P.rows, ...extra });
  // súng chưa có build mẫu thì dùng build tối ưu tự tính
  const bestOf = (g) => { const r = C.optimize(g, candidates(), optOpts(P.petBonus, false))[0]; return r ? r.lines.map((l) => l.name) : Array(P.rows).fill(NO_LINE); };
  // súng không có build trong Excel: tự tạo build mẫu cùng kiểu như của Cánh đỏ / Điện từ (tính từ chỉ số của súng)
  (() => {
    const find = (f) => D.lines.find((l) => OPT_TIERS.includes(l.tier) && f(l));
    const atk = find((l) => l.atkPct > 0 && !l.spdPct && !l.spdFlat)?.name;
    const spd = find((l) => l.spdPct > 0 && !l.atkPct)?.name;
    const flat = find((l) => l.spdFlat > 0)?.name;
    if (!atk || !spd || !flat) return;
    const rep = (n, k) => Array(k).fill(n);
    D.guns.forEach((g) => {
      if (D.builds.some((b) => b.gun === g.name)) return;
      const best = bestOf(g);
      const mk = (name, lines) => D.builds.push({ gun: g.name, name, lines, auto: true });
      mk("Nên build (Cân bằng)", best);
      mk("Thiên dame", [...rep(atk, 3), spd, flat]);
      mk("Thiên tốc", [atk, ...rep(spd, 3), flat]);
      mk("Toàn Tấn công", rep(atk, 5));
    });
  })();
  const defaultLines = (g) => { const b = recommendedBuild(g) || buildsOf(g)[0]; return b ? b.lines.slice() : bestOf(g); };
  const sameLines = (a, b) => a.length === b.length && [...a].sort().join("|") === [...b].sort().join("|");

  function effectText(l) {
    const out = [];
    if (C.num(l.atkPct) > 0) out.push(`+${pct(l.atkPct)} Tấn công`);
    if (C.num(l.spdPct) > 0) out.push(`+${pct(l.spdPct)} Tốc độ tấn công`);
    if (C.num(l.spdFlat) > 0) out.push(`+${fmt(l.spdFlat)} viên/giây (cộng vào tốc gốc)`);
    if (C.num(l.atkFlatMin) > 0 || C.num(l.atkFlatMax) > 0) out.push(`+${fmt(l.atkFlatMin)} đến ${fmt(l.atkFlatMax)} Tấn công cộng thẳng`);
    return out.length ? out.join(" · ") : "Không ảnh hưởng dame / tốc độ";
  }

  // ---------- thành phần giao diện ----------
  const tierBadge = (t) => (t && multiTier ? `<i class="tier tier-${esc(t)}" title="Bậc ${esc(t)}">${esc(t)}</i>` : "");
  // ảnh thật img/guns/<id>.png nếu có, không thì chữ cái đầu
  const gunBadge = (g, lg) => `<span class="gun-badge${lg ? " lg" : ""}" style="--gc:${gunColor(g)}" aria-hidden="true"><span>${esc(g.name.trim().split(/\s+/).pop().charAt(0).toUpperCase())}</span><img src="img/guns/${esc(g.id)}.png" alt="" onerror="this.remove()"></span>`;

  function chips(names) {
    const order = [], count = new Map();
    names.forEach((n) => { if (n === NO_LINE) return; if (!count.has(n)) { count.set(n, 0); order.push(n); } count.set(n, count.get(n) + 1); });
    if (!order.length) return `<span class="faint">Chưa có dòng</span>`;
    return `<div class="chips">${order.map((n) => {
      const c = count.get(n), l = lineBy.get(n);
      return `<span class="chip">${c > 1 ? `<b>${c}×</b>` : ""}${esc(lineLabel(n))}${l ? tierBadge(l.tier) : ""}</span>`;
    }).join("")}</div>`;
  }

  const seg = (name, items, active) =>
    `<div class="seg" role="group" data-seg="${esc(name)}">${items.map(([v, label]) => `<button type="button" data-v="${esc(v)}" aria-pressed="${String(v) === String(active)}">${esc(label)}</button>`).join("")}</div>`;
  function bindSeg(root, name, cb) {
    const el = $(`[data-seg="${name}"]`, root);
    if (!el) return;
    el.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-v]");
      if (!b) return;
      $$("button", el).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      cb(b.dataset.v);
    });
  }

  const petOptions = (sel) => PET_OPTIONS.map((o) => `<option value="${o}"${o === sel ? " selected" : ""}>+${pct(o)}</option>`).join("");

  function lineOptions(selected) {
    const opt = (l) => `<option value="${esc(l.name)}"${l.name === selected ? " selected" : ""}>${esc(multiTier ? l.name : lineLabel(l.name))}${l.tier && !C.isEffective(l) ? " (không tính)" : ""}</option>`;
    if (!multiTier) return D.lines.map(opt).join("");
    const groups = tiers.map((t) => `<optgroup label="Bậc ${esc(t)}">${D.lines.filter((l) => l.tier === t).map(opt).join("")}</optgroup>`).join("");
    const rest = D.lines.filter((l) => !l.tier).map(opt).join("");
    return rest + groups;
  }

  function warnList(gun, lineObjs) {
    const w = [];
    const sf = lineObjs.filter((l) => l && C.num(l.spdFlat) > 0).length;
    if (sf > SF_VERIFIED) w.push(`Build có ${sf} dòng tốc độ cộng thẳng (/giây). Chưa kiểm chứng game có cho ra trùng dòng này và cộng dồn đúng công thức không.`);
    if (lineObjs.some((l) => l && (C.num(l.atkFlatMin) > 0 || C.num(l.atkFlatMax) > 0))) w.push("Dòng Tấn công cộng thẳng: chưa kiểm chứng có nhân với % Tấn công hay không.");
    if (lineObjs.some((l) => l && l.tier && !C.isEffective(l))) w.push("Dòng chí mạng không được tính vào kết quả.");
    if (gun && gun.mag == null) w.push(`Chưa biết độ bền (số đạn) của ${gun.name} nên chưa tính được dame cả băng và thời gian hết băng.`);
    if (gun && gun.source === "sheet") w.push(`Chỉ số gốc của ${gun.name} lấy từ sheet người chơi tổng hợp, chưa đối chiếu với game.`);
    if (gun && !gun.measured.dame) w.push(`Dame của ${gun.name} chưa được đo bằng clip (công thức dame mới kiểm chứng trên súng khác).`);
    return w;
  }

  // ---------- liên kết ----------
  const calcHref = (gunId, names, pet, fps) => `#/tinh-build?gun=${encodeURIComponent(gunId)}&l=${names.map((n) => lineIdx.get(n) ?? lineIdx.get(NO_LINE) ?? 0).join(".")}` +
    (pet != null && Math.abs(pet - P.petBonus) > 1e-9 ? `&pet=${Math.round(pet * 100)}` : "") + (fps && fps !== 60 ? `&fps=${fps}` : "");
  const optHref = (gunId) => `#/toi-uu?gun=${encodeURIComponent(gunId)}`;
  function parseLines(s) {
    if (!s) return null;
    const idx = s.split(".").map(Number);
    if (idx.length !== P.rows || idx.some((i) => !Number.isInteger(i) || !D.lines[i])) return null;
    return idx.map((i) => D.lines[i].name);
  }

  // ======================================================
  // Trang: Tổng quan
  // ======================================================
  function viewHome(main) {
    const nLines = D.lines.filter((l) => l.tier).length;
    main.innerHTML = `
    <div class="container">
      <section class="hero">
        <div class="eyebrow">Play Together · Tra cứu build súng</div>
        <h1>Tính dame, tìm build súng mạnh nhất</h1>
        <p>Tra chỉ số súng và các dòng chỉ số bổ sung, tính tốc bắn, DPS, dame cả băng cho từng build và tự duyệt mọi tổ hợp để ra build tối ưu.</p>
        <button class="hero-search" id="hero-search" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <span>Tìm súng, dòng chỉ số, build, giả thuyết...</span>
        </button>
        <div class="row">
          <a class="btn btn-white" href="#/tinh-build">Tính dame súng</a>
          <a class="btn btn-light" href="#/toi-uu">Tìm build tối ưu</a>
          <a class="btn btn-light" href="#/sung">Danh sách súng</a>
        </div>
      </section>

      <div class="tiles">
        <div class="tile"><b class="num">${D.guns.length}</b><span>Súng đã có dữ liệu</span></div>
        <div class="tile"><b class="num">${nLines}</b><span>Loại dòng chỉ số</span></div>
        <div class="tile"><b class="num">${D.builds.length}</b><span>Build mẫu</span></div>
        <div class="tile"><b class="num">${PET_OPTIONS.map((o) => pct(o)).join(" / ")}</b><span>Pet cộng Tấn công</span></div>
      </div>

      <section class="section">
        <div class="section-head">
          <div><h2>Build tối ưu DPS của từng súng</h2><div class="muted" style="font-size:13px">Tự duyệt mọi tổ hợp dòng S theo chỉ số từng súng, cho phép tối đa ${P.maxSpdFlat} dòng tốc độ cộng thẳng (+0,50/giây, chưa kiểm chứng trùng dòng). Không tính chí mạng.</div></div>
          ${seg("home-pet", PET_OPTIONS.map((o) => [o, "Pet +" + pct(o)]), PET_OPTIONS[0])}
        </div>
        <div id="compare" class="grid grid-2"></div>
      </section>

      <section class="section">
        <h2 style="margin-bottom:12px">${esc(D.summary.conclusionsTitle)}</h2>
        <div class="card"><ol style="margin:0;padding-left:22px;display:grid;gap:10px">${D.summary.conclusions.map((c) => `<li>${esc(c)}</li>`).join("")}</ol></div>
      </section>
    </div>`;
    const compare = $("#compare", main);
    // build tối ưu DPS tính từ chỉ số từng súng (không tính chí mạng); không pet và có pet có thể ra build khác nhau
    const paint = (pet) => {
      compare.innerHTML = D.guns.map((g) => {
        const col = (label, usePet, cls) => {
          const best = C.optimize(g, candidates(), optOpts(pet, usePet))[0];
          if (!best) return `<div class="${cls}"><span class="label">${label}</span><span class="muted">Không có build hợp lệ</span></div>`;
          const names = best.lines.map((l) => l.name), d = best.d;
          return `<div class="${cls}">
            <span class="label">${label}</span>
            <div class="dps">${fmt(d.dps)}<small>DPS</small></div>
            ${chips(names)}
            <div class="muted" style="font-size:13px">Tốc bắn <b class="num">${fmt(best.ev.speed)}</b>/giây · Dame <b class="num">${fmt(d.min)} – ${fmt(d.max)}</b><br>Trung bình <b class="num">${fmt(d.avg)}</b> · Cả băng <b class="num">${fmt(d.mag)}</b></div>
            <a class="btn btn-ghost btn-sm" style="align-self:flex-start" href="${calcHref(g.id, names, pet)}">Xem chi tiết</a>
          </div>`;
        };
        return `<article class="card" style="--gc:${gunColor(g)}">
          <div class="row" style="margin-bottom:12px">${gunBadge(g)}<div><h3>${esc(g.name)}</h3><div class="muted" style="font-size:13px">Dame gốc ${fmt(g.min)}–${fmt(g.max)} · tốc gốc ${fmt(g.speed)}/giây</div></div></div>
          <div class="vs">${col("Không pet", false, "")}${col("Pet +" + pct(pet), true, "rec")}</div>
          <div class="row" style="margin-top:14px">
            <a class="btn btn-ghost btn-sm" href="${optHref(g.id)}">Top build tối ưu</a>
            <a class="btn btn-ghost btn-sm" href="#/sung/${esc(g.id)}">Chi tiết súng</a>
          </div>
        </article>`;
      }).join("");
    };
    paint(PET_OPTIONS[0]);
    bindSeg(main, "home-pet", (v) => paint(Number(v)));
    $("#hero-search", main).addEventListener("click", openSearch);
  }

  // ======================================================
  // Trang: Danh sách súng + chi tiết
  // ======================================================
  const gunStats = (g) => `<div class="stat-grid">
    <div class="stat"><small>Dame gốc</small><b>${fmt(g.min)} – ${fmt(g.max)}</b></div>
    <div class="stat"><small>Tốc gốc</small><b>${fmt(g.speed)}/giây</b></div>
    <div class="stat"><small>Số đạn (băng đầy)</small><b>${g.mag == null ? "chưa rõ" : fmt(g.mag)}</b></div>
    ${g.crit ? `<div class="stat"><small>Chí mạng gốc</small><b>${pct(g.crit[0])} / ${pct(g.crit[1])}</b></div>` : ""}
    ${g.collect ? `<div class="stat"><small>Nơi thu thập</small><b style="font-size:.95rem">${esc(g.collect)}</b></div>` : ""}</div>`;
  const measuredTags = (g) => `<div class="chips">
    ${g.source === "game" ? '<span class="tag tag-good">Chỉ số từ ảnh trong game</span>' : g.source === "sheet" ? '<span class="tag tag-warn">Chỉ số từ sheet người chơi</span>' : ""}
    <span class="tag ${g.measured.speed ? "tag-good" : ""}">${g.measured.speed ? "Đã đo tốc bắn" : "Chưa đo tốc bắn"}</span>
    <span class="tag ${g.measured.dame ? "tag-good" : "tag-warn"}">${g.measured.dame ? "Đã đo dame" : "Chưa đo dame"}</span></div>`;

  function viewGuns(main) {
    main.innerHTML = `<div class="container page">
      <div class="page-head"><h1>Danh sách súng</h1><p>Chỉ số gốc của từng súng, trước khi cộng dòng chỉ số và pet. Chọn một súng để xem build mẫu.</p></div>
      <div class="grid grid-2">${D.guns.map((g) => `
        <a class="card gun-card" href="#/sung/${esc(g.id)}" style="--gc:${gunColor(g)}">
          <div class="row">${gunBadge(g, true)}<div><h3>${esc(g.name)}</h3><div class="muted" style="font-size:13px">${buildsOf(g).length} build mẫu</div></div></div>
          ${gunStats(g)}${measuredTags(g)}
          ${g.note ? `<p class="muted" style="font-size:13px;margin:0">${esc(g.note)}</p>` : ""}
        </a>`).join("")}</div>
    </div>`;
  }

  function viewGun(main, parts) {
    const g = gunById.get(parts[1]);
    if (!g) return viewNotFound(main);
    document.title = `${g.name} · PT Build súng`;
    main.innerHTML = `<div class="container page" style="--gc:${gunColor(g)}">
      <div class="crumbs"><a href="#/sung">Súng</a> › ${esc(g.name)}</div>
      <div class="row" style="gap:16px;margin-bottom:18px">${gunBadge(g, true)}<div><h1>${esc(g.name)}</h1>${g.note ? `<p class="muted" style="margin:4px 0 0">${esc(g.note)}</p>` : ""}</div></div>
      ${gunStats(g)}
      <div style="margin-top:12px">${measuredTags(g)}</div>
      <div class="section">
        <div class="section-head"><h2>Build mẫu</h2>${seg("gun-pet", [["0", "Không pet"], ["1", "Có pet"]], "0")}</div>
        <div class="tbl-wrap"><table class="data"><thead><tr><th>Hạng</th><th>Build</th><th>Các dòng chỉ số</th><th class="r">Tốc bắn</th><th class="r">Dame</th><th>DPS</th><th class="r">Cả băng</th><th></th></tr></thead><tbody id="gun-builds"></tbody></table></div>
        <p class="muted" style="font-size:13px;margin-top:10px">Hạng xếp theo DPS trong các build mẫu của súng này.</p>
      </div>
      <div class="row" style="margin-top:22px">
        <a class="btn btn-primary" href="${calcHref(g.id, defaultLines(g), null)}">Tính dame súng này</a>
        <a class="btn btn-ghost" href="${optHref(g.id)}">Tìm build tối ưu</a>
      </div>
    </div>`;
    const body = $("#gun-builds", main);
    const paint = (usePet) => {
      const list = buildsOf(g).map((b) => { const ev = evalBuild(g, b.lines); return { b, ev, d: usePet ? ev.pet : ev.noPet }; });
      const top = Math.max(...list.map((x) => x.d.dps));
      body.innerHTML = list.map((x) => {
        const rank = 1 + list.filter((y) => y.d.dps > x.d.dps).length;
        return `<tr class="${rank === 1 ? "best" : ""}">
          <td><span class="rank${rank === 1 ? " r1" : ""}">${rank}</span></td>
          <td><b>${esc(x.b.name)}</b></td><td>${chips(x.b.lines)}</td>
          <td class="r num">${fmt(x.ev.speed)}</td><td class="r num">${fmt(x.d.min)} – ${fmt(x.d.max)}</td>
          <td class="cell-bar"><b>${fmt(x.d.dps)}</b><div class="bar" style="margin-top:4px"><i style="width:${(x.d.dps / top) * 100}%"></i></div></td>
          <td class="r num">${fmt(x.d.mag)}</td>
          <td><a class="btn btn-ghost btn-sm" href="${calcHref(g.id, x.b.lines, null)}">Chi tiết</a></td></tr>`;
      }).join("") || `<tr><td colspan="8" class="muted">Chưa có build mẫu cho súng này.</td></tr>`;
    };
    paint(false);
    bindSeg(main, "gun-pet", (v) => paint(v === "1"));
  }

  // ======================================================
  // Trang: Tính dame súng
  // ======================================================
  function viewCalc(main, parts, q) {
    const gun0 = gunById.get(q.get("gun")) || D.guns[0];
    const st = {
      gun: gun0.id,
      lines: parseLines(q.get("l")) || defaultLines(gun0),
      pet: q.has("pet") ? petOf((Number(q.get("pet")) || 0) / 100) : petOf(P.petBonus),
      fps: FPS_CHOICES.includes(Number(q.get("fps"))) ? Number(q.get("fps")) : 60,
    };
    const presetOpts = () => {
      const g = gunById.get(st.gun);
      const match = buildsOf(g).find((b) => sameLines(b.lines, st.lines));
      return `<option value="">— Tự chọn —</option>` + buildsOf(g).map((b, i) => `<option value="${i}"${match === b ? " selected" : ""}>${esc(b.name)}</option>`).join("");
    };
    main.innerHTML = `<div class="container page">
      <div class="page-head"><h1>Tính dame súng</h1><p>Chọn súng và ${P.rows} dòng chỉ số, kết quả tự tính: tốc bắn, dame min – max, dame trung bình, DPS, dame cả băng, có và không có pet.</p></div>
      <div class="calc-grid">
        <form class="card form-stack" id="calc-form" onsubmit="return false">
          <label class="field"><span>Súng</span><select name="gun">${D.guns.map((g) => `<option value="${esc(g.id)}"${g.id === st.gun ? " selected" : ""}>${esc(g.name)}</option>`).join("")}</select></label>
          <label class="field"><span>Nạp build mẫu</span><select name="preset"></select></label>
          <div class="lines-list">${Array.from({ length: P.rows }, (_, i) => `<label class="field"><span>Dòng ${i + 1}</span><select name="l${i}">${lineOptions(st.lines[i])}</select></label>`).join("")}</div>
          <label class="field"><span>Pet cộng Tấn công</span><select name="pet">${petOptions(st.pet)}</select><span class="hint">Cộng chung với các dòng % Tấn công.</span></label>
          <label class="field"><span>FPS khi bắn (chỉ để ước tính thực tế)</span><select name="fps">${FPS_CHOICES.map((f) => `<option value="${f}"${f === st.fps ? " selected" : ""}>${f} FPS</option>`).join("")}</select></label>
          <div class="row"><button class="btn btn-ghost btn-sm" type="button" id="copy-link">Sao chép liên kết</button><button class="btn btn-ghost btn-sm" type="button" id="reset">Đặt lại</button></div>
        </form>
        <div id="calc-result" class="form-stack" aria-live="polite"></div>
      </div>
      </div>`;
    const form = $("#calc-form", main), out = $("#calc-result", main);

    const readForm = () => {
      st.gun = form.gun.value;
      st.lines = Array.from({ length: P.rows }, (_, i) => form[`l${i}`].value);
      st.pet = petOf(Number(form.pet.value));
      st.fps = Number(form.fps.value);
    };
    const refresh = () => {
      form.preset.innerHTML = presetOpts();
      out.innerHTML = calcResult(st);
      const e = C.evaluate(gunById.get(st.gun), toObjs(st.lines), st.pet);
      history.replaceState(null, "", calcHref(st.gun, st.lines, st.pet, st.fps));
    };
    form.addEventListener("input", (e) => {
      if (e.target.name === "preset") return;
      readForm(); refresh();
    });
    form.addEventListener("change", (e) => {
      if (e.target.name === "gun") { readForm(); refresh(); }
      if (e.target.name === "preset") {
        const b = buildsOf(gunById.get(st.gun))[Number(e.target.value)];
        if (!b) return;
        b.lines.forEach((n, i) => (form[`l${i}`].value = n));
        readForm(); refresh();
      }
    });
    $("#reset", main).addEventListener("click", () => {
      const g = gunById.get(st.gun);
      defaultLines(g).forEach((n, i) => (form[`l${i}`].value = n));
      form.pet.value = String(petOf(P.petBonus)); form.fps.value = 60;
      readForm(); refresh();
    });
    $("#copy-link", main).addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      try { await navigator.clipboard.writeText(location.href); btn.textContent = "Đã sao chép"; }
      catch { btn.textContent = "Hãy copy từ thanh địa chỉ"; }
      setTimeout(() => (btn.textContent = "Sao chép liên kết"), 1800);
    });
    refresh();
  }

  function calcResult(st) {
    const g = gunById.get(st.gun);
    const objs = toObjs(st.lines);
    const ev = C.evaluate(g, objs, st.pet);
    const s = ev.sums;
    const f = (n) => fmt(n, 3);
    const avgOf = (d) => d.avg;

    const modeCard = (title, d, key) => `
      <section class="card result-card">
        <h3>${title}</h3>
        <div class="stat-grid">
          <div class="stat big"><small>DPS</small><b>${fmt(d.dps)}</b></div>
          <div class="stat"><small>Dame min – max</small><b>${fmt(d.min)} – ${fmt(d.max)}</b></div>
          <div class="stat"><small>Dame trung bình</small><b>${fmt(d.avg)}</b></div>
          <div class="stat"><small>Dame cả băng</small><b>${fmt(d.mag)}</b></div>
        </div>
      </section>`;

    const best = (usePet) => C.optimize(g, candidates(), optOpts(st.pet, usePet))[0];
    const bestCmp = (label, usePet, d) => {
      const b = best(usePet);
      if (!b) return "";
      const ratio = d.dps / b.dps;
      return `<div style="margin-top:12px"><div class="row row-between" style="font-size:14px"><span>${label}</span>
        <b class="num">${fmt(ratio * 100, 1)}% <span class="muted" style="font-weight:500">(${fmt(d.dps)} / ${fmt(b.dps)})</span></b></div>
        <div class="bar" style="margin-top:5px;--gc:${ratio >= 0.999 ? "var(--good)" : "var(--brand)"}"><i style="width:${clamp(ratio, 0, 1) * 100}%"></i></div></div>`;
    };
    const bestPetBuild = best(true), bestBuild = best(false);

    const rate = C.realRate(ev.speed, st.fps);
    const warns = warnList(g, objs);

    const petLbl = `${pct(st.pet)}`;
    const formula =
`<b>Tốc bắn</b> = (Tốc gốc + Σ cộng thẳng) × (1 + Σ% Tốc độ)
         = (${f(g.speed)} + ${f(s.spdFlat)}) × (1 + ${f(s.spdPct)}) = <b>${f(ev.speed)}</b> viên/giây

<b>Dame min</b> = (Dame gốc min + Σ cộng thẳng) × (1 + Pet + Σ% Tấn công)
  không pet = (${f(g.min)} + ${f(s.flatMin)}) × (1 + ${f(s.atkPct)}) = <b>${f(ev.noPet.min)}</b>
  có pet    = (${f(g.min)} + ${f(s.flatMin)}) × (1 + ${f(st.pet)} + ${f(s.atkPct)}) = <b>${f(ev.pet.min)}</b>
<b>Dame max</b>
  không pet = (${f(g.max)} + ${f(s.flatMax)}) × (1 + ${f(s.atkPct)}) = <b>${f(ev.noPet.max)}</b>
  có pet    = (${f(g.max)} + ${f(s.flatMax)}) × (1 + ${f(st.pet)} + ${f(s.atkPct)}) = <b>${f(ev.pet.max)}</b>

<b>DPS</b>       = Tốc bắn × Dame trung bình
  không pet = ${f(ev.speed)} × ${f(avgOf(ev.noPet))} = <b>${f(ev.noPet.dps)}</b>
  có pet    = ${f(ev.speed)} × ${f(avgOf(ev.pet))} = <b>${f(ev.pet.dps)}</b>
<b>Cả băng</b>   = Dame trung bình × Số đạn (${fmt(g.mag)})
  không pet = <b>${f(ev.noPet.mag)}</b>   có pet = <b>${f(ev.pet.mag)}</b>`;

    return `
      <div class="card row row-between" style="gap:14px">
        <div class="row">${gunBadge(g)}<div><h2>${esc(g.name)}</h2><div class="muted" style="font-size:13px">Dame gốc ${fmt(g.min)}–${fmt(g.max)} · tốc gốc ${fmt(g.speed)}/giây · ${fmt(g.mag)} đạn</div></div></div>
        <div class="stat-grid" style="min-width:min(100%,300px)">
          <div class="stat"><small>Tốc bắn</small><b>${fmt(ev.speed)}/giây</b></div>
          <div class="stat"><small>Bắn hết băng</small><b style="font-size:.95rem">${fmtTime(ev.time)}</b></div>
        </div>
      </div>
      <div class="result-pair">
        ${modeCard("Không tính pet", ev.noPet)}
        ${modeCard(`Có pet <span class="tag tag-brand">+${petLbl}</span>`, ev.pet)}
      </div>
      <section class="card">
        <h3>Σ các dòng đã chọn</h3>
        <div class="stat-grid" style="margin-top:10px">
          <div class="stat"><small>Σ % Tấn công</small><b>${pct(s.atkPct)}</b></div>
          <div class="stat"><small>Σ % Tốc độ</small><b>${pct(s.spdPct)}</b></div>
          <div class="stat"><small>Σ tốc độ cộng thẳng</small><b>${fmt(s.spdFlat)}/giây</b></div>
          <div class="stat"><small>Σ Tấn công cộng thẳng</small><b>${s.flatMin || s.flatMax ? `${fmt(s.flatMin)}–${fmt(s.flatMax)}` : "0"}</b></div>
        </div>
      </section>
      <section class="card">
        <div class="row row-between"><h3>So với build tối ưu của ${esc(g.name)}</h3><a class="btn btn-ghost btn-sm" href="${optHref(g.id)}">Xem top build</a></div>
        ${bestCmp("Không tính pet", false, ev.noPet)}${bestCmp("Có tính pet", true, ev.pet)}
        ${bestBuild ? `<div style="margin-top:14px"><div class="muted" style="font-size:13px;margin-bottom:6px">Build tối ưu (giới hạn tối đa ${P.maxSpdFlat} dòng tốc độ cộng thẳng, ${P.maxAtkFlat} dòng tấn công cộng thẳng):</div>${chips(bestBuild.lines.map((l) => l.name))}</div>` : ""}
        ${bestBuild && bestPetBuild && bestBuild.counts.join() !== bestPetBuild.counts.join() ? `<div class="muted" style="font-size:13px;margin-top:8px">Khi có pet, build tối ưu khác: </div>${chips(bestPetBuild.lines.map((l) => l.name))}` : ""}
      </section>
      <section class="card">
        <h3>Ước tính thực tế theo FPS</h3>
        <p class="muted" style="font-size:13.5px;margin:6px 0 10px">Game bắn theo khung hình nên tốc bắn thật thấp hơn công thức. Quy tắc: số khung giữa 2 viên = làm tròn lên (FPS ÷ tốc bắn) + 1. Quy tắc này suy ra từ số đo clip, chưa đọc từ mã nguồn game.</p>
        <div class="stat-grid">
          <div class="stat"><small>Tốc bắn @${st.fps} FPS</small><b>${fmt(rate)}/giây</b></div>
          <div class="stat"><small>DPS không pet</small><b>${fmt(rate * ev.noPet.avg)}</b></div>
          <div class="stat"><small>DPS có pet</small><b>${fmt(rate * ev.pet.avg)}</b></div>
        </div>
      </section>
      ${warns.length ? `<div>${warns.map((w) => `<div class="banner warn">${esc(w)}</div>`).join("")}</div>` : ""}
      <details class="box"><summary>Xem cách tính chi tiết</summary><div class="box-body"><div class="formula">${formula}</div></div></details>`;
  }

  // ======================================================
  // Trang: Build tối ưu
  // ======================================================
  function viewOpt(main, parts, q) {
    const st = {
      gun: (gunById.get(q.get("gun")) || D.guns[0]).id,
      pm: q.get("pm") === "1" ? "1" : "0",
      pet: q.has("pet") ? petOf((Number(q.get("pet")) || 0) / 100) : petOf(P.petBonus),
      sort: q.get("sort") === "mag" ? "mag" : "dps",
      top: ["5", "10", "20", "all"].includes(q.get("top")) ? q.get("top") : "5",
    };
    main.innerHTML = `<div class="container page">
      <div class="page-head"><h1>Build tối ưu</h1><p>Tự duyệt mọi tổ hợp ${P.rows} dòng bậc ${esc(OPT_TIERS.join(", "))} (Tấn công %, Tốc độ %, Tốc độ cộng thẳng, Tấn công cộng thẳng) và xếp hạng. DPS bằng nhau thì ưu tiên dame cả băng cao hơn.</p></div>
      <form class="card" id="opt-form" onsubmit="return false">
        <div class="opt-grid">
          <label class="field"><span>Súng</span><select name="gun">${D.guns.map((g) => `<option value="${esc(g.id)}"${g.id === st.gun ? " selected" : ""}>${esc(g.name)}</option>`).join("")}</select></label>
          <div class="field"><span>Chế độ</span>${seg("opt-pm", [["0", "Không pet"], ["1", "Có pet"]], st.pm)}</div>
          <label class="field"><span>Pet cộng Tấn công</span><select name="pet">${petOptions(st.pet)}</select></label>
          <div class="field"><span>Xếp theo</span>${seg("opt-sort", [["dps", "DPS"], ["mag", "Dame cả băng"]], st.sort)}</div>
        </div>
      </form>
      <div id="opt-result" class="section" aria-live="polite"></div></div>`;
    const form = $("#opt-form", main), out = $("#opt-result", main);
    const paint = () => {
      const g = gunById.get(st.gun), usePet = st.pm === "1";
      const all = C.optimize(g, candidates(), { petBonus: st.pet, usePet, maxSpdFlat: P.maxSpdFlat, maxAtkFlat: P.maxAtkFlat, rows: P.rows, sortBy: st.sort });
      const list = st.top === "all" ? all : all.slice(0, Number(st.top));
      const top = all[0] ? (st.sort === "mag" ? all[0].mag : all[0].dps) : 1;
      const cur = currentBuild(g);
      const curEv = cur && evalBuild(g, cur.lines, st.pet);
      const curD = curEv && (usePet ? curEv.pet : curEv.noPet);
      const gain = curD && all[0] ? all.reduce((m, x) => Math.max(m, x.dps), 0) / curD.dps - 1 : null;
      history.replaceState(null, "", `#/toi-uu?gun=${encodeURIComponent(st.gun)}&pm=${st.pm}&pet=${Math.round(st.pet * 100)}&sort=${st.sort}&top=${st.top}`);
      out.innerHTML = `
        <div class="section-head" style="margin-top:0">
          <h2>${st.top === "all" ? "Tất cả" : "Top " + st.top} build cho ${esc(g.name)} ${usePet ? `(có pet +${pct(st.pet)})` : "(không pet)"}</h2>
          ${seg("opt-top", [["5", "Top 5"], ["10", "Top 10"], ["20", "Top 20"], ["all", "Tất cả"]], st.top)}
        </div>
        ${gain != null && gain > 1e-9 ? `<div class="banner good" style="margin-bottom:12px">Build hiện tại của ${esc(g.name)}: <b>${fmt(curD.dps)} DPS</b>. Build tối ưu cao hơn <b>${fmt(gain * 100, 1)}%</b>.</div>` : ""}
        <div class="tbl-wrap"><table class="data"><thead><tr><th>Hạng</th><th>Các dòng chỉ số</th><th class="r">Tốc bắn</th><th class="r">Dame</th><th>DPS</th><th>Cả băng</th><th></th></tr></thead>
        <tbody>${list.map((x, i) => {
          const names = x.lines.map((l) => l.name);
          // thứ tự cột cố định (DPS rồi Cả băng); thanh so sánh nằm ở cột đang dùng để xếp hạng
          const cellOf = (key, on) => on ? `<td class="cell-bar"><b>${fmt(x[key])}</b><div class="bar" style="margin-top:4px;--gc:${gunColor(g)}"><i style="width:${(x[key] / top) * 100}%"></i></div></td>` : `<td class="num">${fmt(x[key])}</td>`;
          return `<tr class="${i === 0 ? "best" : ""}"><td><span class="rank${i === 0 ? " r1" : ""}">${i + 1}</span></td><td>${chips(names)}</td>
            <td class="r num">${fmt(x.ev.speed)}</td><td class="r num">${fmt(x.d.min)} – ${fmt(x.d.max)}</td>
            ${cellOf("dps", st.sort !== "mag")}${cellOf("mag", st.sort === "mag")}
            <td><a class="btn btn-ghost btn-sm" href="${calcHref(g.id, names, st.pet)}">Chi tiết</a></td></tr>`;
        }).join("") || `<tr><td colspan="7" class="muted">Không có tổ hợp nào thoả giới hạn.</td></tr>`}</tbody></table></div>
        <p class="muted" style="font-size:13px;margin-top:10px">Đã duyệt ${fmt(all.length, 0)} tổ hợp hợp lệ. Số liệu theo công thức lý thuyết, không tính chí mạng. Build dùng 2 dòng Tốc độ +0,50/giây chưa kiểm chứng là game có ra trùng dòng này.</p>`;
      bindSeg(out, "opt-top", (v) => { st.top = v; paint(); });
    };
    form.addEventListener("input", (e) => {
      if (e.target.name === "gun") st.gun = e.target.value;
      if (e.target.name === "pet") st.pet = petOf(Number(e.target.value));
      paint();
    });
    bindSeg(form, "opt-pm", (v) => { st.pm = v; paint(); });
    bindSeg(form, "opt-sort", (v) => { st.sort = v; paint(); });
    paint();
  }

  // ======================================================
  // Trang: Dòng chỉ số
  // ======================================================
  function viewLines(main) {
    const W = window.PT_WEAPONS, S = W.grades.find((x) => x.g === "S");
    const list = D.lines.filter((l) => l.name !== NO_LINE && (!l.tier || l.tier === "S"));
    const cell = (v, f = (x) => fmt(x)) => (v == null ? `<span class="faint">?</span>` : v === 0 ? `<span class="faint">—</span>` : f(v));
    const crit = (l) => /Xác suất chí mạng/i.test(l.name) ? S.cp : /Sát thương chí mạng/i.test(l.name) ? S.cd : null;
    const effect = (l) => /Xác suất chí mạng/i.test(l.name) ? "Tăng xác suất bắn chí mạng" : crit(l) ? "Tăng dame khi bắn chí mạng" : l.atkPct > 0 ? "Tăng dame" : l.spdPct > 0 || l.spdFlat > 0 ? "Tăng tốc bắn" : l.atkFlatMin || l.atkFlatMax ? "Tăng dame (cộng thẳng)" : "";
    const note = (l) => l.atkPct > 0 ? "Cộng bằng chỉ số gốc × " + pct(l.atkPct) + "; 2 dòng thì × " + pct(2 * l.atkPct) + " (các dòng cộng dồn)." : l.spdPct > 0 ? "Cộng bằng tốc độ gốc × " + pct(l.spdPct) + "; 2 dòng thì × " + pct(2 * l.spdPct) + " (các dòng cộng dồn)." : crit(l) ? (/Xác suất chí mạng/i.test(l.name) ? "Tăng xác suất bắn chí mạng" : "Tăng dame khi bắn chí mạng") + "; không tính vào DPS trong web." : (l.note || "");
    main.innerHTML = `<div class="container page">
      <div class="page-head"><h1>Dòng chỉ số</h1><p>Toàn bộ dòng chỉ số bổ sung của vũ khí ở bậc S (giá trị bậc S theo Haegin).</p></div>
      <div class="tbl-wrap"><table class="data lines"><thead><tr><th>Dòng</th><th>Tấn công %</th><th>Tốc độ %</th><th>Tấn công</th><th>Tốc độ (/giây)</th><th>Xác suất chí mạng</th><th>Sát thương chí mạng</th><th>Ghi chú</th></tr></thead><tbody>${list.map((l) => `<tr class="${C.isEffective(l) ? "" : "dim"}">
        <td><b>${esc(lineLabel(l.name))}</b></td>
        <td class="num">${cell(l.atkPct, pct)}</td><td class="num">${cell(l.spdPct, pct)}</td>
        <td class="num">${l.atkFlatMin || l.atkFlatMax ? `${fmt(l.atkFlatMin)} – ${fmt(l.atkFlatMax)}` : cell(0)}</td><td class="num">${cell(l.spdFlat)}</td>
        <td class="num">${/Xác suất chí mạng/i.test(l.name) ? S.cp : cell(0)}</td><td class="num">${/Sát thương chí mạng/i.test(l.name) ? S.cd : cell(0)}</td>
        <td class="muted" style="font-size:13px">${esc(note(l))}</td></tr>`).join("")}</tbody></table></div>
      <p class="muted" style="font-size:13px;margin-top:10px">${list.length} loại dòng. Ô “?” là chưa có thông tin.</p>
      <section class="section">
        <h2 style="margin-bottom:6px">Giá trị dòng chỉ số theo bậc</h2>
        <p class="muted" style="font-size:13.5px">Áp dụng cho vũ khí nhóm 2, 3, 4. Nguồn: trung tâm trợ giúp Haegin, ghi nhận ngày ${esc(W.checked)}.</p>
        <div class="tbl-wrap"><table class="data"><thead><tr><th>Bậc</th><th>Tấn công %</th><th>Tốc độ %</th><th>Tấn công</th><th>Tốc độ (/giây)</th><th>Xác suất chí mạng</th><th>Sát thương chí mạng</th></tr></thead>
        <tbody>${W.grades.map((r) => `<tr class="${r.g === "S" ? "best" : ""}"><td><span class="tier tier-${r.g === "S" ? "S" : r.g === "B" ? "B" : ""}">${r.g}</span></td><td class="num">${r.atkPct}</td><td class="num">${r.spdPct}</td><td class="num">${r.atk}</td><td class="num">${r.spd}</td><td class="num">${r.cp}</td><td class="num">${r.cd}</td></tr>`).join("")}</tbody></table></div>
      </section></div>`;
  }

  // ======================================================
  // Trang: Cách tính, giả thuyết & số đo
  // ======================================================
  function genTable(t) {
    const cellHtml = (v) => (typeof v === "number" ? fmt(v, 3) : esc(renameText(v)));
    // cột toàn số thì tiêu đề cũng căn phải để thẳng hàng với dữ liệu
    const numeric = t.header.map((_, j) => t.rows.length > 0 && t.rows.every((r) => typeof r[j] === "number"));
    // độ rộng tối thiểu theo độ dài chữ của cột: cột ghi chú dài thì rộng và tự xuống dòng, tên súng không bị bẻ từng chữ
    const minW = t.header.map((_, j) => { const L = Math.max(0, ...t.rows.map((r) => (typeof r[j] === "string" ? renameText(r[j]).length : 0))); return numeric[j] ? 0 : L > 60 ? 250 : L > 14 ? 170 : 0; });
    const sty = (j) => (minW[j] ? ` style="min-width:${minW[j]}px${minW[j] === 250 ? ";font-size:13px" : ""}"` : "");
    return `<div class="tbl-wrap"><table class="data"><thead><tr>${t.header.map((h, j) => `<th class="${numeric[j] ? "r" : ""}" title="${esc(h)}">${esc(String(h).replace(/\s*=.*$/, ""))}</th>`).join("")}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((v, j) => `<td class="${typeof v === "number" ? "r num" : ""}"${sty(j)}>${cellHtml(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  function viewExplain(main, parts, q) {
    const M = D.measurements, H = D.hypotheses;
    const open = Number(q.get("open"));
    const hypCols = M.theoSpeed.header.slice(1);
    const verdictFor = (i) => M.verdicts[i];
    const badge = (t) => (/^Chọn/.test(t) ? `<span class="tag tag-good">Được chọn</span>` : /^Loại/.test(t) ? `<span class="tag tag-bad">Bị loại</span>` : "");
    main.innerHTML = `<div class="container page">
      <div class="page-head"><h1>Cách tính, giả thuyết và số đo</h1><p>${esc(H.intro[1] || "")}</p></div>
      <div class="grid" style="gap:12px">${H.items.map((h, i) => `
        <details class="box${/Chưa có thông tin/.test(h.title) ? " warn" : ""}" id="h${i}"${open === i + 1 || (!q.has("open") && i < 2) ? " open" : ""}>
          <summary>${esc(h.title)}</summary><div class="box-body">${paras(h.body)}</div></details>`).join("")}</div>

      <section class="section">
        <h2 style="margin-bottom:6px">${esc(M.speed.title)}</h2>
        <div style="margin-top:10px">${genTable(M.speed)}</div>
      </section>
      <section class="section">
        <h2 style="margin-bottom:10px">${esc(M.dame.title)}</h2>
        ${genTable(M.dame)}
        ${M.dame.note ? `<p class="muted" style="font-size:13px;margin-top:10px">${esc(M.dame.note)}</p>` : ""}
      </section>
      <section class="section">
        <h2 style="margin-bottom:6px">So sánh 4 giả thuyết tốc độ với số đo</h2>
        <p class="muted" style="font-size:13.5px">Mỗi ô: tốc lý thuyết (viên/giây) và độ lệch giữa số khung đo được với số khung lý thuyết. Giả thuyết đúng phải cho độ lệch ổn định và cùng dấu ở cả 3 trường hợp.</p>
        <div class="tbl-wrap"><table class="data"><thead><tr><th>Trường hợp</th><th class="r">Số khung đo</th>${hypCols.map((h) => `<th class="nocase">${esc(h)}</th>`).join("")}</tr></thead><tbody>
          ${M.theoSpeed.rows.map((r, i) => `<tr><td><b>${esc(renameText(r[0]))}</b></td><td class="r num">${fmt(M.theoFrames.rows[i][5], 0)}</td>
            ${hypCols.map((_, j) => `<td class="num">${fmt(r[j + 1])}/s<br><span class="muted" style="font-size:12.5px">lệch ${signed(M.deviation.rows[i][j + 1])} khung</span></td>`).join("")}</tr>`).join("")}
        </tbody></table></div>
      </section>
      <section class="section">
        <h2 style="margin-bottom:10px">${esc(M.rule.title)}</h2>
        ${genTable(M.rule)}
      </section>
      <section class="section">
        <h2 style="margin-bottom:12px">Kết luận từng giả thuyết</h2>
        <div class="grid grid-2">${M.verdicts.map((v, i) => `<div class="card"><div class="row row-between" style="margin-bottom:6px"><h3>${esc(v.name)}</h3>${badge(v.text)}</div>
          <div class="muted" style="font-size:13px;margin-bottom:6px">${esc(hypCols[i] || "")}</div><p style="margin:0">${esc(v.text.replace(/^(Chọn|Loại):\s*/, "").replace(/^./, (c) => c.toUpperCase()))}</p></div>`).join("")}</div>
        ${M.footnote ? `<p class="muted" style="font-size:13px;margin-top:12px">${esc(M.footnote)}</p>` : ""}
      </section></div>`;
    if (q.has("open")) setTimeout(() => { const el = $(`#h${open - 1}`, main); if (el) el.scrollIntoView({ block: "center" }); }, 50);
  }

  // ======================================================
  function viewNotFound(main) {
    main.innerHTML = `<div class="container page"><h1>Không tìm thấy trang</h1><p class="muted">Trang bạn mở không tồn tại hoặc đã đổi.</p><a class="btn btn-primary" href="#/">Về trang chủ</a></div>`;
  }

  // ======================================================
  // Tra cứu nhanh (Ctrl+K)
  // ======================================================
  let searchIndex = null;
  function buildIndex() {
    const items = [];
    D.guns.forEach((g) => {
      const e = evalBuild(g, (recommendedBuild(g) || { lines: [] }).lines.length ? recommendedBuild(g).lines : defaultLines(g));
      items.push({ type: "Súng", title: g.name, sub: `Dame gốc ${fmt(g.min)}–${fmt(g.max)} · tốc ${fmt(g.speed)}/giây · ${fmt(g.mag)} đạn`, href: `#/sung/${g.id}`, text: g.note || "" });
      items.push({ type: "Tính dame", title: `Tính dame ${g.name}`, sub: `Build gợi ý: ${fmt(e.noPet.dps)} DPS (không pet)`, href: calcHref(g.id, defaultLines(g), null), text: "tinh dame dps" });
      items.push({ type: "Tính dame", title: `Build tối ưu ${g.name}`, sub: "Tự duyệt mọi tổ hợp dòng chỉ số", href: optHref(g.id), text: "toi uu top build" });
    });
    D.lines.filter((l) => l.name !== NO_LINE).forEach((l) => items.push({ type: "Dòng chỉ số", title: l.name, sub: effectText(l), href: `#/dong-chi-so?q=${encodeURIComponent(lineLabel(l.name))}`, text: l.note || "" }));
    D.builds.forEach((b) => {
      const g = gunByName.get(b.gun); if (!g) return;
      const ev = evalBuild(g, b.lines);
      items.push({ type: "Build mẫu", title: `${b.gun} · ${b.name}`, sub: `${fmt(ev.noPet.dps)} DPS không pet · ${fmt(ev.pet.dps)} có pet`, href: calcHref(g.id, b.lines, null), text: b.lines.join(" ") });
    });
    D.hypotheses.items.forEach((h, i) => items.push({ type: "Cách tính", title: h.title.replace(/^\d+\.\s*/, ""), sub: h.body.split("\n")[0].slice(0, 140), href: `#/cach-tinh?open=${i + 1}`, text: h.body }));
    D.measurements.verdicts.forEach((v) => items.push({ type: "Cách tính", title: v.name, sub: v.text.slice(0, 140), href: "#/cach-tinh", text: v.text }));
    D.summary.conclusions.forEach((c, i) => items.push({ type: "Kết luận", title: `Kết luận ${i + 1}`, sub: c.slice(0, 140), href: "#/", text: c }));
    items.push({ type: "Tham số", title: `Pet ${P.petName}`, sub: `+${pct(P.petBonus)} Tấn công. ${P.petNote || ""}`, href: "#/tinh-build", text: "pet" });
    items.forEach((it) => { it.hay = norm(`${it.title} ${it.sub} ${it.text}`); it.nt = norm(it.title); });
    return items;
  }

  const dlg = $("#search-dialog"), sin = $("#search-input"), sres = $("#search-results");
  let sActive = 0, sItems = [];
  function openSearch() {
    if (!searchIndex) searchIndex = buildIndex();
    if (!dlg.open) dlg.showModal();
    sin.value = ""; paintSearch(); sin.focus();
  }
  function paintSearch() {
    const tokens = norm(sin.value).split(/\s+/).filter(Boolean);
    if (!tokens.length) {
      const sug = [...D.guns.map((g) => g.name), "Tốc độ tấn công", "Nên build", "pet", "FPS", "chí mạng"];
      sItems = [];
      sres.innerHTML = `<div class="sd-group">Gợi ý tìm kiếm</div><div class="sd-suggest">${sug.map((s) => `<button type="button" class="chip" data-s="${esc(s)}">${esc(s)}</button>`).join("")}</div>`;
      return;
    }
    sItems = searchIndex.filter((it) => tokens.every((t) => it.hay.includes(t)))
      .sort((a, b) => tokens.filter((t) => b.nt.includes(t)).length - tokens.filter((t) => a.nt.includes(t)).length).slice(0, 40);
    sActive = 0;
    if (!sItems.length) { sres.innerHTML = `<div class="sd-empty">Không tìm thấy “${esc(sin.value)}”.</div>`; return; }
    let last = "", html = "";
    sItems.forEach((it, i) => {
      if (it.type !== last) { html += `<div class="sd-group">${esc(it.type)}</div>`; last = it.type; }
      html += `<a class="sd-item" role="option" href="${esc(it.href)}" data-i="${i}" aria-selected="${i === 0}"><b>${esc(it.title)}</b><small>${esc(it.sub)}</small></a>`;
    });
    sres.innerHTML = html;
  }
  function moveActive(d) {
    if (!sItems.length) return;
    sActive = (sActive + d + sItems.length) % sItems.length;
    $$(".sd-item", sres).forEach((el) => el.setAttribute("aria-selected", String(Number(el.dataset.i) === sActive)));
    const cur = $(`.sd-item[data-i="${sActive}"]`, sres); if (cur) cur.scrollIntoView({ block: "nearest" });
  }
  sin.addEventListener("input", paintSearch);
  sin.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); moveActive(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveActive(-1); }
    else if (e.key === "Enter" && sItems[sActive]) { e.preventDefault(); location.hash = sItems[sActive].href; dlg.close(); }
  });
  sres.addEventListener("click", (e) => {
    if (e.target.closest(".sd-item")) return dlg.close();
    const s = e.target.closest("[data-s]"); if (s) { sin.value = s.dataset.s; paintSearch(); sin.focus(); }
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  $("#open-search").addEventListener("click", openSearch);

  // ======================================================
  // Giao diện sáng/tối + router
  // ======================================================
  // bảng → thẻ trên điện thoại: gắn nhãn cột (lấy từ tiêu đề) cho từng ô, kể cả khi bảng được vẽ lại
  const labelTables = () => $$("table.data").forEach((t) => {
    const heads = $$("thead th", t).map((h) => h.textContent.trim());
    $$("tbody tr", t).forEach((r) => [...r.children].forEach((c, i) => { if (c.tagName === "TD" && c.dataset.label === undefined) c.dataset.label = c.colSpan > 1 ? "" : (heads[i] || ""); if (c.textContent.trim() === "—") c.dataset.empty = "1"; }));
  });
  new MutationObserver(labelTables).observe($("#main"), { childList: true, subtree: true });
  $("#theme-toggle").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("pt-theme", root.dataset.theme); } catch (e) { /* bỏ qua */ }
  });

  const routes = { "": ["Tổng quan", viewHome], sung: ["Súng", viewGuns], "tinh-build": ["Tính dame súng", viewCalc], "toi-uu": ["Build tối ưu", viewOpt], "dong-chi-so": ["Dòng chỉ số", viewLines], "vu-khi": ["Dòng chỉ số", viewLines], "cach-tinh": ["Cách tính và số đo", viewExplain] };
  function render() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [path, qs = ""] = raw.split("?");
    const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
    const route = routes[parts[0] || ""];
    const main = $("#main");
    const view = parts[0] === "sung" && parts[1] ? viewGun : route ? route[1] : viewNotFound;
    view(main, parts, new URLSearchParams(qs));
    if (view !== viewGun) document.title = (route ? route[0] + " · " : "") + "PT Build súng";
    $$(".nav a").forEach((a) => (a.classList.toggle("active", a.dataset.route === (parts[0] || "")), a.toggleAttribute("aria-current", a.dataset.route === (parts[0] || ""))));
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", render);
  $("#footer-meta").textContent = `Dữ liệu từ file ${D.meta.source}, cập nhật ${D.meta.generated.split("-").reverse().join("/")}.`;
  render();
})();
