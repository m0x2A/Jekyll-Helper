import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';


// Function to get the current date and time formatted with timezone offset
export function getDateTime(): string {
  const date = new Date();
  const isoString = date.toISOString(); // Returns format: YYYY-MM-DDTHH:MM:SS.sssZ
  
  // Split to get the date and time parts separately
  const [yyyyMMdd, time] = isoString.split('T');
  
  // Get the time without milliseconds and append the timezone offset
  const formattedTime = time.slice(0, 8); // Extract only HH:MM:SS from time

  // Get the timezone offset in the format ±HH:MM
  const timeZoneOffsetMinutes = -date.getTimezoneOffset(); // Offset in minutes
  const sign = timeZoneOffsetMinutes >= 0 ? '+' : '-';
  const timeZoneOffsetHours = Math.abs(Math.floor(timeZoneOffsetMinutes / 60)).toString().padStart(2, '0');
  const timeZoneOffsetMinutesRest = Math.abs(timeZoneOffsetMinutes % 60).toString().padStart(2, '0');

  return `${yyyyMMdd} ${formattedTime} ${sign}${timeZoneOffsetHours}${timeZoneOffsetMinutesRest}`;
}

// Function to get the current date formatted
export function getDate(): string {
  const date = new Date();
  // Use .toISOString() to get YYYY-MM-DDTHH:MM:SSZ and then slice only the date part, returns YYYY-MM-DD
  return date.toISOString().split('T')[0];
}


// Function to create a new file with a unique filename in the specified directory
export async function createFile(dirName: string, title: string, newFileName: string, userTemplateName: string): Promise<string> {
  // Get the workspace folders
  const folders = vscode.workspace.workspaceFolders;
  // Find the folder that matches the provided directory name
  const folder = folders?.filter(f => dirName.indexOf(f.uri.fsPath) !== -1)[0];
  // If the folder is not found or the directory name is null or undefined, return the new file name
  if (folder === undefined || dirName === null || dirName === undefined) {
    return newFileName;
  }
  // If the directory is actually a file, get its parent directory
  if (!fs.lstatSync(dirName).isDirectory() && fs.lstatSync(dirName).isFile()) {
    dirName = path.dirname(dirName);
  }

  // Check if file already exists and modify filename if necessary
  let filename = path.resolve(dirName, newFileName);
  let counter = 0;
  // Define filename without extension
  const fileBaseName = path.parse(newFileName).name; 
  // Define filename extension
  const fileExtension = path.parse(newFileName).ext; 
 
  while (fs.existsSync(filename)) {
    counter++;
    newFileName = `${fileBaseName}-${counter}${fileExtension}`;
    filename = path.resolve(dirName, newFileName);
  }

  // Resolve the template path based on user-specified template name
  const templateName: string = vscode.workspace.getConfiguration().get('jekyllhelper.template.path') + "/" + userTemplateName;
  const templatePath = path.resolve(folder.uri.fsPath, templateName);

  // Check if the specified template file exists and is a file
  let templateExists = false;
  if (templatePath && fs.existsSync(templatePath) && fs.lstatSync(templatePath).isFile()) {
    templateExists = true;
  }

  // Default front matter snippet
  let postSnippet: string =
`---
layout: $\{1:post}
title: "\${title}"
date: \${date}
category: $\{2}
author: $\{3}
tags: [$\{4}]
description: "$\{5}"
---

$\{6}`;

  // If using a template, set snippet to it, otherwise use the default snippet
  if (templateExists) {
    postSnippet = fs.readFileSync(templatePath, 'utf8');
  }

  // Set current date and time for front matter snippet
  const currentDate = getDateTime(); 
  // Set variables for front matter snippet
  const variables = {
    title: formatTitle(title),
    date: currentDate,
  };

  // Replace title and date variables in front matter snippet
  const content = replaceTemplateVariables(postSnippet, variables);

  // Write the file
  fs.writeFileSync(filename, content);

  // Return the full path of the created or existing file
 return filename;
}

