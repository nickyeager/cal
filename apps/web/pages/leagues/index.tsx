import type { GetServerSidePropsContext } from "next";

import { getLayout } from "@calcom/features/MainLayout";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { TeamsListing } from "@calcom/features/ee/teams/components";
import { ShellMain } from "@calcom/features/shell/Shell";
import { WEBAPP_URL } from "@calcom/lib/constants";
import { getSafeRedirectUrl } from "@calcom/lib/getSafeRedirectUrl";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui";
import { Plus } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

import { ssrInit } from "@server/lib/ssr";

function Leagues() {
  const { t } = useLocale();
  const [user] = trpc.viewer.me.useSuspenseQuery();

  return (
    <ShellMain
      heading="League or Club"
      hideHeadingOnMobile
      subtitle="Create a new league or club"
      CTA={
        (!user.organizationId || user.organization.isOrgAdmin) && (
          <Button
            variant="fab"
            StartIcon={Plus}
            type="button"
            href={`${WEBAPP_URL}/leagues/new?returnTo=${WEBAPP_URL}/leagues`}>
            {t("new")}
          </Button>
        )
      }>
      <TeamsListing />
    </ShellMain>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const ssr = await ssrInit(context);
  await ssr.viewer.me.prefetch();
  const session = await getServerSession({ req: context.req, res: context.res });
  const token = context.query?.token;
  const resolvedUrl = context.resolvedUrl;

  const callbackUrl = token ? getSafeRedirectUrl(`${WEBAPP_URL}${resolvedUrl}`) : null;

  if (!session) {
    return {
      redirect: {
        destination: callbackUrl ? `/auth/login?callbackUrl=${callbackUrl}&teamInvite=true` : "/auth/login",
        permanent: false,
      },
      props: {},
    };
  }

  return { props: { trpcState: ssr.dehydrate() } };
};

Leagues.requiresLicense = false;
Leagues.PageWrapper = PageWrapper;
Leagues.getLayout = getLayout;
export default Leagues;
