import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import CurrencyCalculator from "../components/CurrencyCalculator";

export default function CurrencyPage() {
    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <BackButton />

                <h1 className="text-3xl font-bold mb-6">
                    Обмен валют
                </h1>

                <CurrencyCalculator />
            </div>
        </Layout>
    );
}