import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import html2canvas from "html2canvas";
import MathJax from "react-mathjax2";

const ascii = "U = 1/(R_(si) + sum_(i=1)^n(s_n/lambda_n) + R_(se))";

function App() {
  const [transactionsPerSession, setTransactionsPerSession] = useState("10");
  const [sessionsPerDay, setSessionsPerDay] = useState("5000");
  const [eventsPerSecond, setEventsPerSecond] = useState(200); // new state for events per second
  const [errorMessage, setErrorMessage] = useState("");

  // New states for calculated transactions and sample percentage
  const [calculatedTransactions, setCalculatedTransactions] = useState(0);
  const [samplePercentage, setSamplePercentage] = useState(1.0);

  const printRef = React.useRef();

  const paddingForGrowthOrSpikes = 0.8; // 80%
  const timeMultipliers = 60 * 60 * 24;
  const maxTransactionsPerDay = eventsPerSecond * timeMultipliers;
  const paddedMaxTransactionsPerDay =
    maxTransactionsPerDay * paddingForGrowthOrSpikes;

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

  // useEffect to calculate transactions per day when inputs change
  useEffect(() => {
    const calculateTransactionsPerDay = () => {
      if (transactionsPerSession && sessionsPerDay) {
        const transactions = parseInt(removeCommas(transactionsPerSession));
        const sessions = parseInt(removeCommas(sessionsPerDay));
        return transactions * sessions;
      }
      return 0;
    };

    setCalculatedTransactions(calculateTransactionsPerDay());
  }, [transactionsPerSession, sessionsPerDay]);

  // useEffect to calculate sample percentage when calculated transactions or other inputs change
  useEffect(() => {
    const calculateSamplePercentage = () => {
      if (calculatedTransactions > paddedMaxTransactionsPerDay) {
        return (paddedMaxTransactionsPerDay / calculatedTransactions).toFixed(
          3
        );
      }
      return 1.0;
    };

    setSamplePercentage(calculateSamplePercentage());
  }, [calculatedTransactions, paddedMaxTransactionsPerDay]);

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

  return (
    <Container style={{ marginTop: "50px" }}>
      <Paper elevation={3} style={{ padding: "30px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography inline variant="h6">
              Transaction Sample Rate Calculator
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography inline variant="h6">
              1. How many transactions are generated in a "typical" session?
            </Typography>
            <Typography variant="body2">
              Have customer integrate Sentry locally with a 1.0 sample rate.
              Next, they should walk through a typical critical flow /
              user-journey. Check Sentry to see how many transactions showed up.
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <TextField
              label="Transactions per session"
              variant="outlined"
              fullWidth
              value={transactionsPerSession}
              onChange={handleInput(setTransactionsPerSession)}
              error={!!errorMessage}
              helperText={errorMessage ? "Please enter a valid integer" : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <hr />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="h6">
              2. How many sessions in a given day?
              <Typography variant="body2">
                Customers are likely already measuring and tracking this, so we
                can ask directly.
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Sessions per day"
              variant="outlined"
              fullWidth
              value={sessionsPerDay}
              onChange={handleInput(setSessionsPerDay)}
              error={!!errorMessage}
              helperText={errorMessage ? "Please enter a valid integer" : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <hr />
          </Grid>

          {/* Dropdown for Events per Second */}
          <Grid item xs={8}>
            <Typography variant="h6">
              3. How many events per second?
              <Typography variant="body2">
                Choose the expected number of events per second for the project
                (default is 200 transactions/second).
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Events per second</InputLabel>
              <Select
                value={eventsPerSecond}
                label="Events per second"
                onChange={(e) => setEventsPerSecond(e.target.value)}
              >
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={200}>200</MenuItem>
                <MenuItem value={300}>300</MenuItem>
                <MenuItem value={400}>400</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {calculatedTransactions > 0 && (
            <Grid item xs={12}>
              <Box textAlign="left">
                <div ref={printRef} className="padded">
                  <TableContainer m component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Transactions/session</TableCell>
                          <TableCell align="right">
                            <MathJax.Context input="ascii">
                              <div>
                                <MathJax.Node inline>
                                  {`${transactionsPerSession} " transactions/session"`}
                                </MathJax.Node>
                              </div>
                            </MathJax.Context>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sessions/day</TableCell>
                          <TableCell align="right">
                            <MathJax.Context input="ascii">
                              <div>
                                <MathJax.Node inline>
                                  {`${sessionsPerDay} " sessions/day"`}
                                </MathJax.Node>
                              </div>
                            </MathJax.Context>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            Events/second <br /> (per project)
                          </TableCell>
                          <TableCell align="right">
                            <MathJax.Context input="ascii">
                              <div>
                                <MathJax.Node inline>
                                  {`${eventsPerSecond} " events/second"`}
                                </MathJax.Node>
                              </div>
                            </MathJax.Context>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            True Max transactions/day <br />
                            (per project)
                          </TableCell>
                          <TableCell align="right">
                            <MathJax.Context input="ascii">
                              <div>
                                <MathJax.Node inline>
                                  {`(${eventsPerSecond} " transactions/second" * "60 seconds/minute" * "60 minutes/hour" * "24 hours/day") = ${maxTransactionsPerDay.toLocaleString()} " max transactions/day"`}
                                </MathJax.Node>
                              </div>
                            </MathJax.Context>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            Padded Max transactions/day <br /> (per project)
                          </TableCell>
                          <TableCell align="right">
                            <MathJax.Context input="ascii">
                              <div>
                                <MathJax.Node inline>
                                  {`(${maxTransactionsPerDay.toLocaleString()} " max transactions/day" * ${paddingForGrowthOrSpikes} " padding") = ${paddedMaxTransactionsPerDay.toLocaleString()} " padded max transactions/day"`}
                                </MathJax.Node>
                              </div>
                            </MathJax.Context>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            Estimated transactions/day <br /> (per project)
                          </TableCell>
                          <TableCell align="right">
                            <MathJax.Context input="ascii">
                              <div>
                                <MathJax.Node inline>
                                  {`(${transactionsPerSession.toLocaleString()} " transactions/session" * ${sessionsPerDay.toLocaleString()} " sessions/day") = ${calculatedTransactions.toLocaleString()} " estimated transactions/day"`}
                                </MathJax.Node>
                              </div>
                            </MathJax.Context>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold" }}>
                            Recommended tracesSampleRate
                          </TableCell>
                          <TableCell align="right">
                            {samplePercentage >= 1.0 ? (
                              <Typography color="green">
                                <MathJax.Context input="ascii">
                                  <div>
                                    <MathJax.Node inline>
                                      {`${calculatedTransactions.toLocaleString()} " transactions/day (per project)" < ${paddedMaxTransactionsPerDay.toLocaleString()} " transactions/day (per project)" => ${samplePercentage.toFixed(
                                        1
                                      )}`}
                                    </MathJax.Node>
                                  </div>
                                </MathJax.Context>
                              </Typography>
                            ) : (
                              <Typography
                                color="red"
                                style={{ fontWeight: "bold" }}
                              >
                                <MathJax.Context input="ascii">
                                  <div>
                                    <MathJax.Node inline>
                                      {`frac(${paddedMaxTransactionsPerDay.toLocaleString()} " padded max transactions/day")(${calculatedTransactions.toLocaleString()} " estimated transactions/day") "(per project)" = ${samplePercentage}`}
                                    </MathJax.Node>
                                  </div>
                                </MathJax.Context>
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <p></p>
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
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
