/* Súng và thông tin thêm hiện nằm hết trong Excel (data/Build_sung_Play_Together.xlsx, sheet "Súng").
 * Muốn thêm súng: thêm 1 hàng ở sheet "Súng" rồi chạy cap-nhat-du-lieu.bat.
 * File này chỉ còn dùng cho súng muốn thêm tạm mà chưa sửa Excel (cùng định dạng cũ):
 *   PT_EXTRA_GUNS = [{ id, name, gameName, min, max, speed, mag, crit: [xs, st], collect, source: "game"|"sheet", note }]
 *   PT_GUN_META   = { "<id súng trong Excel>": { crit, collect, source, gameName } } */
window.PT_GUN_META = {};
window.PT_EXTRA_GUNS = [];
