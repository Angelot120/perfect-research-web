"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "../../authentication.css";
import PrimaryButton from "@/app/components/generals/buttons/PrimaryButton";
import { useRouter } from "next/navigation";

import { toast, Toaster } from "sonner";
import ButtonLoading from "@/app/components/Loading/ButtonLoading";
import { getApiUrl } from "@/app/lib/config";

const Login = () => {
  const [email, setEmail] = useState<string>("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({
    email: false,
  });

  const router = useRouter();

  const handleReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Réinitialiser les erreurs de champ
    setFieldErrors({
      email: !email,
    });

    // Validation de base
    if (!email) {
      setError("Veuillez remplir le champ Email.");
      setIsLoading(false);
      return;
    }

    try {
      // Appel à l'API de réinitialisation
      const response = await fetch(`${getApiUrl("/auth/forgot-password")}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("Réponse Email :", email);
      console.log("Réponse API :", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la réinitialisation"
        );
      }

      // Récupérer la réponse JSON
      const responseData = await response.json();
      console.log("Réponse API :", responseData); // Pour déboguer

      // Pas de tokens ici, juste une confirmation
      toast.success("Un email de réinitialisation a été envoyé !");
      router.push("/pages/authentication/forgotten-password/new-passwd");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation :", error);
      if (error instanceof Error) {
        toast.error(error.message || "Une erreur est survenue.");
      } else {
        toast.error("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-custom bg-[url('/file2.svg')] min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />
      <div className="auth-height flex flex-col min-h-screen w-full justify-center items-center">
        <div className="auth-page-all-items px-4 md:px-28 py-10 flex-grow grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] h-full gap-6">

          {/* ici le hidden md:blocksupprime l'affichage de ce image sur certaine écran */}
          {/* <div className="text-center hidden md:block">
            <Image
              src="/assets/images/svg/register-img.svg"
              alt="image"
              width={400}
              height={400}
              layout="contain"
            />
          </div> */}

          <div className="bg-white auth-form px-10 ">
            <br />
            <br />
            <span className="">
              <Image
                src="/assets/images/png/Plan de travail 1.png"
                alt="logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </span>

            <br />

            <h2 className="regular sub-title text-center">
              Renseignez votre email pour récupérer votre mot de passe.
            </h2>
            <br />
            <form>
              <label
                htmlFor="email"
                className={fieldErrors.email ? "text-red-500" : "regular"}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Votre Email ici..."
                id="email"
                className={`auth-input regular  bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all duration-200 text-gray-700 font-medium ${fieldErrors.email ? "border-red-500" : ""
                  }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <br />

              {error && <p className="text-red-500 text-center">{error}</p>}
              <br />
              {isLoading ? (
                <div className="btn btn-primary text-center w-full items-center justify-center">
                  <ButtonLoading />
                </div>
              ) : (
                <PrimaryButton onClick={handleReset} text="Récupérer" />
              )}
            </form>

            <br />

            <p className="text-center regular">
              Vous vous rappelez de votre mot de passe ?{" "}
              <Link
                href="/pages/authentication/login"
                className="text-blue-700 regular"
              >
                Se connecter
              </Link>
            </p>

            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
