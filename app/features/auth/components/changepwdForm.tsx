"use client";

import { Box, TextField, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

function ChangepwdForm() {
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== cnfPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:3200/auth/change-password",
        {
          password,
        }
      );

      setSuccess("Password changed successfully");
      console.log(response.data);

    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
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
        <Typography variant="h5" textAlign="center" mb={2}>
          Change Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={cnfPassword}
            onChange={(e) => setCnfPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />

          {success && (
            <Typography color="green" mt={1}>
              {success}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Update Password
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default ChangepwdForm;