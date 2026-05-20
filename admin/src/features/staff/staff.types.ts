export interface AvailabilitySlot {
    day: string,
    start: string,
    end: string
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
    availability: AvailabilitySlot[] | null;
    createdAt: string;
    updatedAt: string;
}