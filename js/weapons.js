/* Danh sách vũ khí săn, bảng dòng chỉ số, hộp bốc thăm và nguồn.
 * Dữ liệu nhập tay từ 2 nguồn chính thức, ghi nhận ngày 21/11/2026:
 *  - Haegin (nhà phát hành), trung tâm trợ giúp bản tiếng Việt: help-playtogether.haegin.kr/hc/vi
 *      + 4 bài "Tỷ lệ cường hóa vũ khí 1-4": danh sách vũ khí theo nhóm + xác suất dòng chỉ số
 *      + mục "Thông tin Xác suất" (219 bài): hộp bốc thăm và tỷ lệ ra vũ khí
 *  - VNG, tin tức chính thức: playtogether.vnggames.com/tin-tuc (117 bài, đã quét): cách nhận vũ khí qua sự kiện
 * Trang chính thức KHÔNG công bố dame / tốc độ gốc / số đạn của vũ khí. */
(function () {
  const H = "https://help-playtogether.haegin.kr/hc/vi/articles/";
  const V = "https://playtogether.vnggames.com/tin-tuc/tin-tuc/";
  const haegin = (id, label) => ({ site: "Haegin", label, url: H + id });
  const vng = (file, label) => ({ site: "VNG", label, url: V + file });

  const S = {
    enh: [
      haegin("48485715459865", "Tỷ lệ cường hóa vũ khí 1"),
      haegin("39085189834137", "Tỷ lệ cường hóa vũ khí 2"),
      haegin("48485781447449", "Tỷ lệ cường hóa vũ khí 3"),
      haegin("61542826471833", "Tỷ lệ cường hóa vũ khí 4"),
    ],
    kemMa: haegin("38991879129241", "Bốc thăm Kẹo ma"),
    kemMaShop: haegin("38994802340889", "Cửa hàng Halloween vui vẻ"),
    blackRose: haegin("43925261850905", "Bốc thăm Black Rose"),
    nuHoang: haegin("46185842175769", "Bốc thăm Nữ hoàng bóng đêm"),
    sói: haegin("50022884455065", "Bốc thăm Thành phố người sói"),
    sungBac: haegin("48336832478745", "Bốc thăm Súng bạc"),
    deadeye: haegin("56834414511001", "Bốc thăm Xạ thủ Deadeye"),
    blackFriday: haegin("63464167383961", "Bốc thăm Black Friday"),
    v208: vng("chi-tiet-cap-nhat-2-08.html", "Cập nhật 2.08 (23/10/2024)"),
    v213: vng("chi-tiet-cap-nhat-2-13.html", "Cập nhật 2.13 (05/03/2025)"),
    v215: vng("chi-tiet-cap-nhat-2-15.html", "Cập nhật 2.15 (28/04/2025)"),
    v177: vng("chi-tiet-cap-nhat-ngay-17-7.html", "Cập nhật 17/7 (16/07/2025)"),
    v119: vng("chi-tiet-cap-nhat-ngay-11-09.html", "Cập nhật 11/09 (10/09/2025)"),
    v221: vng("chi-tiet-cap-nhat-2-21.html", "Cập nhật 2.21 (05/11/2025)"),
  };

  window.PT_WEAPONS = {
    checked: "21/11/2026",
    scanned: "Đã quét 219 bài “Thông tin Xác suất” và 48 bài “Chi tiết cập nhật” của Haegin, 117 tin tức của VNG.",
    sources: S,
    grades: [
      { g: "F", atk: "5 – 6", spd: "0,05", cp: "1%", cd: "5%", atkPct: "5%", spdPct: "5%" },
      { g: "D", atk: "9 – 11", spd: "0,1", cp: "2%", cd: "10%", atkPct: "10%", spdPct: "10%" },
      { g: "C", atk: "14 – 17", spd: "0,15", cp: "3%", cd: "15%", atkPct: "15%", spdPct: "15%" },
      { g: "B", atk: "18 – 22", spd: "0,2", cp: "4%", cd: "20%", atkPct: "20%", spdPct: "20%" },
      { g: "A", atk: "23 – 28", spd: "0,25", cp: "5%", cd: "25%", atkPct: "25%", spdPct: "25%" },
      { g: "S", atk: "45 – 55", spd: "0,5", cp: "10%", cd: "50%", atkPct: "50%", spdPct: "50%" },
    ],
    // prob: xác suất (%) cho MỖI loại dòng ở từng bậc F, D, C, B, A, S. Mỗi bậc có 6 loại dòng.
    groups: [
      { id: 2, src: S.enh[1], prob: [9.4167, 5.8333, 0.8333, 0.3333, 0.1667, 0.0833] },
      { id: 3, src: S.enh[2], prob: [8.6667, 5.0, 1.6667, 0.8333, 0.3333, 0.1667] },
      { id: 4, src: S.enh[3], prob: [9.7333, 5.8333, 0.8333, 0.1667, 0.0833, 0.0167] },
    ],
    // draw: hộp bốc thăm (Haegin). how: cách nhận khác (VNG). refs: nguồn riêng của vũ khí.
    weapons: [
      { group: 2, vi: "Vũ khí súng kẹo ma", en: "Ghost Candy Gun", gun: "sung-keo-ma", draw: { name: "Bốc thăm Kẹo ma", rate: "1,0%", src: S.kemMa }, refs: [S.kemMaShop, S.v208] },
      { group: 2, vi: "Vũ khí súng gián điệp đen", en: "Black Spy Gun", gun: "sung-gian-diep-den", draw: { name: "Bốc thăm Black Rose", rate: "1,0%", src: S.blackRose }, refs: [S.v213] },
      { group: 2, vi: "Vũ khí trượng bóng đêm", en: "Scepter of the Night", gun: "vuong-truong-bong-dem", draw: { name: "Bốc thăm Nữ hoàng bóng đêm", rate: "1,0%", src: S.nuHoang } },
      { group: 2, vi: "Vũ khí súng trường sói Neo", en: "Neo Wolf Impactor", gun: "xung-kich-soi-neo", draw: { name: "Bốc thăm Thành phố người sói", rate: "1,0%", src: S.sói },
        how: "VNG gọi là “Vũ khí súng trường sói Neo”.", refs: [S.v119] },
      { group: 3, vi: "Vũ khí súng bạc", en: "Silver Pistol", gun: "sung-bac", draw: { name: "Bốc thăm Súng bạc", rate: "0,5%", src: S.sungBac },
        how: "VNG: “vũ khí có tốc độ tấn công nhanh nhất từ trước đến nay”. Điểm danh 7 ngày tặng 1 lượt bốc thăm.", refs: [S.v177] },
      { group: 3, vi: "Thiết bị xung kích cánh đỏ", en: "Red Wing Blaster", gun: "canh-do", draw: { name: "Bốc thăm Xạ thủ Deadeye", rate: "0,5%", src: S.deadeye } },
      { group: null, vi: "Thiết bị phát xạ điện từ khuếch đại", en: "", gun: "dien-tu", how: "Sản phẩm sự kiện (theo ảnh chụp trong game). Chưa thấy trong bảng xác suất của Haegin." },
    ],
  };
})();
