import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mask } from "remask";
import "./style.css";

const schema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(14, "Telefone inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export default function App() {
  const [alertVisible, setAlertVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    setAlertVisible(true);
    reset();
  };

  useEffect(() => {
    if (alertVisible) {
      const timer = setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertVisible]);

  const handlePhoneChange = (e) => {
    const masked = mask(e.target.value, ["(99) 99999-9999"]);
    setValue("phone", masked);
  };

  return (
    <>
      {alertVisible && (
        <div className="alert-success">Cadastro realizado com sucesso!</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3>Cadastro de Usuário</h3>

        <label>Nome</label>
        <input type="text" {...register("name")} />
        {errors.name && <p className="error-message">{errors.name.message}</p>}

        <label>E-mail</label>
        <input type="email" {...register("email")} />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}

        <label>Telefone</label>
        <input
          type="text"
          {...register("phone")}
          value={watch("phone") || ""}
          onChange={handlePhoneChange}
          placeholder="(99) 99999-9999"
        />
        {errors.phone && (
          <p className="error-message">{errors.phone.message}</p>
        )}

        <label>Senha</label>
        <input type="password" {...register("password")} />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}

        <label>Confirmar Senha</label>
        <input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword.message}</p>
        )}

        <button type="submit">Cadastrar</button>
      </form>
    </>
  );
}
