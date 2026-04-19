const sanitizeTestIdPart = (value: string | number) =>
  String(value)
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

export const buildTestId = (...parts: Array<string | number | null | undefined | false>) => {
  const sanitizedParts = parts
    .filter(
      (part): part is string | number =>
        part !== null && part !== undefined && part !== false && `${part}`.trim() !== ''
    )
    .map(sanitizeTestIdPart)
    .filter(Boolean);

  return sanitizedParts.length > 0 ? sanitizedParts.join('-') : undefined;
};

export const testIdProps = (testId?: string) =>
  testId
    ? { 'data-testid': testId }
    : {};
