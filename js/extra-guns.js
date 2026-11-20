/* Súng bổ sung ngoài file Excel + thông tin thêm cho súng trong Excel.
 * source: "game"  = chỉ số đọc từ ảnh chụp màn hình trong game (do người dùng cung cấp, ngày 21/11/2026)
 *         "sheet" = lấy từ Google Sheet người chơi tổng hợp, chưa đối chiếu với game
 * crit: [xác suất chí mạng, sát thương chí mạng] (không tính vào DPS). collect: "Nơi thu thập" hiển thị trong game.
 * Số đạn = độ bền tối đa (mag: null nếu chưa biết).
 * Ảnh: img/guns/<id>.png (cắt từ ảnh chụp trong game). Muốn thêm súng khác: thêm 1 mục vào đây (hoặc vào Excel rồi chạy cap-nhat-du-lieu.bat). */
window.PT_GUN_META = {
  "canh-do": { crit: [0.15, 0.15], collect: "Sản phẩm bốc thăm", source: "game", gameName: "Thiết bị xung kích cánh đỏ" },
  "dien-tu": { crit: [0.15, 0.15], collect: "Sản phẩm sự kiện", source: "game", gameName: "Thiết bị phát xạ điện từ khuếch đại" },
};

window.PT_EXTRA_GUNS = [
  { id: "sung-bac", name: "Súng bạc", gameName: "Vũ khí súng bạc", min: 180, max: 220, speed: 2, mag: 500, crit: [0.15, 0.15],
    collect: "Sản phẩm bốc thăm", source: "game", note: "Silver Pistol. Chỉ số đọc từ ảnh trong game (độ bền 500). Sửa chữa 1.500 (3 mỗi viên) theo sheet người chơi." },
  { id: "xung-kich-soi-neo", name: "Thiết bị xung kích sói Neo", gameName: "Vũ khí súng trường sói Neo", min: 315, max: 385, speed: 1, mag: 450, crit: [0.10, 0.15],
    collect: "Sản phẩm bốc thăm", source: "game", note: "Neo Wolf. Trong game ghi tên “Vũ khí súng trường sói Neo”. Sửa chữa 1.250 (2,78 mỗi viên) theo sheet người chơi." },
  { id: "sung-gian-diep-den", name: "Súng gián điệp đen", gameName: "Vũ khí súng gián điệp đen", min: 270, max: 330, speed: 1, mag: 400, crit: [0.10, 0.10],
    collect: "Sản phẩm bốc thăm", source: "game", note: "Black Spy Gun. Độ bền 400 lấy theo sheet người chơi, chưa thấy trong ảnh game." },
  { id: "vuong-truong-bong-dem", name: "Vương trượng bóng đêm", gameName: "Vũ khí trượng bóng đêm", min: 270, max: 330, speed: 1, mag: 400, crit: [0.10, 0.10],
    collect: "Sản phẩm bốc thăm", source: "game", note: "Scepter of the Night. Trong game ghi tên “Vũ khí trượng bóng đêm”, độ bền tối đa 400." },
  { id: "sung-keo-ma", name: "Súng kẹo ma", gameName: "Vũ khí súng kẹo ma", min: 135, max: 165, speed: 2, mag: 400, crit: [0.10, 0.10],
    collect: "Sản phẩm bốc thăm", source: "game", note: "Ghost Candy Gun. Chỉ số đọc từ ảnh trong game (độ bền tối đa 400). Sửa chữa 1.000 (2,5 mỗi viên) theo sheet người chơi." },
];
