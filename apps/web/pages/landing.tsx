import { useLocale } from "@calcom/lib/hooks/useLocale";

import PageWrapper from "@components/PageWrapper";
import Footer from "@components/ui/Footer";
import PublicNavBar from "@components/ui/PublicNavBar";

export default function LandingPage() {
  const { t } = useLocale();
  return (
    /* <ShellMain hideHeadingOnMobile withoutMain={true} useShouldDisplayNavigationItem isPublic={true} title={"Drive Drop"} subtitle={"Pickleball clinics and tournaments"}>*/
    <div className="max-w-screen-lg">
      <PublicNavBar />
      <p className="text-subtle mt-6 text-xs leading-tight md:hidden">{t("more_page_footer")}</p>
      <Footer />
    </div>
    /* </ShellMain>*/
  );
}
LandingPage.PageWrapper = PageWrapper;
