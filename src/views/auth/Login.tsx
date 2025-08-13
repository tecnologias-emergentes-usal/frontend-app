import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { SurveillanceIcon } from "@/components";
import { SignIn } from "@clerk/clerk-react";

export function Login() {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate("/")}
        className="w-fit h-fit p-2 rounded-lg mb-6 hover:bg-gray-100 transition-colors"
      >
        <ChevronLeftIcon width={28} height={28} />
      </button>

      <div className="mb-6 flex justify-center">
        <SurveillanceIcon width={200} height={150} />
      </div>

      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/register"
      />
    </>
  );
}
