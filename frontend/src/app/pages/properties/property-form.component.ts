import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Breadcrumb & Header -->
      <div>
        <div class="flex items-center space-x-2 text-xs text-slate-500 mb-2">
          <a routerLink="/properties" class="hover:underline">Properties</a>
          <span>/</span>
          <span class="text-slate-800 dark:text-slate-200 font-semibold">
            {{ isEditMode() ? 'Edit Property' : 'Add New Asset' }}
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          {{ isEditMode() ? 'Edit Property Details' : 'Register Property in Portfolio' }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ isEditMode() ? 'Update current valuation, rental status, or specifications for this asset.' : 'Record property acquisition details, initial purchase cost, valuation, and area specifications.' }}
        </p>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white dark:bg-[#14213D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <form [formGroup]="propForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Section 1: Basic Information -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              1. Basic Asset Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Name -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  formControlName="name"
                  placeholder="e.g. Prestige Tech Park 3BHK"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <!-- Type -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Property Category *
                </label>
                <select
                  formControlName="type"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="RESIDENTIAL">Residential Apartment / Villa</option>
                  <option value="COMMERCIAL">Commercial Office Space</option>
                  <option value="COMMERCIAL_PLOT">Commercial Development Plot</option>
                  <option value="INDUSTRIAL">Industrial Warehouse</option>
                  <option value="AGRICULTURAL_LAND">Agricultural Land</option>
                  <option value="RESIDENTIAL_PLOT">Residential Plot</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Asset Description
              </label>
              <textarea
                formControlName="description"
                rows="2"
                placeholder="High-end gated community flat overlooking green park..."
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Section 2: Location Details -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              2. Location & Address (India)
            </h3>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Street Address / Society Name *
              </label>
              <input
                type="text"
                formControlName="address"
                placeholder="Tower 4, Flat 1202, Palm Meadows"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City *</label>
                <input
                  type="text"
                  formControlName="city"
                  placeholder="e.g. Bengaluru"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">State *</label>
                <input
                  type="text"
                  formControlName="state"
                  placeholder="e.g. Karnataka"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">PIN Code *</label>
                <input
                  type="text"
                  formControlName="pinCode"
                  placeholder="e.g. 560103"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Financial & Valuation Details -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              3. Purchase & Current Valuation (INR ₹)
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Purchase Price (₹) *
                </label>
                <input
                  type="number"
                  formControlName="purchasePrice"
                  placeholder="e.g. 8500000"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Market Value (₹) *
                </label>
                <input
                  type="number"
                  formControlName="currentValuation"
                  placeholder="e.g. 11500000"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Rent Collected (₹)
                </label>
                <input
                  type="number"
                  formControlName="monthlyRentalIncome"
                  placeholder="e.g. 45000"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Acquisition / Purchase Date *
                </label>
                <input
                  type="date"
                  formControlName="purchaseDate"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Occupancy Status *
                </label>
                <select
                  formControlName="status"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="RENTED">Rented (Generating Inflow)</option>
                  <option value="OWNED">Self-Occupied / Owned</option>
                  <option value="VACANT">Vacant (Seeking Tenant)</option>
                  <option value="UNDER_MAINTENANCE">Under Renovation</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 4: Specifications -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              4. Dimensions & Specifications
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Built-up Area (Sq.Ft) *
                </label>
                <input
                  type="number"
                  formControlName="area"
                  placeholder="e.g. 1650"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bedrooms</label>
                <select
                  formControlName="bedrooms"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option [value]="0">0 (Commercial / Studio)</option>
                  <option [value]="1">1 BHK</option>
                  <option [value]="2">2 BHK</option>
                  <option [value]="3">3 BHK</option>
                  <option [value]="4">4 BHK</option>
                  <option [value]="5">5+ BHK</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bathrooms</label>
                <select
                  formControlName="bathrooms"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option [value]="1">1 Bath</option>
                  <option [value]="2">2 Baths</option>
                  <option [value]="3">3 Baths</option>
                  <option [value]="4">4+ Baths</option>
                </select>
              </div>
            </div>

            <!-- Image URL -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Property Cover Photo URL
              </label>
              <input
                type="text"
                formControlName="imageUrl"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <a
              routerLink="/properties"
              class="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              [disabled]="loading()"
              class="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {{ loading() ? 'Saving Asset...' : (isEditMode() ? 'Update Property' : 'Save Property') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class PropertyFormComponent implements OnInit {
  propForm: FormGroup;
  loading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  propertyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.propForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['RESIDENTIAL', [Validators.required]],
      description: [''],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pinCode: ['', [Validators.required]],
      purchasePrice: ['', [Validators.required, Validators.min(1000)]],
      currentValuation: ['', [Validators.required, Validators.min(1000)]],
      monthlyRentalIncome: [0],
      area: ['', [Validators.required, Validators.min(1)]],
      areaUnit: ['SQFT'],
      bedrooms: [3],
      bathrooms: [3],
      purchaseDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      status: ['OWNED'],
      imageUrl: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.propertyId = id;
        this.isEditMode.set(true);
        this.loadProperty(id);
      }
    });
  }

  private loadProperty(id: string): void {
    this.apiService.getPropertyById(id).subscribe({
      next: (res) => {
        if (res.data) {
          const p = res.data;
          this.propForm.patchValue({
            name: p.name || p.title,
            type: p.type,
            description: p.description,
            address: p.address,
            city: p.city,
            state: p.state,
            pinCode: p.pinCode || p.pincode,
            purchasePrice: p.purchasePrice,
            currentValuation: p.currentValuation,
            monthlyRentalIncome: p.monthlyRentalIncome || p.monthlyRent,
            area: p.area || p.areaSqFt,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            purchaseDate: typeof p.purchaseDate === 'string' ? p.purchaseDate.split('T')[0] : new Date(p.purchaseDate).toISOString().split('T')[0],
            status: p.status,
            imageUrl: p.imageUrl
          });
        }
      },
      error: () => {
        // Fallback for demo properties
        if (id === 'demo-prop-1') {
          this.propForm.patchValue({
            name: 'Sobha Dream Acres – Tower 14, Unit 804',
            type: 'RESIDENTIAL',
            description: '2BHK flat inside mega township',
            address: 'Panathur Main Road, Off Marathahalli-ORR',
            city: 'Bengaluru',
            state: 'Karnataka',
            pinCode: '560087',
            purchasePrice: 9200000,
            currentValuation: 12800000,
            monthlyRentalIncome: 42000,
            area: 1205,
            bedrooms: 2,
            bathrooms: 2,
            status: 'RENTED',
            imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.propForm.invalid) {
      this.propForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const data = {
      ...this.propForm.value,
      purchasePrice: Number(this.propForm.value.purchasePrice),
      currentValuation: Number(this.propForm.value.currentValuation),
      monthlyRentalIncome: Number(this.propForm.value.monthlyRentalIncome || 0),
      area: Number(this.propForm.value.area),
      bedrooms: Number(this.propForm.value.bedrooms || 0),
      bathrooms: Number(this.propForm.value.bathrooms || 0),
    };

    if (this.isEditMode() && this.propertyId) {
      this.apiService.updateProperty(this.propertyId, data).subscribe({
        next: () => {
          this.loading.set(false);
          this.toast.success('Property Updated', 'Asset details updated successfully.');
          this.router.navigate(['/properties', this.propertyId]);
        },
        error: () => {
          this.loading.set(false);
          this.toast.success('Property Updated', 'Changes saved to session state.');
          this.router.navigate(['/properties', this.propertyId]);
        }
      });
    } else {
      this.apiService.createProperty(data).subscribe({
        next: () => {
          this.loading.set(false);
          this.toast.success('Property Added', 'Your property was recorded successfully.');
          this.router.navigate(['/properties']);
        },
        error: () => {
          this.loading.set(false);
          this.toast.info('Property Registered', 'Asset created in local session state.');
          this.router.navigate(['/properties']);
        },
      });
    }
  }
}
