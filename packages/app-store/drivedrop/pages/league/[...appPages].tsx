import { getLayout } from "@calcom/features/MainLayout";
import { TeamsListing } from "@calcom/features/ee/teams/components";
import { ShellMain } from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import type {
  AppGetServerSidePropsContext,
  AppPrisma,
  AppSsrInit,
  AppUser,
} from "@calcom/types/AppGetServerSideProps";

import PageWrapper from "@components/PageWrapper";

function Leagues() {
  const { t } = useLocale();
  const [user] = trpc.viewer.me.useSuspenseQuery();

  return (
    <ShellMain
      heading="Create or manage leagues/clubs"
      hideHeadingOnMobile
      subtitle="Create or manage leagues or clubs">
      <TeamsListing />
    </ShellMain>
  );
}

export const getServerSideProps = async (
  context: AppGetServerSidePropsContext,
  prisma: AppPrisma,
  user: AppUser,
  ssrInit: AppSsrInit
) => {
  const ssr = await ssrInit(context);
  await ssr.viewer.me.prefetch();
  // const session = await getServerSession({ req: context.req, res: context.res });
  // const token = context.query?.token;
  // const resolvedUrl = context.resolvedUrl;
  //
  // const callbackUrl = token ? getSafeRedirectUrl(`${WEBAPP_URL}${resolvedUrl}`) : null;
  //
  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: callbackUrl ? `/auth/login?callbackUrl=${callbackUrl}&teamInvite=true` : "/auth/login",
  //       permanent: false,
  //     },
  //     props: {},
  //   };
  // }

  return { props: { trpcState: ssr.dehydrate() } };
};

Leagues.requiresLicense = false;
Leagues.PageWrapper = PageWrapper;
Leagues.getLayout = getLayout;
export default Leagues;
