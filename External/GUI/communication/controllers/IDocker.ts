import Docker from "dockerode";

export interface CommandReply{
    ExitCode:number | null | undefined;
    stdoutData:string[];
    stderrData:string[];
}

export enum CodeLanguage{
    JavaScript,
    TypeScript
}

export interface IDocker{
    pullImage(image: string): void;
    createContainer(image: string, cmd?: string[]): void;
    startContainer(): void;
    stopContainer(): void;
    sendCommandToContainer(cmd: string[]): Promise<CommandReply>;
    execToContainer(cmd: string[]): Promise<CommandReply>;
    uploadAtBindedMount(): any;
    downloadAtBindedMount(): any;
    
    //아래부턴 1차 발표 대비 리스너를 위한 함수
    /**
     * SupplierPC의 터미널에게 명령을 내리는 함수
     */
    sendCommandToTerminal(cmd: string): Promise<CommandReply>;
    sendSourceCode(which_language: CodeLanguage) : void;
    saveText(text: string): void;
}