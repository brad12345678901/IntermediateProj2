# MintyFire
Is a transaction-based project to simulate the process of minting and burning tokens within your account.

## To Make this work
Clone this github project by using git clone {link of this github}. Then after that, do these steps:
  1. Create three terminals, bash type terminals
  2. Inside the project directory, in the terminal type: npm i
  3. Open two additional terminals in your VS code
  4. In the second terminal type: npx hardhat node
  5. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
  6. Back in the first terminal, type npm run dev to launch the front-end.
     
And your project will be running an localhost, typically at localhost:3000
