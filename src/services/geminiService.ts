import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function parseReceipt(base64Image: string): Promise<ReceiptData> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          { text: "Analyze this receipt and extract the vendor name, transaction date, and the final total amount. If possible, also list the individual items with their prices." }
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vendor: { type: Type.STRING, description: "The name of the vendor or store." },
            date: { type: Type.STRING, description: "The date of the transaction in YYYY-MM-DD format." },
            total: { type: Type.NUMBER, description: "The final total amount on the receipt." },
            items: {
              type: Type.ARRAY,
              description: "A list of items purchased.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "The name of the item." },
                  price: { type: Type.NUMBER, description: "The price of the item." },
                },
                required: ['name', 'price'],
              },
            },
          },
          required: ['vendor', 'date', 'total'],
        },
      },
    });
    
    const jsonString = response.text;
    const parsedData = JSON.parse(jsonString);

    // Basic validation
    if (!parsedData.vendor || !parsedData.date || typeof parsedData.total !== 'number') {
      throw new Error("Parsed data is missing required fields.");
    }
    
    return parsedData as ReceiptData;

  } catch (error) {
    console.error("Error parsing receipt:", error);
    throw new Error("Failed to analyze the receipt. The image might be unclear or not a valid receipt.");
  }
}
