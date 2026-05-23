import { VisitQuota } from '../types/visitQuota';

export const mockVisitQuotas: VisitQuota[] = [
  {
    quotaID: 'Q001',
    period: 'Monthly',
    target: 5000,
    actual: 5200,
    progress: 100,
    status: 'Met',
    lastUpdated: '01/04/2026'
  },
  {
    quotaID: 'Q002',
    period: 'Weekly',
    target: 1200,
    actual: 980,
    progress: 82,
    status: 'Unmet',
    lastUpdated: '01/03/2026'
  },
  {
    quotaID: 'Q003',
    period: 'Daily',
    target: 150,
    actual: 165,
    progress: 100,
    status: 'Met',
    lastUpdated: '01/05/2026'
  },
  {
    quotaID: 'Q004',
    period: 'Quarterly',
    target: 15000,
    actual: 12300,
    progress: 82,
    status: 'Unmet',
    lastUpdated: '01/01/2026'
  },
  {
    quotaID: 'Q005',
    period: 'Monthly',
    target: 4500,
    actual: 4700,
    progress: 100,
    status: 'Met',
    lastUpdated: '12/30/2025'
  },
  {
    quotaID: 'Q006',
    period: 'Weekly',
    target: 1000,
    actual: 650,
    progress: 65,
    status: 'Unmet',
    lastUpdated: '12/28/2025'
  },
  {
    quotaID: 'Q007',
    period: 'Yearly',
    target: 50000,
    actual: 38500,
    progress: 77,
    status: 'Unmet',
    lastUpdated: '01/05/2026'
  },
  {
    quotaID: 'Q008',
    period: 'Daily',
    target: 200,
    actual: 215,
    progress: 100,
    status: 'Met',
    lastUpdated: '01/04/2026'
  },
  {
    quotaID: 'Q009',
    period: 'Monthly',
    target: 6000,
    actual: 4200,
    progress: 70,
    status: 'Unmet',
    lastUpdated: '01/02/2026'
  },
  {
    quotaID: 'Q010',
    period: 'Weekly',
    target: 800,
    actual: 920,
    progress: 100,
    status: 'Met',
    lastUpdated: '01/03/2026'
  }
];
