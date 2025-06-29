import * as Yup from "yup";

const CITIES = ["Bogotá", "Medellín", "Cali", "Barranquilla"];

export const QuoteSchema = Yup.object().shape({
  originCity: Yup.string()
    .oneOf(CITIES, "Debe seleccionar una ciudad válida")
    .required("La ciudad de origen es requerida"),
  destinationCity: Yup.string()
    .oneOf(CITIES, "Debe seleccionar una ciudad válida")
    .required("La ciudad de destino es requerida")
    .test(
      "different-cities",
      "Las ciudades de origen y destino deben ser diferentes",
      function (value) {
        return value !== this.parent.originCity;
      }
    ),
  weight: Yup.number()
    .positive("El peso debe ser un número positivo")
    .required("El peso es requerido"),
  height: Yup.number()
    .positive("La altura debe ser un número positivo")
    .required("La altura es requerida"),
  width: Yup.number()
    .positive("El ancho debe ser un número positivo")
    .required("El ancho es requerido"),
  length: Yup.number()
    .positive("El largo debe ser un número positivo")
    .required("El largo es requerido"),
});
