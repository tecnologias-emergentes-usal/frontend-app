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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        className="self-start p-2 rounded-lg mb-6 w-fit"
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
        </List>
        
        <List strongIos insetIos>
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
        </List>

        <Block className="flex justify-end p-0">
          <Button 
            clear 
            className="text-secondary p-0 m-0"
            onClick={() => navigate("/forgot-password")}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Block>

        {error && (
          <BlockFooter className="text-red-500">
            {error}
          </BlockFooter>
        )}
        
        <div className="space-y-4 mt-6">
          <Button
            large
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </Button>
        </div>

        <Block className="text-center p-0 mt-6">
          <p className="text-secondary">
            ¿No tienes una cuenta?{" "}
            <Button 
              clear 
              className="text-secondary font-medium p-0 m-0"
              onClick={() => navigate("/register")}
            >
              Regístrate
            </Button>
          </p>
        </Block>
      </form>
    </>
  );
} 