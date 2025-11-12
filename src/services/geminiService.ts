import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Transaction, TransactionType } from '../types';

// Define the expected structure of the JSON response from the Gemini API.
// This helps TypeScript understand the data shape and prevents type errors.
type GeminiData = {
  date?: string;
  source?: string;
  amount?: number;
  type?: TransactionType;
  category?: string;
}

// The API key must be sourced exclusively from `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const schema = {
  type: Type.OBJECT,
  properties: {
    date: {
      type: Type.STRING,
      description: 'The date of the transaction in YYYY-MM-DD format. If no year is present, assume the current year.',
    },
    source: {
      type: Type.STRING,
      description: 'The name of the vendor, store, client, or payer who issued the document.',
    },
    amount: {
      type: Type.NUMBER,
      description: 'The total amount of the transaction as a number. Extract the largest, most prominent numerical value, likely the total.',
    },
    type: {
      type: Type.STRING,
      description: 'The type of transaction. Infer if it is "income" (e.g., invoice, check, payment received) or "expense" (e.g., receipt, purchase). Default to "expense" if unsure.',
    },
    category: {
      type: Type.STRING,
      description: 'The most appropriate category for this transaction from the provided list.',
    },
  },
  required: ['date', 'source', 'amount', 'type', 'category'],
};


export const parseDocument = async (imageDataBase64: string, userCategories: string[]): Promise<Partial<Transaction>> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: imageDataBase64,
            },
        };

        const textPart = {
            text: `Analyze this receipt, invoice, or check. Extract the key details. Based on the content, infer if it is 'income' (e.g., from an invoice, check, or payment confirmation) or 'expense' (e.g., from a store receipt or purchase). Categorize it into one of the following user-defined categories: ${userCategories.join(', ')}. Provide the output in a structured JSON format.`,
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        const jsonString = response.text;
        // By casting the parsed JSON to our defined type, we give TypeScript a clear structure.
        const parsedData: GeminiData = JSON.parse(jsonString);

        // This nested validation structure is the definitive fix for strict compilers.
        // It creates an unambiguous "type safe" scope.
        if (typeof parsedData.date === 'string') {
            // In this block, the compiler knows `parsedData.date` is a string,
            // so we can safely call `.test()` on it.
            if (!/^\d{4}-\d{2}-\d{2}$/.test(parsedData.date)) {
                // The format is invalid, so assign a default.
                parsedData.date = new Date().toISOString().split('T')[0];
            }
            // If the format is valid, do nothing, preserving the correct date.
        } else {
            // The date was not a string (e.g., it was undefined), so assign a default.
            parsedData.date = new Date().toISOString().split('T')[0];
        }

        return parsedData;
    } catch (error) {
        console.error("Error parsing document with Gemini:", error);
        throw new Error("Failed to analyze the document. Please enter the details manually.");
    }
};

export const startTaxChat = (): Chat => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are Stuart AI, a helpful assistant for freelancers and self-employed individuals in the United States. Your goal is to provide clear, general information about common tax topics, such as deductions, quarterly payments, and savings strategies. Do not provide financial, legal, or tax advice. Always encourage users to consult with a qualified professional like a CPA. Keep your tone friendly, encouraging, and easy to understand. Use markdown for formatting, like lists and bold text, to make the information digestible.',
    },
  });
  return chat;
};