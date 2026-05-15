# Gemini Caveman Extension 🦍

Ultra-compressed communication mode for Gemini CLI. Cuts ~75% of tokens while keeping full technical accuracy by making the AI speak like a caveman.

```bash
  gemini extensions link /home/christopher/Projects/gemini-caveman
```

## Features

- **Token Efficiency:** Saves tokens and context window space by removing fluff, pleasantries, and filler words.
- **Multiple Intensities:** Choose from `lite` (professional but tight) to `ultra` (maximum abbreviation)
- **Auto-Clarity:** Automatically drops caveman mode for security warnings or complex irreversible actions to ensure safety.
- **Custom Commands:** Built-in commands for ultra-compressed commit messages (`/caveman/commit`) and code reviews (`/caveman/review`).
- **Smart Context:** Automatically tracks your preferred mode across sessions using hooks.

## Installation

Clone this repository and add it to your Gemini CLI workspace or global extensions directory. The CLI will automatically load the commands and hooks.



## Usage

### The `/caveman` Command

Toggle or adjust the intensity of the caveman communication mode:

```bash
/caveman             # Activate default (full) caveman mode
/caveman lite        # No filler. Keep articles + full sentences
/caveman ultra       # Maximum abbreviation, strip conjunctions, use arrows
/caveman off         # Return to normal verbose communication
```

### Specialized Commands

- **`/caveman/commit`**
  Generate an ultra-compressed commit message in Conventional Commits format for your staged changes. No fluff, no "This commit does X".

- **`/caveman/review`**
  Generate terse, actionable code review comments. One line per finding.
  Format: `L<line>: <severity>: <problem>. <fix>.`

## Examples

**Standard AI:**
> "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by the fact that the token expiry check uses `<` instead of `<=`."

**Caveman (full):**
> "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"

**Standard Review:**
> "It looks like this function is doing a lot of things and might benefit from being broken up."

**Caveman Review:**
> `L88-140: 🔵 nit: 50-line fn does 4 things. Extract validate/normalize/persist.`

## How it Works

The extension uses Gemini CLI hooks (`SessionStart` and `BeforeAgent`) to inject the `GEMINI.md` rules and track your requested intensity level, ensuring the AI consistently applies the correct level of terseness across your session.
