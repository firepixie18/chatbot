import React, { useState, useEffect, useRef } from 'react';
import { generateAns } from '../utils/getAnswers'; // Adjust the import path as necessary
import { HiArrowUp } from 'react-icons/hi'; // Import an upward arrow icon
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Import a loading icon

const ChatInput = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);
    const chatContainerRef = useRef(null);

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSend = async () => {
        if (message.trim()) {
            setLoading(true); // Set loading to true when request starts
            try {
                const apiResponse = await generateAns(message);
                setResponse(apiResponse);
                setMessage('');
                // Scroll to the bottom of the chat container
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            } catch (error) {
                console.error('Error generating response:', error);
            } finally {
                setLoading(false); // Set loading to false when request completes
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent adding a new line on Enter key
            handleSend();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    // Function to convert plain text URLs to clickable links
    const renderTextWithLinks = (text) => {
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        return text.split(urlPattern).map((part, index) =>
            urlPattern.test(part) ? (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {part}
                </a>
            ) : (
                part
            )
        );
    };

    // Function to render bullet points from text
    const renderBulletPoints = (text) => {
        const bulletPointPattern = /(?:\n|^)\* (.*?)(?:\n|$)/g;
        const items = [];
        let match;
        while ((match = bulletPointPattern.exec(text)) !== null) {
            items.push(<li key={items.length} className="list-disc pl-5">{match[1]}</li>);
        }
        return items.length > 0 ? <ul className="list-disc pl-5">{items}</ul> : renderTextWithLinks(text);
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Chat Messages Container */}
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {/* Chat messages will be displayed here */}
                {response && (
                    <div className="mb-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm text-lg">
                        {renderBulletPoints(response)}
                    </div>
                )}
            </div>

            {/* Input Box and Send Button */}
            <div className="p-2 bg-gray-100 border-t border-gray-300 flex items-center">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows="1"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-lg resize-none overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSend}
                    className="ml-2 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ease-in-out"
                    disabled={loading}
                >
                    {loading ? (
                        <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
                    ) : (
                        <HiArrowUp className="w-6 h-6" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
