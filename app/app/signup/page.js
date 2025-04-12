import StartContainer from "@/components/layout/login/StartContainer";
import Link from "next/link";
import Image from "next/image";
import SignupForm from "@/components/layout/signup/SignupForm";

export default function SignUp() {
  return (
    <StartContainer>
      <div className="flex flex-col w-[350px] absolute -translate-x-1/2 -top-[220px]">
        <Link href="/" className="flex flex-col">
          <Image
            src="/logo/bohemauth-logo-white.svg"
            alt="Logo"
            width={100}
            height={100}
            className="invert -translate-x-4 translate-y-2"
          />
          <span className="font-bold inline-block text-4xl">BohemAuth</span>
        </Link>
        <SignupForm />
      </div>
    </StartContainer>
  );
}
