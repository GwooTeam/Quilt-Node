import { ipcMain } from "electron";
import { spawn } from "child_process"
import path from "path";

function run_sandboxRunner(){
    //Sandbox Runner의 main.py위치를 맞춰야함
    console.log(path.join(__dirname, "..", "..", "Sandbox", "Runner", `main.py`));
    const sandbox_runner = spawn("python", [path.join(__dirname, "..", "..", "..", "Sandbox", "Runner", `main.py`)]);
    sandbox_runner.stdout.on("data", (data)=>{
        console.log(`[SandboxRunner] ${data.toString()}`);
    });

    sandbox_runner.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    return "실행시킴";
}

export function assignEvents_sandboxRunner(){
    ipcMain.on("sandbox_runner_trigger", (event)=>{
        console.log("[MSA]Sandbox Runner trigger received from ipcRenderer");
        const log_sandbox_runner = run_sandboxRunner();
        event.reply("sandbox_runner_trigger_reply", log_sandbox_runner);
    });
}