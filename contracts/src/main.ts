// import { Mina, PrivateKey, Field, PublicKey } from 'o1js';
// import { Match } from './Match.js';

// (async () => {
//   const network = Mina.Network('ttps://api.minascan.io/node/devnet/v1/graphql');
//   Mina.setActiveInstance(network);

//   const deployerPrivateKey = PrivateKey.fromBase58('my-private key');
//   const zkAppAddress = PublicKey.fromBase58('B62qnNPQApJ4bVWmR5F1dJxb3gQaU8ze4WZoiusMfeMvdUjXXorsn1F');
//   const zkApp = new Match(zkAppAddress);

//   const salt = Field(12345);
//   const secret = Field(2024);

//   const deployTxn = await Mina.transaction(deployerAccount, async () => {
//     AccountUpdate.fundNewAccount(deployerAccount);
//     await zkAppInstance.deploy();
//     await zkAppInstance.initState(salt, secret);
//   });
//   await deployTxn.prove();
//   await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();
  
//   // get the initial state of IncrementSecret after deployment
//   const num0 = zkAppInstance.x.get();
//   console.log('state after init:', num0.toString());

//   console.log('Contract initialized with salt and secret.');
// })

import { Match } from './Match.js';
import { Field, Mina, PrivateKey, AccountUpdate } from 'o1js';

const useProof = false;

const Local = await Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const deployerAccount = Local.testAccounts[0];
const deployerKey = deployerAccount.key;
const senderAccount = Local.testAccounts[1];
const senderKey = senderAccount.key;

// const salt = Field.random();
const salt = Field(12345)

// ----------------------------------------------------

// create a destination we will deploy the smart contract to
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

const zkAppInstance = new Match(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, async () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  await zkAppInstance.deploy();
  await zkAppInstance.initState(salt, Field(2024));
});
await deployTxn.prove();
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

// get the initial state of Match after deployment
console.log('txinfo', deployTxn)
const num0 = zkAppInstance.x.get();
console.log('state after init:', num0.toString());

// ----------------------------------------------------

const txn1 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.matchSecret(salt, Field(2024));
});
await txn1.prove();
await txn1.sign([senderKey]).send();

const num1 = zkAppInstance.x.get();
console.log('state after txn1:', num1.toString());
