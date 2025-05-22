import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Navbar, 
  List, 
  ListInput, 
  Button, 
  BlockFooter 
} from "konsta/react";
import { useAuth } from "@/lib/auth";

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        onClick={() => navigate("/")}
        className="p-2 rounded-lg bg-gray-100 mb-6 flex items-center justify-center"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
          />
          <ListInput
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <ListInput
            label="Contraseña"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <ListInput
            label="Confirmar Contraseña"
            type="password"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
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