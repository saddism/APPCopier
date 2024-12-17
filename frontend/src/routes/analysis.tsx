import React from 'react';
import { Route } from '@tanstack/react-router';
import { rootRoute } from './root';
import { useTranslation } from '@/lib/translations';
import { OrderAnalysis } from '@/components/OrderAnalysis';
import { Helmet } from 'react-helmet-async';

export const analysisRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/analysis',
  component: () => {
    const { t } = useTranslation();

    // Mock data for testing
    const mockAnalysisResult = {
      total_orders: 10,
      normal_orders: 8,
      cancelled_orders: 2,
      total_amount: 5678.90,
      average_amount: 709.86,
      orders: [
        {
          order_number: 'ORD001',
          date: '2024-03-18',
          amount: 1234.56,
          status: '正常'
        },
        {
          order_number: 'ORD002',
          date: '2024-03-18',
          amount: 789.10,
          status: '已取消'
        }
      ]
    };

    return (
      <>
        <Helmet>
          <title>{t('analysis.title')}</title>
        </Helmet>
        <h1 className="text-2xl font-bold mb-6">{t('analysis.title')}</h1>
        <OrderAnalysis analysisResult={mockAnalysisResult} />
      </>
    );
  }
});
