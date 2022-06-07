# Basic Sample Hardhat Project

Intended to be a demo for simple introspective access control. Inherits Openzeppelin's AccessControl and builds on it. To use - 

```
npm install 
npx hardhat compile 
```

To follow the workflow and make "introspective" contracts - do the following ... 

```
Create a new contract in the contracts/ folder 
Run npx hardhat compile 
Scroll to scripts/wrangleContract.js and adjust path to your contract's ABI
npx hardhat --network rinkeby run scripts/wrangleContract.js
```

By now, you should have a new contract which automatically adds new roleIDs to your functions 
Make your original contract inherit from this and add ichiGuard() modifiers to all your mutating functions 

Finally, your contract is ready to be deployed ...

```
npx hardhat --network rinkeby run scripts/deploy.js
```

Status - To Be Continued 