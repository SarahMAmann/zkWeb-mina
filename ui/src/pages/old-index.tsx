import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GradientBG from '../components/GradientBG.js';
import styles from '../styles/Home.module.css';
import zkwebLogo from '../../public/assets/zkweb-logo.svg';
import zkwebBannerImage from '../../public/assets/zkweb-banner-image.svg';
import { createClient } from '../utils/supabase/client'

let transactionFee = 0.1;
const ZKAPP_ADDRESS = 'B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP';

export default function Home() {
  const supabase = createClient();

  const [data, setData] = useState<any>(null);
  const [secretKey, setSecretKey] = useState('');
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: proofs } = await supabase.from("mina-proofs").select();
      console.log('proofs:', proofs)
      setData(proofs);
    };
    fetchData();
  }, []);

  const prove = async (key: string) => {

    console.log('clicked', key)
    try {
      const response = await fetch('/api/prove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      const result = await response.json();
      setSecretKey('');
      setMessage(result.data);
    } catch (error) {
      console.error('Error validating proof:', error);
      setMessage('Validation failed');
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

          <input 
            className="custom-input" 
            placeholder="Enter the secret key..." 
            value={secretKey} 
            onChange={(e) => setSecretKey(e.target.value)} 
          />
          <button className="custom-button" onClick={() => prove(secretKey)}>Prove</button>

        </div>

        <div className={styles.grid}>
        {data?.map((item: any, index: any) => (
            <a
              key={index}
              href=""
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>
                <span>PROOF</span>
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
              <p className="date">{new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </a>
          ))}
        </div>
      </main>
    </GradientBG>
  </>
  );
}
