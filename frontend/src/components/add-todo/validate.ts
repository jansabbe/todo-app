export function isValid(description: string): boolean {
    const trimmed = description.trim();
    return trimmed.length > 0 && trimmed.length < 100;
}
