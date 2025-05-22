import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ListInput,
  Button,
  BlockFooter,
  List,
  Block,
} from "konsta/react";
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
        onClick={() => navigate("/")}
        className="p-2 rounded-lg bg-gray-100 mb-6 flex items-center justify-center"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor" />
              </svg>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" fill="currentColor" />
                </svg>
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22m-5-5c.34.3.68.62 1 .92-1.7 1.46-3.71 2.69-5 3.08-2.79.87-5.59.5-8.23-1.34-1.5-1.04-2.86-2.45-4.08-4.16.58-.86 1.23-1.71 1.97-2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
          
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-secondary text-sm">O inicia sesión con</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Button clear className="flex justify-center items-center border border-gray-300 rounded-lg p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325V22.676C0 23.407 0.593 24 1.325 24H12.82V14.706H9.692V11.084H12.82V8.413C12.82 5.313 14.713 3.625 17.479 3.625C18.804 3.625 19.942 3.724 20.274 3.768V7.008L18.356 7.009C16.852 7.009 16.561 7.724 16.561 8.772V11.085H20.148L19.681 14.707H16.561V24H22.677C23.407 24 24 23.407 24 22.675V1.325C24 0.593 23.407 0 22.675 0Z"
                  fill="#3b5998"
                />
              </svg>
            </Button>
            <Button clear className="flex justify-center items-center border border-gray-300 rounded-lg p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 0C5.372 0 0 5.373 0 12C0 18.627 5.372 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM19.369 11.999H16.006V8.636C16.006 8.048 15.528 7.57 14.94 7.57C14.352 7.57 13.874 8.048 13.874 8.636V11.999H10.511C9.923 11.999 9.445 12.477 9.445 13.065C9.445 13.653 9.923 14.131 10.511 14.131H13.874V17.494C13.874 18.082 14.352 18.56 14.94 18.56C15.528 18.56 16.006 18.082 16.006 17.494V14.131H19.369C19.957 14.131 20.435 13.653 20.435 13.065C20.435 12.477 19.957 11.999 19.369 11.999Z"
                  fill="#DB4437"
                />
              </svg>
            </Button>
            <Button clear className="flex justify-center items-center border border-gray-300 rounded-lg p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.05 12.536C17.0262 10.7086 17.9097 9.32706 19.6909 8.30497C18.7525 6.9125 17.3525 6.14062 15.5237 6.00497C13.7906 5.87497 11.9047 7.01497 11.3097 7.01497C10.6697 7.01497 8.96719 6.04687 7.69687 6.04687C4.43437 6.09375 1 8.59219 1 13.6659C1 15.1922 1.2675 16.7709 1.8025 18.3909C2.51562 20.5284 5.05312 24.0659 7.69531 23.9909C8.89844 23.9584 9.74219 23.1347 11.3084 23.1347C12.8278 23.1347 13.6059 23.9909 14.9734 23.9909C17.6309 23.9422 19.9359 20.7659 20.6031 18.6234C16.9022 16.8922 17.05 12.6359 17.05 12.536ZM14.1203 4.29844C15.5641 2.57031 15.4156 0.984375 15.3797 0.375C14.0594 0.446875 12.5344 1.27344 11.6797 2.27344C10.7344 3.34375 10.1641 4.65937 10.2906 5.98594C11.7141 6.09844 12.9 5.73594 14.1203 4.29844Z"
                  fill="black"
                />
              </svg>
            </Button>
          </div>
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