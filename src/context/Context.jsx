import { createContext, useState } from "react";
import run from "../config/gemini";

// Create Context
export const Context = createContext();

const ContextProvider = (props) => {
    // Move all state initialization inside the ContextProvider component
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Function to handle the sending of the prompt
    const onSent = async () => {

        setResultData("");
        setLoading(true);  
        setShowResult(true); 
        setRecentPrompt(input)
        const response = await run(input); 
        setResultData(response);  
        setLoading(false);  
        setInput("");
    };

    // Prepare the context value
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
}

export default ContextProvider;
