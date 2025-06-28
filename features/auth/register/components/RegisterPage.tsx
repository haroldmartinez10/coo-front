"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RegisterFormValues } from "@/features/auth/register/types/RegisterType";
import { RegisterSchema } from "@/features/auth/register/schemas/RegisterSchema";
import { registerService } from "@/features/auth/register/services/registerService";
import { ErrorResponse } from "@/shared/types/ErrorResponse";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const initialValues: RegisterFormValues = {
    name: "",
    email: "",
    password: "",
  };

  const router = useRouter();

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const res = await registerService(
        values.email,
        values.password,
        values.name
      );

      setRegisterError("");

      const signInResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInResponse?.ok) {
        router.refresh();
      }
    } catch (error: unknown) {
      const errorResponse = error as ErrorResponse;
      setRegisterError(errorResponse?.response?.data.error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Image src="/coo-logo.svg" alt="logo" width={150} height={150} />
          </Box>

          <Typography component="h1" variant="h6" sx={{ mb: 3 }}>
            Registro
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form style={{ width: "100%" }}>
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Nombre"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ mb: 2 }}
                />

                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ mb: 2 }}
                />

                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                {registerError && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ mt: 1, mb: 1, textAlign: "center" }}
                  >
                    {registerError}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  Crear Cuenta
                </Button>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tienes una cuenta?{" "}
              <Button
                onClick={() => router.push("/login")}
                variant="text"
                size="small"
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Inicia sesión aquí
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
