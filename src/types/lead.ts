export interface LeadQuestion {
    id: string;
    title: string;
    options: string[];
}

export interface LeadConfig {
    title: string;
    emoji: string;
    category: string;
    questions: LeadQuestion[];
}
