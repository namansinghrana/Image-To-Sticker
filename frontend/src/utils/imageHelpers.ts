export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateFilename = (originalName: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}-sticker-${timestamp}.png`;
};

export const pasteFromClipboard = async (): Promise<File | null> => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (type.startsWith('image/')) {
          const blob = await clipboardItem.getType(type);
          return new File([blob], `pasted-image.${type.split('/')[1]}`, { type });
        }
      }
    }
  } catch (error) {
    console.error('Failed to read clipboard:', error);
  }
  return null;
};