import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "@/header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Task test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={` ${inter.className}`}></main>
    </>
  );
}
