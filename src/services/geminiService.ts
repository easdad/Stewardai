import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptData } from '../types';

// Per guidelines, initialize with API key from environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const receiptSchema = {
  type: Type.OBJECT,
  properties: {
    vendor: {
      type: Type.STRING,
      description: "The name of the store or vendor.",
    },
    date: {
      type: Type.STRING,
      description: "The date of the transaction in YYYY-MM-DD format.",
    },
    total: {
      type: Type.NUMBER,
      description: "The total amount of the transaction.",
    },
    items: {
      type: Type.ARRAY,
      description: "A list of items purchased.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the item.",
          },
          price: {
            type: Type.NUMBER,
            description: "The price of the item.",
          },
        },
        required: ["name", "price"],
      },
    },
  },
  required: ["vendor", "date", "total"],
};


export async function parseReceipt(base64Image: string): Promise<ReceiptData> {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: `Analyze the receipt image and extract the following information. The date must be in YYYY-MM-DD format. The total must be a number.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: receiptSchema,
      },
    });

    if (!response.text) {
      throw new Error("Failed to analyze receipt: The AI service returned an empty response.");
    }

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);

    // Basic validation
    if (!parsedData.vendor || !parsedData.date || typeof parsedData.total === 'undefined') {
      throw new Error("Failed to parse receipt data correctly. Missing required fields.");
    }

    return parsedData as ReceiptData;

  } catch (error) {
    console.error("Error parsing receipt with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze receipt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while analyzing the receipt.");
  }
}