export type LeadQuestionType = "options" | "date";

export interface LeadQuestion {
    id: string;
    title: string;
    options?: string[];
    type?: LeadQuestionType;
    description?: string;
    showWhen?: {
        questionId: string;
        value: string;
    };
}

export interface LeadConfig {
    title: string;
    emoji: string;
    category: string;
    questions: LeadQuestion[];
}
