"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const prompt = req.body.prompt;
    try {
        const result = yield model.generateContent([
            "Return either 'node' or 'react' based on what you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra.",
            prompt
        ]);
        const answer = result.response.text().trim().toLowerCase();
        console.log("Template decision:", answer, "for prompt:", prompt);
        if (answer === "react") {
            res.json({
                prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [react_1.basePrompt]
            });
            return;
        }
        if (answer === "node") {
            res.json({
                prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [node_1.basePrompt]
            });
            return;
        }
        // Default to react if unclear
        console.log("Unclear response, defaulting to react");
        res.json({
            prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [react_1.basePrompt]
        });
    }
    catch (error) {
        console.error("Template error:", error);
        // Handle specific Gemini API errors
        if (error.status === 429) {
            res.status(429).json({
                message: "API quota exceeded. You've reached the daily limit for Gemini API requests. Please try again tomorrow or upgrade your plan.",
                error: "quota_exceeded",
                retryAfter: ((_b = (_a = error.errorDetails) === null || _a === void 0 ? void 0 : _a.find((detail) => { var _a; return (_a = detail['@type']) === null || _a === void 0 ? void 0 : _a.includes('RetryInfo'); })) === null || _b === void 0 ? void 0 : _b.retryDelay) || "24 hours"
            });
        }
        else if (error.status >= 400 && error.status < 500) {
            res.status(error.status).json({
                message: "API request error. Please check your API key and try again.",
                error: "api_error"
            });
        }
        else {
            res.status(500).json({
                message: "Error processing template request",
                error: "server_error"
            });
        }
    }
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const messages = req.body.messages;
    try {
        // Convert messages to a more structured format for Gemini
        const conversationHistory = messages.map((msg, index) => {
            const role = msg.role === 'user' ? 'User' : 'Assistant';
            return `${role}: ${msg.content}`;
        }).join('\n\n');
        const systemPrompt = (0, prompts_1.getSystemPrompt)();
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
        const result = yield model.generateContent(fullPrompt);
        let response = result.response.text();
        // Post-process to clean up common formatting issues
        response = cleanUpGeneratedCode(response);
        console.log(result.response);
        res.json({
            response: response
        });
    }
    catch (error) {
        console.error("Chat error:", error);
        // Handle specific Gemini API errors
        if (error.status === 429) {
            res.status(429).json({
                message: "API quota exceeded. You've reached the daily limit for Gemini API requests. Please try again tomorrow or upgrade your plan.",
                error: "quota_exceeded",
                retryAfter: ((_b = (_a = error.errorDetails) === null || _a === void 0 ? void 0 : _a.find((detail) => { var _a; return (_a = detail['@type']) === null || _a === void 0 ? void 0 : _a.includes('RetryInfo'); })) === null || _b === void 0 ? void 0 : _b.retryDelay) || "24 hours"
            });
        }
        else if (error.status >= 400 && error.status < 500) {
            res.status(error.status).json({
                message: "API request error. Please check your API key and try again.",
                error: "api_error"
            });
        }
        else {
            res.status(500).json({
                message: "Error processing chat request",
                error: "server_error"
            });
        }
    }
}));
// Function to clean up common AI code generation issues
function cleanUpGeneratedCode(content) {
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
        cleanContent = cleanContent.replace(/className=\{`([^`]*)`\}/g, (templateMatch, templateContent) => {
            // Ensure proper template literal syntax
            return `className={\`${templateContent}\`}`;
        });
        return `<boltAction${attributes}>${cleanContent}</boltAction>`;
    });
    return content;
}
app.listen(3000);
