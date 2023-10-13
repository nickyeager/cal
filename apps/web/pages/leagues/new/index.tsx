import Head from "next/head";

import { CreateANewTeamForm } from "@calcom/features/ee/teams/components";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { WizardLayout } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

const CreateNewLeaguePage = () => {
  const { t } = useLocale();
  return (
    <>
      <Head>
        <title>Create a new league</title>
        <meta name="description" content="Create a new league description" />
      </Head>
      <CreateANewTeamForm />
    </>
  );
};
const LayoutWrapper = (page: React.ReactElement) => {
  return (
    <WizardLayout currentStep={1} maxSteps={2}>
      {page}
    </WizardLayout>
  );
};

CreateNewLeaguePage.getLayout = LayoutWrapper;
CreateNewLeaguePage.PageWrapper = PageWrapper;

export default CreateNewLeaguePage;
