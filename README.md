# Jekyll Helper - VSCode Extension

## Note
This is my first public VSCode extension project, and I welcome any constructive feedback, suggestions, or bug reports. Feel free to create an issue if you encounter any problems or have suggestions for improvement.

## About
**Jekyll Helper** simplifies the process of managing Jekyll blog posts directly from Visual Studio Code, streamlining tasks like creating drafts, publishing posts, and managing front matter metadata. This project is based on [Nor-s/front-matter-gen](https://github.com/Nor-s/front-matter-gen), itself a fork of [Abdillah/vscode-belikejekyll](https://github.com/Abdillah/vscode-belikejekyll) and [rohgarg/jekyll-post](https://github.com/rohgarg/jekyll-post).

### Changes Made
- **Added "Title Case" Function**: Implemented functionality to convert titles to title case in the front matter.
- **Added Draft Button**: Introduced a button for creating new drafts.
- **Added Publish Button**: Created a button for publishing drafts as posts.
- **Implemented Filename Uniqueness Checks**: Ensured unique filenames by adding numeric suffixes (e.g., '-1').
- **Refactored and Sanitized Core Source Code**: Improved, extended, and cleaned up the core code.
- **Modified Date Filename Pattern and File Extension Configuration**: Updated the filename format to include dates and customized file extension handling.

### Description
This VSCode extension adds intuitive buttons to simplify the creation, editing, and publishing of Jekyll blog posts and drafts. It enhances the workflow by providing pre-filled "front matter" templates and ensuring unique filenames for posts and drafts.

### Features
- **New Explorer Context Menu Options**:
	- **New Jekyll Post**: Creates a new blog post with front matter.
	- **New Jekyll Draft**: Creates a draft with front matter.
	- **Publish Jekyll Draft**: 
		- Checking if there are unsaved changes in the draft file before proceeding.
		- Adding the current date to both the filename and the front matter.
		- Updating the filename based on the title specified in the front matter.
		- Moving the file to the _posts directory.
- **Automatic Filename Generation**:
	- Adds the current date in `YYYY-MM-DD` format.
	- Sanitizes the title by replacing spaces with hyphens and converting it to lowercase.
	- Checks for filename uniqueness and adds numeric suffixes if necessary (e.g., `-1`, `-2`).
- **Title Case Conversion**: Automatically converts the user-provided title into Title Case in the front matter.
- **Customizable Templates**: Allows the use of custom templates for new posts and drafts. If no template is provided, a built-in default template is used.

## Usage Instructions
### Creating a New Post or Draft
1. **Enable the Extension**: Set `jekyllhelper.enabled` to `true` in your `settings.json` file.
2. **Right-click on a Directory**: Right-click on a folder in the VSCode Explorer.
	- **New Jekyll Post**: Creates a post with the current date in the filename.
	- **New Jekyll Draft**: Creates a draft with the current date in the filename.
3. **Select a Template**: If you have multiple templates, choose one from the list when prompted.
4. **Enter a Title**: Provide a title when prompted. The extension will use this title for both the front matter and the filename.
5. **Publish a Draft**: When ready to publish, right-click on the draft file and select "Publish Jekyll Draft" to convert it into a post. The extension will automatically add the current date and update the front matter title to match the filename.

### Providing a Custom Template
To provide a custom template for posts, place your template file in `.vscode/jekyll-helper-tmpl/{template-file}` relative to your project’s root directory.

Here's an example of a custom template:

```yaml
---
layout: post
title: "${title}"
date: ${date}
category: [cat1]
author: User
tags: [tag1, tag2]
description: ""
---
```

### Default Template
If no custom template is provided, the extension will use the following default template:

```yaml
---
layout: post
title: "${title}"
date: ${date}
category:
author:
tags: []
description: ""
---
```

## Requirements
This extension has been tested on Visual Studio Code and VSCodium (v1.93). Compatibility with earlier versions may not be guaranteed.

### Compile
Use the following settings for compiling:

`tsconfig.json`
```json
{
	"compilerOptions": {
		"module": "Node16",
		"target": "ES2022",
		"outDir": "out",
		"lib": [
			"ES2022"
		],
		"sourceMap": true,
		"rootDir": "src",
		"strict": true
	}
}

```

## Extension Settings
- `jekyllhelper.enabled`: Enable or disable the extension.
- `jekyllhelper.template.path`: Set the path to the directory containing template files.


## TODO
- Add functions for creating posts, drafts, and publishing drafts as commands in the command palette.
- Improve the Title Case function and add a configuration setting to disable it for non-English titles.
- Restrict buttons to function only within folders specified in the configuration (e.g., _posts, _drafts).
- Refactoring for DRY principle.

---

**Enjoy using Jekyll Helper!**


---

## Credits:

- [Nor-s/front-matter-gen](https://github.com/Nor-s/front-matter-gen)
- [rohgarg/jekyll-post](https://github.com/rohgarg/jekyll-post)
- [Abdillah/vscode-belikejekyll](https://github.com/Abdillah/vscode-belikejekyll)

- [Jekyll](https://jekyllrb.com)
---