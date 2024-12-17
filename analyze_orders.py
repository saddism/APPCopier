import os
import json
import pandas as pd
from frame_analysis import analyze_frame

def extract_amount(amount_str):
    if not amount_str:
        return None
    try:
        amount = ''.join(filter(lambda x: x.isdigit() or x == '.', str(amount_str)))
        return float(amount) if amount else None
    except (ValueError, TypeError):
        return None

def extract_flight_number(text):
    import re
    flight_pattern = r'([A-Z]{2}\d{2,4})'
    match = re.search(flight_pattern, text)
    return match.group(1) if match else None

def analyze_orders(frames_dir):
    frames = []
    for file in os.listdir(frames_dir):
        if file.endswith('.jpg'):
            frames.append(os.path.join(frames_dir, file))

    orders = []
    for frame in sorted(frames):
        frame_info = analyze_frame(frame)
        if frame_info.get('text'):
            amount = extract_amount(frame_info.get('amount'))
            if amount is not None:
                order_number = (frame_info.get('order_number') or
                              extract_flight_number(frame_info.get('text', '')))
                order = {
                    'frame': frame_info['frame'],
                    'date': frame_info.get('date'),
                    'amount': float(amount),
                    'status': frame_info.get('status', '正常'),
                    'order_number': order_number
                }
                orders.append(order)

    df = pd.DataFrame(orders)

    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    df['status'] = df['status'].fillna('正常')
    df['date'] = pd.to_datetime(df['date'], format='%m-%d', errors='coerce')
    df['date'] = df['date'].dt.strftime('%m-%d').fillna('')
    df['order_number'] = df['order_number'].fillna('未知')

    normal_orders = df[df['status'] == '正常'].copy()
    cancelled_orders = df[df['status'] == '已取消'].copy()

    total_amount = float(normal_orders['amount'].sum() if len(normal_orders) > 0 else 0)
    avg_amount = float(normal_orders['amount'].mean() if len(normal_orders) > 0 else 0)

    order_table = []
    for _, row in df.iterrows():
        if pd.notna(row['amount']):
            order_table.append({
                "订单编号": row['order_number'],
                "日期": row['date'],
                "金额": float(row['amount']),
                "状态": row['status']
            })

    report = {
        'total_orders': len(df),
        'normal_orders': len(normal_orders),
        'cancelled_orders': len(cancelled_orders),
        'total_amount': round(total_amount, 2),
        'average_amount': round(avg_amount, 2),
        'order_table': order_table,
        'orders': df.to_dict('records')
    }

    os.makedirs('analysis', exist_ok=True)
    with open('analysis/order_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    return report

if __name__ == '__main__':
    frames_dir = 'frames'
    if not os.path.exists(frames_dir):
        print(f"错误：找不到帧目录 '{frames_dir}'")
        exit(1)

    try:
        report = analyze_orders(frames_dir)
        print("\n=== 订单分析报告 ===")
        print(f"总订单数：{report['total_orders']}")
        print(f"正常订单数：{report['normal_orders']}")
        print(f"已取消订单数：{report['cancelled_orders']}")
        print(f"正常订单总金额：¥{report['total_amount']}")
        print(f"平均订单金额：¥{report['average_amount']}")
        print("\n详细分析结果已保存到 analysis/order_analysis.json")
    except Exception as e:
        print(f"分析过程中出现错误：{str(e)}")
        exit(1)
