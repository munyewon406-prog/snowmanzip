import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeminiAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const snowmanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "눈사람에게 어울리는 창의적이고 재미있는 한국어 이름" },
    description: { type: Type.STRING, description: "포켓몬 도감 스타일의 짧고 재치 있는 한국어 설명" },
    type: { type: Type.STRING, description: "속성이나 스타일 (예: '클래식', '진흙', '추상적', '꼬마'). 한국어로 작성" },
    rarity: { 
      type: Type.STRING, 
      enum: ['Common', 'Uncommon', 'Rare', 'Legendary', 'Mythical'],
      description: "복잡도와 노력에 따른 희귀도 등급"
    },
    stats: {
      type: Type.OBJECT,
      properties: {
        creativity: { type: Type.INTEGER, description: "창의성 점수 1-100" },
        roundness: { type: Type.INTEGER, description: "동글동글함 점수 1-100" },
        accessories: { type: Type.INTEGER, description: "악세서리 활용 점수 1-100" },
        chillFactor: { type: Type.INTEGER, description: "분위기/여유 점수 1-100" },
        durability: { type: Type.INTEGER, description: "예상 내구도 점수 1-100" },
      },
      required: ["creativity", "roundness", "accessories", "chillFactor", "durability"]
    },
    funFact: { type: Type.STRING, description: "이 눈사람에 대한 재미있는 한국어 티엠아이(TMI)" }
  },
  required: ["name", "description", "type", "rarity", "stats", "funFact"]
};

export const analyzeSnowmanImage = async (base64Image: string): Promise<GeminiAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "이 눈사람 사진을 '눈사람 도감'용으로 분석해줘. 특징을 파악하고 판타지 RPG 스타일의 희귀도를 부여하며 능력치를 생성해줘. 모든 텍스트(이름, 설명, 타입, 재미있는 사실)는 반드시 한국어로 작성하고, 매우 재치 있고 창의적이어야 해."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: snowmanSchema,
        temperature: 0.8,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiAnalysisResult;
    }
    throw new Error("No text response from Gemini");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateSnowmanSticker = async (base64Image: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Transform this snowman into a cute, clean, flat vector art sticker. White background. Thick outline. Pokemon-style illustration. Minimalist and colorful."
          }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No sticker generated");
  } catch (error) {
    console.error("Sticker Generation Error:", error);
    return "";
  }
};
