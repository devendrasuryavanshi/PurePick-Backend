import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIAnalysisPrompt } from "../../data/constants.js";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const googleSearchTool = {
    googleSearch: {}
};

const getAIAnalysis = async(productDetails, productAdditoinalInfo, userDetails) => {
    try {
        const prompt = AIAnalysisPrompt(productDetails, productAdditoinalInfo, userDetails);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            tools: [googleSearchTool]
        });

        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.2,     // Balanced precision with creativity - for product analysis while maintaining factual accuracy
                topK: 3,             // Allow top 3 most likely tokens - helps with finding valid product alternatives
                topP: 0.95,          // High nucleus sampling - ensures comprehensive product analysis while maintaining coherence
                maxOutputTokens: 4096, // Increased token limit - for detailed product analysis and multiple suggestions
                responseMimeType: "application/json"
            }
        });

        // Access search results from the correct path in response
        const groundingMetadata = result.response.candidates?.[0]?.groundingMetadata;
        const searchResults = groundingMetadata?.searchEntryPoint?.renderedContent;

        const response = JSON.parse(result.response.text()
            .replace(/json/gi, '')
            .replace(/JSON/gi, '')
            .replace(/`/g, '')
            .replace(/^\s+|\s+$/g, ''));

        return response;
    } catch (error) {
        return null;
    }
}

export { getAIAnalysis };