import os
from PIL import Image
import json
import pytesseract
import re

def analyze_frame(frame_path):
    img = Image.open(frame_path)
    width, height = img.size

    # Extract text using OCR
    text = pytesseract.image_to_string(img, lang='chi_sim')

    # Initialize order info
    order_info = {
        "frame": os.path.basename(frame_path),
        "resolution": f"{width}x{height}",
        "timestamp": frame_path.split("_")[-1].split(".")[0],
        "text": text,
        "order_number": None,
        "date": None,
        "amount": None,
        "status": None
    }

    # Extract order information using regex patterns
    # Order number pattern (订单号后的数字和字母组合)
    order_number_match = re.search(r'订单号[：:]\s*([A-Z0-9-]+)|#(\d+)', text)
    if order_number_match:
        order_info["order_number"] = order_number_match.group(1) or order_number_match.group(2)

    # Date pattern (支持中文日期格式和标准日期格式)
    date_match = re.search(r'(\d{4}[-年]\d{1,2}[-月]\d{1,2}|\d{2}[-/]\d{2})', text)
    if date_match:
        date_str = date_match.group(1)
        # 转换中文日期格式为标准格式
        date_str = date_str.replace('年', '-').replace('月', '-')
        order_info["date"] = date_str

    # Amount pattern (支持"在线付半"和"到店付半"格式，处理OCR错误)
    amount_match = re.search(r'[在到]线付[半针](\d+\.?\d*)|实付款[半针](\d+\.?\d*)|付[半针](\d+\.?\d*)|[半针](\d+\.?\d*)', text)
    if amount_match:
        amount_str = amount_match.group(1) or amount_match.group(2) or amount_match.group(3) or amount_match.group(4)
        try:
            order_info["amount"] = float(amount_str)
        except (ValueError, TypeError):
            pass

    # Status detection (支持更多状态)
    if '已取消' in text or '取消' in text:
        order_info["status"] = "已取消"
    elif '已完成' in text or '成功' in text or '已出票' in text or '预订成功' in text:
        order_info["status"] = "正常"
    else:
        order_info["status"] = "正常"  # 默认为正常状态

    print(f"\n=== 分析帧 {os.path.basename(frame_path)} ===")
    print(f"分辨率: {width}x{height}")
    print(f"订单信息: {json.dumps(order_info, ensure_ascii=False, indent=2)}")

    return order_info

def main():
    frames = [
        "frames/frame_0001.jpg", "frames/frame_0030.jpg",
        "frames/frame_0060.jpg", "frames/frame_0090.jpg",
        "frames/frame_0120.jpg", "frames/frame_0150.jpg",
        "frames/frame_0180.jpg"
    ]

    results = []
    for frame in frames:
        if os.path.exists(frame):
            results.append(analyze_frame(frame))

    os.makedirs("analysis", exist_ok=True)
    with open("analysis/frame_analysis.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
