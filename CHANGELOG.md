# Change Log

## [0.0.1]
- Initial release

## [0.0.2]
- Added a command for creating drafts with user-selected templates
- Added a command for publishing drafts as posts
    - Implemented functionality to move and rename draft files upon publishing
- Implemented filename uniqueness checks with numeric suffixes (e.g., '-1') to ensure unique filenames

## [0.0.3]
- Migrated from "commonjs" and "es6" to "Node16" and "ES2022"
- Added "Title Case" function for the provided front matter title
- Updated `getDateTime()` and `getDate()` function to use `toISOString()` for ISO 8601 format with local time zone detection
- Updated PostSnippet template to use variables for greater flexibility
- Updated Publish button to:
  - Set current date and time in the front matter
  - Update filename format to include the front matter title
  - Implemented draft file checking for unsaved changes
- General source code refactor and cleanup
- Added extensive comments to improve code readability and maintainability
- Enhanced error handling with centralized `handleError` function

## [Unreleased]
- 
