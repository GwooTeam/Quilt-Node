const { ipcRenderer } = require('electron');

const button_sandboxRunner = document.getElementById("button_sandboxRunner");
if(button_sandboxRunner){
    button_sandboxRunner.addEventListener("click", ()=>{
        ipcRenderer.send("sandbox_runner_trigger");
    })
}

ipcRenderer.on("sandbox_runner_trigger_reply", (event, arg)=>{
    const log_sandboxRunner = document.getElementById("log_sandboxRunner");
    if(log_sandboxRunner){
        log_sandboxRunner.innerHTML = arg;
    }
});
