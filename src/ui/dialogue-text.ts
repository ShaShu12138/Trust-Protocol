export interface DialogueTextPart { text: string; strong: boolean }
export function dialogueTextParts(text: string): DialogueTextPart[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map(part => {
    const strong = part.startsWith('**') && part.endsWith('**');
    return { text: strong ? part.slice(2, -2) : part, strong };
  });
}
export function revealDialogue(parts: readonly DialogueTextPart[], count: number): DialogueTextPart[] {
  let remaining = Math.max(0, count);
  return parts.map(part => {
    const characters = Array.from(part.text);
    const text = characters.slice(0, remaining).join('');
    remaining = Math.max(0, remaining - characters.length);
    return { ...part, text };
  });
}
