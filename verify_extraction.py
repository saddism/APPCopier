import os
import json
from frame_analysis import analyze_frame

def verify_extraction(frame_path):
    """验证单个帧的信息提取"""
    print(f"\n=== 验证帧 {os.path.basename(frame_path)} ===")

    frame_info = analyze_frame(frame_path)

    # 验证金额提取
    if frame_info['amount']:
        print(f"✓ 成功提取金额: {frame_info['amount']}")
    else:
        print("✗ 未找到金额")

    # 验证日期提取
    if frame_info['date']:
        print(f"✓ 成功提取日期: {frame_info['date']}")
    else:
        print("✗ 未找到日期")

    # 验证订单号提取
    if frame_info['order_number']:
        print(f"✓ 成功提取订单号: {frame_info['order_number']}")
    else:
        print("✗ 未找到订单号")

    # 验证状态提取
    if frame_info['status']:
        print(f"✓ 成功提取状态: {frame_info['status']}")
    else:
        print("✗ 未找到状态")

    return frame_info

def main():
    frames_dir = 'frames'
    results = []

    # 选择关键帧进行验证
    test_frames = [
        'frame_0030.jpg',  # 测试正常订单
        'frame_0060.jpg',  # 测试取消订单
        'frame_0090.jpg',  # 测试金额格式
        'frame_0120.jpg'   # 测试日期格式
    ]

    for frame in test_frames:
        frame_path = os.path.join(frames_dir, frame)
        if os.path.exists(frame_path):
            result = verify_extraction(frame_path)
            results.append(result)

    # 保存验证结果
    with open('analysis/verification_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
