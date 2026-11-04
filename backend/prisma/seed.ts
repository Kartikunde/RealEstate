import { PrismaClient, Role, PropertyType, PropertyStatus, AreaUnit, FinancialType, FinancialCategory, PaymentStatus, TransactionType, DocumentCategory, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PropVest database seed...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.propertyDocument.deleteMany();
  await prisma.loanEmiPayment.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.rentalPayment.deleteMany();
  await prisma.rentalAgreement.deleteMany();
  await prisma.financialRecord.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.marketplaceListing.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing database records.');

  // Password hashes
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const demoPasswordHash = await bcrypt.hash('Demo@123', 10);

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@propvest.in',
      passwordHash: adminPasswordHash,
      name: 'Rajesh Sharma',
      phone: '+91 98201 12345',
      role: Role.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  // 2. Create Demo Investor User
  const investor = await prisma.user.create({
    data: {
      email: 'demo@propvest.in',
      passwordHash: demoPasswordHash,
      name: 'Vikram Malhotra',
      phone: '+91 98112 54321',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  console.log(`Created users: Admin (${admin.email}) and Demo Investor (${investor.email})`);

  // 3. Create Investor's Properties
  const prop1 = await prisma.property.create({
    data: {
      userId: investor.id,
      name: 'Prestige Tech Park Residency 3BHK',
      type: PropertyType.RESIDENTIAL,
      description: 'Premium east-facing 3BHK luxury apartment in Whitefield IT corridor with modular kitchen and private balcony overlooking the club.',
      address: 'Tower 4, Apt 1102, Prestige Park View, ECC Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560066',
      latitude: 12.9698,
      longitude: 77.7499,
      purchasePrice: 14500000,
      currentValuation: 18500000,
      area: 1850,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 3,
      bathrooms: 3,
      purchaseDate: new Date('2022-03-15'),
      status: PropertyStatus.RENTED,
      monthlyRentalIncome: 58000,
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    },
  });

  const prop2 = await prisma.property.create({
    data: {
      userId: investor.id,
      name: 'One BKC Grade-A Corporate Suite',
      type: PropertyType.COMMERCIAL,
      description: 'Fully furnished commercial IT/Finance office space in Bandra Kurla Complex with 20 workstations, 2 executive cabins and meeting room.',
      address: 'Suite 802, Wing B, One BKC, G Block',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400051',
      latitude: 19.0664,
      longitude: 72.8687,
      purchasePrice: 42000000,
      currentValuation: 51000000,
      area: 1400,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 0,
      bathrooms: 2,
      purchaseDate: new Date('2021-08-10'),
      status: PropertyStatus.RENTED,
      monthlyRentalIncome: 220000,
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    },
  });

  const prop3 = await prisma.property.create({
    data: {
      userId: investor.id,
      name: 'DLF Magnolias Luxury Duplex',
      type: PropertyType.RESIDENTIAL,
      description: 'Ultra-luxurious golf facing 4BHK duplex penthouse with panoramic greenery, private elevator lobby, and 5-star club privileges.',
      address: 'Apartment 16A, Tower 2, DLF Magnolias, Golf Course Road',
      city: 'Gurugram',
      state: 'Haryana',
      pinCode: '122002',
      latitude: 28.4595,
      longitude: 77.0266,
      purchasePrice: 75000000,
      currentValuation: 98000000,
      area: 4200,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 4,
      bathrooms: 5,
      purchaseDate: new Date('2020-11-20'),
      status: PropertyStatus.OWNED,
      monthlyRentalIncome: 0,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    },
  });

  const prop4 = await prisma.property.create({
    data: {
      userId: investor.id,
      name: 'Blue Ridge Tech Residency 2BHK',
      type: PropertyType.RESIDENTIAL,
      description: 'Modern high-rise 2BHK apartment in Pune Hinjawadi SEZ township with river view, covered parking and high tenant demand from IT professionals.',
      address: 'Tower 12, Unit 804, Blue Ridge SEZ, Hinjawadi Phase 1',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411057',
      latitude: 18.5913,
      longitude: 73.7389,
      purchasePrice: 6800000,
      currentValuation: 8400000,
      area: 1050,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 2,
      bathrooms: 2,
      purchaseDate: new Date('2023-01-18'),
      status: PropertyStatus.RENTED,
      monthlyRentalIncome: 28000,
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    },
  });

  const prop5 = await prisma.property.create({
    data: {
      userId: investor.id,
      name: 'OMR Tech Corridor Commercial Plot',
      type: PropertyType.COMMERCIAL_PLOT,
      description: 'Corner commercial development land parcel fronting Old Mahabalipuram Road IT expressway. Zoned for IT/Commercial high-density build.',
      address: 'Survey No. 44/2, OMR IT Expressway, Sholinganallur',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pinCode: '600119',
      latitude: 12.9010,
      longitude: 80.2279,
      purchasePrice: 18000000,
      currentValuation: 23500000,
      area: 4800,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 0,
      bathrooms: 0,
      purchaseDate: new Date('2022-09-05'),
      status: PropertyStatus.VACANT,
      monthlyRentalIncome: 0,
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    },
  });

  console.log('Seeded 5 portfolio properties.');

  // 4. Create Rental Agreements & Payments
  // Bangalore agreement
  const agreement1 = await prisma.rentalAgreement.create({
    data: {
      propertyId: prop1.id,
      tenantName: 'Arjun Sengupta',
      tenantEmail: 'arjun.sengupta@infotech.com',
      tenantPhone: '+91 98450 11223',
      monthlyRent: 58000,
      securityDeposit: 174000,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2027-03-31'),
      paymentDueDate: 5,
      status: 'ACTIVE',
      notes: 'Tenant employed as VP at Tech Corp. 11-month escalation clause @ 5%.',
    },
  });

  // Mumbai BKC agreement
  const agreement2 = await prisma.rentalAgreement.create({
    data: {
      propertyId: prop2.id,
      tenantName: 'FinEdge Capital Advisory LLP',
      tenantEmail: 'ops@finedgecapital.com',
      tenantPhone: '+91 98200 44556',
      monthlyRent: 220000,
      securityDeposit: 660000,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2027-08-31'),
      paymentDueDate: 1,
      status: 'ACTIVE',
      notes: 'Commercial lease with corporate guarantee. TDS deduction @ 10% applied by tenant.',
    },
  });

  // Pune Hinjawadi agreement
  const agreement3 = await prisma.rentalAgreement.create({
    data: {
      propertyId: prop4.id,
      tenantName: 'Neha Kulkarni',
      tenantEmail: 'neha.kulkarni@tcs.com',
      tenantPhone: '+91 99220 77889',
      monthlyRent: 28000,
      securityDeposit: 84000,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2026-05-31'),
      paymentDueDate: 7,
      status: 'ACTIVE',
      notes: 'Lead engineer at IT MNC. Rent paid via direct bank transfer.',
    },
  });

  // Rental payment records
  const rentPayments = [
    { agreementId: agreement1.id, propertyId: prop1.id, amount: 58000, dueDate: new Date('2026-09-05'), paymentDate: new Date('2026-09-04'), status: PaymentStatus.PAID, paymentMethod: 'NEFT', notes: 'Sept 2026 rent received' },
    { agreementId: agreement1.id, propertyId: prop1.id, amount: 58000, dueDate: new Date('2026-10-05'), paymentDate: new Date('2026-10-05'), status: PaymentStatus.PAID, paymentMethod: 'UPI', notes: 'Oct 2026 rent received' },
    { agreementId: agreement1.id, propertyId: prop1.id, amount: 58000, dueDate: new Date('2026-11-05'), paymentDate: null, status: PaymentStatus.PENDING, paymentMethod: null, notes: 'Nov 2026 rent due in 2 days' },

    { agreementId: agreement2.id, propertyId: prop2.id, amount: 220000, dueDate: new Date('2026-09-01'), paymentDate: new Date('2026-08-31'), status: PaymentStatus.PAID, paymentMethod: 'RTGS', notes: 'Sept 2026 commercial rent' },
    { agreementId: agreement2.id, propertyId: prop2.id, amount: 220000, dueDate: new Date('2026-10-01'), paymentDate: new Date('2026-10-01'), status: PaymentStatus.PAID, paymentMethod: 'RTGS', notes: 'Oct 2026 commercial rent' },
    { agreementId: agreement2.id, propertyId: prop2.id, amount: 220000, dueDate: new Date('2026-11-01'), paymentDate: new Date('2026-11-01'), status: PaymentStatus.PAID, paymentMethod: 'RTGS', notes: 'Nov 2026 rent credited' },

    { agreementId: agreement3.id, propertyId: prop4.id, amount: 28000, dueDate: new Date('2026-10-07'), paymentDate: new Date('2026-10-06'), status: PaymentStatus.PAID, paymentMethod: 'UPI', notes: 'Oct 2026 rent' },
    { agreementId: agreement3.id, propertyId: prop4.id, amount: 28000, dueDate: new Date('2026-11-07'), paymentDate: null, status: PaymentStatus.PENDING, paymentMethod: null, notes: 'Nov 2026 rent pending' },
  ];

  for (const rp of rentPayments) {
    await prisma.rentalPayment.create({ data: rp });
  }

  // 5. Create Loans & EMIs
  const loan1 = await prisma.loan.create({
    data: {
      userId: investor.id,
      propertyId: prop1.id,
      bankName: 'HDFC Bank Ltd',
      principalAmount: 9000000,
      interestRate: 8.5,
      tenureMonths: 240,
      startDate: new Date('2022-04-01'),
      emiAmount: 78103,
      outstandingBalance: 8140000,
      notes: 'Home loan account #HDFC-HL-88231. Auto-debit on 10th of every month.',
    },
  });

  const loan2 = await prisma.loan.create({
    data: {
      userId: investor.id,
      propertyId: prop2.id,
      bankName: 'ICICI Bank Corporate Banking',
      principalAmount: 20000000,
      interestRate: 9.2,
      tenureMonths: 180,
      startDate: new Date('2021-09-01'),
      emiAmount: 205273,
      outstandingBalance: 16250000,
      notes: 'Commercial lease rental discounting loan #ICICI-LRD-9912.',
    },
  });

  // Recent EMI payments
  await prisma.loanEmiPayment.create({
    data: {
      loanId: loan1.id,
      paymentDate: new Date('2026-10-10'),
      amountPaid: 78103,
      principalPaid: 20436,
      interestPaid: 57667,
      remainingBalance: 8140000,
      status: 'PAID',
      notes: 'Oct 2026 auto-debit successful',
    },
  });

  await prisma.loanEmiPayment.create({
    data: {
      loanId: loan2.id,
      paymentDate: new Date('2026-10-05'),
      amountPaid: 205273,
      principalPaid: 80665,
      interestPaid: 124608,
      remainingBalance: 16250000,
      status: 'PAID',
      notes: 'Oct 2026 commercial EMI cleared',
    },
  });

  // 6. Create Financial Records (Income & Expenses)
  const financialRecords = [
    // Income
    { userId: investor.id, propertyId: prop1.id, type: FinancialType.INCOME, category: FinancialCategory.RENTAL_INCOME, amount: 58000, transactionDate: new Date('2026-10-05'), description: 'Rental Income for Oct 2026' },
    { userId: investor.id, propertyId: prop2.id, type: FinancialType.INCOME, category: FinancialCategory.RENTAL_INCOME, amount: 220000, transactionDate: new Date('2026-10-01'), description: 'Commercial lease rental BKC Suite 802' },
    { userId: investor.id, propertyId: prop4.id, type: FinancialType.INCOME, category: FinancialCategory.RENTAL_INCOME, amount: 28000, transactionDate: new Date('2026-10-06'), description: 'Oct rental Hinjawadi Apt' },
    { userId: investor.id, propertyId: prop1.id, type: FinancialType.INCOME, category: FinancialCategory.RENTAL_INCOME, amount: 58000, transactionDate: new Date('2026-09-04'), description: 'Rental Income for Sept 2026' },
    { userId: investor.id, propertyId: prop2.id, type: FinancialType.INCOME, category: FinancialCategory.RENTAL_INCOME, amount: 220000, transactionDate: new Date('2026-09-01'), description: 'Commercial lease rental BKC Sept' },
    // Expenses
    { userId: investor.id, propertyId: prop1.id, type: FinancialType.EXPENSE, category: FinancialCategory.SOCIETY_CHARGES, amount: 6500, transactionDate: new Date('2026-10-10'), description: 'Monthly Prestige Park View HOA Maintenance' },
    { userId: investor.id, propertyId: prop2.id, type: FinancialType.EXPENSE, category: FinancialCategory.MAINTENANCE, amount: 18000, transactionDate: new Date('2026-10-05'), description: 'Common area maintenance & HVAC One BKC' },
    { userId: investor.id, propertyId: prop3.id, type: FinancialType.EXPENSE, category: FinancialCategory.PROPERTY_TAX, amount: 42000, transactionDate: new Date('2026-09-20'), description: 'Municipal property tax MCG Gurugram' },
    { userId: investor.id, propertyId: prop4.id, type: FinancialType.EXPENSE, category: FinancialCategory.SOCIETY_CHARGES, amount: 3200, transactionDate: new Date('2026-10-15'), description: 'Blue Ridge society monthly maintenance' },
    { userId: investor.id, propertyId: prop1.id, type: FinancialType.EXPENSE, category: FinancialCategory.INSURANCE, amount: 14500, transactionDate: new Date('2026-08-12'), description: 'Annual HDFC Ergo property & fire insurance' },
    { userId: investor.id, propertyId: prop5.id, type: FinancialType.EXPENSE, category: FinancialCategory.PROPERTY_TAX, amount: 16000, transactionDate: new Date('2026-09-25'), description: 'Greater Chennai Corporation commercial vacant land tax' },
    { userId: investor.id, propertyId: prop1.id, type: FinancialType.EXPENSE, category: FinancialCategory.REPAIRS, amount: 8500, transactionDate: new Date('2026-09-18'), description: 'Balcony water sealant and plumbing fixture service' },
  ];

  for (const fr of financialRecords) {
    await prisma.financialRecord.create({ data: fr });
  }

  // 7. Create Transactions Ledger
  const transactions = [
    { userId: investor.id, propertyId: prop2.id, type: TransactionType.RENTAL_INCOME, amount: 220000, date: new Date('2026-11-01'), description: 'Nov Rent Credited - FinEdge Capital BKC', paymentMethod: 'RTGS', referenceNumber: 'RTGS-BKC-99120' },
    { userId: investor.id, propertyId: prop1.id, type: TransactionType.LOAN_PAYMENT, amount: 78103, date: new Date('2026-10-10'), description: 'HDFC Home Loan Auto-Debit', paymentMethod: 'Auto Debit NACH', referenceNumber: 'NACH-HDFC-8821' },
    { userId: investor.id, propertyId: prop2.id, type: TransactionType.LOAN_PAYMENT, amount: 205273, date: new Date('2026-10-05'), description: 'ICICI Commercial Loan EMI', paymentMethod: 'Auto Debit', referenceNumber: 'ICICI-LRD-5441' },
    { userId: investor.id, propertyId: prop1.id, type: TransactionType.RENTAL_INCOME, amount: 58000, date: new Date('2026-10-05'), description: 'Oct Rent Credited - Arjun Sengupta', paymentMethod: 'UPI', referenceNumber: 'UPI-RENT-1029' },
    { userId: investor.id, propertyId: prop4.id, type: TransactionType.RENTAL_INCOME, amount: 28000, date: new Date('2026-10-06'), description: 'Oct Rent Credited - Neha Kulkarni', paymentMethod: 'UPI', referenceNumber: 'UPI-RENT-4491' },
    { userId: investor.id, propertyId: prop3.id, type: TransactionType.PROPERTY_TAX, amount: 42000, date: new Date('2026-09-20'), description: 'MCG Property Tax Paid', paymentMethod: 'Net Banking', referenceNumber: 'TAX-MCG-2026-902' },
    { userId: investor.id, propertyId: prop2.id, type: TransactionType.RENTAL_INCOME, amount: 220000, date: new Date('2026-10-01'), description: 'Oct Commercial Rent Credited', paymentMethod: 'RTGS', referenceNumber: 'RTGS-BKC-7721' },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({ data: tx });
  }

  // 8. Create Property Documents
  await prisma.propertyDocument.createMany({
    data: [
      { propertyId: prop1.id, title: 'Registered Sale Deed', category: DocumentCategory.SALE_DEED, fileUrl: '/uploads/docs/prestige-sale-deed.pdf', fileSize: '4.2 MB' },
      { propertyId: prop1.id, title: 'BBMP Khata Certificate & Tax Paid', category: DocumentCategory.PROPERTY_TAX_RECEIPT, fileUrl: '/uploads/docs/bbmp-khata-2026.pdf', fileSize: '1.8 MB' },
      { propertyId: prop1.id, title: 'Tenant Lease Agreement (Arjun Sengupta)', category: DocumentCategory.RENTAL_AGREEMENT, fileUrl: '/uploads/docs/lease-prestige-1102.pdf', fileSize: '2.5 MB' },
      { propertyId: prop2.id, title: 'Commercial Title Deed & Conveyance', category: DocumentCategory.SALE_DEED, fileUrl: '/uploads/docs/one-bkc-title-deed.pdf', fileSize: '6.1 MB' },
      { propertyId: prop2.id, title: 'Corporate Tenancy Contract 2024-2027', category: DocumentCategory.RENTAL_AGREEMENT, fileUrl: '/uploads/docs/finedge-tenancy-bkc.pdf', fileSize: '3.4 MB' },
      { propertyId: prop3.id, title: 'DLF Magnolias Possession & Occupancy Certificate', category: DocumentCategory.SALE_DEED, fileUrl: '/uploads/docs/dlf-magnolias-oc.pdf', fileSize: '5.8 MB' },
    ],
  });

  // 9. Create Notifications
  await prisma.notification.createMany({
    data: [
      { userId: investor.id, title: 'Rental Payment Credited', message: '₹2,20,000 received for One BKC Grade-A Corporate Suite from FinEdge Capital via RTGS.', type: NotificationType.SUCCESS, isRead: false },
      { userId: investor.id, title: 'Upcoming Loan EMI', message: 'HDFC Home Loan EMI of ₹78,103 is scheduled for auto-debit on 10th November 2026.', type: NotificationType.WARNING, isRead: false },
      { userId: investor.id, title: 'Marketplace Opportunity Alert', message: 'A new high-yield commercial warehouse listing in Bhiwandi (8.4% expected yield) matches your criteria.', type: NotificationType.INFO, isRead: true },
      { userId: investor.id, title: 'Valuation Growth Update', message: 'Whitefield residential property values in your pin code 560066 appreciated by +7.2% YoY.', type: NotificationType.SUCCESS, isRead: true },
    ],
  });

  // 10. Seed Marketplace Listings (Indian Real Estate Opportunities)
  const listings = [
    {
      title: 'Godrej Woodsman 4BHK Sky Villa',
      type: PropertyType.RESIDENTIAL,
      description: 'Expansive 4BHK sky residence in Hebbal North Bangalore adjacent to Bellary Road highway. Features panoramic lake views, Italian marble flooring, and smart home automation.',
      address: 'Tower 7, Bellary Road, Hebbal',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560024',
      latitude: 13.0358,
      longitude: 77.5970,
      price: 24500000,
      area: 2850,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 4,
      bathrooms: 4,
      estimatedRentalIncome: 95000,
      estimatedRentalYield: 4.65,
      estimatedAnnualAppreciation: 8.5,
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      imageGallery: JSON.stringify([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800',
      ]),
      specifications: JSON.stringify({
        furnishing: 'Semi-Furnished',
        facing: 'North-East',
        carParking: '2 Covered Slots',
        reraId: 'PRM/KA/RERA/1251/309/PR/171015/000412',
        floor: '18th of 26 Floors',
        waterSupply: 'Cauvery & 24/7 Borewell',
      }),
      sellerName: 'Godrej Properties Ltd Partner Desk',
      sellerPhone: '+91 80 4910 5000',
      sellerEmail: 'invest@godrejwoodsmancity.com',
      isDemo: true,
    },
    {
      title: 'Lodha World One Commercial Floor',
      type: PropertyType.COMMERCIAL,
      description: 'Grade-A corporate floor plate in Lower Parel Mumbai prime business district. Pre-leased to multinational consulting firm with long-term lock-in and high rental yield.',
      address: 'Upper Worli, Senapati Bapat Marg, Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400013',
      latitude: 18.9986,
      longitude: 72.8258,
      price: 89000000,
      area: 3600,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 0,
      bathrooms: 4,
      estimatedRentalIncome: 620000,
      estimatedRentalYield: 8.36,
      estimatedAnnualAppreciation: 7.2,
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      imageGallery: JSON.stringify([
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      ]),
      specifications: JSON.stringify({
        tenantType: 'Fortune 500 Consulting',
        leaseTermRemaining: '6 Years with 15% Escalation',
        floor: '22nd Floor',
        certification: 'LEED Platinum Certified',
        carParking: '6 Reserved Slots',
      }),
      sellerName: 'Macrotech Commercial Advisory',
      sellerPhone: '+91 22 6773 9000',
      sellerEmail: 'commercial@lodhagroup.com',
      isDemo: true,
    },
    {
      title: 'Aparna CyberLife 3BHK Gated Community',
      type: PropertyType.RESIDENTIAL,
      description: 'Modern residential apartment in Nallagandla Financial District corridor Hyderabad. Prime rental magnet for Microsoft, Google, and Amazon IT workforce.',
      address: 'Nallagandla Flyover Road, Gachibowli Outer Ring',
      city: 'Hyderabad',
      state: 'Telangana',
      pinCode: '500019',
      latitude: 17.4722,
      longitude: 78.3182,
      price: 11500000,
      area: 1680,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 3,
      bathrooms: 3,
      estimatedRentalIncome: 46000,
      estimatedRentalYield: 4.80,
      estimatedAnnualAppreciation: 10.2,
      imageUrl: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800',
      imageGallery: JSON.stringify([
        'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ]),
      specifications: JSON.stringify({
        facing: 'East',
        amenities: '50,000 sqft Clubhouse, Swimming Pool, Tennis Court',
        reraId: 'P02400000129',
        carParking: '2 Basement Slots',
      }),
      sellerName: 'Aparna Realty Partners',
      sellerPhone: '+91 40 2335 2708',
      sellerEmail: 'investments@aparna.com',
      isDemo: true,
    },
    {
      title: 'LogiParks Grade-A Industrial Warehouse',
      type: PropertyType.INDUSTRIAL,
      description: 'High-cube pre-engineered warehouse facility in Chakan Pune auto-industrial belt. Dock levelers, FM2 heavy-load flooring, and pre-leased to tier-1 auto supplier.',
      address: 'Plot B-14, MIDC Industrial Area Phase 2, Chakan',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '410501',
      latitude: 18.7606,
      longitude: 73.8567,
      price: 48000000,
      area: 18500,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 0,
      bathrooms: 4,
      estimatedRentalIncome: 370000,
      estimatedRentalYield: 9.25,
      estimatedAnnualAppreciation: 6.8,
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
      imageGallery: JSON.stringify([
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
      ]),
      specifications: JSON.stringify({
        clearHeight: '11 Meters',
        flooring: 'FM2 Industrial Grade (6 Ton/sqm)',
        powerCapacity: '250 KVA Dedicated Transformer',
        leaseDuration: '9 Years Triple-Net Lease',
      }),
      sellerName: 'IndoSpace Logistics Advisory',
      sellerPhone: '+91 20 6601 2200',
      sellerEmail: 'chakan@logiparks.in',
      isDemo: true,
    },
    {
      title: 'M3M Golfestate Ultra-Luxury 4BHK',
      type: PropertyType.RESIDENTIAL,
      description: 'Resort-style luxury condominium facing executive 9-hole golf greens on Golf Course Extension Road, Sector 65 Gurugram.',
      address: 'Tower 9, Sector 65, Golf Course Extension Road',
      city: 'Gurugram',
      state: 'Haryana',
      pinCode: '122101',
      latitude: 28.4068,
      longitude: 77.0673,
      price: 49500000,
      area: 3750,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 4,
      bathrooms: 5,
      estimatedRentalIncome: 165000,
      estimatedRentalYield: 4.00,
      estimatedAnnualAppreciation: 9.1,
      imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      imageGallery: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      ]),
      specifications: JSON.stringify({
        furnishing: 'Fully Furnished Designer Interior',
        golfCourseFacing: 'Yes, 180-degree unobstructed',
        parking: '3 Reserved Slots',
      }),
      sellerName: 'M3M Premium Realty',
      sellerPhone: '+91 124 473 3000',
      sellerEmail: 'golfestate@m3mindia.com',
      isDemo: true,
    },
    {
      title: 'Assagao Heritage Portuguese Villa Plot',
      type: PropertyType.RESIDENTIAL_PLOT,
      description: 'Exclusive clear-titled settlement land parcel surrounded by tropical canopy in Assagao, North Goa. Sanctioned for boutique luxury pool villa development.',
      address: 'Badem Road, Near Gunpowder, Assagao',
      city: 'Goa',
      state: 'Goa',
      pinCode: '403507',
      latitude: 15.5901,
      longitude: 73.7745,
      price: 36000000,
      area: 6500,
      areaUnit: AreaUnit.SQFT,
      bedrooms: 0,
      bathrooms: 0,
      estimatedRentalIncome: 280000,
      estimatedRentalYield: 9.33,
      estimatedAnnualAppreciation: 12.5,
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      imageGallery: JSON.stringify([
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      ]),
      specifications: JSON.stringify({
        zoning: 'Settlement Zone (Sanctioned FAR 0.8)',
        frontage: '80 Feet Asphalt Road Frontage',
        idealUse: 'Luxury Vacation Villa / Airbnb High-Yield Rental',
      }),
      sellerName: 'Goa Coastal Lands & Estates',
      sellerPhone: '+91 832 245 8899',
      sellerEmail: 'properties@assagoa.com',
      isDemo: true,
    },
  ];

  for (const item of listings) {
    const created = await prisma.marketplaceListing.create({ data: item });
    // Add first 2 to demo user's watchlist
    if (item.city === 'Bengaluru' || item.city === 'Pune') {
      await prisma.watchlist.create({
        data: {
          userId: investor.id,
          listingId: created.id,
        },
      });
    }
  }

  console.log('Seeded 6 marketplace listings and initial watchlist.');
  console.log('✅ PropVest database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
