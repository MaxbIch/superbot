import { useState } from "react";
import Layout from "./Layout";
import BackButton from "./BackButton";
import OptionGroup from "./OptionGroup";
import ContactButton from "./ContactButton";
import type { FormQuestion } from "../types/form";

interface Props {
    title: string;
    questions: FormQuestion[];
}

export default function FormPage({
                                     title,
                                     questions,
                                 }: Props) {
    const [answers, setAnswers] = useState<
        Record<string, string>
    >({});

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <BackButton />

                <div className="bg-white rounded-3xl p-6 shadow">
                    <h1 className="text-2xl font-bold mb-8">
                        {title}
                    </h1>

                    {questions.map((question) => (
                        <OptionGroup
                            key={question.id}
                            title={question.title}
                            options={question.options}
                            value={answers[question.id]}
                            onChange={(value) =>
                                setAnswers({
                                    ...answers,
                                    [question.id]: value,
                                })
                            }
                        />
                    ))}
                </div>

                <div className="mt-4">
                    <ContactButton />
                </div>
            </div>
        </Layout>
    );
}