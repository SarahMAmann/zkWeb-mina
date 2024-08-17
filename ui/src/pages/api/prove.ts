import type { NextApiRequest, NextApiResponse } from "next";


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    console.log('got here', req.body)

    // Generate a proof from the secret


    // Submit the proof to the smart contract for verification
    // const txn1 = await Mina.transaction(senderAccount, async () => {
    //     await zkAppInstance.matchSecret(salt, Field(750));
    //   });
    //   await txn1.prove();
    //   await txn1.sign([senderKey]).send();
      
    //   const num1 = zkAppInstance.x.get();
    //   console.log('state after txn1:', num1.toString());

    // If it's a successful valid match, add a new record to mina-proof table

    res.status(200).json({ name: "John Doe" });
}
