import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api/v1";

const initialFormState = { email: "", password: "" };

const Login = () => {
  const [form, setForm] = useState(initialFormState);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Respuesta no válida del servidor");
      }

      setFeedback({
        type: "success",
        text: `Usuario logueado, el token generado es ${data.tokenJWT}`,
      });
      setForm(initialFormState);
    } catch (error) {
      setFeedback({
        type: "error",
        text: `Error al hacer proceso de login, error: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Iniciar sesión</h1>
        <p className="text-sm text-slate-500">Ingresa con tus credenciales registradas.</p>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="usuario@correo.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isSubmitting ? "Validando..." : "Ingresar"}
        </button>
      </form>

      {feedback && (
        <p
          className={`mt-6 rounded-lg px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {feedback.text}
        </p>
      )}
      
        <p className="text-sm text-slate-600 mt-4 text-center">
        ¿No tienes cuenta?
        <Link to="/register" className="text-indigo-600 font-semibold hover:underline ml-1">
        Crear cuenta
        </Link>
        </p>

    </section>
  );
};

export default Login;
