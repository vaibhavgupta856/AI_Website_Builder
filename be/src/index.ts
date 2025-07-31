import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import {basePrompt as nodeBasePrompt} from "./defaults/node";
import {basePrompt as reactBasePrompt} from "./defaults/react";
import cors from "cors";

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const app = express();
app.use(cors())
app.use(express.json())

app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;
    
    try {
        const result = await model.generateContent([
            "Return either 'node' or 'react' based on what you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra.",
            prompt
        ]);
        
        const answer = result.response.text().trim().toLowerCase();
        console.log("Template decision:", answer, "for prompt:", prompt);
        
        if (answer === "react") {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            })
            return;
        }

        if (answer === "node") {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            })
            return;
        }

        // Default to react if unclear
        console.log("Unclear response, defaulting to react");
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        
    } catch (error: any) {
        console.error("Template error:", error);
        
        // Handle specific Gemini API errors
        if (error.status === 429) {
            res.status(429).json({
                message: "API quota exceeded. You've reached the daily limit for Gemini API requests. Please try again tomorrow or upgrade your plan.",
                error: "quota_exceeded",
                retryAfter: error.errorDetails?.find((detail: any) => detail['@type']?.includes('RetryInfo'))?.retryDelay || "24 hours"
            });
        } else if (error.status >= 400 && error.status < 500) {
            res.status(error.status).json({
                message: "API request error. Please check your API key and try again.",
                error: "api_error"
            });
        } else {
            res.status(500).json({
                message: "Error processing template request",
                error: "server_error"
            });
        }
    }
})

app.post("/chat", async (req, res) => {
    const messages = req.body.messages;
    
    try {
        // Convert messages to a more structured format for Gemini
        const conversationHistory = messages.map((msg: any, index: number) => {
            const role = msg.role === 'user' ? 'User' : 'Assistant';
            return `${role}: ${msg.content}`;
        }).join('\n\n');
        
        const systemPrompt = getSystemPrompt();
        
        // Create a more structured prompt for Gemini with specific JSX instructions
        const fullPrompt = `${systemPrompt}

CRITICAL CODE GENERATION RULES:
1. NEVER wrap code in markdown code blocks (no \`\`\`css, \`\`\`jsx, etc.)
2. Generate PURE code content only - no formatting artifacts
3. For CSS files, output only CSS - no markdown formatting
4. For JSX files, output only valid JSX/TypeScript - no markdown formatting
5. ALWAYS use proper JSX syntax - no malformed template literals
6. For conditional CSS classes, use this EXACT pattern:
   className={\`base-classes \${condition ? 'additional-class' : ''}\`}
7. NEVER break template literals across lines in JSX
8. NEVER break template literals across lines in JSX
9. Use double quotes for JSX attributes: className="example"
10. Test every template literal expression for syntax validity

EXAMPLES OF CORRECT CODE:
❌ WRONG CSS: \`\`\`css @tailwind base; \`\`\`
✅ CORRECT CSS: @tailwind base;

❌ WRONG JSX: className={\`line-through \${todo.completed ? 'text-gray-500' : ''}\`}
✅ CORRECT JSX: className={todo.completed ? "line-through text-gray-500" : "line-through"}

Previous conversation:
${conversationHistory}

Generate valid XML artifacts with clean, unformatted code content.`;
        
        const result = await model.generateContent(fullPrompt);
        
        let response = result.response.text();
        
        // Post-process to clean up common formatting issues
        response = cleanUpGeneratedCode(response);

        console.log(result.response);

        res.json({
            response: response
        });
        
    } catch (error: any) {
        console.error("Chat error:", error);
        
        // Handle specific Gemini API errors
        if (error.status === 429) {
            res.status(429).json({
                message: "API quota exceeded. You've reached the daily limit for Gemini API requests. Please try again tomorrow or upgrade your plan.",
                error: "quota_exceeded",
                retryAfter: error.errorDetails?.find((detail: any) => detail['@type']?.includes('RetryInfo'))?.retryDelay || "24 hours"
            });
        } else if (error.status >= 400 && error.status < 500) {
            res.status(error.status).json({
                message: "API request error. Please check your API key and try again.",
                error: "api_error"
            });
        } else {
            res.status(500).json({
                message: "Error processing chat request",
                error: "server_error"
            });
        }
    }
});

// Function to clean up common AI code generation issues
function cleanUpGeneratedCode(content: string): string {
    // Remove markdown code blocks from within boltAction file content
    content = content.replace(/<boltAction([^>]*type="file"[^>]*)>([\s\S]*?)<\/boltAction>/g, (match, attributes, fileContent) => {
        // Clean up file content
        let cleanContent = fileContent;
        
        // Remove markdown code blocks like ```css, ```jsx, ```typescript, etc.
        cleanContent = cleanContent.replace(/```\w*\n/g, '');
        cleanContent = cleanContent.replace(/\n```/g, '');
        cleanContent = cleanContent.replace(/^```\w*/gm, '');
        cleanContent = cleanContent.replace(/```$/gm, '');
        
        // Fix common JSX template literal issues
        cleanContent = cleanContent.replace(/className=\{`([^`]*)`\}/g, (templateMatch: string, templateContent: string) => {
            // Ensure proper template literal syntax
            return `className={\`${templateContent}\`}`;
        });
        
        return `<boltAction${attributes}>${cleanContent}</boltAction>`;
    });
    
    return content;
}

app.listen(3000);

