import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import NavigationBar from "@components/layouts/NavigationBar";


import PageWrapper from "@components/PageWrapper";
import {APP_NAME} from "@calcom/lib/constants";

export default function LandingPage() {
  useEffect(() => {
    const init = async () => {
      const {  initTE, Collapse } = await import("tw-elements");
      initTE({ Collapse });
    };
    init();
  }, []);
  //const {t, isLocaleReady} = useLocale();
  // if (!isLocaleReady) return null;
  return (
    <div className="bg-subtle">
      <Head>
        <title>
          Nicks Pickleball - Welcome
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="mb-40">
        <NavigationBar />
        <div className="px-6 py-12 text-center md:px-12 lg:text-left">
          <div className="w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl xl:px-32">
            <div className="grid items-center lg:grid-cols-2">
              <div className="mb-12 md:mt-12 lg:mt-0 lg:mb-0">
                <div
                  className="block rounded-lg bg-[hsla(0,0%,100%,0.55)] px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-[hsla(0,0%,5%,0.55)] dark:shadow-black/20 md:px-12 lg:-mr-14 backdrop-blur-[30px]">
                  <h1 className="mt-2 mb-16 text-4xl font-bold tracking-tight md:text-5xl xl:text-6xl">
                    Learn pickleball<br /><span className="text-primary">and have fun</span>
                  </h1>
                  <Link className="mb-2 inline-block rounded bg-primary px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] md:mr-2 md:mb-0"
                        href="/calendar" data-te-nav-link-ref data-te-ripple-init data-te-ripple-color="light">
                    Get started
                  </Link>
                  <Link className="inline-block rounded px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 dark:hover:bg-neutral-700 dark:hover:bg-opacity-40"
                        href="/about" data-te-nav-link-ref data-te-ripple-init data-te-ripple-color="light">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="md:mb-12 lg:mb-0">
                <img src="/photo_midjourney1.png"
                     className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
LandingPage.PageWrapper = PageWrapper;
