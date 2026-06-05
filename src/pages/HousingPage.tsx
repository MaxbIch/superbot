import LeadFormPage from "../components/LeadFormPage";

import { housingLead } from "../data/housingLead";

export default function HousingPage() {
    return (
        <LeadFormPage
            config={housingLead}
        />
    );
}