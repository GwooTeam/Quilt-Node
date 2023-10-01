#Introduction
The `GUI` folder consists of a backend process responsible for the command transmission and execution between nodes, and a GUI that oversees this. The backend process is defined in the `communication` folder.
#communication demonstration
1. Install npm and Docker on your PC.
2. Go to Docker's settings and check "Expose daemon on tcp://localhost:2375 without TLS".
3. Open a terminal in this folder and run `npm install` to create a `node_modules` folder.
4. Modify the file `./communication/global/Dockerode-config.ts` according to your environment.
5. If you want to test the Supplier node and User node on one device, open two terminals.
6. In one terminal, enter `ts-node ./communication/index/SupplierNode.ts` to run the SupplierNode file.
7. In the remaining terminal, enter `ts-node ./communication/index/UserNode.ts` to run the User file.
8. Check if RFC communication is working well between terminals (operating as nodes).