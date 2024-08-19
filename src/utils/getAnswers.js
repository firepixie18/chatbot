import axios from "axios";


const apiKey=process.env.REACT_API_KEY;

export async function generateAns(message) {
    const response=await axios({
        url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        method:"post",
        data:{
            contents:[
                {parts:[{text:message}]}
            ],
        },
    });
    const rawText = response.data.candidates[0].content.parts[0].text;

        // Remove special symbols and formatting
        const cleanedText = rawText
            .replace(/##/g, '') // Remove double hash symbols
            .replace(/\*\*/g, '') // Remove double asterisks
            .replace(/[*_~`]/g, '') // Remove other markdown symbols
            .trim(); // Trim leading and trailing whitespace

        return cleanedText;
}
