import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrCurrency',
  standalone: true,
})
export class InrCurrencyPipe implements PipeTransform {
  transform(value: number | undefined | null, format: 'full' | 'compact' | 'lakhs' | 'crores' = 'full'): string {
    if (value === undefined || value === null || isNaN(value)) {
      return '₹ 0';
    }

    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (format === 'compact') {
      if (abs >= 10000000) {
        return `${sign}₹ ${(abs / 10000000).toFixed(2)} Cr`;
      }
      if (abs >= 100000) {
        return `${sign}₹ ${(abs / 100000).toFixed(2)} L`;
      }
      if (abs >= 1000) {
        return `${sign}₹ ${(abs / 1000).toFixed(1)} K`;
      }
      return `${sign}₹ ${abs.toFixed(0)}`;
    }

    if (format === 'crores') {
      return `${sign}₹ ${(abs / 10000000).toFixed(2)} Cr`;
    }

    if (format === 'lakhs') {
      return `${sign}₹ ${(abs / 100000).toFixed(2)} Lakhs`;
    }

    // Default full format with Indian comma grouping
    return `${sign}₹ ${abs.toLocaleString('en-IN')}`;
  }
}
