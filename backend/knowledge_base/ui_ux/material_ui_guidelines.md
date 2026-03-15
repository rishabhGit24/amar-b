# Material-UI (MUI) Usage Guidelines for AMAR System

## 🚨 CRITICAL: MUI is MANDATORY for ALL Projects

**EVERY generated project MUST use Material-UI components throughout.** No plain HTML/CSS-only pages.

**THIS IS NON-NEGOTIABLE**: Any project generated without Material-UI components will be considered a failure and must be regenerated.

## Why Material-UI is Mandatory?

1. **Professional Design**: Pre-built, tested components with modern aesthetics
2. **Consistent Styling**: Cohesive design system across all elements
3. **Responsive by Default**: Mobile-friendly out of the box
4. **Accessibility Built-in**: WCAG compliant components
5. **Theming Support**: Easy color customization and branding
6. **Rich Component Library**: 50+ components ready to use
7. **Production Ready**: Battle-tested in thousands of applications
8. **No Version Conflicts**: Eliminates dependency and styling issues

## 🚨 MANDATORY MUI Packages - MUST BE INCLUDED

```json
{
  "@mui/material": "^5.14.0",
  "@mui/icons-material": "^5.14.0",
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0"
}
```

**These MUST be included in EVERY package.json - NO EXCEPTIONS**

## 🚨 MANDATORY: ThemeProvider Setup

**EVERY project MUST include a ThemeProvider with custom theme in App.tsx or index.tsx:**

```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark', // or 'light'
    primary: {
      main: '#667eea',
      light: '#a5b4fc',
      dark: '#4c51bf',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '3.5rem', fontWeight: 700 },
    h2: { fontSize: '2.5rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

**This setup is MANDATORY - no project should be generated without it.**

## Core MUI Components to Use

### Layout Components (Use in EVERY page)

```typescript
import { Box, Container, Grid, Stack } from '@mui/material';

// Container - wraps page content (maxWidth: 'sm', 'md', 'lg', 'xl')
<Container maxWidth="lg">
  {/* page content */}
</Container>

// Box - flexible container with sx prop for styling
<Box sx={{ bgcolor: 'primary.main', p: 4 }}>
  {/* content */}
</Box>

// Grid - responsive grid layout
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    {/* content */}
  </Grid>
  <Grid item xs={12} md={6}>
    {/* content */}
  </Grid>
</Grid>

// Stack - vertical/horizontal stacking with spacing
<Stack spacing={2} direction="row">
  {/* stacked items */}
</Stack>
```

### Typography Components (Use for ALL text)

```typescript
import { Typography } from '@mui/material';

// NEVER use plain <h1>, <h2>, <p> tags
// ALWAYS use Typography component

<Typography variant="h1" component="h1" gutterBottom>
  Page Title
</Typography>

<Typography variant="h2" gutterBottom>
  Section Heading
</Typography>

<Typography variant="h3" color="primary" gutterBottom>
  Subsection
</Typography>

<Typography variant="body1" paragraph>
  Body text with paragraph spacing
</Typography>

<Typography variant="body2" color="text.secondary">
  Secondary text (smaller, muted)
</Typography>

<Typography variant="caption" display="block">
  Caption text (very small, for labels)
</Typography>
```

**Typography Variants**:

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings
- `subtitle1`, `subtitle2` - Subheadings
- `body1`, `body2` - Body text
- `caption` - Small text
- `overline` - Overline text (uppercase, small)

### Button Components

```typescript
import { Button, IconButton, Fab } from '@mui/material';
import { Add, Send, Delete } from '@mui/icons-material';

// Primary action button
<Button variant="contained" color="primary" size="large">
  Get Started
</Button>

// Secondary button
<Button variant="outlined" color="secondary">
  Learn More
</Button>

// Text button
<Button variant="text" color="inherit">
  Cancel
</Button>

// Button with icon
<Button variant="contained" startIcon={<Send />}>
  Submit
</Button>

// Icon-only button
<IconButton color="primary">
  <Add />
</IconButton>

// Floating action button
<Fab color="primary" aria-label="add">
  <Add />
</Fab>
```

### Card Components

```typescript
import { Card, CardContent, CardActions, CardMedia, CardHeader } from '@mui/material';

<Card elevation={3}>
  <CardHeader
    title="Card Title"
    subheader="Subtitle"
  />
  <CardMedia
    component="img"
    height="200"
    image="/path/to/image.jpg"
    alt="Description"
  />
  <CardContent>
    <Typography variant="body2">
      Card content text
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Learn More</Button>
  </CardActions>
</Card>
```

### Form Components

```typescript
import { TextField, Select, MenuItem, Checkbox, Radio, FormControlLabel, FormGroup } from '@mui/material';

// Text input
<TextField
  label="Email"
  variant="outlined"
  fullWidth
  type="email"
  placeholder="you@example.com"
/>

// Select dropdown
<Select
  value={value}
  label="Category"
  onChange={handleChange}
>
  <MenuItem value="option1">Option 1</MenuItem>
  <MenuItem value="option2">Option 2</MenuItem>
