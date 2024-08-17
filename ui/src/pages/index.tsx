
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GradientBG from '../components/GradientBG.js';
import styles from '../styles/Home.module.css';
import heroMinaLogo from '../../public/assets/hero-mina-logo.svg';
import arrowRightSmall from '../../public/assets/arrow-right-small.svg';
import zkwebLogo from '../../public/assets/zkweb-logo.svg';
import zkwebBannerImage from '../../public/assets/zkweb-banner-image.svg';

export default function Home() {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    (async () => {
      // const { Mina, PublicKey } = await import('o1js');
      // const { Add } = await import('../../../contracts/build/src/');

      // Update this to use the address (public key) for your zkApp account.
      // To try it out, you can try this address for an example "Add" smart contract that we've deployed to
      // Testnet B62qkwohsqTBPsvhYE8cPZSpzJMgoKn4i1LQRuBAtVXWpaT4dgH6WoA.
      const zkAppAddress = '';
      // This should be removed once the zkAppAddress is updated.
      if (!zkAppAddress) {
        console.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Testnet: B62qkwohsqTBPsvhYE8cPZSpzJMgoKn4i1LQRuBAtVXWpaT4dgH6WoA'
        );
      }
      //const zkApp = new Add(PublicKey.fromBase58(zkAppAddress))
    })();
  }, []);

  const deployContract = async () => {
    console.log('clicked')
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
      });

      const result = await response.json();
      setMessage(result.data);
    } catch (error) {
      console.error('Error deploying contract:', error);
      setMessage('Deployment failed');
    }
  };

  return (
    <>
    <Head>
      <title>zkWeb On-Chain</title>
      <meta name="description" content="built with o1js" />
      <link rel="icon" href="/assets/favicon.ico" />
    </Head>
    <GradientBG>
      <main className={styles.main}>
        <nav>
          <button className="nav-button">Get Started</button>
        </nav>
        <div className={styles.center}>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src={zkwebBannerImage}
              alt="Mina Logo"
              width={500}
              height="400"
              priority
            />
          </a>
          {/* <p className={styles.tagline}>
            built with
            <code className={styles.code}>o1js</code>
          </p> */}
          <input className="custom-input" placeholder="Enter the secret key..." />
          <button className="custom-button" onClick={() => deployContract()}>Prove</button>

        </div>
        {/* <p className={styles.start}>
          Get started by editing
          <code className={styles.code}>src/pages/index.js</code> or <code className={styles.code}>src/pages/index.tsx</code>
        </p> */}
        <div className={styles.grid}>
          <a
            href=""
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              <span>EXAMPLE 1</span>
              <div>
                <Image
                  src={zkwebLogo}
                  alt="Mina Logo"
                  width={36}
                  height={36}
                  priority
                />
              </div>
            </h2>
            <p>Correct key was provided</p>
          </a>
          <a
            href=""
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              <span>EXAMPLE 2</span>
              <div>
              <Image
                  src={zkwebLogo}
                  alt="Mina Logo"
                  width={36}
                  height={36}
                  priority
                />
              </div>
            </h2>
            <p>Correct key was provided</p>
          </a>
          <a
            href=""
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              <span>EXAMPLE 3</span>
              <div>
                <Image
                  src={zkwebLogo}
                  alt="Mina Logo"
                  width={36}
                  height={36}
                  priority
                />
              </div>
            </h2>
            <p>Correct key was provided</p>
          </a>
          <a
            href=""
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              <span>EXAMPLE 4</span>
              <div>
                <Image
                  src={zkwebLogo}
                  alt="Mina Logo"
                  width={36}
                  height={36}
                  priority
                />
              </div>
            </h2>
            <p>Correct key was provided</p>
          </a>
        </div>
      </main>
    </GradientBG>
  </>
  );
}
