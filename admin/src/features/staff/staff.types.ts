export interface Shift {
    id: string;
    staffId: string;
    day: string;
    startTime: string;
    endTime: string;
    breakStart: string | null;
    breakDuration: number | null;
    active: boolean;
}

export interface StaffSummary {
    id: string;
    firstName: string;
    lastName: string;
    active: boolean;
}

export interface Staff {
    id: string,
    shopId: string;
    firstName: string;
    lastName: string;
    active: boolean;
    shifts: Shift[] | null;
    createdAt: string;
    updatedAt: string;
}