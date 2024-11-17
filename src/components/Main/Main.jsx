import React, { useContext, useState, useEffect } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, setRecentPrompt } = useContext(Context);
    const [typedText, setTypedText] = useState(""); // State to hold the typed effect text
    const typingSpeed = 15; // Speed of typing effect in milliseconds (faster)

    // Function to simulate typing effect
    const typeWriterEffect = (text) => {
        let i = 0;
        let tempText = "";
        const textLength = text.length;

        // Set an interval to simulate typing effect
        const interval = setInterval(() => {
            tempText += text.charAt(i); // Add the next character to the tempText
            setTypedText(tempText); // Update the state with the typed text

            // Stop the interval when all characters are typed
            if (i >= textLength - 1) {
                clearInterval(interval);
            }

            i++;
        }, typingSpeed); // Adjust the speed here
    };

    useEffect(() => {
        if (resultData) {
            setTypedText(""); // Clear previous typed text
            typeWriterEffect(resultData); // Start typing effect on new result
        }
    }, [resultData]); // Trigger typing effect when resultData changes

    return (
        <div className="main">
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="User Icon" />
            </div>
            <div className="main-container">

                {!showResult
                    ? <>
                        <div className="greet">
                            <p><span>Hello, Dev.</span></p>
                            <p>How can I help you today?</p>
                        </div>

                        <div className="cards">
                            <div className="card">
                                <p>How do I find the best road trip itineraries or travel guides?</p>
                                <img src={assets.compass_icon} alt="Compass Icon" />
                            </div>

                            <div className="card">
                                <p>What is the difference between AI and machine learning?</p>
                                <img src={assets.bulb_icon} alt="Bulb Icon" />
                            </div>

                            <div className="card">
                                <p>Improve the time complexity of the following code</p>
                                <img src={assets.code_icon} alt="Code Icon" />
                            </div>

                            <div className="card">
                                <p>Help me write a cover letter</p>
                                <img src={assets.message_icon} alt="Message Icon" />
                            </div>
                        </div>
                    </>
                    : <div className="result">
                        <div className="result-title">
                            <img src={assets.user_icon} alt="User Icon" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="Gemini Icon" />
                            {loading
                                ? <div className="loader">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                                : <p dangerouslySetInnerHTML={{ __html: typedText }}></p>  // Render typedText with HTML formatting
                            }
                        </div>
                    </div>
                }

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder="Enter a prompt here"
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="Gallery Icon" />
                            <img src={assets.mic_icon} alt="Mic Icon" />
                             {input? <img
                                onClick={() => {
                                    setRecentPrompt(input);  // Set recentPrompt before sending
                                    onSent();  // Trigger onSent to handle prompt sending
                                }}
                                src={assets.send_icon}
                                alt="Send Icon"
                            />:null}   
                        </div>
                    </div>

                    <p className="bottom-info">
                        Gemini may display inaccurate info, including about people,
                        so double-check its responses. Your privacy and Gemini Apps
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Main;
