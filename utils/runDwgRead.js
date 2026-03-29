import { spawn } from "child_process";

export function runDwgRead(dwgreadExe, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(dwgreadExe, args, { windowsHide: true });

        child.stdout.on("data", d => process.stdout.write(d));
        child.stderr.on("data", d => process.stderr.write(d));

        child.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Process exited with code ${code}`));
        });

        child.on("error", reject);
    });
}