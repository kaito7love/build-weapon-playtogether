/* Công thức tính dame súng - port từ sheet "Giả thuyết" / "Tính build" của file Excel.
 *  Tốc bắn   = (Tốc gốc + Σ dòng cộng thẳng/giây) × (1 + Σ % Tốc độ)
 *  Dame      = (Dame gốc + Σ Tấn công cộng thẳng) × (1 + Pet + Σ % Tấn công)
 *  DPS       = Tốc bắn × Dame trung bình
 *  Cả băng   = Dame trung bình × Số đạn
 * Không tính chí mạng. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PTCalc = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const num = (v) => (typeof v === "number" && isFinite(v) ? v : 0);
  const r4 = (x) => Math.round((x + Number.EPSILON) * 1e4) / 1e4; // giống ROUND(x,4) trong Excel

  /** Một dòng có ảnh hưởng dame / tốc độ không (dòng chí mạng thì không). */
  function isEffective(l) {
    return !!l && (num(l.atkPct) > 0 || num(l.spdPct) > 0 || num(l.spdFlat) > 0 ||
      num(l.atkFlatMin) > 0 || num(l.atkFlatMax) > 0);
  }

  function sumLines(lines) {
    const s = { atkPct: 0, spdPct: 0, spdFlat: 0, flatMin: 0, flatMax: 0 };
    for (const l of lines) {
      if (!l) continue;
      s.atkPct += num(l.atkPct);
      s.spdPct += num(l.spdPct);
      s.spdFlat += num(l.spdFlat);
      s.flatMin += num(l.atkFlatMin);
      s.flatMax += num(l.atkFlatMax);
    }
    return s;
  }

  function damage(gun, s, bonus, speed) {
    const min = (gun.min + s.flatMin) * (1 + bonus + s.atkPct);
    const max = (gun.max + s.flatMax) * (1 + bonus + s.atkPct);
    const avg = (min + max) / 2;
    const mag = Number.isFinite(gun.mag) ? gun.mag : NaN; // chưa biết độ bền thì không tính dame cả băng
    return { min, max, avg, dps: r4(speed * avg), mag: r4(avg * mag), bonus };
  }

  /** Tính toàn bộ chỉ số của 1 súng với danh sách dòng (đối tượng dòng). */
  function evaluate(gun, lineObjs, petBonus) {
    const s = sumLines(lineObjs);
    const speed = (gun.speed + s.spdFlat) * (1 + s.spdPct);
    return {
      sums: s,
      speed,
      time: Number.isFinite(gun.mag) ? gun.mag / speed : NaN, // giây để bắn hết băng
      noPet: damage(gun, s, 0, speed),
      pet: damage(gun, s, petBonus, speed),
    };
  }

  /** Tốc bắn thực tế ước tính: số khung giữa 2 viên = làm tròn lên(FPS ÷ tốc) + 1 (suy từ số đo, chưa kiểm chứng từ mã nguồn). */
  function realRate(speed, fps) {
    return fps / (Math.ceil(fps / speed - 1e-9) + 1);
  }

  /** Duyệt mọi tổ hợp `rows` dòng từ các loại dòng ứng viên, giới hạn số dòng cộng thẳng. */
  function optimize(gun, candidates, o) {
    const rows = o.rows || 5;
    const k = candidates.length;
    const cap = candidates.map((l) => Math.min(
      num(l.spdFlat) > 0 ? o.maxSpdFlat : Infinity,
      num(l.atkFlatMin) > 0 || num(l.atkFlatMax) > 0 ? o.maxAtkFlat : Infinity));
    const out = [];
    const counts = new Array(k).fill(0);
    const push = () => {
      const lines = [];
      counts.forEach((c, i) => { for (let j = 0; j < c; j++) lines.push(candidates[i]); });
      const ev = evaluate(gun, lines, o.petBonus);
      const d = o.usePet ? ev.pet : ev.noPet;
      out.push({ lines, counts: counts.slice(), ev, d, dps: d.dps, mag: d.mag });
    };
    (function rec(i, left) {
      if (i === k - 1) { if (left <= cap[i]) { counts[i] = left; push(); } counts[i] = 0; return; }
      for (let c = 0; c <= Math.min(left, cap[i]); c++) { counts[i] = c; rec(i + 1, left - c); }
      counts[i] = 0;
    })(0, rows);
    const [a, b] = o.sortBy === "mag" ? ["mag", "dps"] : ["dps", "mag"];
    out.sort((x, y) => (y[a] - x[a]) || (y[b] - x[b]) || 0); // NaN (chưa rõ số đạn) coi như bằng nhau
    return out;
  }

  return { num, r4, isEffective, sumLines, evaluate, realRate, optimize };
});
