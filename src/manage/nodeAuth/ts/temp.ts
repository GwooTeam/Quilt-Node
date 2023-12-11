//import { spawnSync } from "child_process";
import path = require("path");

const temp = path.join(__dirname, "..", "..", "..", "crpto", "kmodule", "modules", "kmodule").split(":");
const drive = temp[0];
const crypto_module_path_token = temp[1].split(path.win32.sep)
const crypto_module_path_wsl = path.posix.join("/mnt", drive, ...crypto_module_path_token);

console.log(crypto_module_path_wsl);
const crypto_module_path_dir = path.posix.join(crypto_module_path_wsl, '..');
console.log(crypto_module_path_dir);


//let crypto_module_process_result = spawnSync(`wsl ${crypto_module_path_wsl} --encap -r --key=${this.server_pubkey}`, {shell:true, encoding:"utf-8"});
