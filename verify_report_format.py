import json
import os
from datetime import datetime

def verify_report_format(report_file):
    print("\n=== 分析报告格式验证 ===")

    try:
        with open(report_file, 'r', encoding='utf-8') as f:
            report = json.load(f)

        # 验证报告基本结构
        required_fields = ['total_orders', 'normal_orders', 'cancelled_orders',
                         'total_amount', 'average_amount', 'orders']

        print("\n1. 验证报告基本结构:")
        for field in required_fields:
            if field in report:
                print(f"✓ 包含字段: {field}")
            else:
                print(f"✗ 缺少字段: {field}")

        # 验证订单详情格式
        print("\n2. 验证订单详情格式:")
        if not report.get('orders'):
            print("✗ 未找到订单列表")
            return

        sample_order = report['orders'][0]
        order_fields = ['order_number', 'date', 'amount', 'status']

        for field in order_fields:
            if field in sample_order:
                print(f"✓ 订单包含字段: {field}")
            else:
                print(f"✗ 订单缺少字段: {field}")

        # 验证数据类型
        print("\n3. 验证数据类型:")
        print(f"总订单数: {report['total_orders']} ({type(report['total_orders']).__name__})")
        print(f"正常订单数: {report['normal_orders']} ({type(report['normal_orders']).__name__})")
        print(f"取消订单数: {report['cancelled_orders']} ({type(report['cancelled_orders']).__name__})")
        print(f"总金额: {report['total_amount']} ({type(report['total_amount']).__name__})")
        print(f"平均金额: {report['average_amount']} ({type(report['average_amount']).__name__})")

        # 验证订单状态
        print("\n4. 验证订单状态统计:")
        status_count = {'正常': 0, '已取消': 0}
        for order in report['orders']:
            status = order['status']
            status_count[status] = status_count.get(status, 0) + 1

        print(f"正常订单数量: {status_count['正常']}")
        print(f"已取消订单数量: {status_count['已取消']}")

        # 验证金额计算
        print("\n5. 验证金额计算:")
        total = sum(order['amount'] for order in report['orders']
                   if order['status'] == '正常' and order['amount'])
        print(f"计算得到的总金额: {total:.2f}")
        print(f"报告中的总金额: {report['total_amount']:.2f}")

        if abs(total - report['total_amount']) < 0.01:
            print("✓ 金额计算正确")
        else:
            print("✗ 金额计算有误")

    except FileNotFoundError:
        print(f"✗ 未找到报告文件: {report_file}")
    except json.JSONDecodeError:
        print(f"✗ 报告格式错误，非有效JSON")
    except Exception as e:
        print(f"✗ 验证过程出错: {str(e)}")

if __name__ == "__main__":
    report_file = "analysis/order_analysis.json"
    verify_report_format(report_file)
