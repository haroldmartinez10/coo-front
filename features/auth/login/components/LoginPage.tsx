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
import { LoginFormValues } from "@/features/auth/login/types/LoginType";
import { LoginSchema } from "@/features/auth/login/schemas/LoginSchema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const router = useRouter();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.ok) {
        setLoginError("");
        router.refresh();
      }

      if (response?.error) {
        setLoginError("Credenciales incorrectas");
      }
    } catch (error) {
      setLoginError("Ocurrió un error inesperado");
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
            Iniciar sesión
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form style={{ width: "100%" }}>
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
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
                  autoComplete="current-password"
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

                {/* Mensaje de error de login */}
                {loginError && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ mt: 1, mb: 1, textAlign: "center" }}
                  >
                    {loginError}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
                </Button>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tienes una cuenta?{" "}
              <Button
                onClick={() => router.push("/register")}
                variant="text"
                size="small"
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Regístrate aquí
              </Button>
            </Typography>
            <Button
              variant="text"
              size="small"
              sx={{ mt: 1, textTransform: "none" }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
