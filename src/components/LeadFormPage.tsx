import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import Layout from "./Layout";
import BackButton from "./BackButton";
import OptionGroup from "./OptionGroup";
import Card from "./Card";
import Button from "./Button";

import { submitLead } from "../services/leadService";
import { hapticFeedback } from "../lib/telegram";
import type { LeadConfig, LeadQuestion } from "../types/lead";

interface Props {
    config: LeadConfig;
}

function isQuestionVisible(
    question: LeadQuestion,
    answers: Record<string, string>,
) {
    if (!question.showWhen) return true;

    return answers[question.showWhen.questionId] === question.showWhen.value;
}

function formatDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    const [year, month, day] = value.split("-");
    return `${day}.${month}.${year}`;
}

export default function LeadFormPage({ config }: Props) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const visibleQuestions = useMemo(
        () =>
            config.questions.filter((question) =>
                isQuestionVisible(question, answers),
            ),
        [answers, config.questions],
    );

    const completed = visibleQuestions.every(
        (question) => answers[question.id],
    );

    const fields = useMemo(() => {
        const result: Record<string, string> = {};

        visibleQuestions.forEach((question) => {
            const answer = answers[question.id] || "-";
            result[question.title] =
                question.type === "date" ? formatDate(answer) : answer;
        });

        return result;
    }, [answers, visibleQuestions]);

    const handleChange = (question: LeadQuestion, value: string) => {
        setAnswers((current) => {
            const next = {
                ...current,
                [question.id]: value,
            };

            config.questions.forEach((dependentQuestion) => {
                if (
                    dependentQuestion.showWhen?.questionId === question.id &&
                    dependentQuestion.showWhen.value !== value
                ) {
                    delete next[dependentQuestion.id];
                }
            });

            return next;
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            await submitLead({
                category: config.category,
                title: config.title,
                emoji: config.emoji,
                fields,
            });

            hapticFeedback("success");
            setSent(true);
        } catch (err) {
            hapticFeedback("error");
            setError(
                err instanceof Error
                    ? err.message
                    : "Не удалось отправить заявку",
            );
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <Layout>
                <Card padding="lg" className="text-center animate-fade-in-up">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold text-ink mb-2">
                        Заявка отправлена!
                    </h1>
                    <p className="text-ink-muted mb-6">
                        Мы получили вашу заявку и скоро свяжемся с вами в Telegram.
                    </p>
                    <Button onClick={() => window.history.back()}>
                        Вернуться назад
                    </Button>
                </Card>
            </Layout>
        );
    }

    return (
        <Layout>
            <BackButton />

            <div className="animate-fade-in-up">
                <div className="mb-5">
                    <span className="text-4xl">{config.emoji}</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2">
                        {config.title}
                    </h1>
                    <p className="text-ink-muted mt-1 text-sm">
                        Ответьте на несколько вопросов — мы подберём лучший вариант
                    </p>
                </div>

                <Card className="mb-4 overflow-hidden">
                    {visibleQuestions.map((question) => (
                        <div key={question.id} className="min-w-0">
                            {question.type === "date" ? (
                                <div className="mb-5 last:mb-0 min-w-0">
                                    <h3 className="font-semibold text-ink mb-1 text-sm sm:text-base">
                                        {question.title}
                                    </h3>

                                    {question.description && (
                                        <p className="text-ink-muted text-xs sm:text-sm mb-2">
                                            {question.description}
                                        </p>
                                    )}

                                    <div className="min-w-0 max-w-full overflow-hidden">
                                        <input
                                            type="date"
                                            value={answers[question.id] || ""}
                                            onChange={(event) =>
                                                handleChange(
                                                    question,
                                                    event.target.value,
                                                )
                                            }
                                            className="block w-full max-w-full min-w-0 h-12 box-border px-3 py-2 rounded-xl border-2 border-border bg-surface-muted text-ink text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 appearance-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <OptionGroup
                                    title={question.title}
                                    options={question.options ?? []}
                                    value={answers[question.id]}
                                    onChange={(value) =>
                                        handleChange(question, value)
                                    }
                                />
                            )}
                        </div>
                    ))}
                </Card>

                {completed && (
                    <Card className="animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-brand-600" />
                            <h2 className="font-semibold text-ink">
                                Проверьте заявку
                            </h2>
                        </div>

                        <div className="space-y-2 mb-4">
                            {visibleQuestions.map((question) => (
                                <div
                                    key={question.id}
                                    className="flex justify-between gap-4 text-sm py-2 border-b border-border last:border-0"
                                >
                                    <span className="text-ink-muted">
                                        {question.title}
                                    </span>
                                    <span className="font-medium text-ink text-right">
                                        {question.type === "date"
                                            ? formatDate(answers[question.id])
                                            : answers[question.id]}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm leading-relaxed">
                                {error}
                            </div>
                        )}

                        <Button
                            fullWidth
                            size="lg"
                            loading={loading}
                            onClick={handleSubmit}
                        >
                            Отправить заявку
                        </Button>
                    </Card>
                )}
            </div>
        </Layout>
    );
}
