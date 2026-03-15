import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

// --- Type Definitions ---

/**
 * Represents a social media link for a team member.
 */
interface SocialLink {
  icon: React.ElementType;
  url: string;
  label: string;
}

/**
 * Represents a single team member's data.
 */
interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  social?: SocialLink[];
}

/**
 * Props for the TeamSection component.
 */
interface TeamSectionProps {
  members?: TeamMember[];
}

/**
 * Represents the state of the contact form.
 */
interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

/**
 * Represents validation errors for the contact form.
 */
interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Represents the expected response structure from the mock API.
 */
interface FormSubmissionResponse {
  success: boolean;
  message: string;
}

// --- Constants ---

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Chef Isabella Rossi",
    title: "Head Chef & Culinary Director",
    bio: "With over 15 years of experience in Michelin-starred kitchens, Chef Isabella brings a passion for innovative Italian cuisine and a commitment to fresh, seasonal ingredients. Her dishes are a symphony of flavors and textures.",
    image: "https://mui.com/static/images/avatar/1.jpg",
    social: [
      {
        icon: InstagramIcon,
        url: "https://instagram.com/isabella",
        label: "Instagram profile",
      },
      {
        icon: LinkedInIcon,
        url: "https://linkedin.com/in/isabella",
        label: "LinkedIn profile",
      },
    ],
  },
  {
    id: "2",
    name: "Chef Marco Bianchi",
    title: "Sous Chef & Pastry Specialist",
    bio: "Marco is a master of delicate pastries and exquisite desserts. His artistic flair and precision transform simple ingredients into edible works of art, delighting guests with every sweet creation.",
    image: "https://mui.com/static/images/avatar/2.jpg",
    social: [
      {
        icon: FacebookIcon,
        url: "https://facebook.com/marco",
        label: "Facebook profile",
      },
      {
        icon: TwitterIcon,
        url: "https://twitter.com/marco",
        label: "Twitter profile",
      },
    ],
  },
  {
    id: "3",
    name: "Chef Sofia Moretti",
    title: "Executive Sous Chef",
    bio: "Sofia is the backbone of our kitchen, ensuring smooth operations and consistent quality. Her expertise in Mediterranean flavors and her calm demeanor make her an invaluable asset to the team.",
    image: "https://mui.com/static/images/avatar/3.jpg",
    social: [
      {
        icon: InstagramIcon,
        url: "https://instagram.com/sofia",
        label: "Instagram profile",
      },
      {
        icon: EmailIcon,
        url: "mailto:sofia@example.com",
        label: "Email Sofia",
      },
    ],
  },
];

const MOCK_API_URL = "https://api.example.com/contact"; // Placeholder API URL

/**
 * A reusable component to display information about key team members or chefs,
 * including a contact form for inquiries.
 */
const TeamSection: React.FC<TeamSectionProps> = ({ members }) => {
  const teamMembers = members && members.length > 0 ? members : DEFAULT_MEMBERS;

  const [formState, setFormState] = useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field as user types
    if (formErrors[name as keyof ContactFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ContactFormErrors = {};
    if (!formState.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formState.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Email is invalid";
    }
    if (!formState.message.trim()) {
      errors.message = "Message is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      const response = await fetch(MOCK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: FormSubmissionResponse = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setFormState({ name: "", email: "", message: "" }); // Reset form
      } else {
        setIsError(true);
        setErrorMessage(data.message || "Submission failed. Please try again.");
      }
    } catch (error: unknown) {
      setIsError(true);
      if (error instanceof Error) {
        setErrorMessage("Failed to submit form: " + error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: "grey.50",
        color: "text.primary",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        {/* Section Title */}
        <Typography
          variant="h2"
          component="h2"
          sx={{
            mb: { xs: 4, md: 8 },
            fontWeight: 700,
            color: "primary.dark",
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.75rem" },
            letterSpacing: "-0.02em",
          }}
        >
          Meet Our Culinary Experts
        </Typography>

        {/* Team Members Grid */}
        <Grid container spacing={{ xs: 4, md: 6 }} justifyContent="center">
          {teamMembers.map((member) => (
            <Grid item key={member.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  boxShadow: 6,
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 12,
                  },
                  bgcolor: "background.paper",
                }}
              >
                <Avatar
                  alt={member.name}
                  src={member.image}
                  sx={{
                    width: { xs: 120, sm: 140 },
                    height: { xs: 120, sm: 140 },
                    mb: 3,
                    border: "4px solid",
                    borderColor: "primary.main",
                    boxShadow: 3,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 0, textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      mb: 1,
                      fontSize: { xs: "1.5rem", sm: "1.75rem" },
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary.main"
                    sx={{
                      mb: 2,
                      fontWeight: 500,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                    }}
                  >
                    {member.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      lineHeight: 1.6,
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                    }}
                  >
                    {member.bio}
                  </Typography>
                  {member.social && member.social.length > 0 && (
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {member.social.map((socialLink, index) => (
                        <IconButton
                          key={index}
                          component={Link}
                          href={socialLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={socialLink.label}
                          sx={{
                            color: "primary.dark",
                            "&:hover": {
                              color: "primary.main",
                              bgcolor: "primary.light",
                            },
                          }}
                        >
                          <socialLink.icon />
                        </IconButton>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <Divider
          sx={{
            my: { xs: 8, md: 12 },
            borderColor: "grey.300",
            borderBottomWidth: 2,
            width: "50%",
            mx: "auto",
          }}
        />

        {/* Contact Form Section */}
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            p: { xs: 3, sm: 5 },
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 4,
            textAlign: "left",
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: "primary.dark",
              textAlign: "center",
              fontSize: { xs: "2rem", sm: "2.5rem" },
            }}
          >
            Join Our Team or Inquire
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            Have a question or interested in becoming part of our culinary
            family? Reach out to us!
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Your Name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              error={!!formErrors.name}
              helperText={formErrors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Your Email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              error={!!formErrors.email}
              helperText={formErrors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Your Message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              multiline
              rows={5}
              required
              error={!!formErrors.message}
              helperText={formErrors.message}
              sx={{ mb: 3 }}
            />

            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress />
              </Box>
            )}

            {isSuccess && (
              <Alert severity="success" sx={{ my: 2 }}>
                Thank you for your message! We will get back to you shortly.
              </Alert>
            )}

            {isError && (
              <Alert severity="error" sx={{ my: 2 }}>
                {errorMessage ||
                  "Failed to send your message. Please try again later."}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TeamSection;
