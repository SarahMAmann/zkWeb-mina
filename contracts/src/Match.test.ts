import { Field, PrivateKey, Poseidon, Mina, AccountUpdate, PublicKey } from 'o1js';
import { Match } from './Match';
import { expect } from 'chai';

let proofsEnabled = false;

describe('Match', () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    senderAccount: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Match;

  beforeAll(async () => {
    if (proofsEnabled) await Match.compile();
  });

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    [deployerAccount, senderAccount] = Local.testAccounts;
    deployerKey = deployerAccount.key;
    senderKey = senderAccount.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Match(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
    });
    if (proofsEnabled) await txn.prove();
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `Match` smart contract', async () => {
    await localDeploy();
    const secret = zkApp.x.get();
    expect(secret.equals(Field(2024)).toBoolean()).to.be.true;
  });

  it('should initialize the state with a hash of salt and secret', async () => {
    const salt = Field(750);
    const secret = Field(2024);
    const expectedHash = Poseidon.hash([salt, secret]);

    const tx = await Mina.transaction(deployerAccount, () => {
      return zkApp.initState(salt, secret);
    });
    if (proofsEnabled) await tx.prove();
    tx.sign([deployerKey, zkAppPrivateKey]);
    await tx.send().wait();

    const x = zkApp.x.get();
    expect(x.equals(expectedHash).toBoolean()).to.be.true;
  });

  it('should match the secret', async () => {
    const salt = Field(750);
    const secret = Field(2024);
    const newSecret = Field(2024);
    const expectedNewHash = Poseidon.hash([salt, newSecret]);

    const tx1 = await Mina.transaction(deployerAccount, () => {
      return zkApp.initState(salt, secret);
    });
    if (proofsEnabled) await tx1.prove();
    tx1.sign([deployerKey, zkAppPrivateKey]);
    await tx1.send().wait();

    const tx2 = await Mina.transaction(deployerAccount, () => {
      return zkApp.matchSecret(salt, newSecret);
    });
    if (proofsEnabled) await tx2.prove();
    tx2.sign([deployerKey, zkAppPrivateKey]);
    await tx2.send().wait();

    const x = zkApp.x.get();
    expect(x.equals(expectedNewHash).toBoolean()).to.be.true;
  });

  it('should fail to match an incorrect secret', async () => {
    const salt = Field(750);
    const secret = Field(2024);
    const incorrectSecret = Field(22222);

    const tx1 = await Mina.transaction(deployerAccount, () => {
      return zkApp.initState(salt, secret);
    });
    if (proofsEnabled) await tx1.prove();
    tx1.sign([deployerKey, zkAppPrivateKey]);
    await tx1.send().wait();

    let errorCaught = false;
    try {
      const tx2 = await Mina.transaction(deployerAccount, () => {
        return zkApp.matchSecret(salt, incorrectSecret);
      });
      if (proofsEnabled) await tx2.prove();
      tx2.sign([deployerKey, zkAppPrivateKey]);
      await tx2.send().wait();
    } catch (error) {
      errorCaught = true;
    }

    expect(errorCaught).to.be.true;
  });
});


