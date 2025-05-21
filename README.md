# Foundry VTT AI NPC Generator

This module for Foundry Virtual Tabletop allows Game Masters to generate Non-Player Characters (NPCs) and Monsters using AI services for Dungeons & Dragons 4th Edition (v4.3.7 system). It currently supports configuration for Gemini and OpenAI API keys.

## Features

*   Allows configuration of Gemini and OpenAI API keys through the module settings.
*   (Future) Generate detailed NPC and Monster actors directly within Foundry VTT.

## Installation

1.  Download the module package (e.g., as a zip file).
2.  Extract the `fvtt-ai-npc-generator` folder into your `Data/modules/` directory in your Foundry VTT user data path.
3.  Launch Foundry VTT and enable the "AI NPC Generator" module in your world's module management settings.

## Configuration

To use the AI generation features (once implemented), you will need to provide API keys for the desired AI services:

1.  In Foundry VTT, go to the "Settings" tab (gear icon).
2.  Click on "Module Settings".
3.  Find the "AI NPC Generator" section.
4.  Click on "API Keys" (or a similarly named button that opens the custom settings).
5.  Enter your Gemini API Key and/or OpenAI API Key in the respective fields.
6.  Click "Save Changes".

The module will use these keys to authenticate with the AI services.

## System Compatibility

*   **Foundry VTT:** Version 12 and later.
*   **Game System:** Dungeons & Dragons 4th Edition (dnd4e system, tested with v4.3.7).

## Contributing

Contributions are welcome! If you have ideas for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
