import { memo } from "react";
import AIQuestionBot, { AIQuestionBotProps } from "./AIQuestionBot/AIQuestionBot";

export type AIBotProps = AIQuestionBotProps;

const AIBot: React.FC<AIBotProps> = ({ generationConfig, models, botId }) => {
    return <AIQuestionBot models={models} botId={botId} generationConfig={generationConfig} />
}

export default memo(AIBot);