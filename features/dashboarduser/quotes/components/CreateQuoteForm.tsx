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
} from "@mui/material";
import { useCreateQuote } from "@/features/dashboarduser/quotes/mutations/useCreateQuote";
import { QuoteBody } from "@/features/dashboarduser/quotes/types/quoteTypes";
import { QuoteSchema } from "@/features/dashboarduser/quotes/schemas/QuoteSchema";
import { ErrorResponse } from "@/shared/types/ErrorResponse";
import { useCreateOrder } from "@/features/dashboarduser/orders/mutations/useCreateOrder";
import { OrderBody } from "@/features/dashboarduser/orders/types/orderTypes";
import { CitySelect } from "@/features/dashboarduser/quotes/components/CitiSelect";
import { useRouter } from "next/navigation";

const CreateQuoteForm = () => {
  const router = useRouter();
  const [quoteCurrentPrice, setQuoteCurrentPrice] = useState(0);

  const [isOrderCreated, setIsOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState(0);
  const { createQuoteAsync, isPending } = useCreateQuote();
  const { createOrderAsync, isPending: isPendingCreateOrder } =
    useCreateOrder();

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

  const formatCop = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const handleCreateOrder = async (values: OrderBody) => {
    try {
      setSubmitError("");
      setSubmitSuccess("");
      const response = await createOrderAsync({
        body: { ...values, basePrice: quoteCurrentPrice },
      });

      if (response) {
        setSubmitSuccess("¡Orden creada exitosamente!");
        setOrderId(response?.data.id);
        setIsOrderCreated(true);
      }
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setSubmitError(
        errorResponse?.response?.data?.message ||
          "Ocurrió un error al crear la orden"
      );
    }
  };

  const handleResetCotization = () => {
    setQuoteCurrentPrice(0);
    setSubmitError("");
    setSubmitSuccess("");
  };

  const handleSubmit = async (values: QuoteBody) => {
    if (isOrderCreated) {
      console.log("hello world");
      router.push(`/orders/${orderId}`);
      return;
    }

    if (quoteCurrentPrice > 0) {
      await handleCreateOrder(values as OrderBody);
      return;
    }
    try {
      setSubmitError("");
      setSubmitSuccess("");
      const response = await createQuoteAsync({ body: values });

      setQuoteCurrentPrice(response?.quote?.price);
      setSubmitSuccess(
        `Cotización creada exitosamente por valor de ${formatCop.format(
          response?.quote?.price
        )} `
      );
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setSubmitError(
        errorResponse?.response?.data?.message ||
          "Ocurrió un error al crear la cotización"
      );
    }
  };

  const textOfActionButton = isOrderCreated
    ? "IR A MI ORDEN"
    : !quoteCurrentPrice
      ? "Crear Cotización"
      : `Crear Orden por ${formatCop.format(quoteCurrentPrice)}`;

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
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                <CitySelect
                  name="originCity"
                  label="Ciudad de Origen"
                  disabled={quoteCurrentPrice > 0}
                />
                <CitySelect
                  name="destinationCity"
                  label="Ciudad de Destino"
                  disabled={quoteCurrentPrice > 0}
                />
              </Stack>

              <Field
                disabled={quoteCurrentPrice > 0}
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
                    disabled={quoteCurrentPrice > 0}
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
                disabled={isSubmitting || isPending || isPendingCreateOrder}
                sx={{ py: 1.5 }}
              >
                {isPendingCreateOrder ? "Creando orden..." : textOfActionButton}
              </Button>

              {quoteCurrentPrice > 0 && (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleResetCotization}
                  sx={{ py: 1.5, mt: 2, backgroundColor: "#000" }}
                >
                  Realizar otra cotización
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default CreateQuoteForm;
