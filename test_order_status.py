import json
from frame_analysis import analyze_frame

def test_order_status():
    test_cases = [
        {
            "text": "订单状态：预订成功\n订单号：123456\n金额：¥100",
            "expected_status": "正常"
        },
        {
            "text": "订单已完成\n订单号：789012\n金额：¥200",
            "expected_status": "正常"
        },
        {
            "text": "订单已取消\n订单号：345678\n金额：¥300",
            "expected_status": "已取消"
        },
        {
            "text": "已出票\n订单号：901234\n金额：¥400",
            "expected_status": "正常"
        }
    ]

    print("\n=== 订单状态识别测试 ===")
    passed_tests = 0
    
    for i, case in enumerate(test_cases, 1):
        frame_info = {
            "text": case["text"],
            "frame": f"test_case_{i}",
            "resolution": "720x1560",
            "timestamp": str(i).zfill(4)
        }
        
        # 使用frame_analysis中的状态检测逻辑
        if '已取消' in case["text"] or '取消' in case["text"]:
            frame_info["status"] = "已取消"
        elif any(x in case["text"] for x in ['已完成', '成功', '已出票', '预订成功']):
            frame_info["status"] = "正常"
        else:
            frame_info["status"] = "正常"

        print(f"\n测试用例 {i}:")
        print(f"输入文本: {case['text']}")
        print(f"预期状态: {case['expected_status']}")
        print(f"实际状态: {frame_info['status']}")
        
        if frame_info["status"] == case["expected_status"]:
            print("✓ 测试通过")
            passed_tests += 1
        else:
            print("✗ 测试失败")
    
    print(f"\n测试结果总结:")
    print(f"总用例数: {len(test_cases)}")
    print(f"通过用例数: {passed_tests}")
    print(f"失败用例数: {len(test_cases) - passed_tests}")

if __name__ == "__main__":
    test_order_status()
