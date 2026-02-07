import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHotdogCommentary = async (percentageEaten: number, isFinished: boolean, finishTimeMs?: number): Promise<string> => {
  try {
    let prompt = "";
    
    if (isFinished && finishTimeMs) {
      const seconds = (finishTimeMs / 1000).toFixed(2);
      prompt = `The user devoured an entire virtual hotdog in ${seconds} seconds. 
      If it was under 5 seconds, say something shocked about their speed. 
      If it was over 20 seconds, gently roast them for savoring it too much. 
      Otherwise, give a witty congratulatory remark. Keep it to 1 short sentence.`;
    } else if (percentageEaten < 20) {
      prompt = "The user just took their first bite of a virtual hotdog. Give a short, snappy, 1-sentence witty remark about the anticipation or the first taste.";
    } else if (percentageEaten > 80) {
      prompt = "The user has almost finished the hotdog. Give a short, 1-sentence funny warning about it almost being gone or asking if they are still hungry.";
    } else {
      prompt = `The user has eaten ${Math.round(percentageEaten)}% of a hotdog. Give a random, short, weirdly philosophical or funny 1-sentence thought about hotdogs, mustard, or the nature of snacking.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a witty, food-loving narrator observing someone eating a hotdog. Keep it light, funny, and very brief.",
        temperature: 1.2, // High creativity
      }
    });

    return response.text || "Tasty!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback messages if API fails
    if (isFinished) return "All gone! Delicious.";
    return "Mmm, chompy chomp.";
  }
};
