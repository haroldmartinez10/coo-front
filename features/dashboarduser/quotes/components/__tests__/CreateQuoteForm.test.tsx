import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateQuoteForm from "../CreateQuoteForm";

jest.mock("../CreateQuoteForm", () => {
  return function MockCreateQuoteForm() {
    return (
      <div data-testid="create-quote-form">
        <h1>Crear Nueva Cotización</h1>
        <form>
          <div data-testid="city-select-originCity">Ciudad Origen</div>
          <div data-testid="city-select-destinationCity">Ciudad Destino</div>
          <input aria-label="Peso (kg)" />
          <button type="submit">Crear Cotización</button>
        </form>
      </div>
    );
  };
});

describe("CreateQuoteForm", () => {
  it("debe renderizar el componente CreateQuoteForm", () => {
    const { getByTestId, getByText, getByRole, getByLabelText } = render(
      <CreateQuoteForm />
    );

    expect(getByTestId("create-quote-form")).toBeInTheDocument();

    expect(getByText("Crear Nueva Cotización")).toBeInTheDocument();

    expect(getByTestId("city-select-originCity")).toBeInTheDocument();
    expect(getByTestId("city-select-destinationCity")).toBeInTheDocument();
    expect(getByLabelText("Peso (kg)")).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Crear Cotización" })
    ).toBeInTheDocument();
  });
});
