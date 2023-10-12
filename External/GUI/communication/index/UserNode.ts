import { WebConnector } from "tgrid/protocols/web/WebConnector";
import { Driver } from "tgrid/components/Driver";
import { CodeLanguage, CommandReply, IDocker } from "../controllers/IDocker";
import { DockerProvider } from "../providers/Docker";
import {Spinner} from "cli-spinner";
import { IMAGE_NAME, SERVER_IP, PORT_TGRID }from "../global/Dockerode-config"

import readline from 'readline';

const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function processUserInput(input: string): void {
    // 사용자가 입력한 값 그대로 출력
    console.log('You entered:', input);
  }
  
  // 사용자 입력을 지속적으로 받는 무한 반복 루프
  async function UserInput() {
    rl.question('Enter command in JSON format: ', async (input) => {
        // 사용자 입력값 그대로 출력
        console.log(`You entered: ${input}`);

        // "exit" 입력 시 무한루프 탈출
        if (input.trim().toLowerCase() === 'exit') {
            return rl.close();
        }

        let obj;
        
        // JSON 파싱 시도
        try {
            obj = JSON.parse(input);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            return UserInput();  // 오류가 발생하면 다시 입력받기
        }

         // cmd key 확인
         if (obj.hasOwnProperty('cmd')) {
            //  await sendCommandToTerminal(obj['cmd']);
            console.log('sendCommandToTerminal function is executing...');
             
          // code key 확인   
         } else if (obj.hasOwnProperty('code')) {
            //  await sendSourceCode(obj['code']);
            console.log('sendSourceCode function is executing...');
             
          // 그 외 경우   
          } else {
              console.error('Invalid command');
          }
          
          return UserInput();  // 명령어를 처리한 후 다시 입력받기
        
    });
}



async function main(): Promise<void>
{
    //----
    // CONNECTION
    //----
    let connector: WebConnector<null, DockerProvider> = new WebConnector(null, new DockerProvider());
    await connector.connect(`ws://${SERVER_IP}:${PORT_TGRID}`);

    //----
    // CALL REMOTE FUNCTIONS
    //----
    // GET DRIVER
    let dock: Driver<IDocker> = connector.getDriver<IDocker>();
    let image:string = IMAGE_NAME;
    
    /**
     * 아래는 Provider는 사용하는 예시입니다.
     * 아래 예시들같이 Provider함수들을 쓸땐, 모두 try{}catch(){}형식으로 하는 것이 좋다.
     * 원격함수가 에러가 날수있기때문이다
     * 그리고 loading은 로딩효과 문장을 위한 라이브러리. 그래서 안써도됨
     * start하면 Spinner("문장")의 문장이 출력되고, 삥글삥글돈다
     * stop(true)하면 삥글 + 문장이 아에 한줄이 사라진다
     * stop(false)하면 멈춘삥글 + 문장 이렇게 문장이 남아있다
     * 아래 코드는 성공하면 사라지고, 에러가 났을때에만 문장을 남겨서 어떤 명령에서 에러가 났는지 파악하도록 만들었다
     */
    /*
    //pullImage()작동확인코드
    {
        let loading = new Spinner("이미지 다운 중");
        loading.start();
        try{
            await dock.pullImage(image);
        }catch(err:any){
            loading.stop(false);
            console.log(err);
        }
        loading.stop(true);
    }

    //createContainer()작동확인코드
    {
        let loading = new Spinner("컨테이너 생성 중");
        loading.start();
        try{
            await dock.createContainer(image);
        }catch(err:any){
            loading.stop(false);
            console.error(err);
        }
        loading.stop(true);
    }

    //startContainer()작동확인코드
    {
        let loading = new Spinner("컨테이너 시작 중");
        loading.start();
        try{
            await dock.startContainer();
        }catch(err:any){
            loading.stop(false);
            console.error(err);
        }
        loading.stop(true);
    }

    //stopContainer()작동확인코드
    {
        let loading = new Spinner("컨테이너 중지 중");
        loading.start();
        try{
            await dock.stopContainer();
        }catch(err:any){
            loading.stop(false);
            console.error(err.json ?? "Non json 에러");
        }
        loading.stop(true);
    }
*/

    /* JSON 파일 읽어와 컨테이너에 명령으로 집어넣는 기능 */
    // JSON 파일 읽기
    fs.readFile('../listener/cmd.json', 'utf8', async function(err: Error, data: string) {
        if (err) {
            console.error(err);
            return;
        }

        // JSON 문자열 파싱
        let obj = JSON.parse(data);

        // commands 키의 값 가져오기 
        let commands = obj.commands;

        if (!Array.isArray(commands)) {
            console.error("Commands should be an array");
            return;
        }

        //sendCommandToContainer()작동확인코드
        for( let cmd of commands){

            if (!Array.isArray(cmd)) {
                console.error("Each command should be an array");
                continue;
            }

            // 명령어를 received.txt 파일에 저장
            fs.appendFileSync('received.txt', cmd.join(' ') + '\n');

            // runCode가 첫 번째 요소인 경우 나머지 요소들을 TypeScript 코드로 실행
            if (cmd[0] === 'runCode') {
                const code = cmd.slice(1).join(' ');
                eval(code);
            } else {    
                let commandReply: CommandReply;
                let loading = new Spinner("컨테이너에게 명령어 전달 중");
                loading.start();
                try{
                    commandReply = await dock.sendCommandToContainer(cmd);
                    loading.stop(true);
                    console.log(commandReply);
                }catch(err:any){
                    loading.stop(false);
                    console.error(err);
                }
            }
        }
    });

    //execToContainer()작동확인코드
    for( let cmd of [["whoami"], ["123123"]]) 
    {
        let commandReply: CommandReply;
        let loading = new Spinner("컨테이너에게 exec()하는 중");
        loading.start();
        let a = process.stdin;
        let b = process.stdout;
        try{
            commandReply = await dock.execToContainer(cmd);
            loading.stop(true);
            console.log(commandReply);
        }catch(err:any){
            loading.stop(false);
            console.error(err);
        }
       
    }

   
    UserInput();

    //----
    // TERMINATE
    //----
    await connector.close();
}
main();