import Docker from "dockerode";

export interface CommandReply{
    ExitCode:number | null | undefined;
    stdoutData:string[];
    stderrData:string[];
}

export interface IDocker{
    [key: string]: Function;
    pullImage(image: string): void;
    createContainer(image: string, cmd?: string[]): void;
    startContainer(): void;
    stopContainer(): void;
    sendCommandToContainer(cmd: string[]): Promise<CommandReply>;
    execToContainer(cmd: string[]): Promise<CommandReply>;
    uploadAtBindedMount(): any;
    downloadAtBindedMount(): any;
    
}