import { useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
} from "@mui/material";
import { postRequest } from "../../../models/requests";

let sentEmail;
function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a
          link to reset your password.
        </DialogContentText>
        <OutlinedInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
        />
        {message && (
          <Alert severity={message.includes("not") ? "error" : "success"}>
            {message} {message.includes("not") && `"${sentEmail}"`}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Close</Button>
        {
          <Button
            variant="contained"
            type="button"
            onClick={async () => {
              try {
                if (!email.trim()) return setMessage("Please write your email");
                const res = await postRequest("auth/forgot-password", {
                  email,
                });
                console.log(res);
                sentEmail = email;
                setMessage(res?.message);
              } catch (err) {
                console.log("bruhh", err);
              }
              // handleClose();
            }}
          >
            Send
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
