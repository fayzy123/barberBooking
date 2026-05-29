export interface Shift {
    id: string;
    staffId: string;
    day: string;
    startTime: string;
    endTime: string;
    breakStart: string | null;
    active: boolean;
}

export interface StaffSummary {
    id: string;
    name: string;
    active: boolean;
}

export interface Staff {
    id: string,
    shopId: string;
    name: string;
    active: boolean;
    shifts: Shift[] | null;
    createdAt: string;
    updatedAt: string;
}