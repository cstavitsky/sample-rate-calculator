import React, { useState } from "react";
import {
  Container,
  Grid2,
  TextField,
  Typography,
  Paper,
  Box,
  Button,
} from "@mui/material";
import html2canvas from "html2canvas";

function App() {
  const [transactionsPerSession, setTransactionsPerSession] = useState("10");
  const [sessionsPerDay, setSessionsPerDay] = useState("5000");
  const [errorMessage, setErrorMessage] = useState("");
  const printRef = React.useRef();

  const maxTransactionsPerDay = 13824000;

  const handleDownloadImage = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = `samplerate_${samplePercentage}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

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
            Transaction Sample Rate Calculator
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
                <div ref={printRef} class="padded">
                  {samplePercentage === 100 ? (
                    <div>
                      <Typography
                        variant="h6"
                        color="green"
                        style={{ fontWeight: "bold" }}
                      >
                        Sampling at 100% is OK
                        <br />
                        (Estimated transactions/day is below the max)
                      </Typography>
                      <p>Calculation breakdown:</p>
                      Max transactions/project/day ={" "}
                      {maxTransactionsPerDay.toLocaleString()}
                      <br />
                      Estimated transactions/project/day ={" "}
                      {calculatedTransactions.toLocaleString()}
                      <br />
                    </div>
                  ) : (
                    <div>
                      <Typography
                        variant="h6"
                        color="error"
                        style={{ fontWeight: "bold" }}
                      >
                        Customer will need to sample!
                      </Typography>
                      <hr />
                      <Typography variant="h5">
                        <b>
                          Recommended tracesSampleRate: {samplePercentage / 100}{" "}
                        </b>
                      </Typography>
                      <p>Calculation breakdown:</p>
                      Max transactions/project/day ={" "}
                      {maxTransactionsPerDay.toLocaleString()}
                      <br />
                      Estimated transactions/project/day ={" "}
                      {calculatedTransactions.toLocaleString()}
                      <br />
                      Sample rate = ({maxTransactionsPerDay.toLocaleString()} /{" "}
                      {calculatedTransactions.toLocaleString()}) * 100% ={" "}
                      {samplePercentage}%
                      <br />
                    </div>
                  )}
                </div>
                <div>
                  <p></p>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleDownloadImage}
                  >
                    Download as Image
                  </Button>
                </div>
              </Box>
            </Grid2>
          )}
        </Grid2>
      </Paper>
    </Container>
  );
}

export default App;
