import type { GetServerSidePropsContext } from "next";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

function RedirectPage() {
  return;
}

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const session = await getServerSession({ req, res });
  // check if the page they hit requires auth. If it does, redirect them there
  //return { redirect: { permanent: false, destination: "/landing" } };
  if (!session?.user?.id) {
    return { redirect: { permanent: false, destination: "/auth/login" } };
  }

  return { redirect: { permanent: false, destination: "/tournaments" } };
}

export default RedirectPage;
