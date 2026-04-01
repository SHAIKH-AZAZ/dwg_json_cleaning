import fs from "fs";
import path from "path";

const fsp = fs.promises;

export async function findDWGFiles(rootFolder) {
    const results = [];

    async function walk(dir) {
        const entries = await fsp.readdir(dir, { withFileTypes: true });

        for (const e of entries) {
            const fp = path.join(dir, e.name);

            if (e.isDirectory()) {
                await walk(fp);
            } else if (
                e.isFile() &&
                e.name.toLowerCase().endsWith(".dwg")
            ) {
                results.push(fp);
            }
        }
    }

    await walk(rootFolder);
    return results;
}