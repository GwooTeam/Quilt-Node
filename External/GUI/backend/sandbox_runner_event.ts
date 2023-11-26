import { ipcMain } from "electron";

function run_sandboxRunner(){
    //구현예정
    return "TEST";
}

export function assignEvents_sandboxRunner(){
    ipcMain.on("sandbox_runner_trigger", (event)=>{
        console.log("[MSA]Sandbox Runner trigger received from ipcRenderer");
        const log_sandbox_runner = run_sandboxRunner();
        event.reply("sandbox_runner_trigger_reply", log_sandbox_runner);
    });
}