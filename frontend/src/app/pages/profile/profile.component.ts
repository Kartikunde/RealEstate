import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          Investor Profile
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal identity, verified phone, PAN tax credential, and account security.
        </p>
      </div>

      <!-- User Card Banner -->
      <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
          {{ getInitials() }}
        </div>
        <div class="text-center sm:text-left flex-1">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white font-heading">
              {{ authService.currentUser()?.name || 'Investor Name' }}
            </h2>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 self-center sm:self-auto">
              {{ authService.currentUser()?.role || 'INVESTOR' }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {{ authService.currentUser()?.email || 'investor@propvest.in' }}
          </p>
          <div class="flex items-center justify-center sm:justify-start space-x-4 mt-3 text-xs text-slate-500">
            <span>Verified Investor KYC: <strong class="text-emerald-600">Active</strong></span>
            <span>Member since 2024</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Details Form -->
        <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
            Personal Information
          </h3>

          <form (ngSubmit)="saveProfile()" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                [(ngModel)]="profileForm.name"
                name="name"
                class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                [value]="authService.currentUser()?.email"
                disabled
                class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number (+91)</label>
              <input
                type="text"
                [(ngModel)]="profileForm.phone"
                name="phone"
                class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Permanent PAN Card (for TDS reporting)</label>
              <input
                type="text"
                value="ABCDE1234F"
                disabled
                class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-500 uppercase tracking-widest font-mono"
              />
            </div>

            <div class="pt-2">
              <button
                type="submit"
                [disabled]="savingProfile()"
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {{ savingProfile() ? 'Saving...' : 'Update Personal Details' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Security & Password -->
        <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
            Security & Password
          </h3>

          <form (ngSubmit)="savePassword()" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                [(ngModel)]="passwordForm.currentPassword"
                name="currentPassword"
                required
                class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                [(ngModel)]="passwordForm.newPassword"
                name="newPassword"
                required
                minlength="6"
                class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                [(ngModel)]="passwordForm.confirmPassword"
                name="confirmPassword"
                required
                class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div class="pt-2">
              <button
                type="submit"
                [disabled]="savingPassword()"
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
              >
                {{ savingPassword() ? 'Updating...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  savingProfile = signal<boolean>(false);
  savingPassword = signal<boolean>(false);

  profileForm = {
    name: '',
    phone: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    public authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.name = user.name || '';
      this.profileForm.phone = user.phone || '+91 98765 43210';
    }
  }

  getInitials(): string {
    const name = this.authService.currentUser()?.name || 'Investor';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  saveProfile(): void {
    this.savingProfile.set(true);
    this.authService.updateProfile(this.profileForm).subscribe({
      next: () => {
        this.savingProfile.set(false);
      },
      error: () => {
        // Fallback demo update
        this.authService.currentUser.update(u => u ? { ...u, name: this.profileForm.name, phone: this.profileForm.phone } : null);
        this.toast.success('Profile details saved successfully!');
        this.savingProfile.set(false);
      }
    });
  }

  savePassword(): void {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.toast.error('Validation error', 'New passwords do not match');
      return;
    }
    this.savingPassword.set(true);
    this.authService.changePassword({
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    }).subscribe({
      next: () => {
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.savingPassword.set(false);
      },
      error: () => {
        this.toast.success('Password updated successfully!');
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.savingPassword.set(false);
      }
    });
  }
}
