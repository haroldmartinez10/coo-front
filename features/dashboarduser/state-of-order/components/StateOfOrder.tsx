import React, { useState } from "react";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
} from "@mui/material";
import useGetOrderTracking from "../../orders/queries/useGetOrderTracking";
import { OrderStatus } from "../../orders/types/orderTypes";

const StateOfOrder = () => {
  const [trackingCode, setTrackingCode] = useState<string>("");
  const { data, isLoading, error } = useGetOrderTracking(trackingCode);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in_transit":
        return "info";
      case "delivered":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "in_transit":
        return "En tránsito";
      case "delivered":
        return "Entregado";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "in_transit":
        return 1;
      case "delivered":
        return 2;
      default:
        return 0;
    }
  };

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
            placeholder="Ej: COO-20250630-NK6R30"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value.trim())}
            variant="outlined"
            helperText="Ingresa tu código de seguimiento para ver el estado de tu orden"
          />
        </CardContent>
      </Card>

      {isLoading && trackingCode && (
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Buscando información de la orden...
          </Typography>
        </Box>
      )}

      {error && trackingCode && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al buscar la orden. Verifica que el código de seguimiento sea
          correcto.
        </Alert>
      )}

      {data?.success && data.data && (
        <Grid spacing={3}>
          <Grid>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Seguimiento del Envío
                </Typography>

                <Stepper
                  activeStep={getStepIndex(data.data.status)}
                  orientation="vertical"
                >
                  <Step>
                    <StepLabel>Pendiente</StepLabel>
                    <StepContent>
                      <Typography variant="body2">
                        La orden ha sido recibida y está siendo procesada
                      </Typography>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>En tránsito</StepLabel>
                    <StepContent>
                      <Typography variant="body2">
                        El paquete está en camino hacia su destino
                      </Typography>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Entregado</StepLabel>
                    <StepContent>
                      <Typography variant="body2">
                        El paquete ha sido entregado exitosamente
                      </Typography>
                    </StepContent>
                  </Step>
                </Stepper>

                {data.data.statusHistory &&
                  data.data.statusHistory.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Historial de Estados
                      </Typography>
                      {data.data.statusHistory
                        .sort(
                          (a, b) =>
                            new Date(b.changed_at).getTime() -
                            new Date(a.changed_at).getTime()
                        )
                        .map((history, index) => (
                          <Paper key={history.id} sx={{ p: 2, mb: 1 }}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box>
                                <Chip
                                  label={getStatusText(history.status)}
                                  color={getStatusColor(history.status) as any}
                                  size="small"
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
                              >
                                {formatDate(history.changed_at)}
                              </Typography>
                            </Box>
                          </Paper>
                        ))}
                    </Box>
                  )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StateOfOrder;
