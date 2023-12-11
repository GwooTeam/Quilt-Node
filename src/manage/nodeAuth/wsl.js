const { spawnSync } = require("child_process");
const os = require("os");
const path = require("path");
//WSL을 통한 암호모듈 사용관련 클래스
class WSL{
    kmodule_path;
    dmodule_path;
    mmodule_path;
    //kmodule에서 LD_LIBRARY_PATH의 값
    kmodule_env_path;
    dmodule_env_path;
    mmodule_env_path;
    pre_script;
    constructor(debug){
        if(os.platform().includes("win")){
            this.debug = debug;
            //현재파일기준으로 암호모듈파일 상대경로를 넣음
            let temp = path.join(__dirname, "..", "..", "..", "crypto").split(":");
            let drive = temp[0].toLowerCase();
            let crypto_module_path_token = temp[1].split(path.win32.sep);
            temp = path.posix.join("/mnt/", drive, ...crypto_module_path_token);
            this.kmodule_path = path.posix.join(temp, "kmodule", "modules", "kmodule");
            this.dmodule_path = path.posix.join(temp, "dmodule", "dmodule");
            this.mmodule_path = path.posix.join(temp, "mmodule", "mmodule");
            this.kmodule_env_path = path.posix.join(this.kmodule_path, "..");
            this.dmodule_env_path = path.posix.join(this.dmodule_path, "..");
            this.mmodule_env_path = path.posix.join(this.mmodule_path, "..");
            this.pre_script = `wsl (export LD_LIBRARY_PATH=`
        }else{
            console.error("[WSL]This OS is not supported yet.");
            return null;
        }
    }
    
    async KyberKeyGen(){
        let cmd = `${this.pre_script}${this.kmodule_env_path};${this.kmodule_path} -r --keygen)`;
        if(this.debug) console.log("kyberKeyGen :\n"+cmd);
        let result = spawnSync(
            cmd,
            {shell:"cmd"}
        );
        if(this.debug)console.log(result);
        if(result.error||result.status != 0){
            throw new Error("[API] crypto module Error");
        }
        let temp = result.stdout.toString().split("puk=")[1];
        temp = temp.split("prk=");
        const pubkey = temp[0];
        const prikey = temp[1];
        return [pubkey, prikey];
    }

    async KyberEncapsulate(key){
        let cmd = `${this.pre_script}${this.kmodule_env_path};${this.kmodule_path} --encap -r --key=${key})`;
        if(this.debug) console.log("kyberKeyGen :\n"+cmd);
        let result = spawnSync(
            cmd,
            {shell:"cmd"}
        );
        if(this.debug)console.log(result);
        if(result.error||result.status != 0){
            throw new Error("[API] crypto module Error");
        }
        return result.stdout.toString();
    }

    async KyberDecrypt(key, cipher){
        let cmd = `${this.pre_script}${this.kmodule_env_path};${this.kmodule_path} --decrypt -r --key=${key} --target=${cipher})`;
        if(this.debug) console.log("kyberKeyGen :\n"+cmd);
        let result = spawnSync(
            cmd,
            {shell:"cmd"}
        );
        if(this.debug)console.log(result);
        if(result.error||result.status != 0){
            throw new Error("[API] crypto module Error");
        }
        console.error(result.stderr.toString());
        return result.stdout.toString();
    }

    async DilithiumKeyGen(key, cipher){
        let cmd = `${this.pre_script}${this.dmodule_env_path};${this.dmodule_path} --keygen -r)`;
        if(this.debug) console.log("DilithiumKeyGen :\n"+cmd);
        let result = spawnSync(
            cmd,
            {shell:"cmd"}
        );
        if(this.debug)console.log(result);
        if(result.error||result.status != 0){
            throw new Error("[API] crypto module Error");
        }
        let temp = result.stdout.toString().split("puk=")[1];
        temp = temp.split("prk=");
        const pubkey = temp[0];
        const prikey = temp[1];
        return [pubkey, prikey];
    }

    async DilithiumSign(key, data_to_be_signed){
        let cmd = `${this.pre_script}${this.dmodule_env_path};${this.dmodule_path} -s -r ${data_to_be_signed} ${key})`;
        if(this.debug) console.log("DilithiumSign :\n"+cmd);
        let result = spawnSync(
            cmd,
            {shell:"cmd"}
        );
        if(this.debug)console.log(result);
        if(result.error||result.status != 0){
            throw new Error("[API] crypto module Error");
        }
        let sign = result.stdout.toString().split("sign=")[1];
        return sign;
    }

    async hashing(target, mk){
        let cmd = `${this.pre_script}${this.mmodule_env_path};${this.mmodule_path} --hash -r --target=${target} --key=${mk})`;
        if(this.debug) console.log("hashing :\n"+cmd);
        let result = spawnSync(
            cmd,
            {shell:"cmd"}
        );
        if(this.debug)console.log(result);
        if(result.error){
            throw new Error("[API] crypto module Error");
        }
        let hash = result.stdout.toString().split("hash=")[1]; 
        return hash;
    }
}
module.exports = { WSL };