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
- Phần tối ưu cho phép tối đa 2 dòng Tốc độ +0,50/giây (đặt ở sheet Tham số, ô B5) và 1 dòng Tấn công cộng thẳng. Việc game có ra trùng dòng +0,50/giây hay không **chưa được kiểm chứng**.
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

Mỗi súng có 4 build mẫu (Cân bằng, Thiên dame, Thiên tốc, Toàn Tấn công) trong sheet Tính build. Build "Cân bằng" của 5 súng mới là kết quả tìm tối ưu theo chỉ số riêng từng súng.

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
js/data.js            dữ liệu súng, dòng chỉ số, build (sinh từ Excel, không sửa tay)
js/extra-guns.js      súng thêm tạm ngoài Excel (hiện để trống)
js/weapons.js         bảng giá trị dòng chỉ số theo bậc, nguồn Haegin
js/calc.js            công thức tính và bộ tìm build tối ưu
js/app.js             giao diện và bộ định tuyến
img/guns/<id>.png     ảnh súng (cắt tròn từ ảnh trong game)
data/                 file Excel nguồn dữ liệu
tools/build_data.py   đọc file Excel, ghi ra js/data.js
cap-nhat-du-lieu.bat  chạy build_data.py trên Windows
```

## Thêm hoặc cập nhật dữ liệu

Nguồn dữ liệu chính là file Excel **`data/Build_sung_Play_Together.xlsx`** (nằm trong dự án). Web đọc dữ liệu qua `js/data.js`, file này được sinh từ Excel.

Các sheet chính:

| Sheet | Nội dung |
|---|---|
| Súng | Mỗi hàng một súng: dame, tốc gốc, độ bền, mã ảnh, tên trong game, chí mạng, nơi thu thập, nguồn chỉ số |
| Dòng chỉ số | Các loại dòng chỉ số (web chỉ dùng bậc S) |
| Tính build | Các build mẫu của từng súng, tự tính tốc bắn, dame, DPS, cả băng |
| Tối ưu | Chọn súng, Excel tự duyệt mọi tổ hợp 5 dòng |
| Tham số | Mức pet, số dòng +0,50/giây tối đa khi tìm tối ưu |
| Giá trị theo bậc | Bảng giá trị dòng chỉ số F–S (tham khảo, web dùng bảng trong `js/weapons.js`) |
| Giả thuyết, Số đo | Công thức đã thử và số đo từ clip |

**Thêm súng:** thêm một hàng ở sheet **Súng** (điền đủ cột A–L), thêm các build mẫu ở sheet **Tính build**, đặt ảnh tròn 256×256 vào `img/guns/<mã>.png`. Cột G "Mã" chính là tên file ảnh. Sau đó cập nhật web:

```bash
pip install openpyxl
python tools/build_data.py
```

Trên Windows có thể chạy `cap-nhat-du-lieu.bat`. Lệnh này ghi đè `js/data.js`. Muốn dùng file Excel ở chỗ khác thì truyền đường dẫn: `python tools/build_data.py "đường/dẫn/file.xlsx"`.

Súng không có build trong Excel vẫn được web tự tạo 4 build mẫu. `js/extra-guns.js` chỉ còn dùng khi muốn thêm tạm một súng mà chưa sửa Excel.

## Triển khai

Trang chỉ gồm file tĩnh, không có bước build. Dùng được trên GitHub Pages, Cloudflare Pages hoặc Workers (thư mục gốc `/`, không cần build command). Mỗi lần đẩy lên nhánh `main`, nơi host sẽ tự triển khai lại.
