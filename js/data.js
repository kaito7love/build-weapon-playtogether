/* File sinh tự động bởi tools/build_data.py từ Excel. Đừng sửa tay. */
window.PT_DATA = {
 "meta": {
  "source": "Build_sung_Play_Together.xlsx",
  "generated": "2026-11-21"
 },
 "params": {
  "petBonus": 0.5,
  "petName": "Vũ Trụ Long",
  "petNote": "Cộng chung với các dòng % Tấn công. Đã kiểm chứng trên clip điện từ (xem sheet Số đo).",
  "maxSpdFlat": 2,
  "maxSpdFlatNote": "Đặt 2 để cho phép build có 2 dòng +0,50/giây (web đang dùng 2). Chưa kiểm chứng game có cho ra trùng dòng này. Đặt 1 nếu game không cho ra trùng.",
  "maxAtkFlat": 1,
  "maxAtkFlatNote": "Chưa kiểm chứng cách tính dòng này. Không ảnh hưởng build tối ưu hiện tại.",
  "rows": 5
 },
 "guns": [
  {
   "id": "canh-do",
   "name": "Cánh đỏ",
   "min": 360,
   "max": 440,
   "speed": 1,
   "mag": 250,
   "note": "Thiết bị xung kích cánh đỏ. Số đạn = độ bền tối đa. Chí mạng gốc 15% / 15% (không tính).",
   "gameName": "Thiết bị xung kích cánh đỏ",
   "crit": [
    0.15,
    0.15
   ],
   "collect": "Sản phẩm bốc thăm",
   "source": "game",
   "measured": {
    "speed": true,
    "dame": false
   }
  },
  {
   "id": "dien-tu",
   "name": "Điện từ",
   "min": 248,
   "max": 303,
   "speed": 1.5,
   "mag": 400,
   "note": "Thiết bị phát xạ điện từ khuếch đại. Số đạn = độ bền tối đa. Chí mạng gốc 15% / 15% (không tính).",
   "gameName": "Thiết bị phát xạ điện từ khuếch đại",
   "crit": [
    0.15,
    0.15
   ],
   "collect": "Sản phẩm sự kiện",
   "source": "game",
   "measured": {
    "speed": true,
    "dame": true
   }
  },
  {
   "id": "sung-bac",
   "name": "Súng bạc",
   "min": 180,
   "max": 220,
   "speed": 2,
   "mag": 500,
   "note": "Silver Pistol. Chỉ số đọc từ ảnh trong game (độ bền 500). Sửa chữa 1.500 (3 mỗi viên) theo sheet người chơi.",
   "gameName": "Vũ khí súng bạc",
   "crit": [
    0.15,
    0.15
   ],
   "collect": "Sản phẩm bốc thăm",
   "source": "game",
   "measured": {
    "speed": false,
    "dame": false
   }
  },
  {
   "id": "xung-kich-soi-neo",
   "name": "Thiết bị xung kích sói Neo",
   "min": 315,
   "max": 385,
   "speed": 1,
   "mag": 450,
   "note": "Neo Wolf. Trong game ghi tên “Vũ khí súng trường sói Neo”. Sửa chữa 1.250 (2,78 mỗi viên) theo sheet người chơi.",
   "gameName": "Vũ khí súng trường sói Neo",
   "crit": [
    0.1,
    0.15
   ],
   "collect": "Sản phẩm bốc thăm",
   "source": "game",
   "measured": {
    "speed": false,
    "dame": false
   }
  },
  {
   "id": "sung-gian-diep-den",
   "name": "Súng gián điệp đen",
   "min": 270,
   "max": 330,
   "speed": 1,
   "mag": 400,
   "note": "Black Spy Gun. Độ bền 400 lấy theo sheet người chơi, chưa thấy trong ảnh game.",
   "gameName": "Vũ khí súng gián điệp đen",
   "crit": [
    0.1,
    0.1
   ],
   "collect": "Sản phẩm bốc thăm",
   "source": "game",
   "measured": {
    "speed": false,
    "dame": false
   }
  },
  {
   "id": "vuong-truong-bong-dem",
   "name": "Vương trượng bóng đêm",
   "min": 270,
   "max": 330,
   "speed": 1,
   "mag": 400,
   "note": "Scepter of the Night. Trong game ghi tên “Vũ khí trượng bóng đêm”, độ bền tối đa 400.",
   "gameName": "Vũ khí trượng bóng đêm",
   "crit": [
    0.1,
    0.1
   ],
   "collect": "Sản phẩm bốc thăm",
   "source": "game",
   "measured": {
    "speed": false,
    "dame": false
   }
  },
  {
   "id": "sung-keo-ma",
   "name": "Súng kẹo ma",
   "min": 135,
   "max": 165,
   "speed": 2,
   "mag": 400,
   "note": "Ghost Candy Gun. Chỉ số đọc từ ảnh trong game (độ bền tối đa 400). Sửa chữa 1.000 (2,5 mỗi viên) theo sheet người chơi.",
   "gameName": "Vũ khí súng kẹo ma",
   "crit": [
    0.1,
    0.1
   ],
   "collect": "Sản phẩm bốc thăm",
   "source": "game",
   "measured": {
    "speed": false,
    "dame": false
   }
  }
 ],
 "lines": [
  {
   "name": "S · Tấn công 50%",
   "tier": "S",
   "atkPct": 0.5,
   "spdPct": 0,
   "spdFlat": 0,
   "atkFlatMin": 0,
   "atkFlatMax": 0,
   "note": null
  },
  {
   "name": "S · Tốc độ tấn công 50%",
   "tier": "S",
   "atkPct": 0,
   "spdPct": 0.5,
   "spdFlat": 0,
   "atkFlatMin": 0,
   "atkFlatMax": 0,
   "note": null
  },
  {
   "name": "S · Tốc độ tấn công 0,50/giây",
   "tier": "S",
   "atkPct": 0,
   "spdPct": 0,
   "spdFlat": 0.5,
   "atkFlatMin": 0,
   "atkFlatMax": 0,
   "note": "Cộng thẳng vào tốc gốc rồi mới nhân với %"
  },
  {
   "name": "S · Tấn công 45 đến 55 (cộng thẳng)",
   "tier": "S",
   "atkPct": 0,
   "spdPct": 0,
   "spdFlat": 0,
   "atkFlatMin": 45,
   "atkFlatMax": 55,
   "note": "Chưa kiểm chứng: có nhân với % Tấn công hay không"
  },
  {
   "name": "S · Xác suất chí mạng 10%",
   "tier": "S",
   "atkPct": 0,
   "spdPct": 0,
   "spdFlat": 0,
   "atkFlatMin": 0,
   "atkFlatMax": 0,
   "note": "Không tính crit"
  },
  {
   "name": "S · Sát thương chí mạng 50%",
   "tier": "S",
   "atkPct": 0,
   "spdPct": 0,
   "spdFlat": 0,
   "atkFlatMin": 0,
   "atkFlatMax": 0,
   "note": "Không tính crit"
  },
  {
   "name": "B · Tấn công 20%",
   "tier": "B",
   "atkPct": 0.2,
   "spdPct": 0,
   "spdFlat": 0,
   "atkFlatMin": 0,
   "atkFlatMax": 0,
   "note": null
  },
  {
   "name": "B · Tốc độ tấn công 20%",
   "tier": "B",
   "atkPct": 0,
   "spdPct": 0.2,
   "spdFlat": 0,
   "atkFlatMin": 0,
   "atkFlatMax": 0,
   "note": null
  },
  {
   "name": "(không có dòng)",
   "tier": null,
   "atkPct": 0,
   "spdPct": 0,
   "spdFlat": 0,
   "atkFlatMin": 0,
   "atkFlatMax": 0,
   "note": "Dùng khi súng có ít hơn 5 dòng"
  }
 ],
 "builds": [
  {
   "gun": "Cánh đỏ",
   "name": "Hiện tại",
   "lines": [
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây",
    "S · Tấn công 50%",
    "B · Tốc độ tấn công 20%"
   ]
  },
  {
   "gun": "Cánh đỏ",
   "name": "Nên build (Cân bằng)",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Cánh đỏ",
   "name": "Thiên dame",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Cánh đỏ",
   "name": "Thiên tốc",
   "lines": [
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Cánh đỏ",
   "name": "Toàn Tấn công",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%"
   ]
  },
  {
   "gun": "Cánh đỏ",
   "name": "Cần 2 dòng 0,50/giây (chưa kiểm chứng)",
   "lines": [
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Điện từ",
   "name": "Hiện tại",
   "lines": [
    "S · Tấn công 50%",
    "B · Tấn công 20%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Điện từ",
   "name": "Nên build (Cân bằng)",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Điện từ",
   "name": "Thiên dame",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Điện từ",
   "name": "Thiên tốc",
   "lines": [
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Điện từ",
   "name": "Toàn Tấn công",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%"
   ]
  },
  {
   "gun": "Điện từ",
   "name": "Cần 2 dòng 0,50/giây (chưa kiểm chứng)",
   "lines": [
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Súng bạc",
   "name": "Nên build (Cân bằng)",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tấn công 45 đến 55 (cộng thẳng)"
   ]
  },
  {
   "gun": "Súng bạc",
   "name": "Thiên dame",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Súng bạc",
   "name": "Thiên tốc",
   "lines": [
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Súng bạc",
   "name": "Toàn Tấn công",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%"
   ]
  },
  {
   "gun": "Thiết bị xung kích sói Neo",
   "name": "Nên build (Cân bằng)",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Thiết bị xung kích sói Neo",
   "name": "Thiên dame",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Thiết bị xung kích sói Neo",
   "name": "Thiên tốc",
   "lines": [
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Thiết bị xung kích sói Neo",
   "name": "Toàn Tấn công",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%"
   ]
  },
  {
   "gun": "Súng gián điệp đen",
   "name": "Nên build (Cân bằng)",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Súng gián điệp đen",
   "name": "Thiên dame",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Súng gián điệp đen",
   "name": "Thiên tốc",
   "lines": [
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Súng gián điệp đen",
   "name": "Toàn Tấn công",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%"
   ]
  },
  {
   "gun": "Vương trượng bóng đêm",
   "name": "Nên build (Cân bằng)",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Vương trượng bóng đêm",
   "name": "Thiên dame",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Vương trượng bóng đêm",
   "name": "Thiên tốc",
   "lines": [
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Vương trượng bóng đêm",
   "name": "Toàn Tấn công",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%"
   ]
  },
  {
   "gun": "Súng kẹo ma",
   "name": "Nên build (Cân bằng)",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tấn công 45 đến 55 (cộng thẳng)"
   ]
  },
  {
   "gun": "Súng kẹo ma",
   "name": "Thiên dame",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Súng kẹo ma",
   "name": "Thiên tốc",
   "lines": [
    "S · Tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 50%",
    "S · Tốc độ tấn công 0,50/giây"
   ]
  },
  {
   "gun": "Súng kẹo ma",
   "name": "Toàn Tấn công",
   "lines": [
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%",
    "S · Tấn công 50%"
   ]
  }
 ],
 "summary": {
  "title": "Tổng hợp: build tối ưu cánh đỏ và điện từ",
  "intro": "Số liệu theo công thức lý thuyết, không tính crit. Bảng tự cập nhật khi bạn sửa sheet Súng, Dòng chỉ số, Tham số hoặc Tính build.",
  "conclusionsTitle": "Kết luận ban đầu (tại thời điểm tạo file)",
  "conclusions": [
   "Build tối ưu cho cả hai súng, có pet hay không: 2 dòng Tấn công 50% + 2 dòng Tốc độ tấn công 50% + 1 dòng Tốc độ tấn công 0,50/giây.",
   "Có pet, cánh đỏ có thể đạt DPS cao hơn nếu có 2 dòng Tốc độ tấn công 0,50/giây (chưa kiểm chứng game có cho ra trùng dòng này). Xem hàng cuối của mỗi súng ở sheet Tính build.",
   "Muốn nhiều dame cả băng hơn, đổi bớt 1 dòng Tốc độ sang Tấn công (hàng Thiên dame ở sheet Tính build): dame cả băng tăng khoảng 20 đến 25%, DPS giảm khoảng 6 đến 10%.",
   "Xem sheet Giả thuyết cho công thức và mức độ kiểm chứng, sheet Số đo cho số đo từ clip."
  ],
  "legend": "Ký hiệu: S và B là bậc của dòng chỉ số. Dòng bậc B sẽ là bậc S khi nâng cấp."
 },
 "hypotheses": {
  "intro": [
   "Cách tính chỉ số súng: giả thuyết đang dùng trong file",
   "Dựa trên ảnh chỉ số súng, ảnh pet và 4 clip bắn thử của bạn (ngày 17 và 18/11/2026)."
  ],
  "items": [
   {
    "title": "1. Dame mỗi viên",
    "body": "Dame = (Dame gốc + tổng Tấn công cộng thẳng) × (1 + Pet + tổng % Tấn công). Pet và các dòng % Tấn công cộng chung với nhau, không nhân nhau.\nĐã kiểm chứng (điện từ, có pet): dame thấp nhất đo 545, công thức ra 545,6; dame trung bình đo 604, công thức ra 606 (sheet Số đo).\nChưa kiểm chứng: cánh đỏ chưa có clip đo dame; dòng Tấn công cộng thẳng (45 đến 55) có nhân với % hay không."
   },
   {
    "title": "2. Tốc bắn (viên/giây)",
    "body": "Tốc bắn = (Tốc gốc + tổng các dòng cộng thẳng +0,50/giây) × (1 + tổng % Tốc độ). Các % Tốc độ cộng dồn với nhau, và dòng +0,50/giây cũng bị nhân với tổng %.\nVí dụ điện từ: (1,5 + 0,5) × (1 + 0,5 + 0,5) = 4,0. Ví dụ cánh đỏ hiện tại: (1,0 + 0,5) × (1 + 0,5 + 0,2) = 2,55.\nĐây là giả thuyết khớp nhất trong 4 giả thuyết đã thử (A, B, C, D) với 3 số đo tốc bắn, xem sheet Số đo."
   },
   {
    "title": "3. DPS và dame cả băng",
    "body": "DPS = dame trung bình × tốc bắn. Dame cả băng = dame trung bình × số đạn. Thời gian bắn hết băng = số đạn ÷ tốc bắn. Không tính crit."
   },
   {
    "title": "4. Tốc bắn thật so với công thức",
    "body": "Game bắn theo khung hình, mỗi viên trễ thêm khoảng 1 khung, nên tốc bắn thật thấp hơn công thức. Quy tắc khớp với số đo: số khung giữa 2 viên = làm tròn lên(FPS ÷ tốc bắn) + 1.\nĐiện từ: 30 FPS ra 9 khung = 3,33 viên/giây; 60 FPS ra 16 khung = 3,75 viên/giây (đo được 3,73). Tốc bắn càng gần công thức khi FPS càng cao.\nFile này tính theo công thức lý thuyết, không tính độ trễ này. Quy tắc trễ 1 khung là ước lượng từ số đo, chưa đọc từ mã nguồn game."
   },
   {
    "title": "5. Cách chọn build tối ưu",
    "body": "Mỗi súng có 5 dòng. Trong các dòng bậc S chỉ có 4 loại ảnh hưởng dame hoặc tốc độ (Tấn công %, Tốc độ %, Tốc độ 0,50/giây, Tấn công cộng thẳng); 2 loại chí mạng bị bỏ qua.\nSheet Tối ưu duyệt hết 56 tổ hợp, xếp theo DPS; hòa thì ưu tiên dame cả băng cao hơn.\nKết quả ban đầu: cả hai súng, có pet hay không, tối ưu nhất là 2 dòng Tấn công 50% + 2 dòng Tốc độ tấn công 50% + 1 dòng Tốc độ tấn công 0,50/giây."
   },
   {
    "title": "6. Chưa có thông tin (để trống)",
    "body": "Giá trị các dòng ở bậc A, C... (mới biết bậc S, và bậc B của Tấn công % và Tốc độ %); giá trị bậc B của dòng Tốc độ 0,50/giây và Tấn công cộng thẳng.\nGame có cho ra trùng 2 dòng Tốc độ tấn công 0,50/giây hay không, và 2 dòng đó có cộng dồn đúng công thức hay không (build có 2 dòng này chỉ là tính thử).\nDame cánh đỏ chưa đo bằng clip. Tốc bắn của các build nâng cấp chưa đo, mới đo build hiện tại."
   },
   {
    "title": "7. Cách mở rộng khi có súng mới",
    "body": "Bước 1: sheet Súng, điền 1 hàng (tên, dame gốc min và max, tốc gốc, số đạn).\nBước 2: nếu có loại dòng mới (ví dụ bậc A), thêm 1 hàng ở sheet Dòng chỉ số.\nBước 3: sheet Tính build, chọn súng và 5 dòng, kết quả tự tính. Sheet Tối ưu, chọn súng, tự ra top 5 build.\nĐổi giá trị pet hoặc giới hạn số dòng trùng ở sheet Tham số."
   }
  ]
 },
 "measurements": {
  "speed": {
   "title": "A. Số đo tốc bắn (đếm bộ đếm đạn giảm theo từng khung hình)",
   "header": [
    "Clip",
    "Súng",
    "FPS",
    "Số khung giữa 2 viên",
    "Giây giữa 2 viên",
    "Tốc bắn = FPS ÷ số khung (viên/giây)",
    "Ghi chú"
   ],
   "rows": [
    [
     1,
     "Cánh đỏ",
     30,
     13,
     0.433333,
     2.307692,
     "Dòng: Tấn công 50% ×2, Tốc độ 50%, Tốc độ 0,50/giây, Tốc độ 20% (B). 73/78 khoảng cách đúng 13 khung, còn lại lệch từng cặp 12/14 (tổng 26)."
    ],
    [
     2,
     "Điện từ",
     30,
     9,
     0.3,
     3.333333,
     "Dòng: Tấn công 50%, Tấn công 20% (B), Tốc độ 50% ×2, Tốc độ 0,50/giây. 192/199 khoảng cách đúng 9 khung."
    ],
    [
     3,
     "Điện từ",
     60,
     16,
     0.266667,
     3.75,
     "Cùng súng như clip 2. 185/198 khoảng cách đúng 16 khung, 13 lần 17 khung; trung bình cả clip 3,73 viên/giây."
    ]
   ]
  },
  "dame": {
   "title": "B. Số đo dame (điện từ, có pet; clip bắn boss, riêng với 3 clip đo tốc bắn ở trên)",
   "header": [
    "Chỉ tiêu",
    "Đo được",
    "Dự đoán theo công thức",
    "Chênh lệch"
   ],
   "rows": [
    [
     "Dame thấp nhất",
     545,
     545.6,
     -0.6
    ],
    [
     "Dame trung bình",
     604,
     606.1,
     -2.1
    ]
   ],
   "note": "Súng điện từ lúc đó có pet (+50%), Tấn công 50% và Tấn công 20% (B): hệ số 2,2. Chỉ có điện từ được đo dame, cánh đỏ chưa có clip."
  },
  "cases": {
   "title": "C. So sánh 4 giả thuyết tốc độ với số đo",
   "header": [
    "Trường hợp",
    "Súng",
    "FPS",
    "Tốc độ gốc",
    "Dòng cộng thẳng (viên/giây)",
    "% Tốc độ dòng 1",
    "% Tốc độ dòng 2",
    "Số khung đo"
   ],
   "rows": [
    [
     "Clip 1",
     "Cánh đỏ",
     30,
     1,
     0.5,
     0.5,
     0.2,
     13
    ],
    [
     "Clip 2",
     "Điện từ",
     30,
     1.5,
     0.5,
     0.5,
     0.5,
     9
    ],
    [
     "Clip 3",
     "Điện từ",
     60,
     1.5,
     0.5,
     0.5,
     0.5,
     16
    ]
   ]
  },
  "theoSpeed": {
   "title": "Tốc lý thuyết (viên/giây) theo từng giả thuyết",
   "header": [
    "Trường hợp",
    "A: gốc×(1+Σ%)+cộng thẳng",
    "B: (gốc+cộng thẳng)×(1+Σ%)",
    "C: gốc×Π(1+%)+cộng thẳng",
    "D: (gốc+cộng thẳng)×Π(1+%)"
   ],
   "rows": [
    [
     "Clip 1 · Cánh đỏ · 30 FPS",
     2.2,
     2.55,
     2.3,
     2.7
    ],
    [
     "Clip 2 · Điện từ · 30 FPS",
     3.5,
     4,
     3.875,
     4.5
    ],
    [
     "Clip 3 · Điện từ · 60 FPS",
     3.5,
     4,
     3.875,
     4.5
    ]
   ]
  },
  "theoFrames": {
   "title": "Số khung lý thuyết = FPS ÷ tốc lý thuyết",
   "header": [
    "Trường hợp",
    "A",
    "B",
    "C",
    "D",
    "Số khung đo"
   ],
   "rows": [
    [
     "Clip 1 · Cánh đỏ · 30 FPS",
     13.636364,
     11.764706,
     13.043478,
     11.111111,
     13
    ],
    [
     "Clip 2 · Điện từ · 30 FPS",
     8.571429,
     7.5,
     7.741935,
     6.666667,
     9
    ],
    [
     "Clip 3 · Điện từ · 60 FPS",
     17.142857,
     15,
     15.483871,
     13.333333,
     16
    ]
   ]
  },
  "deviation": {
   "title": "Số khung đo trừ số khung lý thuyết (giả thuyết đúng phải cho độ lệch ổn định, cùng dấu)",
   "header": [
    "Trường hợp",
    "A",
    "B",
    "C",
    "D"
   ],
   "rows": [
    [
     "Clip 1 · Cánh đỏ · 30 FPS",
     -0.636364,
     1.235294,
     -0.043478,
     1.888889
    ],
    [
     "Clip 2 · Điện từ · 30 FPS",
     0.428571,
     1.5,
     1.258065,
     2.333333
    ],
    [
     "Clip 3 · Điện từ · 60 FPS",
     -1.142857,
     1,
     0.516129,
     2.666667
    ]
   ]
  },
  "rule": {
   "title": "Kiểm tra quy tắc: số khung giữa 2 viên = làm tròn lên(FPS ÷ tốc B) + 1",
   "header": [
    "Trường hợp",
    "Số khung dự đoán",
    "Số khung đo",
    "Kết quả"
   ],
   "rows": [
    [
     "Clip 1 · Cánh đỏ · 30 FPS",
     13,
     13,
     "Khớp"
    ],
    [
     "Clip 2 · Điện từ · 30 FPS",
     9,
     9,
     "Khớp"
    ],
    [
     "Clip 3 · Điện từ · 60 FPS",
     16,
     16,
     "Khớp"
    ]
   ]
  },
  "verdicts": [
   {
    "name": "Giả thuyết A",
    "text": "Loại: số đo nhanh hơn mức tối đa công thức cho phép (cánh đỏ 2,31 > 2,20; điện từ 3,73 > 3,50). Làm tròn theo khung hình chỉ làm chậm đi, không làm nhanh lên."
   },
   {
    "name": "Giả thuyết B",
    "text": "Chọn: khớp cả 3 số đo với cùng một độ trễ khoảng 1 khung (xem bảng kiểm tra quy tắc). Dòng cộng thẳng cũng bị nhân với tổng % Tốc độ."
   },
   {
    "name": "Giả thuyết C",
    "text": "Loại: độ lệch ngược dấu giữa các súng (cánh đỏ trùng ngẫu nhiên, điện từ lệch +1,26 khung)."
   },
   {
    "name": "Giả thuyết D",
    "text": "Loại: không có cùng một quy tắc làm tròn khớp cả 3 số đo. Có nghĩa các % Tốc độ nhiều khả năng cộng dồn, không nhân nhau."
   }
  ],
  "footnote": "Chữ xanh là số liệu bạn cung cấp hoặc đo từ clip (nhập tay). Chữ đen là công thức."
 }
};
