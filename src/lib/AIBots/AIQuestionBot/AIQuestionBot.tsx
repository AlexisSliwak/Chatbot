"use client";
import styles from "./AIQuestionBot.module.css";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import { useChat } from "@ai-sdk/react";
import AIMessage from "./Message/AIMessage";
import { UIMessage } from "ai";

export type AIQuestionBotProps = {
    generationConfig?: Record<string, unknown>,
    models: string[],
    botId: React.Key
}

const AIQuestionBot: React.FC<AIQuestionBotProps> = ({ generationConfig, models, botId }) => {
    const [model, setModel] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const { messages, input, handleInputChange: handleChatInputChange, handleSubmit: handleChatSubmit } = useChat({
        api: "/api/chat",
        body: {
            model: models[model],
            provider: "google",
            generationConfig
        }
    });

    const handleChangeModel = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Changed model to:", parseInt(e.target.value));
        setModel(parseInt(e.target.value));
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleChatInputChange(e);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("Pressed submit button. Additional API props:", {
            provider: "google",
            model: models[model],
            generationConfig
        });
        e.preventDefault();
        setIsLoading(false);

        handleChatSubmit(e, {
            body: {
                provider: "google",
                model: models[model],
                generationConfig
            }
        });
    };

    return (
        <div className={styles.container}>
            {messages && (
                <div className={styles.responseContainer}>
                    <h2 className={styles.responseTitle}>Response:</h2>
                    <div className={styles.responseText}>
                        {messages.map(message => (
                            <AIMessage message={message as UIMessage & { revisionId: string }} key={message.id} />
                        ))}
                    </div>
                </div>
            )}


            <form onSubmit={handleSubmit} className={styles.form}>
                <textarea
                    className={styles.textarea}
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter your prompt here..."
                />
                {models.length > 1 && (
                    <>
                        <h1 className={styles.responseText}>AI Model</h1>
                        {models.map((modelName, i) =>
                            <div id={`${modelName}_selection`} key={i}>
                                <input type="radio" id={`${modelName}_${botId}`} name="ai_model" value={i} onChange={handleChangeModel} checked={i === model} disabled={isLoading} key="1"></input>
                                <label htmlFor={`${modelName}_${botId}`} key="2">{modelName}</label>
                            </div>
                        )}
                    </>
                )}
                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Generate"}
                </button>
            </form>

            {isLoading && (
                <div className={styles.loaderContainer}>
                    <RingLoader color="#36D7B7" loading={isLoading} size={50} />
                </div>
            )}
        </div>
    );
}

export default AIQuestionBot;