import fs from 'fs';

export const deleteExpiredFiles = (filePaths: string[]) => {
  filePaths.forEach(filePath => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      } else {
        console.log(`Deleted expired file: ${filePath}`);
      }
    });
  });
};

export const isValidFileType = (mimeType: string): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  return allowedTypes.includes(mimeType);
};

export const setupFileCleanup = (interval: number, expirationTime: number) => {
  const uploadedFiles: { path: string; timestamp: number }[] = [];

  setInterval(() => {
    const now = Date.now();
    const expiredFiles = uploadedFiles.filter(file => now - file.timestamp > expirationTime);
    
    deleteExpiredFiles(expiredFiles.map(file => file.path));

    const remainingFiles = uploadedFiles.filter(file => now - file.timestamp <= expirationTime);
    uploadedFiles.length = 0;
    uploadedFiles.push(...remainingFiles);
  }, interval);

  return (filePath: string) => {
    uploadedFiles.push({ path: filePath, timestamp: Date.now() });
  };
};