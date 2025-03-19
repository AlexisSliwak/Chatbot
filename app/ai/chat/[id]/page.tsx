"use server";
import styles from "./page.module.css";
import AIQuestionBot from "../../../../src/lib/AIBots/AIQuestionBot/AIQuestionBot";
import models from "@/lib/ai-models";

type ChatPageProps = {
    params: Promise<{ id: string }>
};

const ChatPage = async ({ params }: ChatPageProps) => {
    const { id } = await params;
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>AI Chat | id:<span className={styles.chatId}>{id}</span></h1>
            <AIQuestionBot models={Object.keys(models.google)} botId={id} generationConfig={{}} />
            <button className={styles.button}>Add Question Bot{"(non-functional)"}</button>
            <button className={styles.button}>Remove Question Bot{"(non-functional)"}</button>
        </div>
    );
};

export default ChatPage;