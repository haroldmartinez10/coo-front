import useGetQuotes from "@/features/dashboarduser/quotes/queries/useGetQuotes";
import React from "react";

const QuotesHistoryPage = () => {
  const { data, isLoading, error } = useGetQuotes();
  return <div>QuotesHistoryPage</div>;
};

export default QuotesHistoryPage;
