import { ActorGenerationForm } from './ui/actor-generation-form.js';

class MySettingsSubmenu extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "fvtt-ai-npc-generator-settings",
            classes: ["fvtt-ai-npc-generator"],
            title: "FVTT_AI_NPC_GENERATOR.Settings.Menu.Title", // Placeholder
            template: "modules/fvtt-ai-npc-generator/templates/settings.hbs",
            width: 600,
            height: "auto",
            closeOnSubmit: true,
            tabs: [{ navSelector: ".tabs", contentSelector: ".content", initial: "general" }]
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
        this.render();
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

    Hooks.on('renderActorDirectory', (app, html, data) => {
        if (!game.user.isGM) {
            return;
        }

        const buttonText = game.i18n.localize("FVTT_AI_NPC_GENERATOR.ActorDirectory.ButtonLabel");
        const button = $(`<button class="ai-npc-generator-button"><i class="fas fa-brain"></i> ${buttonText}</button>`);
        
        button.on('click', (event) => {
            event.preventDefault();
            new ActorGenerationForm().render(true);
        });

        // Add button to the directory header
        let header = html.find('.directory-header .header-actions');
        if (header.length === 0) { // Fallback for some themes/systems
            header = html.find('.directory-header');
        }
        header.append(button);
    });
});
