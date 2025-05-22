import { ActorGenerationForm } from './ui/actor-generation-form.js';

class MySettingsSubmenu extends FormApplication {
    constructor(...args) {
        super(...args);
        console.log('AI NPC Generator | MySettingsSubmenu constructor called');
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "fvtt-ai-npc-generator-settings",
            classes: ["fvtt-ai-npc-generator"],
            title: "FVTT_AI_NPC_GENERATOR.Settings.Menu.Title", // Placeholder
            template: "modules/fvtt-ai-npc-generator/templates/settings.hbs",
            width: 600,
            height: "auto",
            closeOnSubmit: true
        });
    }

    getData(options) {
        const data = super.getData(options);
        data.geminiApiKey = game.settings.get('fvtt-ai-npc-generator', 'geminiApiKey');
        data.openAiApiKey = game.settings.get('fvtt-ai-npc-generator', 'openAiApiKey');
        return data;
    }

    async _updateObject(event, formData) {
        if (formData.geminiApiKey !== undefined) {
            await game.settings.set('fvtt-ai-npc-generator', 'geminiApiKey', formData.geminiApiKey);
        }
        if (formData.openAiApiKey !== undefined) {
            await game.settings.set('fvtt-ai-npc-generator', 'openAiApiKey', formData.openAiApiKey);
        }
        // this.render(); // FormApplication.render is called by the system after _updateObject resolves
    }

    async _renderInner(data) {
        console.log('AI NPC Generator | MySettingsSubmenu _renderInner called');
        return super._renderInner(data);
    }
}

Hooks.once('init', async function() {
    console.log('AI NPC Generator | Initializing AI NPC Generator');

    game.settings.register('fvtt-ai-npc-generator', 'geminiApiKey', {
        name: 'GEMINI_API_KEY_NAME', // Placeholder, will be localized
        hint: 'GEMINI_API_KEY_HINT', // Placeholder, will be localized
        scope: 'world',     // This setting is stored on the world level
        config: true,       // This setting will appear in the Configure Settings menu
        type: String,
        default: '',        // Default value
        onChange: value => {
            console.log('AI NPC Generator | Gemini API Key changed');
        }
    });

    game.settings.register('fvtt-ai-npc-generator', 'openAiApiKey', {
        name: 'OPENAI_API_KEY_NAME', // Placeholder, will be localized
        hint: 'OPENAI_API_KEY_HINT', // Placeholder, will be localized
        scope: 'world',     // This setting is stored on the world level
        config: true,       // This setting will appear in the Configure Settings menu
        type: String,
        default: '',        // Default value
        onChange: value => {
            console.log('AI NPC Generator | OpenAI API Key changed');
        }
    });

    game.settings.registerMenu("fvtt-ai-npc-generator", "configureApiKeys", {
        name: "FVTT_AI_NPC_GENERATOR.Settings.Menu.Name", // Placeholder
        label: "FVTT_AI_NPC_GENERATOR.Settings.Menu.Label", // Placeholder
        hint: "FVTT_AI_NPC_GENERATOR.Settings.Menu.Hint", // Placeholder
        icon: "fas fa-key",
        type: MySettingsSubmenu, 
        restricted: true // Only GM can access
    });
    console.log('AI NPC Generator | Settings menu registration attempted for configureApiKeys');

    Hooks.on('renderActorDirectory', (app, html, data) => {
        console.log('AI NPC Generator | renderActorDirectory hook called. App ID:', app.id, 'App Element:', app.element);
        console.log('AI NPC Generator | HTML object:', html);

        if (!game.user.isGM) {
            console.log('AI NPC Generator | User is not GM, skipping button addition.');
            return;
        }

        try {
            const buttonText = game.i18n.localize("FVTT_AI_NPC_GENERATOR.ActorDirectory.ButtonLabel");
            const button = $(`<button class="ai-npc-generator-button"><i class="fas fa-brain"></i> ${buttonText}</button>`);
            
            button.on('click', (event) => {
                event.preventDefault();
                new ActorGenerationForm().render(true);
            });

            // Add button to the directory header
            const headerActions = html.find('.directory-header .header-actions');
            console.log('AI NPC Generator | Found .directory-header .header-actions:', headerActions);
            
            let targetElement = headerActions;
            if (headerActions.length === 0) {
                console.log('AI NPC Generator | .directory-header .header-actions not found, trying fallback .directory-header');
                const fallbackHeader = html.find('.directory-header');
                console.log('AI NPC Generator | Fallback .directory-header:', fallbackHeader);
                targetElement = fallbackHeader;
            }

            if (targetElement.length > 0) {
                targetElement.append(button);
                console.log('AI NPC Generator | Button appended to target element:', targetElement);
            } else {
                console.error('AI NPC Generator | Could not find a suitable element to append the button.');
            }
        } catch (e) {
            console.error('AI NPC Generator | Error adding button to ActorDirectory:', e);
        }
    });
});