</Select>

// Checkbox
<FormControlLabel
  control={<Checkbox />}
  label="I agree to terms"
/>

// Radio button
<FormControlLabel
  control={<Radio />}
  label="Option A"
/>
```

### Navigation Components

```typescript
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Home, Info, ContactMail } from '@mui/icons-material';

// App bar (header/navbar)
<AppBar position="sticky" color="primary">
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      Brand Name
    </Typography>
    <Button color="inherit">Login</Button>
  </Toolbar>
</AppBar>

// Navigation list
<List>
  <ListItem button>
    <ListItemIcon>
      <Home />
    </ListItemIcon>
    <ListItemText primary="Home" />
  </ListItem>
  <ListItem button>
    <ListItemIcon>
      <Info />
    </ListItemIcon>
    <ListItemText primary="About" />
  </ListItem>
</List>
```

## MUI Theme Configuration

### Create Theme in App.tsx or index.tsx

```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',  // Purple-blue
      light: '#a5b4fc',
      dark: '#4c51bf',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b',  // Orange
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#000000',
    },
    success: {
      main: '#10b981',  // Green
    },
    error: {
      main: '#ef4444',  // Red
    },
    warning: {
      main: '#f59e0b',  // Amber
    },
    info: {
      main: '#3b82f6',  // Blue
    },
    background: {
      default: '#f9fafb',  // Light gray
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',  // Dark gray
      secondary: '#6b7280',  // Medium gray
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',  // Don't uppercase buttons by default
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,  // Rounded corners
  },
  spacing: 8,  // Base spacing unit (8px)
});

// Wrap your app
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />  {/* Normalizes CSS */}
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## MUI `sx` Prop - The Power Tool

The `sx` prop allows inline styling with theme access and responsive design:

```typescript
<Box
  sx={{
    // Basic styles
    bgcolor: 'primary.main',  // Theme color
    color: 'white',
    p: 3,  // Padding: 3 * 8px = 24px
    m: 2,  // Margin: 2 * 8px = 16px
    borderRadius: 2,  // Border radius: 2 * 4px = 8px

    // Responsive styles
    width: {
      xs: '100%',    // Mobile: full width
      sm: '80%',     // Tablet: 80%
      md: '60%',     // Desktop: 60%
      lg: '50%',     // Large: 50%
    },

    // Hover effects
    '&:hover': {
      bgcolor: 'primary.dark',
      transform: 'scale(1.05)',
    },

    // Flexbox
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,

    // Gradients
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

    // Shadows
    boxShadow: 3,  // Theme shadow level (0-24)
  }}
>
  Content
</Box>
```

### Common `sx` Props

- **Spacing**: `p` (padding), `m` (margin), `px`, `py`, `pt`, `pr`, `pb`, `pl`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`
- **Sizing**: `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`
- **Colors**: `bgcolor`, `color`, `borderColor`
- **Typography**: `fontSize`, `fontWeight`, `textAlign`, `lineHeight`
- **Flexbox**: `display`, `flexDirection`, `alignItems`, `justifyContent`, `gap`
- **Grid**: `gridTemplateColumns`, `gridTemplateRows`, `gap`
- **Borders**: `border`, `borderRadius`, `borderTop`, `borderBottom`
- **Effects**: `boxShadow`, `opacity`, `transform`

## Example: Complete Landing Page with MUI

```typescript
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Stack,
} from '@mui/material';
import { Rocket, Speed, Security } from '@mui/icons-material';

