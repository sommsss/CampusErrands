const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// when ai fails to detect
function quickCheck(text) {
    const lower = (text || "").toLowerCase().trim();

    return {
        abusive: ["fuck", "idiot", "stupid", "bitch", "asshole"].some(w => lower.includes(w)),
        violence: ["kill", "killing", "murder", "attack", "hurt", "stab", "shoot"].some(w => lower.includes(w)),
        selfHarm: ["suicide", "kill myself", "end my life", "i want to die"].some(w => lower.includes(w)),
        alcohol: ["beer", "vodka", "cigarette", "smoke", "weed", "alcohol"].some(w => lower.includes(w))
    };
}

// AI moderation 
async function aiModerate(text) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a strict moderation system.

Text: "${text}"

Return ONLY JSON:
{
  "selfHarm": true/false,
  "violence": true/false,
  "abusive": true/false,
  "alcohol": true/false,
  "confidence": "low" | "medium" | "high"
}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (err) {
        console.error("AI ERROR:", err.message);
        return {
            selfHarm: false,
            violence: false,
            abusive: false,
            alcohol: false,
            confidence: "low"
        };
    }
}

module.exports = { quickCheck, aiModerate };