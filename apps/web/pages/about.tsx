import Head from "next/head";
import Link from "next/link";

/*import { APP_NAME, WEBSITE_URL } from "@calcom/lib/constants";*/
import { useLocale } from "@calcom/lib/hooks/useLocale";
/*import { Button } from "@calcom/ui";*/

import PageWrapper from "@components/PageWrapper";
import LandingPage from "./landing";
import NavigationBar from "@components/layouts/NavigationBar";

export default function AboutPage() {
  const {t, isLocaleReady} = useLocale();
  if (!isLocaleReady) return null;
  return (
    <>
      <Head>
        <title>
          Nicks Pickleball - About
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationBar />
      <div className="container my-24 mx-auto md:px-6">
        <section className="mb-32">

          <h1 className="mb-6 text-3xl font-bold">
            Nick Yeager
          </h1>

          <p>
            Nick Yeager is a dedicated pickleball coach with three years of invaluable experience in the sport. His enthusiasm for teaching others how to play pickleball has fueled her journey to becoming a recognized expert in the field.
          </p>
          <br/>
          <p>
            From his early days as a player, Nick's love for the game naturally evolved into a passion for sharing his skills with others. Over the past three years, he has honed his coaching abilities, imparting his knowledge to players of all ages and skill levels. Nick's patient and encouraging approach has helped countless individuals embrace the joy of pickleball while steadily improving their techniques.
          </p>
          <br/>
          <p>
            What sets Nick apart is his commitment to professional growth. He holds a certification from Pickleball Coaching International, a mark of his dedication to delivering top-notch coaching tailored to the unique needs of each player. His= coaching philosophy emphasizes skill development, strategic thinking, and fostering a sense of camaraderie within the pickleball community.
          </p>
          <br/>
          <p>
            When he's not on the court coaching, Nick remains an active participant in local tournaments and events. His personal experience as a player keeps him connected to the challenges and rewards that his students encounter. Whether you're a beginner taking your first steps on the court or an experienced player aiming to refine your skills, Nick's coaching is a testament to his passion for helping everyone discover the excitement of pickleball.
          </p>
        </section>
      </div>
    </>
  )
}

AboutPage.PageWrapper = PageWrapper;
