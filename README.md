# PT Build — Tra cứu súng Play Together

Website tĩnh do người chơi tự làm để tra cứu súng trong Play Together, tính dame và tìm build dòng chỉ số tối ưu. Giao diện tiếng Việt, có chế độ sáng/tối và dùng được trên điện thoại.

> Trang không phải sản phẩm chính thức của Play Together / Haegin / VNG. Số liệu theo công thức lý thuyết, **không tính chí mạng**.

## Tính năng

| Trang | Đường dẫn | Nội dung |
|---|---|---|
| Tổng quan | `#/` | Build DPS tối ưu của từng súng, có và không có pet |
| Tính dame | `#/tinh-build` | Chọn súng và 5 dòng chỉ số, ra tốc bắn, dame min–max, dame trung bình, DPS, dame cả băng |
| Build tối ưu | `#/toi-uu` | Duyệt mọi tổ hợp 5 dòng bậc S, xếp hạng theo DPS hoặc dame cả băng |
| Súng | `#/sung`, `#/sung/<id>` | Danh sách súng, chỉ số gốc, nơi thu thập, các build mẫu |
| Dòng chỉ số | `#/dong-chi-so` | Các dòng bậc S và bảng giá trị dòng chỉ số theo bậc F–S |
| Cách tính | `#/cach-tinh` | Công thức, các giả thuyết đã thử và số đo từ clip |

Có ô tìm kiếm nhanh (súng, dòng chỉ số, build, giả thuyết) ở thanh trên cùng.

## Công thức

```
Tốc bắn  = (Tốc gốc + Σ dòng cộng thẳng/giây) × (1 + Σ % Tốc độ)
Dame     = (Dame gốc + Σ Tấn công cộng thẳng) × (1 + Pet + Σ % Tấn công)
DPS      = Tốc bắn × Dame trung bình
Cả băng  = Dame trung bình × Số đạn
```

- Pet chỉ có 2 mức cộng Tấn công: **+50%** hoặc **+25%**, cộng chung với các dòng % Tấn công.
- Chỉ xét dòng bậc **S**.
- Phần tối ưu cho phép tối đa 2 dòng Tốc độ +0,50/giây và 1 dòng Tấn công cộng thẳng. Việc game có ra trùng dòng +0,50/giây hay không **chưa được kiểm chứng**.
- Công thức đã đối chiếu với file Excel gốc và với clip đo thực tế của súng điện từ.

## Dữ liệu

Chỉ số gốc của các súng lấy từ ảnh chụp trong game (người chơi cung cấp, ngày 21/11/2026). Một số giá trị, như độ bền của súng gián điệp đen, lấy từ sheet người chơi tổng hợp và được ghi chú rõ trên trang. Bảng giá trị dòng chỉ số theo bậc lấy từ trung tâm trợ giúp của Haegin.

| Súng | Tên trong game |
|---|---|
| Cánh đỏ | Thiết bị xung kích cánh đỏ |
| Điện từ | Thiết bị phát xạ điện từ khuếch đại |
| Súng bạc | Vũ khí súng bạc |
| Sói Neo | Vũ khí súng trường sói Neo |
| Gián điệp đen | Vũ khí súng gián điệp đen |
| Trượng bóng đêm | Vũ khí trượng bóng đêm |
| Súng kẹo ma | Vũ khí súng kẹo ma |

Súng chưa có build trong Excel được tự tạo 4 build mẫu (Cân bằng, Thiên dame, Thiên tốc, Toàn Tấn công) từ chỉ số riêng của súng.

## Chạy trên máy

Không cần cài gì, chỉ cần một máy chủ tĩnh:

```bash
python -m http.server 5173
```

Mở `http://localhost:5173`. Mở thẳng `index.html` bằng file cũng được.

## Cấu trúc

```
index.html            khung trang, thanh điều hướng
css/style.css         giao diện chung, sáng/tối
css/mobile.css        giao diện điện thoại và máy tính bảng
js/data.js            dữ liệu súng, dòng chỉ số, build (sinh từ Excel)
js/extra-guns.js      súng bổ sung ngoài Excel và thông tin thêm
js/weapons.js         bảng giá trị dòng chỉ số theo bậc, nguồn Haegin
js/calc.js            công thức tính và bộ tìm build tối ưu
js/app.js             giao diện và bộ định tuyến
img/guns/<id>.png     ảnh súng (cắt tròn từ ảnh trong game)
tools/build_data.py   đọc file Excel, ghi ra js/data.js
cap-nhat-du-lieu.bat  chạy build_data.py trên Windows
```

## Thêm hoặc cập nhật dữ liệu

**Thêm súng ngoài Excel:** thêm một mục vào `PT_EXTRA_GUNS` trong `js/extra-guns.js` (id, tên, dame min/max, tốc gốc, độ bền, chí mạng, nơi thu thập), rồi đặt ảnh tròn 256×256 vào `img/guns/<id>.png`. Nếu muốn dùng tên đầy đủ trong game, điền thêm `gameName`.

**Cập nhật theo file Excel:** cần Python và `openpyxl`.

```bash
pip install openpyxl
python tools/build_data.py "đường/dẫn/Build_sung_Play_Together.xlsx"
```

Trên Windows có thể kéo file Excel thả vào `cap-nhat-du-lieu.bat`. Lệnh này ghi đè `js/data.js`.

## Triển khai

Trang chỉ gồm file tĩnh, không có bước build. Dùng được trên GitHub Pages, Cloudflare Pages hoặc Workers (thư mục gốc `/`, không cần build command). Mỗi lần đẩy lên nhánh `main`, nơi host sẽ tự triển khai lại.
