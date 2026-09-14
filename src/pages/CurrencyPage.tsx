import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import CurrencyCalculator from "../components/CurrencyCalculator";

export default function CurrencyPage() {
    return (
        <Layout>
            <BackButton />
            <div className="mb-5 animate-fade-in-up">
                <img src="/category-icon/exchange.png" alt="" aria-hidden="true" className="w-16 h-16 object-contain" />
                <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">Обмен валют</h1>
                <p className="text-ink-muted mt-1 text-sm">Актуальные курсы и калькулятор</p>
            </div>
            <CurrencyCalculator />
        </Layout>
    );
}
