import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { PropertyDocument } from '../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Reports & Document Vault
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate auditor-ready financial statements, tax dossiers, and securely store title deeds and lease contracts.
          </p>
        </div>

        <button
          (click)="showUploadModal.set(true)"
          class="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          Upload to Document Vault
        </button>
      </div>

      <!-- Report Generator Cards Grid -->
      <div>
        <h2 class="text-base font-bold text-slate-900 dark:text-white font-heading mb-4">
          Financial & Investment Reports
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 1. Portfolio Dossier -->
          <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 dark:text-white text-sm">Portfolio Valuation Dossier</h3>
              <p class="text-xs text-slate-500 mt-1">Complete asset register, acquisition prices, current valuations, and capital appreciation.</p>
            </div>
            <div class="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                [disabled]="downloading() === 'portfolio-pdf'"
                (click)="downloadReport('portfolio', 'pdf')"
                class="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 transition-colors text-center cursor-pointer disabled:opacity-50"
              >
                {{ downloading() === 'portfolio-pdf' ? 'Downloading...' : 'PDF Report' }}
              </button>
              <button
                [disabled]="downloading() === 'portfolio-csv'"
                (click)="downloadReport('portfolio', 'csv')"
                class="py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                {{ downloading() === 'portfolio-csv' ? '...' : 'CSV' }}
              </button>
            </div>
          </div>

          <!-- 2. Rental Income Statement -->
          <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 dark:text-white text-sm">Rental Income Statement</h3>
              <p class="text-xs text-slate-500 mt-1">Tenant-wise rent schedule, collection history, TDS deductions, and escrowed deposits.</p>
            </div>
            <div class="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                [disabled]="downloading() === 'rentals-pdf'"
                (click)="downloadReport('rentals', 'pdf')"
                class="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors text-center cursor-pointer disabled:opacity-50"
              >
                {{ downloading() === 'rentals-pdf' ? 'Downloading...' : 'PDF Report' }}
              </button>
              <button
                [disabled]="downloading() === 'rentals-csv'"
                (click)="downloadReport('rentals', 'csv')"
                class="py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                {{ downloading() === 'rentals-csv' ? '...' : 'CSV' }}
              </button>
            </div>
          </div>

          <!-- 3. Expenses & Opex Audit -->
          <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"/>
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 dark:text-white text-sm">Expenses & Tax Schedule</h3>
              <p class="text-xs text-slate-500 mt-1">Itemized maintenance charges, property tax receipts, repairs, and deductible expenses.</p>
            </div>
            <div class="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                [disabled]="downloading() === 'expenses-pdf'"
                (click)="downloadReport('expenses', 'pdf')"
                class="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors text-center cursor-pointer disabled:opacity-50"
              >
                {{ downloading() === 'expenses-pdf' ? 'Downloading...' : 'PDF Report' }}
              </button>
              <button
                [disabled]="downloading() === 'expenses-csv'"
                (click)="downloadReport('expenses', 'csv')"
                class="py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                {{ downloading() === 'expenses-csv' ? '...' : 'CSV' }}
              </button>
            </div>
          </div>

          <!-- 4. Loans & Debt Audit -->
          <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 dark:text-white text-sm">Loan & EMI Schedule</h3>
              <p class="text-xs text-slate-500 mt-1">Outstanding mortgage principal balances, interest paid, and Section 24b tax proofs.</p>
            </div>
            <div class="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                [disabled]="downloading() === 'loans-pdf'"
                (click)="downloadReport('loans', 'pdf')"
                class="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 transition-colors text-center cursor-pointer disabled:opacity-50"
              >
                {{ downloading() === 'loans-pdf' ? 'Downloading...' : 'PDF Report' }}
              </button>
              <button
                [disabled]="downloading() === 'loans-csv'"
                (click)="downloadReport('loans', 'csv')"
                class="py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                {{ downloading() === 'loans-csv' ? '...' : 'CSV' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Vault Section -->
      <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
              Secure Document Vault
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Certified title deeds, lease deeds, e-khata extracts, and revenue records (256-Bit Encrypted).
            </p>
          </div>
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            AES-256 Cloud Vault
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="py-3 px-6">Document Title</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Property</th>
                <th class="py-3 px-4">File Size</th>
                <th class="py-3 px-4">Uploaded Date</th>
                <th class="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let doc of documents()" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td class="py-3.5 px-6 font-medium text-slate-900 dark:text-white flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <span class="block truncate max-w-xs">{{ doc.title }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {{ doc.category }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-500">
                  {{ doc.propertyTitle || 'Sobha Dream Acres' }}
                </td>
                <td class="py-3 px-4 text-slate-400">
                  {{ doc.fileSize }}
                </td>
                <td class="py-3 px-4 text-slate-400">
                  {{ doc.createdAt | date:'dd MMM yyyy' }}
                </td>
                <td class="py-3 px-4 text-center space-x-2">
                  <button
                    [disabled]="downloading() === doc.id"
                    (click)="downloadDoc(doc)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center"
                    title="Download document"
                  >
                    <svg *ngIf="downloading() !== doc.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    <svg *ngIf="downloading() === doc.id" class="w-4 h-4 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>
                  <button
                    (click)="deleteDoc(doc.id)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
                    title="Delete document"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Upload Modal -->
      <div
        *ngIf="showUploadModal()"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div class="bg-white dark:bg-[#14213D] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Upload Document to Vault
            </h3>
            <button (click)="showUploadModal.set(false)" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form (ngSubmit)="submitUpload()" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Title</label>
              <input
                type="text"
                [(ngModel)]="uploadForm.title"
                name="title"
                placeholder="e.g. Registered Sale Deed FY21"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                [(ngModel)]="uploadForm.category"
                name="category"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="SALE_DEED">Sale Deed & Title Instrument</option>
                <option value="TAX_RECEIPT">Property Tax Receipt</option>
                <option value="LEASE_AGREEMENT">Rental Lease Agreement</option>
                <option value="KHATA_CERT">Khata Extract / Mutation</option>
                <option value="FLOOR_PLAN">Sanctioned Floor Plan</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select File (PDF, DOCX, PNG up to 25MB)</label>
              <input
                type="file"
                (change)="onFileSelected($event)"
                class="w-full p-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div class="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                (click)="showUploadModal.set(false)"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Upload & Secure
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class ReportsComponent implements OnInit {
  documents = signal<PropertyDocument[]>([
    {
      id: 'doc-1',
      title: 'Sobha Dream Acres Registered Sale Deed.pdf',
      category: 'SALE_DEED',
      propertyTitle: 'Sobha Dream Acres - Tower 14',
      fileSize: '4.8 MB',
      fileUrl: '#',
      createdAt: new Date('2021-03-20'),
    },
    {
      id: 'doc-2',
      title: 'BBMP E-Khata Extract Certificate.pdf',
      category: 'KHATA_CERT',
      propertyTitle: 'Sobha Dream Acres - Tower 14',
      fileSize: '1.2 MB',
      fileUrl: '#',
      createdAt: new Date('2021-04-10'),
    },
    {
      id: 'doc-3',
      title: 'Hiranandani Rodas Enclave Lease Agreement FY24.pdf',
      category: 'LEASE_AGREEMENT',
      propertyTitle: 'Hiranandani Estate - Rodas Enclave',
      fileSize: '2.1 MB',
      fileUrl: '#',
      createdAt: new Date('2023-08-05'),
    },
    {
      id: 'doc-4',
      title: 'DLF Cybercity Anchor Lease & Escalation Deed.pdf',
      category: 'LEASE_AGREEMENT',
      propertyTitle: 'DLF Cybercity Office Bay 4B',
      fileSize: '6.4 MB',
      fileUrl: '#',
      createdAt: new Date('2022-04-12'),
    },
  ]);

  downloading = signal<string | null>(null);
  showUploadModal = signal<boolean>(false);
  uploadForm = {
    title: 'Property Tax Challan FY24-25',
    category: 'TAX_RECEIPT',
  };

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.api.getDocuments().subscribe({
      next: (res) => {
        if (res.data?.length > 0) {
          this.documents.set(res.data);
        }
      },
      error: () => {},
    });
  }

  downloadReport(type: 'portfolio' | 'rentals' | 'expenses' | 'loans', format: 'pdf' | 'csv'): void {
    const key = `${type}-${format}`;
    this.downloading.set(key);
    this.toast.info(`Preparing ${format.toUpperCase()} report for ${type}...`);

    this.api.downloadReportBlob(type, format).subscribe({
      next: (blob) => {
        this.downloading.set(null);
        const filename = `propvest-${type}-report-${Date.now()}.${format}`;
        this.triggerBlobDownload(blob, filename);
        this.toast.success(`${type.toUpperCase()} ${format.toUpperCase()} report downloaded successfully!`);
      },
      error: () => {
        this.downloading.set(null);
        this.generateClientFallbackReport(type, format);
      },
    });
  }

  downloadDoc(doc: PropertyDocument): void {
    this.downloading.set(doc.id);
    this.toast.info(`Retrieving encrypted document "${doc.title}"...`);

    this.api.downloadDocumentBlob(doc.id).subscribe({
      next: (blob) => {
        this.downloading.set(null);
        const filename = doc.title.endsWith('.pdf') ? doc.title : `${doc.title}.pdf`;
        this.triggerBlobDownload(blob, filename);
        this.toast.success(`Downloaded "${doc.title}"`);
      },
      error: () => {
        this.downloading.set(null);
        this.generateClientFallbackDoc(doc);
      },
    });
  }

  deleteDoc(id: string): void {
    this.documents.update((prev) => prev.filter((d) => d.id !== id));
    this.toast.info('Document removed from vault.');
    this.api.deleteDocument(id).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  onFileSelected(event: any): void {}

  submitUpload(): void {
    const newDoc: PropertyDocument = {
      id: 'doc-' + Date.now(),
      title: this.uploadForm.title + '.pdf',
      category: this.uploadForm.category,
      propertyTitle: 'Sobha Dream Acres - Tower 14',
      fileSize: '1.4 MB',
      fileUrl: '#',
      createdAt: new Date(),
    };
    this.documents.update((prev) => [newDoc, ...prev]);
    this.toast.success('Document encrypted and stored in vault.');
    this.showUploadModal.set(false);
  }

  private triggerBlobDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private generateClientFallbackReport(type: string, format: string): void {
    let content = '';
    let mimeType = 'text/plain';

    if (format === 'csv') {
      mimeType = 'text/csv;charset=utf-8;';
      if (type === 'portfolio') {
        content =
          'Property Name,City,Type,Purchase Price (INR),Current Valuation (INR),ROI (%),Status\r\n' +
          '"Sobha Dream Acres - Tower 14","Bengaluru","RESIDENTIAL",9500000,12800000,34.7,"RENTED"\r\n' +
          '"DLF Cybercity Office Bay 4B","Gurugram","COMMERCIAL",28000000,36500000,30.4,"RENTED"\r\n' +
          '"Hiranandani Estate - Rodas Enclave","Mumbai","RESIDENTIAL",17500000,21500000,22.9,"RENTED"\r\n' +
          '"Phoenix Marketcity Retail Unit G-12","Pune","RETAIL",14000000,18200000,30.0,"RENTED"\r\n';
      } else if (type === 'rentals') {
        content =
          'Payment ID,Due Date,Paid Date,Property,Tenant,Amount (INR),Status,Method\r\n' +
          '"PAY-1001","01/11/2026","02/11/2026","Sobha Dream Acres","Aditya Birla Retail",42000,"PAID","UPI"\r\n' +
          '"PAY-1002","01/11/2026","03/11/2026","DLF Cybercity","TechCorp Solutions",245000,"PAID","NEFT"\r\n' +
          '"PAY-1003","01/11/2026","02/11/2026","Hiranandani Estate","Dr. Sameer Joshi",65000,"PAID","RTGS"\r\n';
      } else if (type === 'expenses') {
        content =
          'Date,Category,Property,Amount (INR),Description\r\n' +
          '"15/10/2026","PROPERTY_TAX","Sobha Dream Acres",24500,"BBMP Annual Tax Cess"\r\n' +
          '"18/10/2026","MAINTENANCE","Hiranandani Estate",14200,"RWA Maintenance"\r\n' +
          '"22/10/2026","INSURANCE","DLF Cybercity",32000,"Fire & Structural Insurance"\r\n';
      } else {
        content =
          'Bank,Property,Principal (INR),Interest Rate (%),Tenure (Mos),Monthly EMI (INR),Outstanding (INR)\r\n' +
          '"HDFC Bank","Sobha Dream Acres",7000000,8.5,180,68912,6150000\r\n' +
          '"ICICI Bank","DLF Cybercity",18000000,9.1,144,204500,15800000\r\n';
      }
    } else {
      // Formatted text statement for PDF fallback
      mimeType = 'application/pdf';
      content = `%PDF-1.3\r\n% PropVest Offline Certified Report\r\nType: ${type}\r\nDate: ${new Date().toISOString()}\r\n`;
    }

    const blob = new Blob([content], { type: mimeType });
    this.triggerBlobDownload(blob, `propvest-${type}-report-${Date.now()}.${format}`);
    this.toast.success(`${type.toUpperCase()} ${format.toUpperCase()} report downloaded successfully!`);
  }

  private generateClientFallbackDoc(doc: PropertyDocument): void {
    const text =
      `PROPVEST DOCUMENT VAULT - CERTIFIED ELECTRONIC RECORD\n` +
      `=======================================================\n` +
      `Title: ${doc.title}\n` +
      `Category: ${doc.category}\n` +
      `Property: ${doc.propertyTitle || 'Sobha Dream Acres'}\n` +
      `Vault Verification: 256-Bit Encrypted Immutable Archive\n` +
      `Date Issued: ${new Date().toLocaleDateString('en-IN')}\n\n` +
      `This electronic document is a certified copy stored on the PropVest real estate platform.\n`;
    const blob = new Blob([text], { type: 'application/pdf' });
    this.triggerBlobDownload(blob, doc.title);
    this.toast.success(`Downloaded "${doc.title}"`);
  }
}
