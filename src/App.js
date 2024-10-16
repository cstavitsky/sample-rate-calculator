import React, { useState } from "react";
import {
  Container,
  Grid2,
  TextField,
  Typography,
  Paper,
  Box,
} from "@mui/material";

function App() {
  const [transactionsPerSession, setTransactionsPerSession] = useState("10");
  const [sessionsPerDay, setSessionsPerDay] = useState("5000");
  const [errorMessage, setErrorMessage] = useState("");

  const maxTransactionsPerDay = 13824000;

  // Utility function to format numbers with commas
  const formatNumberWithCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Remove commas for calculations
  const removeCommas = (value) => {
    return value.replace(/,/g, "");
  };

  // Handle form input with comma formatting
  const handleInput = (setState) => (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/,/g, ""); // Remove commas before processing

    if (/^\d*$/.test(numericValue)) {
      setState(formatNumberWithCommas(numericValue));
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a valid integer");
    }
  };

  // Calculate results
  const calculateTransactionsPerDay = () => {
    if (transactionsPerSession && sessionsPerDay) {
      const transactions = parseInt(removeCommas(transactionsPerSession));
      const sessions = parseInt(removeCommas(sessionsPerDay));
      return transactions * sessions;
    }
    return 0;
  };

  const calculatedTransactions = calculateTransactionsPerDay();

  // Calculate sampling percentage if exceeding max transactions per day
  const calculateSamplePercentage = () => {
    if (calculatedTransactions > maxTransactionsPerDay) {
      return ((maxTransactionsPerDay / calculatedTransactions) * 100).toFixed(
        3
      );
    }
    return 100;
  };

  const samplePercentage = calculateSamplePercentage();

  return (
    <Container maxWidth="m" style={{ marginTop: "50px" }}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Transaction Calculator
          </Typography>
        </Box>

        <Grid2 container spacing={6} direction="column" alignItems="center">
          <Grid2 item>
            <TextField
              label="Transactions per session"
              variant="outlined"
              fullWidth
              value={transactionsPerSession}
              onChange={handleInput(setTransactionsPerSession)}
              error={!!errorMessage}
              helperText={errorMessage ? "Please enter a valid integer" : ""}
            />
          </Grid2>

          <Grid2 item>
            <TextField
              label="Sessions per day"
              variant="outlined"
              fullWidth
              value={sessionsPerDay}
              onChange={handleInput(setSessionsPerDay)}
              error={!!errorMessage}
              helperText={errorMessage ? "Please enter a valid integer" : ""}
            />
          </Grid2>

          {calculatedTransactions > 0 && (
            <Grid2 item>
              <Box textAlign="left">
                <Typography variant="h6">
                  Max transactions/day: 13,824,000
                </Typography>
                <Typography variant="h6">
                  Estimated transactions/day:{" "}
                  {calculatedTransactions.toLocaleString()}
                </Typography>
                <hr />

                {calculatedTransactions > maxTransactionsPerDay ? (
                  <>
                    <Typography
                      variant="h6"
                      color="error"
                      style={{ fontWeight: "bold" }}
                    >
                      Customer will need to sample!
                    </Typography>
                    <hr />
                  </>
                ) : (
                  <Typography
                    variant="h6"
                    color="green"
                    style={{ fontWeight: "bold" }}
                  >
                    Sampling at 100% is OK.
                  </Typography>
                )}

                <Typography variant="h6">
                  {samplePercentage === 100 ? (
                    "(Estimated transactions/day is below the max)"
                  ) : (
                    <div>
                      <Typography variant="h5">
                        Recommended Sample Rate: {samplePercentage}%{" "}
                      </Typography>
                      <p>Calculation breakdown:</p>
                      Max transactions/day ={" "}
                      {maxTransactionsPerDay.toLocaleString()}
                      <br />
                      Estimated transactions/day ={" "}
                      {calculatedTransactions.toLocaleString()}
                      <br />
                      Sample rate = ({maxTransactionsPerDay.toLocaleString()} /
                      {calculatedTransactions.toLocaleString()}) * 100% ={" "}
                      {samplePercentage}%
                    </div>
                  )}
                </Typography>
              </Box>
            </Grid2>
          )}
        </Grid2>
      </Paper>
    </Container>
  );
}

export default App;
