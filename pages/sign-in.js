import Head from 'next/head';
import { AccountVerificationForm } from '../components/AccountVerificationForm';

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Piper</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <main className="antialiased">
        <AccountVerificationForm />
      </main>
    </>
  );
}
