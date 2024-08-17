// ---- Placeholder for programmatic deployment if dynamic contract generation feature is added ------

// import type { NextApiRequest, NextApiResponse } from "next";
// // import { Mina, PublicKey, PrivateKey, AccountUpdate } from 'o1js';
// // import { Add } from "../../../../contracts/src/Add";
// // import type { Add } from "../../../../contracts/src/Add";
// import { Mina, PrivateKey } from 'o1js';
// // import { Match } from './Match';

// import fs from 'fs';
// import { deploy, loopUntilAccountExists } from './utils';

// type Data = {
//   data: string;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>,
// ) {
//     console.log('got here')

//     const Network = Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
//     Mina.setActiveInstance(Network);

//     // const deployAlias = process.argv[2];
//     // 01-deploy is technically the feepayer alias
//     const deployAlias = 'devnet';
//     const deployerKeysFileContents = fs.readFileSync(
//     'keys/' + deployAlias + '.json',
//     'utf8'
//     );

//     const deployerPrivateKeyBase58 = JSON.parse(
//         deployerKeysFileContents
//       ).privateKey;
//       const deployerPrivateKey = PrivateKey.fromBase58(deployerPrivateKeyBase58);
//       const deployerPublicKey = deployerPrivateKey.toPublicKey();
      
//     //   const zkAppPrivateKey = PrivateKey.fromBase58(
//     //     'EKFTMuvTirzrwpeHP8RKe7bGufBGiKs27nTMzD5XyMV8NcK3upt2'
//     //   );

//     const zkAppPrivateKey = deployerPrivateKey;

//     // -------------------------------


//     let account = await loopUntilAccountExists({
//         account: deployerPublicKey,
//         eachTimeNotExist: () => {
//           console.log(
//             'Deployer account does not exist. ' +
//               'Request funds at faucet ' +
//               'https://faucet.minaprotocol.com/?address=' +
//               deployerPublicKey.toBase58()
//           );
//         },
//         isZkAppAccount: false,
//       });
      
//       console.log(
//         `Using fee payer account with nonce ${account.nonce}, balance ${account.balance}`
//       );


//     // --------------------------------


//     console.log('Compiling smart contract...');
//     let { verificationKey } = await Match.compile();

//     const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
//     let zkapp = new Match(zkAppPublicKey);

//     // Programmatic deploy:
//     await deploy(deployerPrivateKey, zkAppPrivateKey, zkapp, verificationKey);

//     await loopUntilAccountExists({
//     account: zkAppPublicKey,
//     eachTimeNotExist: () =>
//         console.log('waiting for zkApp account to be deployed...'),
//     isZkAppAccount: true,
//     });

//     let num = (await zkapp.num.fetch())!;
//     console.log(`current value of num is ${num}`);


//     res.status(200).json({ data: "Success" });
// }