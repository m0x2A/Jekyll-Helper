# Change Log

## [0.0.1]
- Initial release

## [0.0.2]
- Added a command for creating drafts with user-selected templates
- Added a command for publishing drafts as posts
    - Implemented functionality to move and rename draft files upon publishing
- Implemented filename uniqueness checks with numeric suffixes (e.g., '-1') to ensure unique filenames

## [0.0.3] - 2024-09-26
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

## [0.0.4] - 2024-10-01
- Updated README with further usage and development instructions

## [Unreleased]
- 

## Tags
See the full list of [tags](https://gitlab.com/m0x2A/jekyll-helper/-/tags) for each version. Click on a version to view its associated commits for more details on the changes made.