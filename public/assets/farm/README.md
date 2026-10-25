# Hướng Dẫn Tích Hợp Texture Atlas Pixel Art (32x32px)

Thư mục này là **Asset Dropzone** cho bộ đồ họa thật của Web Game Nông Trại.
Khi bạn đặt 2 file `atlas.png` và `atlas.json` vào đây, game sẽ **tự động chuyển đổi từ bộ hình khối procedural sang pixel art xịn xò 100%** mà không cần sửa bất kỳ dòng code nào.

---

## 1. Hai File Cần Thiết trong `public/assets/farm/`
1. **`atlas.png`**: Tấm spritesheet tổng hợp (RGBA 32-bit PNG, khuyến nghị nền trong suốt `transparent`).
2. **`atlas.json`**: File chỉ mục tọa độ theo chuẩn **Phaser 3 / TexturePacker JSON (Hash)**.

---

## 2. Danh Sách Frame Keys Chuẩn (Standard Frame Names)

Mỗi ô/sprite có kích thước cơ bản **$32 \times 32\text{px}$** (nhân vật có thể là $32 \times 32\text{px}$ hoặc $32 \times 48\text{px}$ tùy ý):

### A. Địa Hình & Đất Nông Trại (Terrain & Soil):
- `tile_grass`: Ô cỏ xanh mặc định của nông trại ($32 \times 32\text{px}$).
- `tile_soil_dry`: Ô đất đã cuốc nhưng đang khô ráo ($32 \times 32\text{px}$).
- `tile_soil_wet`: Ô đất đã cuốc và đã được tưới nước ẩm ($32 \times 32\text{px}$).
- `tile_marker`: Viền highlight ô đất đang rê chuột ($32 \times 32\text{px}$, tùy chọn, có fallback viền trắng).

### B. Cây Trồng (Crops - 4 Giai Đoạn Mỗi Loại):
- **Lúa Mì (Wheat):**
  - `crop_wheat_0`: Mầm non vừa gieo xuống đất
  - `crop_wheat_1`: Cây non mọc lá xanh nhỏ
  - `crop_wheat_2`: Bụi lúa đang trổ bông xanh
  - `crop_wheat_3`: Bông lúa mì vàng rực rỡ (chín hoàn toàn, sẵn sàng gặt)
- **Thảo Mộc (Herb):**
  - `crop_herb_0`: Hạt mầm thảo mộc
  - `crop_herb_1`: Chồi non thảo mộc
  - `crop_herb_2`: Bụi lá thảo mộc xanh đậm
  - `crop_herb_3`: Bụi thảo mộc nở hoa tím/ngát hương (chín hoàn toàn)

### C. Nhân Vật Nông Dân 4 Hướng (Character 4 Directions):
- **Nhìn Xuống (Down / South):**
  - `player_idle_down`: Tư thế đứng yên nhìn xuống
  - `player_walk_down_0`: Bước chân 1
  - `player_walk_down_1`: Bước chân 2
- **Nhìn Lên (Up / North):**
  - `player_idle_up`: Tư thế đứng yên quay lưng
  - `player_walk_up_0`: Bước chân 1
  - `player_walk_up_1`: Bước chân 2
- **Nhìn Trái (Left / West):**
  - `player_idle_left`: Tư thế đứng yên nhìn sang trái
  - `player_walk_left_0`: Bước chân 1
  - `player_walk_left_1`: Bước chân 2
- **Nhìn Phải (Right / East):**
  - `player_idle_right`: Tư thế đứng yên nhìn sang phải
  - `player_walk_right_0`: Bước chân 1
  - `player_walk_right_1`: Bước chân 2
*(Lưu ý: Nếu nhân vật chỉ có 1 ảnh duy nhất, hãy đặt tên frame là `farmer_sprite` để game tự động gán).*

---

## 3. Cấu Trúc File Mẫu `atlas.json` (TexturePacker Hash Standard)

```json
{
  "frames": {
    "tile_grass": {
      "frame": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "tile_soil_dry": {
      "frame": { "x": 32, "y": 0, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "tile_soil_wet": {
      "frame": { "x": 64, "y": 0, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "crop_wheat_0": {
      "frame": { "x": 96, "y": 0, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "crop_wheat_1": {
      "frame": { "x": 128, "y": 0, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "crop_wheat_2": {
      "frame": { "x": 160, "y": 0, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "crop_wheat_3": {
      "frame": { "x": 192, "y": 0, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "crop_herb_0": {
      "frame": { "x": 224, "y": 0, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "crop_herb_1": {
      "frame": { "x": 0, "y": 32, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "crop_herb_2": {
      "frame": { "x": 32, "y": 32, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "crop_herb_3": {
      "frame": { "x": 64, "y": 32, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_idle_down": {
      "frame": { "x": 96, "y": 32, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_walk_down_0": {
      "frame": { "x": 128, "y": 32, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_walk_down_1": {
      "frame": { "x": 160, "y": 32, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_idle_up": {
      "frame": { "x": 192, "y": 32, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_walk_up_0": {
      "frame": { "x": 224, "y": 32, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_walk_up_1": {
      "frame": { "x": 0, "y": 64, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_idle_left": {
      "frame": { "x": 32, "y": 64, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_walk_left_0": {
      "frame": { "x": 64, "y": 64, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_walk_left_1": {
      "frame": { "x": 96, "y": 64, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_idle_right": {
      "frame": { "x": 128, "y": 64, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_walk_right_0": {
      "frame": { "x": 160, "y": 64, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    },
    "player_walk_right_1": {
      "frame": { "x": 192, "y": 64, "w": 32, "h": 32 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 }
    }
  },
  "meta": {
    "app": "Free Texture Packer",
    "version": "0.6.7",
    "image": "atlas.png",
    "format": "RGBA8888",
    "size": { "w": 256, "h": 256 },
    "scale": "1"
  }
}
```

---

## 4. Công Cụ Đóng Gói Atlas Đề Xuất (Miễn Phí & Tốt Nhất)
1. **Free Texture Packer (Web & Desktop):**
   - Truy cập: [https://free-tex-packer.com/app/](https://free-tex-packer.com/app/)
   - Format: Chọn **Phaser 3** (hoặc JSON Hash).
   - Kéo toàn bộ file PNG rời vào -> Nhấn **Export** -> Đổi tên thành `atlas.png` và `atlas.json` -> Thả vào thư mục `public/assets/farm/`.
2. **TexturePacker (CodeAndWeb):**
   - Framework: Chọn **Phaser 3**.
   - Data Format: **Phaser 3 (JSON Hash)**.
