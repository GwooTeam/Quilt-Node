import axios from "axios";
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

class NodeAuthAPI{
    node_auth_config:NodeAuthConfig;
    server_pubkey?:string;
    constructor(){
        //현재 파일의 폴더경로는 External/GUI/dist/backend/NodeAuth이다. json은 .ts가 있는 dist바깥에 있다.
        //let config_string = fs.readFileSync("../../../backend/NodeAuth/config.json", "utf-8");
        let config_string = fs.readFileSync(path.join(__dirname, "config.json"), "utf-8");
        this.node_auth_config = JSON.parse(config_string) as NodeAuthConfig;
        /*
            이곳은 필요시 나중에 세션or토큰 키 저장을 위한 공간
        */
    }
    public async requestServerPubKey():Promise<unknown|string>{
        const url = path.join(this.node_auth_config.SERVER_DOMAIN, this.node_auth_config.SERVER_URL_PATH.getServerPubKey);
        const data = {};
        try{
            const response = await axios.post(url, data);
            console.log("[API] requestServerPubKey Complete");
            console.log(response);
            /**
             * response http json 형태
             *{
             *   "keyType": "KeyType의 값",
             *   "keyAlgorithm": "KeyAlgorithm의 값",
             *   "keyVal": "keyVal의 값",
             *   "keyLength": keyLength의 값
             *}
             */
            this.server_pubkey = response.data.keyVal
            //this.server_pubkey = atob(response.data.keyVal)
        }catch(error){
            console.error(`[API] requestServerPubKey Error ${error}`);
            throw error;
        }
        /**
         * 서버의 pubk로 카이버암호화해야함
         * 1. 현재 실행파일경로 기준으로(__dirname) kmodule의 위치를 알아낸다.
         * 2. WSL에 경유해서 실행시키기 위해 kmodule의 위치를 WSL상으로 바꾼다.
         * 2-1. p:\ 이런식이 mnt/p/로 바뀐다
         * 3. 암호API참고해서 실행한다.
         */

        let crypto_module_path_wsl = null;
        if(os.platform().includes("win")){
            //현재파일기준으로 암호모듈파일 상대경로를 넣음
            const temp = path.join(__dirname, "..", "..", "..", "KEM", "modules", "kmodule").split(":");
            const drive = temp[0];
            const crypto_module_path_token = temp[1].split(path.win32.sep)
            crypto_module_path_wsl = path.posix.join("/mnt", drive, ...crypto_module_path_token);
        }

        let crypto_module_process_result = spawnSync(`wsl ${crypto_module_path_wsl} --encap -r --key=${this.server_pubkey}`, {shell:true, encoding:"utf-8"});
        if(crypto_module_process_result.error || crypto_module_process_result.status != 0){
            return new Error("[API] crypto module Erorr");
        }
        let kyber_encapsuled = crypto_module_process_result.stdout;
        return kyber_encapsuled;
    }

    public async enrollNonce(node_id:string){
        const url = path.join(this.node_auth_config.SERVER_DOMAIN, this.node_auth_config.SERVER_URL_PATH.enrollNonce.replace(`{id}`, node_id));
        const data = {};
        /*
          response에 온 값을 카이버 인크립션 해야함
        */
        try{
            const response = await axios.post(url, data);
            console.log(`[API] enrollNonce Complete`);
            console.log(response);
        }catch(error){
            console.error(`[API] enrollNonce Error ${error}`);
        }
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
        try{
            const response = await axios.post(url, data);
            console.log(`[API] verify Complete`);
            console.log(response);
        }catch(error){
            console.error(`[API] verify Error ${error}`);
        }
    }
}
const temp = new NodeAuthAPI();
temp.enrollNonce("1");
