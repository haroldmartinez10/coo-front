"use client";
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useCreateQuote } from "../mutations/useCreateQuote";
import { QuoteBody } from "../types/quoteTypes";
import { QuoteSchema } from "../schemas/QuoteSchema";
import { ErrorResponse } from "@/shared/types/ErrorResponse";

const CITIES = ["Bogotá", "Medellín", "Cali", "Barranquilla"];

const CitySelect = ({ name, label }: { name: string; label: string }) => (
  <Field name={name}>
    {({ field, meta }: any) => (
      <FormControl
        fullWidth
        error={meta.touched && Boolean(meta.error)}
        required
      >
        <InputLabel>{label}</InputLabel>
        <Select {...field} label={label} value={field.value || ""}>
          {CITIES.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
        {meta.touched && meta.error && (
          <FormHelperText>{meta.error}</FormHelperText>
        )}
      </FormControl>
    )}
  </Field>
);

const CreateQuoteForm = () => {
  const [quoteCurrentPrice, setQuoteCurrentPrice] = useState(0);
  const { createQuoteAsync, isPending } = useCreateQuote();

  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const initialValues: QuoteBody = {
    originCity: "",
    destinationCity: "",
    weight: 0,
    height: 0,
    width: 0,
    length: 0,
  };

  const handleCreateOrder = async (values: QuoteBody) => {};

  const handleSubmit = async (values: QuoteBody) => {
    try {
      setSubmitError("");
      setSubmitSuccess("");
      const response = await createQuoteAsync({ body: values });

      setQuoteCurrentPrice(response.quote.price);
      setSubmitSuccess("¡Cotización creada exitosamente!");
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setSubmitError(
        errorResponse?.response?.data?.message ||
          "Ocurrió un error al crear la cotización"
      );
    }
  };

  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 4, margin: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Crear Nueva Cotización
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={QuoteSchema}
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
            <Form>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                <CitySelect name="originCity" label="Ciudad de Origen" />
                <CitySelect name="destinationCity" label="Ciudad de Destino" />
              </Stack>

              <Field
                as={TextField}
                fullWidth
                name="weight"
                label="Peso (kg)"
                type="number"
                inputProps={{ min: 0, step: 0.1 }}
                error={touched.weight && Boolean(errors.weight)}
                helperText={touched.weight && errors.weight}
                sx={{ mb: 2 }}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                {["height", "width", "length"].map((field) => (
                  <Field
                    key={field}
                    as={TextField}
                    fullWidth
                    name={field}
                    label={`${field === "height" ? "Altura" : field === "width" ? "Ancho" : "Largo"} (cm)`}
                    type="number"
                    inputProps={{ min: 0, step: 0.1 }}
                    error={
                      touched[field as keyof typeof touched] &&
                      Boolean(errors[field as keyof typeof errors])
                    }
                    helperText={
                      touched[field as keyof typeof touched] &&
                      errors[field as keyof typeof errors]
                    }
                  />
                ))}
              </Stack>

              {submitError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submitError}
                </Alert>
              )}
              {submitSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {submitSuccess}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting || isPending}
                sx={{ py: 1.5 }}
              >
                {isSubmitting || isPending ? "Creando..." : "Crear Cotización"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default CreateQuoteForm;
