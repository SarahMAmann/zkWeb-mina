import { Field, Mina, PublicKey, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

// import type { Match } from '../../contracts/src/Match';

const state = {
  // Match: null as null | typeof Match,
  // zkapp: null as null | Match,
// Not ideal but at the moment it will not deploy on Vercel otherwise
  Match: null as null | any,
  zkapp: null as null | any,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToDevnet: async (args: {}) => {
    const Network = Mina.Network(
      'https://api.minascan.io/node/devnet/v1/graphql'
    );
    console.log('Devnet network instance configured.');
    Mina.setActiveInstance(Network);
  },
  loadContract: async (args: {}) => {
    const { Match } = await import('../../contracts/build/src/Match.js');
    // const { Match } = await import('./contract-build/Match.js');
    state.Match = Match;
  },
  compileContract: async (args: {}) => {
    await state.Match!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Match!(publicKey);
  },
//   getNum: async (args: {}) => {
//     const currentNum = await state.zkapp!.num.get();
//     return JSON.stringify(currentNum.toJSON());
//   },
  createUpdateTransaction: async (args: {salt: Field, secret: Field}) => {
    console.log('TX KEY:', args)
    const transaction = await Mina.transaction(async () => {
      await state.zkapp!.matchSecret(Field(args.salt), Field(args.secret));
    });
    state.transaction = transaction;
  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== 'undefined') {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      console.log('FUNC', event.data.fn)
      console.log('EVENT ARGS', event.data.args)

      const returnData = event.data.fn === 'createUpdateTransaction' ? await functions[event.data.fn]({salt: event.data.args.salt.value[1][1], secret: event.data.args.secret.value[1][1]}) : await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}

console.log('Web Worker Successfully Initialized.');