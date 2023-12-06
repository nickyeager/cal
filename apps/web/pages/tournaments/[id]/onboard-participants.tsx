import Head from "next/head";

import AddNewTeamMembers from "@calcom/features/ee/teams/components/AddNewTeamMembers";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { WizardLayout } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

const OnboardTeamMembersPage = () => {
  const { t } = useLocale();
  return (
    <>
      <Head>
        <title>Add tournament participants or admins</title>
        <meta name="description" content="Add tournament participants" />
      </Head>
      <AddNewTeamMembers />
    </>
  );
};

OnboardTeamMembersPage.getLayout = (page: React.ReactElement) => (
  <WizardLayout currentStep={2} maxSteps={2}>
    {page}
  </WizardLayout>
);

OnboardTeamMembersPage.PageWrapper = PageWrapper;

export default OnboardTeamMembersPage;
