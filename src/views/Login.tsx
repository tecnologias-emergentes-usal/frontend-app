import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListInput,
  Button,
  BlockFooter,
  List,
  Block,
} from "konsta/react";
import { ArrowLeftIcon, EyeOpenIcon, EyeClosedIcon, EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/lib/auth";
import { SurveillanceIcon } from "@/components";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // Successful login will redirect via GuestGuard
    } catch (err) {
      setError("Credenciales inválidas. Intente nuevamente.");
    }
  };

  return (
    <>
      <Button
        clear
        outline
        onClick={() => navigate("/")}
        className="w-auto h-auto p-1 rounded-lg mb-6 flex-shrink-0 self-start"
      >
        <ArrowLeftIcon width={20} height={20} />
      </Button>

      <div className="mb-6 flex justify-center">
        <SurveillanceIcon width={200} height={150} />
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-left">Iniciar Sesión</h1>
        <p className="text-secondary text-lg text-left">Inicia sesión para continuar usando la app</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <List strongIos insetIos>
          <ListInput
            label="Email"
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            media={
              <EnvelopeClosedIcon width={24} height={24} />
            }
          />

          <div className="relative">
            <ListInput
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              media={
                <LockClosedIcon width={24} height={24} />
              }
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 p-1"
            >
              {showPassword ? (
                <EyeClosedIcon width={20} height={20} />
              ) : (
                <EyeOpenIcon width={20} height={20} />
              )}
            </button>
          </div>
          <div className="flex justify-end items-end">
            <Button
              clear
              disabled
              className="!w-fit text-primary hover:text-primary/80 font-medium decoration-1 underline-offset-4 text-sm p-0"
              onClick={() => navigate("/forgot-password")}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>
          <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg py-3 px-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </div>
        </List>

        {error && (
          <BlockFooter className="text-red-500">
            {error}
          </BlockFooter>
        )}
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-500">o</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Register Section */}
      <Block className="text-center bg-gray-50 rounded-lg px-6">
        <p className="text-gray-600 mb-2">
          ¿No tienes una cuenta?
        </p>
        <Button
          clear
          className="text-primary font-semibold hover:text-primary/80 bg-white border border-primary/20 rounded-md py-2 px-4 transition-colors"
          onClick={() => navigate("/register")}
        >
          Regístrate aquí
        </Button>
      </Block>
    </>
  );
} 