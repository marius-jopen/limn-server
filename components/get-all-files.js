import { promises as fs } from 'fs';
import path from 'path';

export async function getAllFiles(dirPath) {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    items.map(async item => {
      const fullPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        return getAllFiles(fullPath);
      }
      return fullPath;
    })
  );
  return files.flat();
}