import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Property,
  MarketplaceListing,
  WatchlistItem,
  RentalAgreement,
  RentalPayment,
  FinancialRecord,
  Loan,
  Transaction,
  PropertyDocument,
  Notification,
  DashboardOverview,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private base = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // 1. Properties
  getProperties(params?: any): Observable<{ success: boolean; data: Property[] }> {
    return this.http.get<{ success: boolean; data: Property[] }>(`${this.base}/properties`, { params });
  }

  getPropertyById(id: string): Observable<{ success: boolean; data: Property }> {
    return this.http.get<{ success: boolean; data: Property }>(`${this.base}/properties/${id}`);
  }

  createProperty(propertyData: any): Observable<{ success: boolean; message: string; data: Property }> {
    return this.http.post<{ success: boolean; message: string; data: Property }>(`${this.base}/properties`, propertyData);
  }

  updateProperty(id: string, propertyData: any): Observable<{ success: boolean; message: string; data: Property }> {
    return this.http.put<{ success: boolean; message: string; data: Property }>(`${this.base}/properties/${id}`, propertyData);
  }

  deleteProperty(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.base}/properties/${id}`);
  }

  // 2. Marketplace
  getMarketplaceListings(params?: any): Observable<{ success: boolean; data: MarketplaceListing[] }> {
    return this.http.get<{ success: boolean; data: MarketplaceListing[] }>(`${this.base}/marketplace/listings`, { params });
  }

  getMarketplaceListingById(id: string): Observable<{ success: boolean; data: MarketplaceListing }> {
    return this.http.get<{ success: boolean; data: MarketplaceListing }>(`${this.base}/marketplace/listings/${id}`);
  }

  contactSeller(inquiryData: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.post<{ success: boolean; message: string; data: any }>(`${this.base}/marketplace/inquiry`, inquiryData);
  }

  // 3. Watchlist
  getWatchlist(): Observable<{ success: boolean; data: WatchlistItem[] }> {
    return this.http.get<{ success: boolean; data: WatchlistItem[] }>(`${this.base}/watchlist`);
  }

  addToWatchlist(listingId: string): Observable<{ success: boolean; message: string; data: WatchlistItem }> {
    return this.http.post<{ success: boolean; message: string; data: WatchlistItem }>(`${this.base}/watchlist`, { listingId });
  }

  removeFromWatchlist(listingId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.base}/watchlist/${listingId}`);
  }

  // 4. Comparison
  compareProperties(items: Array<{ id: string; source: 'PORTFOLIO' | 'MARKETPLACE' }>): Observable<{ success: boolean; data: any }> {
    return this.http.post<{ success: boolean; data: any }>(`${this.base}/comparison`, { items });
  }

  // 5. Analytics
  getDashboardOverview(): Observable<{ success: boolean; data: DashboardOverview }> {
    return this.http.get<{ success: boolean; data: DashboardOverview }>(`${this.base}/analytics/dashboard`);
  }

  getInvestmentAnalytics(period: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' = 'YEARLY'): Observable<{ success: boolean; data: any }> {
    return this.http.get<{ success: boolean; data: any }>(`${this.base}/analytics/investments`, { params: { period } });
  }

  // 6. Financial Management
  getFinancialRecords(params?: any): Observable<{ success: boolean; data: { records: FinancialRecord[]; summary: any } }> {
    return this.http.get<{ success: boolean; data: { records: FinancialRecord[]; summary: any } }>(`${this.base}/financials`, { params });
  }

  createFinancialRecord(data: any): Observable<{ success: boolean; message: string; data: FinancialRecord }> {
    return this.http.post<{ success: boolean; message: string; data: FinancialRecord }>(`${this.base}/financials`, data);
  }

  deleteFinancialRecord(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.base}/financials/${id}`);
  }

  // 7. Rental Management
  getRentalOverview(): Observable<{ success: boolean; data: any }> {
    return this.http.get<{ success: boolean; data: any }>(`${this.base}/rentals`);
  }

  createRentalAgreement(data: any): Observable<{ success: boolean; message: string; data: RentalAgreement }> {
    return this.http.post<{ success: boolean; message: string; data: RentalAgreement }>(`${this.base}/rentals/agreements`, data);
  }

  recordRentalPayment(data: any): Observable<{ success: boolean; message: string; data: RentalPayment }> {
    return this.http.post<{ success: boolean; message: string; data: RentalPayment }>(`${this.base}/rentals/payments`, data);
  }

  // 8. Loan & EMI
  getLoans(): Observable<{ success: boolean; data: { summary: any; loans: Loan[] } }> {
    return this.http.get<{ success: boolean; data: { summary: any; loans: Loan[] } }>(`${this.base}/loans`);
  }

  getLoanById(id: string): Observable<{ success: boolean; data: { loan: Loan; calculation: any } }> {
    return this.http.get<{ success: boolean; data: { loan: Loan; calculation: any } }>(`${this.base}/loans/${id}`);
  }

  calculateEmiPreview(data: { principal: number; interestRate: number; tenureMonths: number }): Observable<{ success: boolean; data: any }> {
    return this.http.post<{ success: boolean; data: any }>(`${this.base}/loans/calculate-preview`, data);
  }

  createLoan(data: any): Observable<{ success: boolean; message: string; data: Loan }> {
    return this.http.post<{ success: boolean; message: string; data: Loan }>(`${this.base}/loans`, data);
  }

  recordEmiPayment(data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.post<{ success: boolean; message: string; data: any }>(`${this.base}/loans/payments`, data);
  }

  // 9. Transactions
  getTransactions(params?: any): Observable<{ success: boolean; data: { transactions: Transaction[]; pagination: any } }> {
    return this.http.get<{ success: boolean; data: { transactions: Transaction[]; pagination: any } }>(`${this.base}/transactions`, { params });
  }

  getExportCsvUrl(): string {
    return `${this.base}/transactions/export/csv`;
  }

  // 10. Documents
  getDocuments(params?: any): Observable<{ success: boolean; data: PropertyDocument[] }> {
    return this.http.get<{ success: boolean; data: PropertyDocument[] }>(`${this.base}/documents`, { params });
  }

  uploadDocument(formData: FormData): Observable<{ success: boolean; message: string; data: PropertyDocument }> {
    return this.http.post<{ success: boolean; message: string; data: PropertyDocument }>(`${this.base}/documents/upload`, formData);
  }

  deleteDocument(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.base}/documents/${id}`);
  }

  // 11. Reports (URL endpoints for PDF/CSV downloads)
  getReportDownloadUrl(reportType: 'portfolio' | 'rentals' | 'expenses' | 'loans', format: 'pdf' | 'csv'): string {
    return `${this.base}/reports/${reportType}?format=${format}`;
  }

  downloadReportBlob(reportType: 'portfolio' | 'rentals' | 'expenses' | 'loans', format: 'pdf' | 'csv'): Observable<Blob> {
    return this.http.get(`${this.base}/reports/${reportType}?format=${format}`, {
      responseType: 'blob',
    });
  }

  downloadDocumentBlob(docId: string): Observable<Blob> {
    return this.http.get(`${this.base}/documents/${docId}/download`, {
      responseType: 'blob',
    });
  }

  // 12. Notifications
  getNotifications(): Observable<{ success: boolean; data: { notifications: Notification[]; unreadCount: number } }> {
    return this.http.get<{ success: boolean; data: { notifications: Notification[]; unreadCount: number } }>(`${this.base}/notifications`);
  }

  markNotificationAsRead(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.base}/notifications/${id}/read`, {});
  }

  markAllNotificationsAsRead(): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.base}/notifications/read-all`, {});
  }

  // 13. Admin
  getAdminStats(): Observable<{ success: boolean; data: any }> {
    return this.http.get<{ success: boolean; data: any }>(`${this.base}/admin/stats`);
  }

  getAdminUsers(): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.base}/admin/users`);
  }

  createMarketplaceListing(data: any): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.post<{ success: boolean; message: string; data: any }>(`${this.base}/admin/listings`, data);
  }

  deleteMarketplaceListing(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.base}/admin/listings/${id}`);
  }
}
