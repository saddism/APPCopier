import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTranslation } from '@/lib/translations';

interface Order {
  date: string;
  amount: number;
  status: string;
  order_number?: string;
}

interface OrderAnalysisResult {
  total_orders: number;
  normal_orders: number;
  cancelled_orders: number;
  total_amount: number;
  average_amount: number;
  orders: Order[];
}

interface OrderAnalysisProps {
  analysisResult: OrderAnalysisResult;
}

export const OrderAnalysis: React.FC<OrderAnalysisProps> = ({ analysisResult }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('正常订单总金额')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">¥{analysisResult.total_amount.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('订单总数')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analysisResult.total_orders}</p>
            <p className="text-sm text-muted-foreground">
              {t('正常')}: {analysisResult.normal_orders} | {t('已取消')}: {analysisResult.cancelled_orders}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('平均订单金额')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">¥{analysisResult.average_amount.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('订单详细信息')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('订单编号')}</TableHead>
                <TableHead>{t('日期')}</TableHead>
                <TableHead>{t('金额')}</TableHead>
                <TableHead>{t('状态')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisResult.orders.map((order, index) => (
                <TableRow key={order.order_number || index}>
                  <TableCell>{order.order_number || '-'}</TableCell>
                  <TableCell>{order.date || '-'}</TableCell>
                  <TableCell>¥{order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === '正常'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {t(order.status)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
