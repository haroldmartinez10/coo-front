import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
} from "@mui/material";
import useGetOrderTracking from "@/features/dashboarduser/orders/queries/useGetOrderTracking";
import {
  OrderStatusHistory,
  OrderTrackingResponse,
} from "@/features/dashboarduser/orders/types/orderTypes";

const StateOfOrder = () => {
  const [trackingCode, setTrackingCode] = useState<string>("");
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<OrderTrackingResponse | null>(
    null
  );

  const isValidCode = useMemo(
    () => trackingCode.trim().length >= 9,
    [trackingCode]
  );
  const { data, isLoading, error } = useGetOrderTracking(
    isValidCode ? trackingCode.trim() : ""
  );

  const statusConfig: Record<
    string,
    {
      text: string;
      color: "warning" | "info" | "success";
      step: number;
      desc: string;
    }
  > = {
    pending: {
      text: "Pendiente",
      color: "warning",
      step: 0,
      desc: "La orden ha sido recibida y está siendo procesada",
    },
    in_transit: {
      text: "En tránsito",
      color: "info",
      step: 1,
      desc: "El paquete está en camino hacia su destino",
    },
    delivered: {
      text: "Entregado",
      color: "success",
      step: 2,
      desc: "El paquete ha sido entregado exitosamente",
    },
  };

  const handleChange = (value: string) => {
    setTrackingCode(value);
    if (value.trim().length === 0) {
      setDisplayData(null);
      setSearchAttempted(false);
    } else if (value.trim().length >= 9) {
      setSearchAttempted(true);
    }
  };

  useEffect(() => {
    if (error && searchAttempted && isValidCode) setDisplayData(null);
    else if (data?.success && data.data && searchAttempted)
      setDisplayData(data);
  }, [data, error, searchAttempted, isValidCode]);

  const shouldShow = {
    loading: isLoading && searchAttempted && isValidCode,
    error: error && searchAttempted && isValidCode,
    data: displayData?.success && displayData.data && searchAttempted,
  };

  const getHelperText = () => {
    if (!trackingCode.trim())
      return "Ingresa tu código de seguimiento para ver el estado de tu orden";
    if (trackingCode.trim().length < 9)
      return "El código debe tener al menos 9 caracteres (Ej: COO-74212)";
    if (shouldShow.loading) return "Buscando información de la orden...";
    if (shouldShow.error)
      return "Código no encontrado. Verifica que sea correcto.";
    if (shouldShow.data) return "Información de la orden encontrada";
    return "Código válido - Buscando...";
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const currentStatus = displayData?.data?.status || "";
  const currentConfig = statusConfig[currentStatus];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Estado de la Orden (POLLING)
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Código de seguimiento"
            placeholder="Ej: COO-74212"
            value={trackingCode}
            onChange={(e) => handleChange(e.target.value)}
            helperText={getHelperText()}
            error={
              shouldShow.error ||
              (trackingCode.trim().length > 0 && trackingCode.trim().length < 9)
            }
            color={
              shouldShow.error
                ? "error"
                : shouldShow.data
                  ? "success"
                  : undefined
            }
          />
        </CardContent>
      </Card>

      {shouldShow.loading && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              p={2}
            >
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>
                Buscando información de la orden...
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {shouldShow.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          No se encontró ninguna orden con el código "{trackingCode.trim()}".
          Verifica que el código sea correcto.
        </Alert>
      )}

      {shouldShow.data && (
        <Card>
          <CardContent>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Seguimiento del Envío</Typography>
              <Chip
                label={currentConfig?.text || currentStatus}
                color={currentConfig?.color || "default"}
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            <Stepper
              activeStep={currentConfig?.step || 0}
              orientation="vertical"
            >
              {Object.entries(statusConfig).map(([key, config]) => (
                <Step key={key}>
                  <StepLabel>{config.text}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      {config.desc}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {displayData?.data?.statusHistory &&
              displayData.data.statusHistory.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Historial de Estados
                  </Typography>
                  {displayData.data.statusHistory
                    .sort(
                      (a: OrderStatusHistory, b: OrderStatusHistory) =>
                        new Date(b.changed_at).getTime() -
                        new Date(a.changed_at).getTime()
                    )
                    .map((history: OrderStatusHistory, index: number) => {
                      const historyConfig = statusConfig[history.status];
                      return (
                        <Paper
                          key={history.id}
                          sx={{
                            p: 2,
                            mb: 1,
                            border: index === 0 ? "2px solid" : "1px solid",
                            borderColor:
                              index === 0 ? "primary.main" : "divider",
                          }}
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Chip
                                label={historyConfig?.text || history.status}
                                color={historyConfig?.color || "default"}
                                size="small"
                                variant={index === 0 ? "filled" : "outlined"}
                              />
                              {history.notes && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  {history.notes}
                                </Typography>
                              )}
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontWeight: index === 0 ? "bold" : "normal",
                              }}
                            >
                              {formatDate(history.changed_at)}
                            </Typography>
                          </Box>
                        </Paper>
                      );
                    })}
                </Box>
              )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default StateOfOrder;
