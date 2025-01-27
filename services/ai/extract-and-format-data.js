import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractFormatDataPrompt } from "../../data/constants.js";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const fileToGenerativePart = (file, mimeType) => {
    return {
        inlineData: {
            data: Buffer.from(file).toString("base64"),
            mimeType
        },
    };
}

const extractAndFormatData = async({ buffer1, buffer2, productAdditionalInfo }) => {
    const image1 = fileToGenerativePart(buffer1, "image/jpeg");
    const image2 = fileToGenerativePart(buffer2, "image/jpeg");

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro"
        });

        const result = await model.generateContent([
            extractFormatDataPrompt, image1, image2, JSON.stringify(productAdditionalInfo)
        ],
            {
                generationConfig: {
                    temperature: 0.1,        // Lower temperature for more consistent outputs
                    topK: 1,                 // Reduced for more focused responses
                    topP: 0.8,              // Narrowed sampling for higher precision
                    maxOutputTokens: 4096,   // Increased to handle detailed product info
                    responseMimeType: "application/json",
                    structuredOutput: true,  // Enforce JSON structure
                }
            }
        );
        const response = JSON.parse(result.response.text().replace('```', '').replace('```', '').replace('JSON', '').replace('json', ''));
        return response;
    } catch (error) {
        return {
            error: "Extraction failed",
            reason: "Extraction failed due to an error."
        };
    }
}

export { extractAndFormatData };