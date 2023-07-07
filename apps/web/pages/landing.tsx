import Head from "next/head";
import Link from "next/link";

/*import { APP_NAME, WEBSITE_URL } from "@calcom/lib/constants";*/
import { useLocale } from "@calcom/lib/hooks/useLocale";
/*import { Button } from "@calcom/ui";*/

import PageWrapper from "@components/PageWrapper";

export default function LandingPage() {
  const {t, isLocaleReady} = useLocale();
  if (!isLocaleReady) return null;
  return (
    <>
      <Head>
        <title>My Landing Page</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-100">
        <div className="max-w-2xl px-6 py-12 bg-white shadow-lg rounded-lg">
          <div className="text-center">
            <img
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
            <h1 className="mt-4 text-3xl font-semibold text-gray-800">
              Welcome to My Landing Page
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              A functional landing page built with Next.js and Tailwind CSS
            </p>
          </div>
          <div className="mt-6">
            <p className="text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              consequat, justo quis feugiat sagittis, tellus odio venenatis
              mauris.
            </p>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-center">
              <Link className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600" href="/about">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
LandingPage.PageWrapper = PageWrapper;
