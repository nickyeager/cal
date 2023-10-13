"use client";

//import useScroll from "@/lib/hooks/use-scroll";
// import { useSignInModal } from "./sign-in-modal";
// import UserDropdown from "./user-dropdown";
import Link from "next/link";

export default function PublicNavBar() {
  // const { SignInModal, setShowSignInModal } = useSignInModal();
  // const scrolled = useScroll(50);

  return (
    <>
      <div className="fixed top-0 z-30 flex w-full justify-center bg-white/0 transition-all">
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <Link href="/" className="font-display flex items-center text-2xl">
            <p>Drive Drop</p>
          </Link>
          <div>
            <button className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
