import fs from 'fs';
import path from 'path';

/**
 * Ensure that a file exists, creating its directory and file if needed.
 * @param filePath - Path to the file to check or create.
 */
export const ensureFileExists = (filePath: string): void => {
    
    if (!filePath) throw new Error('filePath is missing');

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
    }
};
