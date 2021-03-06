# Basic Sample Hardhat Project

Intended to be a demo for simple introspective access control. Inherits Openzeppelin's AccessControl and builds on it. The goal is to take a top-level smart contract and introspectively assign RoleIDs to all of it's functions, as well as the the functions of it's various parent contracts. 

To get started with it, clone and run 

```
npm install 

```

To follow the workflow and make "introspective" contracts - do the following ... 

```
Create a new contract in the contracts/ folder 
Run npx hardhat compile 
```

You will notice Hardhat has automatically compiled your contracts and put their ABIs in the artifacts folder. Now, scroll to utils/wrangleContract.js and adjust path to your contract's ABI. Additionally, add paths to the ABIs of parent contracts whose mutating functions you still wish to guard. 

If there are also certain mutating functions you do not want to secure (why-ever so) you can add their names to functionsToIgnore. Do not remove the ones already added.

```
npx hardhat --network rinkeby run utils/wrangleContract.js
```

By now, you should have a new contract which automatically adds new roleIDs to your functions. Make your original contract inherit this (and only this) and create a new constructor. Check for any typos made by toe code generator. Make sure to modify the override in suportsInterface() too. 

Do note that solidty follows "C3 serialization" which means the order of execution of constructors and functions is determined by the order of the declaration at the contract level. So add the new constructor based on where it fits in the contract heirarchy. 

Finally, add ichiGuard() modifiers to all your mutating functions. You will be alerted to the ones you have to override and redefine in the command line. 

Now, your contract is ready to be deployed. Just adjust the scripts/deploy script to match your contract and then ...

```
npx hardhat --network rinkeby run scripts/deploy.js
```