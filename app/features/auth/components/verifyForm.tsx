"use client";

import { Box, TextField, Button, Typography } from "@mui/material";
import React, { useState } from "react";

function VerificationForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setError("");

    console.log("Code entered:", code);

    // Example API call
    // await axios.post("http://localhost:3200/auth/verify-code", { code });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Box
        sx={{
          width: 350,
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          Verification Code
        </Typography>

        <Typography variant="body2" mb={2} textAlign="center">
          Please enter the 6-digit code sent to your email
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter Code"
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputProps={{ maxLength: 6 }}
            error={!!error}
            helperText={error}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Verify
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default VerificationForm;