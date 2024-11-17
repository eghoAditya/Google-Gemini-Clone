import { createContext, useState } from "react";
import run from "../config/gemini";

// Create Context
export const Context = createContext();

const ContextProvider = (props) => {
    // State initialization
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [typedText, setTypedText] = useState(""); // State to hold the typed effect text

    const typingSpeed = 50; // Adjust the typing speed (in ms)

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    // Function to handle the sending of the prompt
    const onSent = async (prompt) => {
        setResultData("");
        setTypedText(""); // Clear any previous typed text
        setLoading(true);
        setShowResult(true);
        let response;
        if (prompt != undefined) {
            response = await run(prompt)
            setRecentPrompt(prompt)
        }
        else {
            setPrevPrompts(prev => [...prev, input])
            setRecentPrompt(input)
            response= await run(input)
        }
       

        let newResponse = ""; // Initialize the newResponse string
        let inBold = false; // Track if we are in bold mode
        let i = 0;

        // Process the response character by character
        while (i < response.length) {
            // Check if we find '**' to toggle bold
            if (response[i] === "*" && response[i + 1] === "*") {
                if (inBold) {
                    newResponse += "</b>"; // Close the bold tag
                } else {
                    newResponse += "<b>"; // Open the bold tag
                }
                inBold = !inBold; // Toggle the bold state
                i += 2; // Skip the next "*" as it's part of the "**"
            }
            // If we find a single '*' for new line, replace it with <br />
            else if (response[i] === "*") {
                newResponse += "<br />"; // Add a line break for single '*'
                i++; // Skip the next '*' as it was already replaced with <br />
            }
            else {
                newResponse += response[i]; // Add the current character to the response
                i++;
            }
        }

        // If there’s any unclosed <b> tag, close it at the end
        if (inBold) {
            newResponse += "</b>";
        }

        setResultData(newResponse); // Store the full response (with HTML formatting)
        setLoading(false);

        // Start typing effect
        typeWriterEffect(newResponse); // Call the function to apply the typing effect
        setInput(""); // Clear the input
    };

    // Typing effect function
    const typeWriterEffect = (text) => {
        let i = 0;
        const textLength = text.length;
        let tempText = "";
        
        const interval = setInterval(() => {
            // Add the next character to the typed text
            tempText += text.charAt(i);

            // Update the state with the new typed text
            setTypedText(tempText);

            // Stop the interval when all characters are typed
            if (i >= textLength - 1) {
                clearInterval(interval);
            }

            i++;
        }, typingSpeed); // Adjust the typing speed here
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
        setInput,
        typedText,
        newChat// Expose the typedText to be rendered in the component
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
}

export default ContextProvider;
