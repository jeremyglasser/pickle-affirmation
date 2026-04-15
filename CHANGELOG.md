# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0]

### Changed
- Replaced similarity-based duplicate detection with prompt-injected recent history. The last 20 affirmations and jokes are now included directly in the generation prompt, giving the AI explicit context to avoid repetition and produce more diverse results.
- Simplified `geminiService.generateText` by removing the unused `allExistingContent` parameter and fixing a broken `Set.entries.join` call.

## [1.2.0]

### Added
- Implemented a fuzzy matching logic (Jaccard similarity) for Gemini-generated jokes and affirmations to prevent duplicates with slight variations. The generation process now auto-retries (up to 3 times) if the new text has an 80% or higher word overlap with any previously generated or canned item.

## [1.1.0]

### Added
- Created the ability to generate and display puns/jokes.
- Added an application version number display.
- Included an AI disclaimer note.

## [1.0.0]

### Added
- Initial release of the Pickle Affirmation application.
