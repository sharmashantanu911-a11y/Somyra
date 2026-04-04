export const sanitizeProfileText = (text: string) => {
  if (!text) return '';
  return text.trim().replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ');
};

export const getInputQuality = (text: string, field: string) => {
  if (!text || text.trim().length === 0) return null;
  const trimmed = text.trim();

  if (field === 'whoAreYou' || field === 'role' || field === 'primaryGoal') {
    if (trimmed.length < 15 || !trimmed.includes(' ')) {
      return { type: 'vague', message: 'This is too vague - be more specific about who you help' } as const;
    }
    if (trimmed.length > 40) {
      return { type: 'strong', message: 'Good - this is clear and specific' } as const;
    }
  }

  return null;
};
