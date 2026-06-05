export interface LeadQuestion {
    id: string;
    title: string;
    options: string[];
}

export interface LeadConfig {
    title: string;
    emoji: string;
    questions: LeadQuestion[];
}