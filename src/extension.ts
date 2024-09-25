import * as vscode from 'vscode';
import * as path from 'path';
import { formatFilename, getTitleFromUser, openFile, createFile, processDraft, findTemplate } from './utils';

// Activates the extension and registers commands
export function activate(context: vscode.ExtensionContext) {
    // Register command to create a new Jekyll post
    const postDisposable = vscode.commands.registerCommand('extension.jekyllhelper.createPost', async (uri: vscode.Uri) => {
        // Directory path where the new post will be created
        const dirName = uri.fsPath;
        // Flag indicating that this is a post (not a draft)
        const isPost = true;
        try {
            // Find the user-selected template for the new post
            const userTemplateFile = await findTemplate(dirName);
            // Prompt the user to enter the title of the new post
            const title = await getTitleFromUser(isPost);
            // Format the filename based on the user's title input
            const userFilePath = formatFilename(title);
            // Create the new file using the selected template or default snippet
            const createdFile = await createFile(dirName, title, userFilePath, userTemplateFile);
            // Open the newly created post file in the editor
            await openFile(createdFile);
        } catch (err) {
            // Handle any errors that occur during the process
            handleError(err); 
        }
    });

    // Register command to create a new Jekyll draft
    const draftDisposable = vscode.commands.registerCommand('extension.jekyllhelper.createDraft', async (uri: vscode.Uri) => {
        const dirName = uri.fsPath;
        const isPost = false;
        try {
            const userTemplateFile = await findTemplate(dirName);
            const title = await getTitleFromUser(isPost);
            const userFilePath = formatFilename(title);
            const createdFile = await createFile(dirName, title, userFilePath, userTemplateFile);
            await openFile(createdFile);
        } catch (err) {
            handleError(err);
        }
    });

    // Register command to publish a Jekyll draft
    const publishDisposable = vscode.commands.registerCommand('extension.jekyllhelper.publishDraft', async (uri: vscode.Uri) => {
        try {
            // Check if there are unsaved changes in the file
            const document = await vscode.workspace.openTextDocument(uri);
            if (document.isDirty) {
                // Notify the user that there are unsaved changes
                vscode.window.showInformationMessage('You have unsaved changes in the file. Please save the file before publishing.');
                return; // Stop further execution
            }
    
            const draftPath = uri.fsPath;
            // Directory of the draft file
            const draftDir = path.dirname(draftPath);
            // Target directory for published posts
            const postDir = path.resolve(draftDir, '../_posts');
    
            // Process the draft
            const postPath = await processDraft(draftPath, postDir);
    
            // Notify the user that the draft has been successfully published
            vscode.window.showInformationMessage(`Draft published: ${path.basename(postPath)}`);
        } catch (error: unknown) {
            // Handle the error properly
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('An unknown error occurred.');
            }
        }
    });
    
    
    // Add the registered commands to the extension's subscription list
    context.subscriptions.push(postDisposable);
    context.subscriptions.push(draftDisposable);
    context.subscriptions.push(publishDisposable);
}

// Centralized error handling function
// Displays an error message to the user
function handleError(err: unknown) {
    if (err instanceof Error) {
        // Show the error message if it is an instance of Error
        vscode.window.showErrorMessage(err.message); 
    } else {
        // Show a generic error message for unexpected errors
        vscode.window.showErrorMessage('An unexpected error occurred.');
    }
}
