// src/components/checkout/TotpModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Slide, Box, Alert
} from "@mui/material";
import KeyRoundedIcon from "@mui/icons-material/VpnKey";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function OtpInput({ value, onChange, disabled }) {
  const refs = useRef([]);
  const setAt = (i, v) => {
    const next = [...value];
    next[i] = v;
    onChange(next);
  };
  const handleChange = (e, i) => {
    let v = e.target.value.replace(/\D/g, "");
    if (i === 0 && v.length >= 2) {
      const arr = v.slice(0, 6).split("");
      const merged = [...value];
      for (let k = 0; k < 6; k++) merged[k] = arr[k] || merged[k] || "";
      onChange(merged);
      refs.current[Math.min(5, arr.length - 1)]?.focus();
      return;
    }
    if (v.length > 1) v = v[0];
    setAt(i, v);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };
  return (
    <Stack direction="row" spacing={1.2} justifyContent="center" mt={1}>
      {value.map((d, i) => (
        <Box
          key={i}
          component="input"
          ref={(el) => (refs.current[i] = el)}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          sx={{
            width: 50, height: 56, textAlign: "center", fontSize: 22,
            borderRadius: 2, border: "1px solid", borderColor: "divider",
            outline: "none", bgcolor: "background.paper", transition: "all .15s",
            boxShadow: "0 1px 0 rgba(0,0,0,.03)",
            "&:focus": {
              borderColor: "primary.main",
              boxShadow: (t) => `0 0 0 4px ${t.palette.primary.main}22`,
            },
            "&:disabled": { opacity: 0.6 },
          }}
        />
      ))}
    </Stack>
  );
}

export default function TotpModal({
  open, onClose, onSubmit,
  loading = false,
  title = "Xác thực Google Authenticator",
  helper = "Nhập mã 6 số để xác nhận giao dịch.",
}) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");

  const token = useMemo(() => otp.join(""), [otp]);
  const canSubmit = /^\d{6}$/.test(token) && !loading;

  // Chỉ reset khi modal mở ra lần đầu
  useEffect(() => {
    if (!open) return;
    setOtp(Array(6).fill(""));
    setError("");
  }, [open]);

  // Lắng nghe Enter/Esc riêng, không phụ thuộc canSubmit
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    const onEnter = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (/^\d{6}$/.test(token) && !loading) handleSubmit();
      }
    };
    window.addEventListener("keydown", onEsc);
    window.addEventListener("keydown", onEnter);
    return () => {
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("keydown", onEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, token, loading]);

  const handleSubmit = async () => {
    if (!/^\d{6}$/.test(token)) {
      setError("Mã Google Authenticator phải gồm 6 số");
      return;
    }
    try {
      setError("");
      await onSubmit?.(token);
    } catch (e) {
      setError(e?.response?.data?.message || "Xác thực thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      BackdropProps={{ sx: { backdropFilter: "blur(1px)" } }}
      PaperProps={{
        elevation: 8,
        sx: { borderRadius: 3, px: 2, py: 1.5, minWidth: 380 },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <KeyRoundedIcon color="primary" />
        <Typography component="span" fontWeight={700}>{title}</Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 0.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          {helper}
        </Typography>
        <OtpInput value={otp} onChange={setOtp} disabled={loading} />
        {error && (
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              mt: 2,
              animation: "shake .25s linear",
              "@keyframes shake": {
                "10%, 90%": { transform: "translateX(-1px)" },
                "20%, 80%": { transform: "translateX(2px)" },
                "30%, 50%, 70%": { transform: "translateX(-4px)" },
                "40%, 60%": { transform: "translateX(4px)" },
              },
            }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit">Huỷ</Button>
      <Button
  onClick={handleSubmit}
  disabled={!canSubmit}
  className="bg-primary text-white hover:bg-primary-dark"
>
  {loading ? "Đang xác nhận…" : "Xác nhận"}
</Button>

      </DialogActions>
    </Dialog>
  );
}
