import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

type FormState = {
  name: string;
  email: string;
  phone: string;
  dateTime: string;
  message: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  dateTime: '',
  message: '',
};

const ContactPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ open: boolean; text: string; severity: 'success' | 'error' }>({
    open: false,
    text: '',
    severity: 'success',
  });

  const isValid = useMemo(() => {
    const hasCore = form.name.trim() && form.email.trim() && form.phone.trim() && form.dateTime.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    return Boolean(hasCore && emailOk);
  }, [form]);

  const onChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      setToast({ open: true, text: 'Please complete all required fields with a valid email.', severity: 'error' });
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSubmitting(false);
    setToast({ open: true, text: 'Reservation request received. We will call you shortly.', severity: 'success' });
    setForm(initialForm);
  };

  return (
    <Box>
      <Header />

      <Box sx={{ background: 'linear-gradient(130deg, #B23A48 0%, #5F3025 60%, #2A211D 100%)', color: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ mb: 2 }}>Contact & Reservations</Typography>
          <Typography variant="body1" sx={{ maxWidth: 760, opacity: 0.95 }}>
            Planning a dinner, birthday, or business meal? Reserve your table here and our team will confirm quickly.
            For immediate pickup orders, call us directly.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" color="primary.main" sx={{ mb: 2 }}>Bella Napoli Pizzeria</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>456 Little Italy Ave, Brooklyn, NY</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>(718) 555-PIZZA</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>hello@bellanapolipizza.com</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Hours</Typography>
                <Typography variant="body2" color="text.secondary">Mon-Thu 11:00 AM-10:00 PM</Typography>
                <Typography variant="body2" color="text.secondary">Fri-Sat 11:00 AM-11:30 PM</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Sun 12:00 PM-9:00 PM</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button href="tel:+17185557499" variant="contained" color="primary">Call Now</Button>
                  <Button href="mailto:hello@bellanapolipizza.com" variant="outlined" color="primary">Email Us</Button>
                </Stack>
                <Button
                  href="https://maps.google.com/?q=456+Little+Italy+Ave+Brooklyn+NY"
                  target="_blank"
                  rel="noreferrer"
                  sx={{ mt: 1.5 }}
                >
                  Open in Maps
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>Book a Table</Typography>
                <Box component="form" onSubmit={onSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Name" value={form.name} onChange={onChange('name')} required /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={form.email} onChange={onChange('email')} required /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={form.phone} onChange={onChange('phone')} required /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Date & Time" type="datetime-local" InputLabelProps={{ shrink: true }} value={form.dateTime} onChange={onChange('dateTime')} required /></Grid>
                    <Grid item xs={12}><TextField fullWidth multiline minRows={4} label="Special requests" value={form.message} onChange={onChange('message')} placeholder="Dietary needs, seating preference, occasion..." /></Grid>
                  </Grid>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2.5 }}>
                    <Button type="submit" disabled={!isValid || submitting} variant="contained" color="primary">
                      {submitting ? 'Submitting...' : 'Send Reservation Request'}
                    </Button>
                    <Button type="button" onClick={() => setForm(initialForm)} variant="outlined" color="primary">Reset</Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />

      <Snackbar open={toast.open} autoHideDuration={3500} onClose={() => setToast((p) => ({ ...p, open: false }))}>
        <Alert severity={toast.severity} onClose={() => setToast((p) => ({ ...p, open: false }))}>
          {toast.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
