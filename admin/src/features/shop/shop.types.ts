export interface Shop {
    id: string;
    name: string;
    timezone: string;
    openTime: string;
    closeTime: string;
    slotInterval: number;
    leadTime: number;
    bookAheadDays: number; 
}