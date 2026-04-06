const CODE_OPEN = "[code]";
const CODE_CLOSE = "[/code]";

export interface PromptParts {
  prompt: string;
  codeSnippet?: string;
}

export function encodePromptWithSnippet(parts: PromptParts): string {
  const prompt = parts.prompt.trimEnd();
  const snippet = parts.codeSnippet?.trim();

  if (!snippet) return prompt;
  return `${prompt}\n\n${CODE_OPEN}\n${snippet}\n${CODE_CLOSE}`;
}

export function decodePromptWithSnippet(fullPrompt: string): PromptParts {
  const openIndex = fullPrompt.indexOf(CODE_OPEN);
  const closeIndex = fullPrompt.indexOf(CODE_CLOSE);

  if (openIndex === -1 || closeIndex === -1 || closeIndex < openIndex) {
    return { prompt: fullPrompt };
  }

  const before = fullPrompt.slice(0, openIndex).trimEnd();
  const snippetRaw = fullPrompt
    .slice(openIndex + CODE_OPEN.length, closeIndex)
    .trim();

  return {
    prompt: before,
    codeSnippet: snippetRaw || undefined,
  };
}

