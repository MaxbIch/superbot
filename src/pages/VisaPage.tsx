import LeadFormPage from "../components/LeadFormPage";
import { visaLead } from "../data/visaLead";

export default function VisaPage() {
    return (
        <LeadFormPage
            config={visaLead}
        />
    );
}