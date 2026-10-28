import { Trip } from '../types/trip';
import { roundToTwoDecimals } from './calculator';

/**
 * Export trip history to RFC-4180 compliant CSV format and trigger browser download.
 */
export function exportTripsToCsv(trips: Trip[], filename: string = 'VoyageLedger_Trip_Expenses.csv'): void {
  if (trips.length === 0) return;

  const headers = [
    'Trip ID',
    'Destination',
    'Duration (Days)',
    'Travellers',
    'Travel Expense (INR)',
    'Accommodation Expense (INR)',
    'Food Expense (INR)',
    'Total Cost (INR)',
    'Cost Per Traveller (INR)',
    'Expense Per Day (INR)',
    'Created At',
  ];

  const escapeCsv = (val: string | number | undefined): string => {
    if (val === undefined || val === null) return '""';
    const stringVal = String(val);
    if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return `"${stringVal}"`;
  };

  const rows = trips.map((t) => {
    const dailyCost = t.days > 0 ? roundToTwoDecimals(t.totalCost / t.days) : 0;
    return [
      escapeCsv(t.id),
      escapeCsv(t.destination),
      escapeCsv(t.days),
      escapeCsv(t.travellers),
      escapeCsv(t.travelExpense),
      escapeCsv(t.accommodationExpense),
      escapeCsv(t.foodExpense),
      escapeCsv(t.totalCost),
      escapeCsv(t.costPerTraveller),
      escapeCsv(dailyCost),
      escapeCsv(t.createdAt),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