const Home: React.FC = () => {
  return (
    <Box>
      {/* Header/Navbar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
             StartupName
          </Typography>
          <Button color="inherit">Features</Button>
          <Button color="inherit">Pricing</Button>
          <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h1" gutterBottom>
            Build Amazing Products Faster
          </Typography>
          <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
            The all-in-one platform that helps startups launch, grow, and scale
            with confidence. Trusted by 10,000+ companies worldwide.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button variant="contained" color="secondary" size="large">
              Get Started Free
            </Button>
            <Button variant="outlined" size="large" sx={{ borderColor: 'white', color: 'white' }}>
              Watch Demo
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Why Teams Choose Us
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Everything you need to succeed, all in one place
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                <Rocket sx={{ fontSize: 60 }} />
              </Box>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Fast Setup
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Get started in minutes with our intuitive onboarding process.
                  No technical expertise required - we guide you every step.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Box sx={{ color: 'secondary.main', mb: 2 }}>
                <Speed sx={{ fontSize: 60 }} />
              </Box>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Lightning Performance
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Built for speed with 99.9% uptime. Your users will love the
                  blazing-fast experience across all devices.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Box sx={{ color: 'success.main', mb: 2 }}>
                <Security sx={{ fontSize: 60 }} />
              </Box>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Enterprise Security
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Bank-grade encryption, SOC 2 certified, and GDPR compliant.
                  Your data is always safe with us.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
            Join thousands of teams already building with us
          </Typography>
          <Button variant="contained" color="secondary" size="large" sx={{ mt: 2 }}>
            Start Free Trial
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container>
          <Typography variant="body2" align="center">
            © 2024 StartupName. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
```

## MUI Component Checklist

Before generating code, ensure:

- [ ] **ThemeProvider** wraps the app with custom theme
- [ ] **CssBaseline** component included for CSS normalization
- [ ] **Container** components used for page layout (not plain divs)
- [ ] **Typography** components for ALL text (never plain h1/p tags)
- [ ] **Button** components for all clickable actions
- [ ] **Card** components for content sections
- [ ] **Grid** or **Stack** for layouts
- [ ] **AppBar** and **Toolbar** for navigation
- [ ] **Box** components with `sx` prop for custom styling
- [ ] **Icons** from @mui/icons-material where appropriate
- [ ] **Responsive** breakpoints using sx prop ({ xs, sm, md, lg, xl })
- [ ] **Color scheme** uses theme.palette colors
- [ ] **Spacing** uses theme spacing (sx={{ p: 2, m: 3, etc. }})

## Common MUI Patterns

### Hero Section

```typescript
<Box sx={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  py: { xs: 8, md: 12 },
  textAlign: 'center'
}}>
  <Container maxWidth="md">
    <Typography variant="h1" gutterBottom>Hero Title</Typography>
    <Typography variant="h5" paragraph>Subtitle</Typography>
    <Button variant="contained" color="secondary" size="large">CTA</Button>
  </Container>
</Box>
```

### Feature Grid

```typescript
<Grid container spacing={4}>
  {features.map((feature, index) => (
    <Grid item xs={12} md={4} key={index}>
      <Card elevation={2} sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>{feature.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {feature.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
```

### Navigation Bar

```typescript
<AppBar position="sticky">
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>Brand</Typography>
    <Button color="inherit">Home</Button>
    <Button color="inherit">About</Button>
    <Button variant="contained" color="secondary">Sign Up</Button>
  </Toolbar>
</AppBar>
```

## CRITICAL: Always Use MUI

❌ **NEVER** generate plain HTML like this:

```typescript
<div style={{ backgroundColor: '#000' }}>
  <h1>Title</h1>
  <p>Text</p>
  <button>Click</button>
</div>
```

✅ **ALWAYS** use MUI components:

```typescript
<Box sx={{ bgcolor: 'primary.main', p: 4 }}>
  <Typography variant="h1">Title</Typography>
  <Typography variant="body1">Text</Typography>
  <Button variant="contained">Click</Button>
</Box>
```

## Summary

**Material-UI is MANDATORY. Every generated project must:**

1. Include MUI packages in package.json
2. Wrap app in ThemeProvider with custom theme
3. Use MUI components (Box, Container, Typography, Button, Card, Grid, etc.)
4. Style with `sx` prop using theme values
5. Create colorful, professional designs
6. Be fully responsive with breakpoints

**NO plain HTML/CSS-only pages!**

## 🚨 ENFORCEMENT RULES FOR AGENTS

### For Planner Agent:

- MUST specify in plan that Material-UI is required
- MUST include MUI components in component specifications
- MUST note that ThemeProvider setup is required

### For Builder Agent:

- MUST include MUI packages in every package.json
- MUST set up ThemeProvider with custom theme
- MUST use MUI components instead of plain HTML elements
- MUST use sx prop for styling instead of inline styles where possible
- MUST create professional, colorful designs using MUI theme system

### For Deployer Agent:

- MUST verify MUI packages are installed before deployment
- MUST check that ThemeProvider is properly configured
- MUST validate that components use MUI instead of plain HTML

## 🚨 VALIDATION CHECKLIST

Before any project is considered complete, verify:

- [ ] **Package.json includes**: @mui/material, @mui/icons-material, @emotion/react, @emotion/styled
- [ ] **ThemeProvider** wraps the entire app with custom theme
- [ ] **CssBaseline** component is included
- [ ] **Typography** components used for ALL text (no plain h1, p, span tags)
- [ ] **Button** components used for all clickable elements
- [ ] **Container/Box** components used for layout (no plain divs)
- [ ] **Card** components used for content sections
- [ ] **Grid** or **Stack** used for responsive layouts
- [ ] **AppBar/Toolbar** used for navigation
- [ ] **sx prop** used for styling with theme values
- [ ] **Icons** from @mui/icons-material used where appropriate
- [ ] **Responsive breakpoints** implemented using sx prop
- [ ] **Color scheme** uses theme.palette colors consistently
- [ ] **Professional appearance** with modern design patterns

**If ANY of these items are missing, the project MUST be regenerated with proper MUI implementation.**

## 🚨 FAILURE CONDITIONS

A project is considered FAILED and must be regenerated if:

- Plain HTML elements (div, h1, p, button) are used instead of MUI components
- No ThemeProvider setup is present
- MUI packages are missing from package.json
- Styling uses only inline styles without MUI theme integration
- Design looks basic or unprofessional
- No responsive design implementation
- Missing CssBaseline component

**Zero tolerance for non-MUI implementations.**
