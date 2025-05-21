// AI Handler for FVTT AI NPC Generator

const GEMINI_MODEL = "gemini-1.5-flash-latest"; // As used in the macro

export const processWithGemini = async (userPrompt, defaultName) => {
    const apiKey = game.settings.get('fvtt-ai-npc-generator', 'geminiApiKey');
    if (!apiKey) {
        ui.notifications.error("Gemini API Key not set in module settings.");
        return null;
    }

    // System instruction largely taken from the user's macro.
    // It's for D&D 5e, which is now the target.
    const systemInstruction = `You are an expert D&D 5e monster designer and a Foundry VTT data architect.
Your task is to generate a complete and valid JSON object representing a D&D 5e monster stat block for Foundry VTT, specifically for the "dnd5e" system.
The output MUST be a single, valid JSON object and NOTHING ELSE. Do not include any explanatory text, markdown backticks like \`\`\`json, or any content outside of the JSON structure.

The JSON structure should follow this Foundry VTT Actor data model:
- "name": (string)
- "type": "npc"
- "img": "icons/svg/mystery-man.svg" (placeholder for actor sheet image)
- "system": {
  "abilities": { /* e.g., "str": {"value": 10, "proficient": 0} ... */ },
  "attributes": {
    "ac": { "calc": "default", "flat": null }, /* Use "default" if items provide AC, "natural" with "flat" value otherwise */
    "hp": { "value": 45, "max": 45, "formula": "6d8+18" }, /* Adjust HP based on CR */
    "movement": { "walk": 30, "units": "ft" },
    "senses": { "darkvision": 60, "units": "ft" }
  },
  "details": { "cr": 3, "alignment": "Chaotic Evil", "type": { "value": "undead", "subtype": "clown" }, "biography": {"value": "<p>A terrifying clown brought back from the dead, its laughter now an echo of despair. It uses its macabre props as deadly weapons.</p>"} },
  "traits": { "size": "med", "languages": { "value": ["common", "orcish"], "custom": "" }, "di": {"value":["poison"]}, "dr":{"value":[]}, "dv":{"value":[]}, "ci":{"value":["charmed", "exhaustion", "frightened", "paralyzed", "poisoned"]} },
  "skills": { /* e.g. "prf": {"ability":"cha", "value": 1}, "ste": {"ability":"dex", "value":1} */ }
},
"items": [ /* THIS IS CRITICAL. Populate this array with weapons, armor, and features. Each item MUST have a unique 16-character LOWERCASE alphanumeric "_id". */
  /* Example Feature (Undead Fortitude):
    {
      "_id": "undeadfort1tude", // ACTUAL 16-CHAR ID
      "name": "Undead Fortitude",
      "type": "feat",
      "img": "icons/magic/death/undead-risen-bone-skull.webp",
      "system": {
        "description": { "value": "<p>If damage reduces the undead to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the undead drops to 1 hit point instead.</p>" },
        "identifier":"undead-fortitude",
        "type": {"value":"monster"}
      }
    }
  */
],
"prototypeToken": { "texture": { "src": "icons/svg/mystery-man.svg" }, "sight": {"enabled": true, "range": 60, "visionMode": "darkvision"}, "name": "" }

CRITICAL:
1. All "_id" fields for items MUST be unique, 16-character, lowercase alphanumeric strings.
2. For weapon items, "system.damage.base" should only contain base weapon dice. Additional damage (like elemental or poison) should be in "system.activities.YOUR_ACTIVITY_KEY.damage.parts" as an array of objects, each with "number", "denomination", "types" (array), and "bonus". Set "includeBase": true if you want the base weapon damage, or false if the parts array defines all damage.
3. Ensure "system.abilities.xxx.proficient" is 0 or 1 for saving throw proficiency.
4. "system.attributes.hp.formula" must be a dice formula.
5. "system.attributes.ac.calc" should be "default" if armor is equipped in items (list as an item with "type": "equipment", "system.armor.value", and "system.equipped": true), or "natural" with a "flat" value otherwise.
6. Base all stats (abilities, HP, AC, attack bonuses, damage dice) on the requested CR and creature type/concept.
7. Include the specific attacks and traits requested by the user as items in the "items" array.

User's request:
---
${userPrompt}
---
Generate ONLY the JSON object.
`;

    const requestBody = {
      contents: [{
        parts: [{ text: systemInstruction }]
      }],
      generationConfig: {
        temperature: 0.75, // As in macro
      }
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("AI NPC Generator | Gemini API Error:", errorData);
            ui.notifications.error(`Gemini API Error: ${errorData.error?.message || response.statusText}. Check console (F12).`);
            return null;
        }

        const data = await response.json();

        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.error("AI NPC Generator | Unexpected Gemini API response structure:", data);
            ui.notifications.error("Unexpected response from Gemini. Check console (F12).");
            return null;
        }

        let jsonString = data.candidates[0].content.parts[0].text;
        // Remove markdown backticks if present
        const markdownMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        if (markdownMatch?.[1]) {
            jsonString = markdownMatch[1];
        }

        console.log("AI NPC Generator | Raw JSON from Gemini:", jsonString);

        try {
            const actorJson = JSON.parse(jsonString);
            console.log("AI NPC Generator | Parsed Actor JSON:", actorJson);
            return actorJson;
        } catch (e) {
            console.error("AI NPC Generator | Error parsing JSON from Gemini:", e);
            ui.notifications.error("Failed to parse JSON from Gemini. Check console (F12) for raw response and error.");
            return null;
        }

    } catch (error) {
        console.error("AI NPC Generator | Error during Gemini API call:", error);
        ui.notifications.error("Error communicating with Gemini API. Check console (F12).");
        return null;
    }
};

// Placeholder for OpenAI functionality
export const processWithOpenAI = async (userPrompt, defaultName) => {
    const apiKey = game.settings.get('fvtt-ai-npc-generator', 'openAiApiKey');
    if (!apiKey) {
        ui.notifications.error("OpenAI API Key not set in module settings.");
        return null;
    }
    console.warn("AI NPC Generator | processWithOpenAI is a placeholder and not yet implemented.");
    ui.notifications.warn("OpenAI processing is not yet implemented in this module.");
    // TODO: Implement actual OpenAI API call and processing
    // const systemInstruction = "You are an expert D&D 5e monster designer...";
    // const requestBody = { model: "gpt-3.5-turbo", messages: [{role:"system", content: systemInstruction},{role:"user", content: userPrompt}]};
    // ... fetch ...
    return null;
};
