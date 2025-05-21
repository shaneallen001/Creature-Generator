# Foundry VTT AI NPC Generator

This module for Foundry Virtual Tabletop allows Game Masters to generate Non-Player Characters (NPCs) and Monsters using AI services, primarily focused on Dungeons & Dragons 5th Edition. It supports configuration for Gemini and OpenAI API keys, with current generation functionality implemented for Gemini.

## Features

*   Configuration of Gemini and OpenAI API keys via module settings.
*   **AI Actor Generation**: A button in the Actors Directory allows GMs to open a dialog, input monster/NPC parameters (name, CR, type, description, etc.), and generate a D&D 5e actor stat block using the configured Gemini API.
*   (Placeholder for OpenAI generation is included but not yet functional).

## Installation

1.  Ensure you are using Foundry VTT version 12 or later and the D&D 5e (`dnd5e`) game system.
2.  Download the module package (e.g., as a zip file from the releases page).
3.  Extract the `fvtt-ai-npc-generator` folder into your `Data/modules/` directory in your Foundry VTT user data path.
4.  Launch Foundry VTT and enable the "AI NPC Generator" module in your world's module management settings.

## Configuration

To use the AI generation features, you need to provide API keys:

1.  In Foundry VTT, go to the "Settings" tab (gear icon).
2.  Click on "Module Settings".
3.  Find the "AI NPC Generator" section.
4.  Click on "API Keys" (this opens the custom settings menu for this module).
5.  Enter your Gemini API Key in the respective field. The OpenAI API Key field is available for future use.
6.  Click "Save Changes".

The module will use these keys to authenticate with the AI services. Currently, only the Gemini API key is used for generation.

## How to Generate an Actor

1.  **Ensure your Gemini API key is configured** (see Configuration above).
2.  Navigate to the "Actors" tab in the right-hand sidebar.
3.  Click the "**AI Generate Actor**" button located in the header of the Actors Directory.
4.  The "Generate Actor with AI" dialog will appear.
    *   Fill in the desired parameters for your creature: Name, CR, Type, Subtype, Alignment, and a detailed Description including any specific features or attacks you want. The more detail you provide in the description, the better the AI can tailor the result.
    *   The "AI Provider" will default to Gemini. OpenAI is listed but not yet functional.
5.  Click the "**Generate**" button.
6.  The module will send the request to the Gemini API. This may take a few moments.
7.  If successful, a new actor will be created in your Actors Directory, and a notification will appear.
8.  Check the console (F12) for detailed logs, especially if you encounter issues.

**A Note on AI Generation:**
The AI strives to create a complete stat block based on your description and the D&D 5e system rules. However, for very complex creatures or highly specific abilities, the generated output may sometimes require manual review and adjustment. If you encounter issues with actor creation:
*   Try simplifying your request or rephrasing parts of the description.
*   Check the F12 browser console. The module logs the raw JSON received from the AI and any errors from Foundry VTT during actor creation, which can be helpful for debugging.
*   Ensure your API key is correctly entered and has sufficient quota.

## System Compatibility

*   **Foundry VTT:** Version 12 and later.
*   **Game System:** Dungeons & Dragons 5th Edition (`dnd5e`).

## Contributing

Contributions, bug reports, and feature suggestions are welcome! Please open an issue or submit a pull request on the project repository.

## License

This project is licensed under the [MIT License](LICENSE).
