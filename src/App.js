import React, { useState } from "react";

const TransactionCalculator = () => {
  const [transactionsPerSession, setTransactionsPerSession] = useState("");
  const [sessionsPerDay, setSessionsPerDay] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_TRANSACTIONS_PER_DAY = 13824000;
  const MAX_TRANSACTIONS_CALCULATION = 17280000 * 0.8;

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Validate input to allow only integers
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setErrorMessage("");
      setter(value);
    } else {
      setErrorMessage("Please enter a valid integer.");
    }
  };

  // Calculate total transactions per day
  const calculateTransactionsPerDay = () => {
    const transactions = parseInt(transactionsPerSession, 10);
    const sessions = parseInt(sessionsPerDay, 10);

    if (!transactions || !sessions) {
      return 0;
    }
    return transactions * sessions;
  };

  // Calculate sampling rate if transactions exceed max
  const calculateSampleRate = (transactionsPerDay) => {
    if (transactionsPerDay <= MAX_TRANSACTIONS_PER_DAY) {
      return 100;
    }
    return (MAX_TRANSACTIONS_PER_DAY / transactionsPerDay) * 100;
  };

  const transactionsPerDay = calculateTransactionsPerDay();
  const sampleRate = calculateSampleRate(transactionsPerDay);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Transaction Calculator</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Number of transactions generated in a typical session
          (transactions/session):
          <input
            type="text"
            value={transactionsPerSession}
            onChange={handleInputChange(setTransactionsPerSession)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Number of sessions per day (sessions/day):
          <input
            type="text"
            value={sessionsPerDay}
            onChange={handleInputChange(setSessionsPerDay)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div style={{ marginTop: "20px" }}>
        <h3>Calculated Values:</h3>
        <p>
          Transactions per day: {formatNumber(transactionsPerDay)}{" "}
          transactions/day
        </p>

        <p>
          Max number of transactions per day:{" "}
          {formatNumber(MAX_TRANSACTIONS_PER_DAY)} transactions/day (17,280,000
          transactions/day * 80%)
        </p>

        {transactionsPerDay > MAX_TRANSACTIONS_PER_DAY && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            You will need to sample the transactions.
          </p>
        )}

        <h3>Sample Rate Calculation:</h3>
        <p>Sample rate: {sampleRate.toFixed(3)}%</p>

        {transactionsPerDay > MAX_TRANSACTIONS_PER_DAY && (
          <p>
            Calculation breakdown: <br />
            Max transactions/day = {formatNumber(MAX_TRANSACTIONS_PER_DAY)}{" "}
            <br />
            Current transactions/day = {formatNumber(transactionsPerDay)} <br />
            Sample rate = ({formatNumber(MAX_TRANSACTIONS_PER_DAY)} /{" "}
            {formatNumber(transactionsPerDay)}) * 100 = {sampleRate.toFixed(3)}%
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionCalculator;
