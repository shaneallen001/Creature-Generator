import { processWithGemini, processWithOpenAI } from '../ai-handler.js';

export class ActorGenerationForm extends FormApplication {
    constructor(object = {}, options = {}) {
        super(object, options);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "ai-npc-generator-form",
            classes: ["dialog", "ai-npc-generator"],
            title: game.i18n.localize("FVTT_AI_NPC_GENERATOR.Dialog.Title"),
            template: "modules/fvtt-ai-npc-generator/templates/actor-generation-form.hbs",
            width: 600,
            height: "auto",
            resizable: true,
            closeOnSubmit: false, // We'll handle submission and closing manually
            submitOnChange: false,
        });
    }

    getData(options) {
        const context = super.getData(options);
        context.defaultMonsterData = { // From macro, good defaults
            name: "Undead Clown",
            cr: 3,
            type: "undead",
            subtype: "clown",
            alignment: "Chaotic Evil",
            description: "A horrifying Undead Clown (CR 3). It attacks with an acid-squirting lapel flower and a surprisingly powerful clown shoe kick. It should have undead traits like Undead Fortitude and poison immunity."
        };
        context.aiProviders = {
            gemini: "Gemini",
            openai: "OpenAI (Not yet implemented)"
        };
        context.chosenProvider = 'gemini'; // Default to Gemini
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('button[name="generate"]').click(this._onGenerate.bind(this));
    }

    async _onGenerate(event) {
        event.preventDefault();
        const formElement = this.form;
        const formData = new FormDataExtended(formElement).object;

        const name = formData.monsterName;
        const cr = parseFloat(formData.cr);
        const type = formData.monsterType;
        const subtype = formData.monsterSubtype;
        const alignment = formData.alignment;
        const description = formData.description;
        const aiProvider = formData.aiProvider;

        if (!name || !description) {
            ui.notifications.warn("Name and Description are required.");
            return;
        }
        
        const userStructuredPrompt = `
Monster Name: ${name}
CR: ${cr}
Type: ${type}
Subtype: ${subtype}
Alignment: ${alignment}
Description/Key Features: ${description}
Specific Attacks to include (if any mentioned in description, otherwise up to you based on concept):
${subtype === 'clown' ? 
`1. Acid-Squirting Lapel Flower (ranged attack, acid damage).
2. Powerful Clown Shoe Kick (melee attack, bludgeoning damage).` : ''}
Include Undead Fortitude, Poison Immunity, and relevant Condition Immunities if type is undead.
Base other stats on CR and concept.
`;

        ui.notifications.info(`Sending prompt to ${aiProvider === 'gemini' ? 'Gemini' : 'OpenAI'}...`);
        
        let actorJson;
        if (aiProvider === 'gemini') {
            actorJson = await processWithGemini(userStructuredPrompt, name);
        } else if (aiProvider === 'openai') {
            actorJson = await processWithOpenAI(userStructuredPrompt, name); // Will show 'not implemented'
        } else {
            ui.notifications.error("Invalid AI Provider selected.");
            return;
        }

        if (actorJson) {
            try {
                // Logic from macro to prepare and create actor
                const actorDataToCreate = {
                    name: actorJson.name || name,
                    type: "npc", // dnd5e type
                    img: actorJson.img || "icons/svg/mystery-man.svg",
                    system: actorJson.system || {},
                    items: actorJson.items || [],
                    prototypeToken: actorJson.prototypeToken || {}
                };

                if (!actorDataToCreate.prototypeToken.name) {
                    actorDataToCreate.prototypeToken.name = actorDataToCreate.name;
                }
                if (!actorDataToCreate.prototypeToken.texture?.src) {
                     actorDataToCreate.prototypeToken.texture = { src: actorDataToCreate.img || "icons/svg/mystery-man.svg" };
                }
                if (!actorDataToCreate.prototypeToken.sight) {
                    actorDataToCreate.prototypeToken.sight = { enabled: true, range: 0, visionMode: "basic" };
                }
                if (actorDataToCreate.system?.attributes?.senses?.darkvision > 0 && actorDataToCreate.prototypeToken.sight.visionMode === "basic") {
                    actorDataToCreate.prototypeToken.sight.visionMode = "darkvision";
                    actorDataToCreate.prototypeToken.sight.range = actorDataToCreate.system.attributes.senses.darkvision;
                }

                if (actorDataToCreate.items && Array.isArray(actorDataToCreate.items)) {
                    actorDataToCreate.items.forEach(item => {
                        if (!item._id || item._id.length !== 16 || !/^[a-z0-9]+$/i.test(item._id)) {
                            item._id = foundry.utils.randomID(16); // Ensure valid _id
                        }
                    });
                }
                
                console.log("AI NPC Generator | Data for Actor.create():", actorDataToCreate);
                await Actor.create(actorDataToCreate);
                ui.notifications.info(`Actor "${actorDataToCreate.name}" created! Check Actors Directory.`);
                this.close(); // Close form on successful creation
            } catch (e) {
                 console.error("AI NPC Generator | Error creating actor from JSON:", e);
                 ui.notifications.error("Error creating actor from JSON. Check console (F12) for details.");
            }
        }
    }

    // We are not using _updateObject for typical form submission, 
    // as the main action is handled by the 'Generate' button.
    async _updateObject(event, formData) {
        // This can be left empty or used for other purposes if needed.
    }
}
