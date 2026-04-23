"use client";

import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import React, { useState } from "react";

function ForgotpwdForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email);

    // هنا تنجم تبعث request بـ axios
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
           <Paper elevation={4} sx={{ p: 4, width: 350 }}>
                <Typography variant="h5" textAlign="center" mb={3}>
                 Forgot Password
                </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Send Reset Link
        </Button>
      </form>
      </Paper>
    </Box>
  );
}

export default ForgotpwdForm;