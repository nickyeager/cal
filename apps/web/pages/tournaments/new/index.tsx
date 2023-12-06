import Head from "next/head";

import { CreateANewTournament } from "@calcom/features/ee/tournaments/components";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { WizardLayout } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

const CreateNewLeaguePage = () => {
  const { t } = useLocale();
  return (
    <>
      <Head>
        <title>Create a new tournament</title>
        <meta name="description" content="Create a new tournament" />
      </Head>
      <CreateANewTournament />
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
