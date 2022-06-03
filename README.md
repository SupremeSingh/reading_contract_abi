# Basic Sample Hardhat Project

Intended to be a demo for simple introspective access control. Inherits Openzeppelin's AccessControl and builds on it. To use - 

```
npm install 
npx hardhat compile 
npx hardhat --network rinkeby run scripts/deploy.js
npx hardhat --network rinkeby run scripts/interact.js
```

Note - interact.js registers new roles under the SUPER_ADMIN role. However, the deploying address still does not have access to them. You have to add access using "grantRole" functionality separately. All RoleIDs are present in the events logs, and also provided by our script. 

Status - To Be Continued 