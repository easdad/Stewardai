import { Category, TransactionType, FilingStatus } from './types';

export const DEFAULT_CATEGORIES: { type: TransactionType, name: Category }[] = [
    { type: 'income', name: 'Client Payment' },
    { type: 'income', name: 'Consulting Gig' },
    { type: 'expense', name: 'Office Supplies' },
    { type: 'expense', name: 'Software & Subscriptions' },
    { type: 'expense', name: 'Travel' },
    { type: 'expense', name: 'Meals & Entertainment' },
    { type: 'expense', name: 'Utilities' },
    { type: 'expense', name: 'Home Office' },
];

// --- NEW DETAILED TAX CONSTANTS ---

// Self-Employment Tax Constants
export const NET_EARNINGS_PERCENTAGE = 0.9235;
export const SOCIAL_SECURITY_WAGE_BASE = 176000; 
export const SOCIAL_SECURITY_RATE = 0.124;
export const MEDICARE_RATE = 0.029;

// 2024 Federal Income Tax Brackets
export const FEDERAL_INCOME_TAX_BRACKETS: { [key in FilingStatus]: { rate: number, min: number, max: number }[] } = {
    single: [
        { rate: 0.10, min: 0, max: 11600 },
        { rate: 0.12, min: 11600, max: 47150 },
        { rate: 0.22, min: 47150, max: 100525 },
        { rate: 0.24, min: 100525, max: 191950 },
        { rate: 0.32, min: 191950, max: 243725 },
        { rate: 0.35, min: 243725, max: 609350 },
        { rate: 0.37, min: 609350, max: Infinity },
    ],
    marriedFilingJointly: [
        { rate: 0.10, min: 0, max: 23200 },
        { rate: 0.12, min: 23200, max: 94300 },
        { rate: 0.22, min: 94300, max: 201050 },
        { rate: 0.24, min: 201050, max: 383900 },
        { rate: 0.32, min: 383900, max: 487450 },
        { rate: 0.35, min: 487450, max: 731200 },
        { rate: 0.37, min: 731200, max: Infinity },
    ],
    headOfHousehold: [
        { rate: 0.10, min: 0, max: 16550 },
        { rate: 0.12, min: 16550, max: 63100 },
        { rate: 0.22, min: 63100, max: 100500 },
        { rate: 0.24, min: 100500, max: 191950 },
        { rate: 0.32, min: 191950, max: 243700 },
        { rate: 0.35, min: 243700, max: 609350 },
        { rate: 0.37, min: 609350, max: Infinity },
    ],
};

// 2024 Standard Deductions
export const STANDARD_DEDUCTIONS: { [key in FilingStatus]: number } = {
    single: 14600,
    marriedFilingJointly: 29200,
    headOfHousehold: 21900,
};

// Standard IRS deadlines for quarterly estimated taxes.
export const QUARTERLY_TAX_DEADLINES = [
    { period: 'Q1 (Jan 1 - Mar 31)', deadline: 'April 15' },
    { period: 'Q2 (Apr 1 - May 31)', deadline: 'June 15' },
    { period: 'Q3 (Jun 1 - Aug 31)', deadline: 'September 15' },
    { period: 'Q4 (Sep 1 - Dec 31)', deadline: 'January 15' },
];


// Simplified State Tax Rates (using flat or average rates for simplicity)
export const STATE_TAX_RATES: { [key: string]: { name: string, rate: number } } = {
    'AL': { name: 'Alabama', rate: 0.05 },
    'AK': { name: 'Alaska', rate: 0.00 },
    'AZ': { name: 'Arizona', rate: 0.025 },
    'AR': { name: 'Arkansas', rate: 0.044 },
    'CA': { name: 'California', rate: 0.093 },
    'CO': { name: 'Colorado', rate: 0.044 },
    'CT': { name: 'Connecticut', rate: 0.055 },
    'DE': { name: 'Delaware', rate: 0.066 },
    'FL': { name: 'Florida', rate: 0.00 },
    'GA': { name: 'Georgia', rate: 0.0549 },
    'HI': { name: 'Hawaii', rate: 0.0825 },
    'ID': { name: 'Idaho', rate: 0.058 },
    'IL': { name: 'Illinois', rate: 0.0495 },
    'IN': { name: 'Indiana', rate: 0.0305 },
    'IA': { name: 'Iowa', rate: 0.057 },
    'KS': { name: 'Kansas', rate: 0.057 },
    'KY': { name: 'Kentucky', rate: 0.045 },
    'LA': { name: 'Louisiana', rate: 0.0425 },
    'ME': { name: 'Maine', rate: 0.0715 },
    'MD': { name: 'Maryland', rate: 0.0575 },
    'MA': { name: 'Massachusetts', rate: 0.05 },
    'MI': { name: 'Michigan', rate: 0.0425 },
    'MN': { name: 'Minnesota', rate: 0.0785 },
    'MS': { name: 'Mississippi', rate: 0.05 },
    'MO': { name: 'Missouri', rate: 0.0495 },
    'MT': { name: 'Montana', rate: 0.059 },
    'NE': { name: 'Nebraska', rate: 0.0627 },
    'NV': { name: 'Nevada', rate: 0.00 },
    'NH': { name: 'New Hampshire', rate: 0.04 },
    'NJ': { name: 'New Jersey', rate: 0.0637 },
    'NM': { name: 'New Mexico', rate: 0.059 },
    'NY': { name: 'New York', rate: 0.0685 },
    'NC': { name: 'North Carolina', rate: 0.045 },
    'ND': { name: 'North Dakota', rate: 0.025 },
    'OH': { name: 'Ohio', rate: 0.035 },
    'OK': { name: 'Oklahoma', rate: 0.0475 },
    'OR': { name: 'Oregon', rate: 0.099 },
    'PA': { name: 'Pennsylvania', rate: 0.0307 },
    'RI': { name: 'Rhode Island', rate: 0.0599 },
    'SC': { name: 'South Carolina', rate: 0.064 },
    'SD': { name: 'South Dakota', rate: 0.00 },
    'TN': { name: 'Tennessee', rate: 0.00 },
    'TX': { name: 'Texas', rate: 0.00 },
    'UT': { name: 'Utah', rate: 0.0465 },
    'VT': { name: 'Vermont', rate: 0.0875 },
    'VA': { name: 'Virginia', rate: 0.0575 },
    'WA': { name: 'Washington', rate: 0.00 },
    'WV': { name: 'West Virginia', rate: 0.0512 },
    'WI': { name: 'Wisconsin', rate: 0.0765 },
    'WY': { name: 'Wyoming', rate: 0.00 },
};