// Function to replace variables in the template
function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
 return template.replace(/\${(.*?)}/g, (_, variable) => variables[variable] || '');
}

// Function to format provided title by the user to Title Case
function formatTitle(title: string): string {
  const lowerCaseWords = ['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'on', 'in', 'with', 'of', 'at', 'for', 'by', 'to', 'up', 'down', 'from'];

  return title
  // Convert the entire string to lowercase first
  .toLowerCase()
  // Split the string into words
  .split(' ')
  .map((word, index, wordsArray) => {
      // Capitalize the first and last word regardless of the lowerCaseWords list
      if (index === 0 || index === wordsArray.length - 1) {
        return capitalize(word);
        }
      // If the word is not in the lowercase list, capitalize it
      if (!lowerCaseWords.includes(word)) {
        return capitalize(word);
      }
        // Otherwise, keep the word in lowercase
     return word;
  })
  // Join the words back into a string
  .join(' '); 
}

// Function to capitalize the words for Title Case
function capitalize(word: string): string {
 return word.charAt(0).toUpperCase() + word.slice(1);
}


// Function to open a file in the editor
export async function openFile(filename: string): Promise<vscode.TextEditor> {
  // Synchronously check the file system stats for the given filename
  const stats = fs.statSync(filename);

  // If the given path is a directory, throw an error
  if (stats.isDirectory()) {
    throw new Error("This file is a directory!");
  }

  // Open the file in VS Code as a text document
  const doc = await vscode.workspace.openTextDocument(filename);
  // If the document couldn't be opened, throw an error
  if (!doc) {
    throw new Error('Could not open file!');
  }

  // Show the opened text document in the VS Code editor window
  const editor = vscode.window.showTextDocument(doc);
  // If the editor window fails to display the document, throw an error
  if (!editor) {
    throw new Error('Could not show document!');
  }
 return editor;
}


// Function to prompt the user for a title
export async function getTitleFromUser(isPost: boolean): Promise<string> {
  // Determine whether to ask for a post or draft title based on the isPost flag
  const type = isPost ? 'post' : 'draft';

  // Display an input box to the user with a prompt and placeholder
  // 'prompt' informs the user what input is expected
  // 'placeHolder' shows example text in the input box to guide the user
  // 'ignoreFocusOut' ensures that the input box stays active even if the user clicks outside of it
  const title = await vscode.window.showInputBox({
    prompt: `Enter the title of your new ${type}`,
    placeHolder: 'Title of your new post',
    ignoreFocusOut: true,
  });

  // If no title is provided by the user (i.e., they cancel or leave it empty), throw an error
  if (!title) {
    throw new Error('No title provided.');
  }

  return title;
}


// Function to format the filename based on user input (replacing spaces with dashes, lowercase)
export function formatFilename(title: string): string {
  const formattedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric characters with hyphen
    .replace(/(^-|-$)/g, '');     // Remove leading or trailing hyphens

  // Add date for posts only
  const datePrefix = getDate();  

  // Return the final filename
  return `${datePrefix}-${formattedTitle}.md`;        
}


// Function to find a template file
export async function findTemplate(dirName: string): Promise<string> {
  // Retrieve the template folder path from the Jekyll Helper extension's configuration settings
  const tFolder = vscode.workspace.getConfiguration().get<string>('jekyllhelper.template.path');
  // Get the list of workspace folders in the current project
  const folders = vscode.workspace.workspaceFolders;
  // Filter to find the workspace folder that matches the given directory name
  const wsFolder = folders?.filter(f => dirName.indexOf(f.uri.fsPath) !== -1)[0];
  
  // If no template folder is configured or no matching workspace folder is found, return an empty string
  if (!tFolder || !wsFolder) {
    return "";
  }
  
  // Find all files within the template folder, excluding certain directories (node_modules, archetypes)
  const templates = await vscode.workspace.findFiles(`${tFolder}/**/*`, "**/node_modules/**,**/archetypes/**");
  // If no template files are found, return an empty string
  if (!templates || templates.length === 0) {
    return "";
  }
  // If only one template is found, return its basename (the filename without the path)
  if (templates.length === 1) {
    return path.basename(templates[0].fsPath);
  }

  // If multiple templates are found, show a dropdown list to the user to select one
  const selectedTemplate: vscode.QuickPickItem | undefined = await vscode.window.showQuickPick(
    templates.map(t => ({
      label: path.basename(t.fsPath),    // Display the template's basename as the label
      description: t.fsPath              // Display the full path of the template as the description
    })),
    {
      placeHolder: `Select the template to use`   // Placeholder text in the dropdown
    }
  );

  // Return the label of the selected template or an empty string if none selected
  return selectedTemplate ? selectedTemplate.label : "";
}


export async function updateDate(postContent: string): Promise<string> {
  // Check if the 'date' field exists and is in the format 'YYYY-MM-DD HH:MM:SS ±HHMM'
  if (/date:\s*\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \+\d{4}/.test(postContent)) {
    // Replace the existing date field with the current date and time in the format 'YYYY-MM-DD HH:MM:SS ±HHMM'
    postContent = postContent.replace(/date:\s*\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \+\d{4}/, `date: ${getDateTime()}`);
  // If the 'date' field exists but is only in the format 'YYYY-MM-DD'
  } else if (/date:\s*\d{4}-\d{2}-\d{2}/.test(postContent)) {
    // Replace the existing date field with the current date and time in the full format
    postContent = postContent.replace(/date:\s*\d{4}-\d{2}-\d{2}/, `date: ${getDateTime()}`);
  // If there is no 'date' field in the front matter
  } else {
    // Add the 'date' field with the current date and time at the beginning of the front matter section
    postContent = postContent.replace(/^---\n/, `---\ndate: ${getDateTime()}\n`);
  }

  return postContent;
}

export async function processDraft(draftPath: string, postDir: string): Promise<string> {
  // Read the content of the draft file
  let postContent = await fsPromises.readFile(draftPath, 'utf8');
  // Debug log
  //console.log('Original post content read from draft:', postContent);

  // Update the 'date' field in the front matter with the current date and time
  postContent = await updateDate(postContent);
  // Debug log
  //console.log('Updated date in postContent:', postContent);

  // Extract the title from the front matter using a regular expression
  const titleMatch = postContent.match(/title:\s*"(.+?)"/);
  // Get the extracted title from the match result or set to null if not found
  const newTitle = titleMatch ? titleMatch[1] : null;

  // If the title is not found in the front matter, throw an error
  if (!newTitle) {
      throw new Error("Title not found in the front matter.");
  }

  // Format the new filename based on the extracted title
  const postFileName = await formatFilename(newTitle)

  // Construct the new file path by combining the posts directory and the new filename
  const postPath = path.resolve(postDir, postFileName);

  // Move the draft file from its current location to the posts directory with the new filename
  await moveFile(draftPath, postPath);

  // Write the updated front matter content to the new file path before moving
  await fsPromises.writeFile(postPath, postContent);
  // Debug log
  //console.log('postContent after writeFile:', postContent);
  
  // Verify that the file has been written correctly
  if (!fs.existsSync(postPath)) {
    throw new Error(`Failed to write updated content to ${postPath}`);
  }

  return postPath;
}

// Function to move a file from one location to another
export async function moveFile(srcPath: string, destPath: string): Promise<void> {
  // Attempt to rename (move) the file from srcPath to destPath
  await fsPromises.rename(srcPath, destPath);
  // Verify that the file has been successfully moved by checking if it exists at the destination path
  if (!fs.existsSync(destPath)) {
    // If the file does not exist at the destination, throw an error indicating the move operation failed
    throw new Error(`Failed to move file to ${destPath}`);
  }
}