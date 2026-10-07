import sys
import json
import subprocess
import os

API_KEY = os.environ.get("FREEIMAGE_API_KEY", "")
UPLOAD_URL = "https://freeimage.host/api/1/upload"

def upload_image_to_cdn(image_path):
    if not API_KEY:
        print(json.dumps({"error": "Thiếu biến môi trường FREEIMAGE_API_KEY. Vui lòng cấu hình trước khi chạy script."}))
        return None

    if not os.path.exists(image_path):
        print(json.dumps({"error": f"File not found: {image_path}"}))
        return None

    cmd = [
        "curl.exe", "-s",
        "-F", f"source=@{image_path}",
        "-F", f"key={API_KEY}",
        "-F", "action=upload",
        UPLOAD_URL
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)
        if data.get("status_code") == 200:
            direct_url = data["image"]["url"]
            print(json.dumps({
                "success": True,
                "url": direct_url,
                "name": data["image"]["name"],
                "width": data["image"]["width"],
                "height": data["image"]["height"]
            }))
            return direct_url
        else:
            print(json.dumps({"error": data.get("status_txt", "Upload failed")}))
            return None
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        upload_image_to_cdn(sys.argv[1])
    else:
        print("Usage: python upload_image.py <image_path>")
