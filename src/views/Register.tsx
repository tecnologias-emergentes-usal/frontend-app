import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListInput,
  Button,
  BlockFooter
} from "konsta/react";
import { useAuth } from "@/lib/auth";
import { ArrowLeftIcon, EyeOpenIcon, EyeClosedIcon, EnvelopeClosedIcon, LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // Implement registration logic here
      // For now, just redirect to login page
      navigate("/login");
    } catch (err) {
      setError("Error al registrar usuario");
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

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-left">Registrarse</h1>
        <p className="text-secondary text-lg text-left">Crea una cuenta para usar USAL Alert</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <List inset strong>
          <ListInput
            label="Nombre"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            media={
              <PersonIcon width={24} height={24} />
            }
          />
          <ListInput
            label="Email"
            type="email"
            placeholder="tu@email.com"
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
              placeholder="Tu contraseña"
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
          <div className="relative">
            <ListInput
              label="Confirmar Contraseña"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              media={
                <LockClosedIcon width={24} height={24} />
              }
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 p-1"
            >
              {showConfirmPassword ? (
                <EyeClosedIcon width={20} height={20} />
              ) : (
                <EyeOpenIcon width={20} height={20} />
              )}
            </button>
          </div>
        </List>

        {error && (
          <BlockFooter className="text-red-500">
            {error}
          </BlockFooter>
        )}

        <div className="mt-4 space-y-4">
          <Button
            large
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </Button>

          <div className="text-center">
            <p className="text-secondary">
              ¿Ya tienes una cuenta?{" "}
              <Button
                clear
                className="text-secondary font-medium p-0 m-0"
                onClick={() => navigate("/login")}
              >
                Inicia sesión
              </Button>
            </p>
          </div>
        </div>
      </form>
    </>
  );
} 