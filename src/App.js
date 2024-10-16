import React, { useState } from "react";
import {
  Container,
  Grid2,
  TextField,
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import html2canvas from "html2canvas";
import MathJax from "react-mathjax2";

const ascii = "U = 1/(R_(si) + sum_(i=1)^n(s_n/lambda_n) + R_(se))";

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
    <Container m style={{ marginTop: "50px" }}>
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
                  <TableContainer m component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Calculation</TableCell>
                          <TableCell align="right">Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            Estimated transactions/project/day
                          </TableCell>
                          <TableCell align="right">
                            {calculatedTransactions.toLocaleString()}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Max transactions/project/day</TableCell>
                          <TableCell align="right">
                            {maxTransactionsPerDay.toLocaleString()}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold" }}>
                            Recommended tracesSampleRate
                          </TableCell>
                          <TableCell align="right">
                            {samplePercentage === 100 ? (
                              <Typography
                                color="green"
                                style={{ fontWeight: "bold" }}
                              >
                                1.0
                              </Typography>
                            ) : (
                              <Typography
                                color="red"
                                style={{ fontWeight: "bold" }}
                              >
                                {samplePercentage / 100}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <p></p>
                  {samplePercentage === 100 ? (
                    <Typography color="green" style={{ fontWeight: "bold" }}>
                      <MathJax.Context input="ascii">
                        <div>
                          <MathJax.Node inline>
                            {`frac("estimated transactions")(day) < frac("max transactions")(day) => ${samplePercentage}%`}
                          </MathJax.Node>
                        </div>
                      </MathJax.Context>
                      <p></p>
                      <p></p>

                      <MathJax.Context input="ascii">
                        <div>
                          <MathJax.Node inline>
                            {`frac(${calculatedTransactions.toLocaleString()} " "transactions)(day) < frac(${maxTransactionsPerDay.toLocaleString()} " " transactions)(day) => ${samplePercentage}%`}
                          </MathJax.Node>
                        </div>
                      </MathJax.Context>
                    </Typography>
                  ) : (
                    <Typography color="error" style={{ fontWeight: "bold" }}>
                      <br />
                      <MathJax.Context input="ascii">
                        <div>
                          Reason for sample rate:{" "}
                          <MathJax.Node inline>
                            {`frac(${maxTransactionsPerDay.toLocaleString()} " "transactions)(day) * frac(day)(${calculatedTransactions.toLocaleString()} " "transactions)*100% = ${samplePercentage}%`}
                          </MathJax.Node>
                        </div>
                      </MathJax.Context>
                    </Typography>
                  )}
                </div>
                <div>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleDownloadImage}
                    style={{ marginTop: "20px" }}
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
