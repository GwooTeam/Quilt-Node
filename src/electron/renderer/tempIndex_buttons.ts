//const { ipcRenderer } = require('electron');

window.onload = function(){
    //renderer가 함수이름을 요청함 : request-functions
    ipcRenderer.send("request-functions");
    console.log("########전송완료");
}

//renderer에게 함수이름을 보냄 : reply-functions
ipcRenderer.on("reply-functions", (event, names_funtions) =>{
    const buttonsDiv = document.getElementById("buttons");
    for(let name of names_funtions){
        let button = document.createElement("button");
        button.innerHTML = name;
        button.addEventListener("click", ()=>{
            //해당 버튼이 클릭되었을때 할일
            ipcRenderer.send("call-function", button.innerHTML);
        });
        buttonsDiv?.appendChild(button);
    }
});

//main이 stdout(터미널의 출력)을 log창에 띄우기 위해 보내옴 : `stdout`
ipcRenderer.on(`stdout`, (event, message)=>{
    const div_log = document.getElementById("log");
    const p = document.createElement("p");
    p.textContent = message;
    div_log?.appendChild(p);
})