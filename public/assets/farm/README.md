# Texture Atlas Asset Dropzone

Đặt 2 file Texture Atlas vào thư mục này để game tự động nạp thay thế bộ procedural fallback:
- `atlas.png`: Tấm spritesheet chứa các frames (độ phân giải 32x32px cho từng tile / crop / tool / character).
- `atlas.json`: File mô tả tọa độ frames theo chuẩn Phaser 3 / TexturePacker JSON (Hash hoặc Array).

### Các Frame Keys Quy Ước:
- `tile_grass`: Ô cỏ xanh 32x32px
- `tile_soil_dry`: Ô đất đã cuốc (khô) 32x32px
- `tile_soil_wet`: Ô đất đã tưới (ướt) 32x32px
- `tile_marker`: Khung viền chỉ định ô đất 32x32px
- `farmer_sprite`: Sprite nhân vật nông dân 32x32px
- `crop_wheat_0`, `crop_wheat_1`, `crop_wheat_2`, `crop_wheat_3`: 4 giai đoạn sinh trưởng của Lúa Mì
- `crop_herb_0`, `crop_herb_1`, `crop_herb_2`, `crop_herb_3`: 4 giai đoạn sinh trưởng của Thảo Mộc

*Ghi chú: Nếu 2 file này chưa xuất hiện, BootScene sẽ tự động chuyển sang chế độ procedural graphics 32x32px để game luôn vận hành 100% không bao giờ gặp lỗi.*
