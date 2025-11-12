import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Transaction, TransactionType } from '../types';

// The API key must be sourced exclusively from `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

/**
 * A type guard to check if a value is a valid TransactionType.
 */
function isTransactionType(type: unknown): type is TransactionType {
    return type === 'income' || type === 'expense';
}

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
        const rawData: unknown = JSON.parse(jsonString);

        // Defensive validation: ensure the response is an object before proceeding.
        if (typeof rawData !== 'object' || rawData === null) {
            throw new Error("Invalid data structure: AI response is not an object.");
        }
        
        const data = rawData as Record<string, unknown>;

        // Validate each property, providing safe fallbacks.
        const validatedDate = (typeof data.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.date))
            ? data.date
            : new Date().toISOString().split('T')[0];

        const validatedTransaction: Partial<Transaction> = {
            date: validatedDate,
            source: typeof data.source === 'string' ? data.source : undefined,
            amount: typeof data.amount === 'number' ? data.amount : undefined,
            type: isTransactionType(data.type) ? data.type : 'expense', // Default to 'expense'
            category: typeof data.category === 'string' ? data.category : undefined,
        };

        return validatedTransaction;

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