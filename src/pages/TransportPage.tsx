import FormPage from "../components/FormPage";
import { bikeForm } from "../data/forms";

export default function TransportPage() {
    return (
        <FormPage
            title="Подбор байка"
            questions={bikeForm}
        />
    );
}