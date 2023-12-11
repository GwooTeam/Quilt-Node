import axios, { AxiosResponse } from "axios";
import { ChildProcess, spawn, spawnSync } from "child_process";
import fs from "fs"
import path = require("path")
import os from "os"

interface ServerURLPath{
    getServerPubKey: string;
    enrollNonce: string;
    verify: string;
}

interface NodeAuthConfig{
    SERVER_DOMAIN:string;
    SERVER_URL_PATH:ServerURLPath;
}

function isSuccessResponse(response:AxiosResponse):boolean{
    if(response.status<200 || response.status>=300){
        return false;
    }
    return true;
}

export class NodeAuthAPI{
    node_auth_config:NodeAuthConfig;
    server_pubkey?:string;
    debug?:boolean;
    crypto_module_path_wsl?:string;
    pre_wsl_script?:string;
    constructor(debug?:boolean){
        //현재 파일의 폴더경로는 External/GUI/dist/backend/NodeAuth이다. json은 .ts가 있는 dist바깥에 있다.
        //let config_string = fs.readFileSync("../../../backend/NodeAuth/config.json", "utf-8");
        let config_string = fs.readFileSync(path.join(__dirname, "config.json"), "utf-8");
        this.node_auth_config = JSON.parse(config_string) as NodeAuthConfig;
        if (debug !== undefined){
            this.debug = debug;
        }
        if(os.platform().includes("win")){
            //현재파일기준으로 암호모듈파일 상대경로를 넣음
            const temp = path.join(__dirname, "..", "..", "..", "crypto", "kmodule", "modules", "kmodule").split(":");
            const drive = temp[0];
            const crypto_module_path_token = temp[1].split(path.win32.sep)
            this.crypto_module_path_wsl = path.posix.join("/mnt/", drive, ...crypto_module_path_token);
            this.pre_wsl_script = `wsl (export LD_LIBRARY_PATH=${path.posix.join(this.crypto_module_path_wsl, "..")};`
        }
        /*
            이곳은 필요시 나중에 세션or토큰 키 저장을 위한 공간
        */
    }
    public async requestServerPubKey():Promise<[string, string]>{
        const url = `${this.node_auth_config.SERVER_DOMAIN}:35001${this.node_auth_config.SERVER_URL_PATH.getServerPubKey}`;
        console.log(url);
        const data = {};
        let response;
        try{
            response = await axios.post(url, data);
        }catch(error){
            console.error(`[API] requestServerPubKey Error ${error}`);
            throw error;
        }
        if(this.debug)console.log(response);
        if(!isSuccessResponse(response)) throw new Error("[API] requestServerPubkey http Error");

        console.log("[API] requestServerPubKey Complete");
        /**
         * response http json 형태
         *{
         *   "keyType": "KeyType의 값",
         *   "keyAlgorithm": "KeyAlgorithm의 값",
         *   "keyVal": "keyVal의 값",
         *   "keyLength": keyLength의 값
         *}
            */
        this.server_pubkey = response.data.keyVal;
        if(this.debug)console.log(`server_pubkey : ${this.server_pubkey}`);
        //this.server_pubkey = atob(response.data.keyVal)
        /**
         * 서버의 pubk로 카이버암호화해야함
         * 1. 현재 실행파일경로 기준으로(__dirname) kmodule의 위치를 알아낸다.
         * 2. WSL에 경유해서 실행시키기 위해 kmodule의 위치를 WSL상으로 바꾼다.
         * 2-1. p:\ 이런식이 mnt/p/로 바뀐다
         * 3. 암호API참고해서 실행한다.
         */
        let crypto_module_process_result = spawnSync(
            `${this.pre_wsl_script} ${this.crypto_module_path_wsl} --encap -r --key=${this.server_pubkey})`, {shell:"cmd"});
        if(this.debug)console.log(crypto_module_process_result);
        if(crypto_module_process_result.error || crypto_module_process_result.status != 0){
            throw new Error("[API] crypto module Erorr");
        }

        let temp = crypto_module_process_result.stdout.toString().split("encapsulated=");
        //[0] : , [1]:jdsklajflakjf
        temp = temp[1].split("ssk=");
        let encapsulated_server_pubkey_with_kyber = temp[0];
        let session_key = temp[1];
        return [encapsulated_server_pubkey_with_kyber, session_key];
    }

    public async enrollNonce(node_id:string, kyber_encapsuled:string){
        const url = `${this.node_auth_config.SERVER_DOMAIN}:35001${this.node_auth_config.SERVER_URL_PATH.enrollNonce.replace(`{id}`, node_id)}`;
        const data = {
            "capVal" : kyber_encapsuled
        };
        /*
          response에 온 값을 카이버 인크립션 해야함
        */
        let response = null;
        try{
            response = await axios.post(url, data);
        }catch(error){
            console.error(`[API] enrollNonce Error ${error}`);
            throw error;
        }
        if(!isSuccessResponse(response)) throw new Error("[API] enrollNonce http Error");
        console.log(`[API] enrollNonce Complete`);
        if(this.debug)console.log(response);

        return response.data.nonce;
    }
    public async verify(node_id:string, node_mac:string, node_sign:string, node_encrypt_pubkey:string, node_sign_pubkey:String, node_pubip:string){
        const url = path.join(this.node_auth_config.SERVER_DOMAIN, this.node_auth_config.SERVER_URL_PATH.verify.replace(`{id}`, node_id));
        const data = {
            "nodeMac": node_mac,
            "nodeSign": node_sign,
            "nodeEncryptPubK": node_encrypt_pubkey,
            "nodeSignPubK": node_sign_pubkey,
            "nodePublicIP": node_pubip
        };
        let response;
        try{
            response = await axios.post(url, data);
        }catch(error){
            console.error(`[API] verify Error ${error}`);
            throw error;
        }
        if(!isSuccessResponse(response)) throw new Error("[API] verify http Error");
        console.log(`[API] verify Complete`);
        if(this.debug)console.log(response);
        /**
         * 여기에 받아오는 값을 파싱하고 저장하는 로직 필요함
         * NodeCertificate(s), NodeCertificate(e)
         */
        return null;
    }
}
