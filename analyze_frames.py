import os
import json
import cv2
import pytesseract
import re
from datetime import datetime

def analyze_frame(frame_path):
    img = cv2.imread(frame_path)
    height, width = img.shape[:2]

    text = pytesseract.image_to_string(img, lang='chi_sim')

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

    order_patterns = [
        r'订单号[：:]\s*(\d+)',
        r'订单[：:]\s*(\d+)',
        r'[A-Z]+(\d{6,})'
    ]

    for pattern in order_patterns:
        order_match = re.search(pattern, text)
        if order_match:
            order_info['order_number'] = order_match.group(1)
            break

    date_patterns = [
        r'(\d{4})-(\d{1,2})-(\d{1,2})',
        r'(\d{1,2})[-.月](\d{1,2})'
    ]

    for pattern in date_patterns:
        date_match = re.search(pattern, text)
        if date_match:
            groups = date_match.groups()
            if len(groups) == 3:
                order_info['date'] = f"{groups[1]:0>2}-{groups[2]:0>2}"
            else:
                order_info['date'] = f"{int(groups[0]):02d}-{int(groups[1]):02d}"
            break

    amount_pattern = r'(在线付半?|到店付半?)?(\d+\.?\d*)'
    amount_matches = re.finditer(amount_pattern, text)
    max_amount = 0

    for match in amount_matches:
        try:
            amount = float(match.group(2))
            if amount > max_amount:
                max_amount = amount
                order_info['amount'] = str(amount)
        except ValueError:
            continue

    if '已取消' in text or '取消' in text:
        order_info['status'] = '已取消'
    elif '预订成功' in text or '已出票' in text:
        order_info['status'] = '正常'
    else:
        order_info['status'] = '正常'

    return order_info

def analyze_frames(frames_dir='frames'):
    results = []

    frame_files = sorted([f for f in os.listdir(frames_dir) if f.endswith('.jpg')])

    for frame_file in frame_files:
        frame_path = os.path.join(frames_dir, frame_file)
        frame_info = analyze_frame(frame_path)
        results.append(frame_info)
        print(f"\n=== 分析帧 {frame_file} ===")
        print(f"分辨率: {frame_info['resolution']}")
        print(f"订单信息: {json.dumps(frame_info, ensure_ascii=False, indent=2)}")

    os.makedirs('analysis', exist_ok=True)
    with open('analysis/frame_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    return results

if __name__ == '__main__':
    import sys
    frames_dir = sys.argv[1] if len(sys.argv) > 1 else 'frames'
    analyze_frames(frames_dir)
