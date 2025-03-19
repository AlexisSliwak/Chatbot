import MarkdownProcessor from "@/lib/markdown-processor";
import styles from "./AIMessage.module.css";
import { UIMessage } from "ai";
import { memo } from "react";

type MessageProps = {
    message: UIMessage & { revisionId: string },
}

const Message: React.FC<MessageProps> = ({ message }) => {
    console.log(message);
    return (
        <div key={message.id}>
            {message.role === "user" ?
                <>
                    <h1 className={styles.userName}>You:</h1>
                    <div className={styles.userMessage}>
                        <MarkdownProcessor>{message.content}</MarkdownProcessor>
                    </div>
                </> :
                <>
                    <h1 className={styles.assistantName}>Assistant:</h1>
                    <div className={styles.assistantMessage}>
                        <MarkdownProcessor>{message.content}</MarkdownProcessor>
                    </div>
                </>
            }
        </div>
    );
}

const areEqual = (prevProps: MessageProps, nextProps: MessageProps) => {
    return prevProps.message.id === nextProps.message.id && prevProps.message.revisionId === nextProps.message.revisionId;
}

export default memo(Message, areEqual);