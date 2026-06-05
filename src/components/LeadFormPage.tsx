import { useMemo, useState } from "react";

import Layout from "./Layout";
import BackButton from "./BackButton";
import OptionGroup from "./OptionGroup";

import type {
    LeadConfig,
} from "../types/lead";

interface Props {
    config: LeadConfig;
}

export default function LeadFormPage({
                                         config,
                                     }: Props) {
    const [answers, setAnswers] =
        useState<
            Record<string, string>
        >({});

    const completed =
        config.questions.every(
            (question) =>
                answers[question.id]
        );

    const message = useMemo(() => {
        let text = `${config.emoji} ${config.title}\n\n`;

        config.questions.forEach(
            (question) => {
                text += `${question.title}: ${
                    answers[
                        question.id
                        ] || "-"
                }\n`;
            }
        );

        return text;
    }, [
        answers,
        config,
    ]);

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <BackButton />

                <div className="bg-white rounded-3xl p-6 shadow">
                    <h1 className="text-2xl font-bold mb-8">
                        {config.emoji}{" "}
                        {config.title}
                    </h1>

                    {config.questions.map(
                        (question) => (
                            <OptionGroup
                                key={question.id}
                                title={
                                    question.title
                                }
                                options={
                                    question.options
                                }
                                value={
                                    answers[
                                        question.id
                                        ]
                                }
                                onChange={(
                                    value
                                ) =>
                                    setAnswers({
                                        ...answers,
                                        [question.id]:
                                        value,
                                    })
                                }
                            />
                        )
                    )}
                </div>

                {completed && (
                    <div className="mt-6 bg-white rounded-3xl p-6 shadow">
                        <h2 className="font-semibold mb-3">
                            Ваша заявка
                        </h2>

                        <pre className="whitespace-pre-wrap text-sm">
              {message}
            </pre>

                        <button
                            className="
                w-full
                mt-4
                bg-green-600
                text-white
                py-4
                rounded-2xl
                font-semibold
              "
                        >
                            Отправить заявку
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}