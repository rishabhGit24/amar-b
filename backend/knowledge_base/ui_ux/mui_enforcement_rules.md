# Material-UI Enforcement Rules for AMAR System

## 🚨 CRITICAL: MANDATORY MUI IMPLEMENTATION

**EVERY generated project MUST use Material-UI components. This is NON-NEGOTIABLE and STRICTLY ENFORCED.**

## Enforcement Hierarchy

### 1. Planner Agent Requirements

- MUST specify Material-UI requirement in every plan
- MUST include MUI component specifications
- MUST note ThemeProvider setup requirement
- MUST validate that UI components use MUI patterns

### 2. Builder Agent Requirements

- MUST include MUI packages in package.json: @mui/material, @mui/icons-material, @emotion/react, @emotion/styled
- MUST implement ThemeProvider with custom theme
- MUST use MUI components instead of plain HTML
- MUST implement CssBaseline for CSS normalization
- MUST use sx prop for styling with theme integration
- MUST create professional, colorful designs

### 3. Deployer Agent Requirements

- MUST verify MUI packages are installed
- MUST check ThemeProvider configuration
- MUST validate component usage before deployment

## Mandatory Component Replacements

### ❌ NEVER USE (Plain HTML)

```typescript
// FORBIDDEN - Will cause project failure
<div>Content</div>
<h1>Title</h1>
<p>Text</p>
<button>Click</button>
<form>Form</form>
<input type="text" />
<nav>Navigation</nav>
<header>Header</header>
<footer>Footer</footer>
<section>Section</section>
<article>Article</article>
```

### ✅ ALWAYS USE (MUI Components)

```typescript
// REQUIRED - Must use these instead
<Box>Content</Box>
<Typography variant="h1">Title</Typography>
<Typography variant="body1">Text</Typography>
<Button variant="contained">Click</Button>
<Box component="form">Form</Box>
<TextField />
<AppBar><Toolbar>Navigation</Toolbar></AppBar>
<Box component="header">Header</Box>
<Box component="footer">Footer</Box>
<Container>Section</Container>
<Card>Article</Card>
```

## Mandatory Package.json Dependencies

**EVERY project MUST include these exact dependencies:**

```json
{
  "@mui/material": "^5.14.0",
  "@mui/icons-material": "^5.14.0",
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0"
}
```

## Mandatory App Structure

**EVERY App.tsx or index.tsx MUST include:**

```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
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
      {/* App content with MUI components */}
    </ThemeProvider>
  );
}
```

## Validation Checklist

**Before any project is considered complete, ALL of these MUST be verified:**

- [ ] MUI packages included in package.json
- [ ] ThemeProvider wraps entire app
- [ ] CssBaseline component included
- [ ] Typography components used for ALL text
- [ ] Button components used for all clickable elements
- [ ] Container/Box components used for layout
- [ ] Card components used for content sections
- [ ] Grid/Stack used for responsive layouts
- [ ] AppBar/Toolbar used for navigation
- [ ] sx prop used for styling with theme values
- [ ] Icons from @mui/icons-material used
- [ ] Responsive breakpoints implemented
- [ ] Professional appearance achieved

## Failure Conditions

**A project is FAILED and MUST be regenerated if ANY of these occur:**

1. **Missing MUI Packages**: Package.json lacks any required MUI dependency
2. **No ThemeProvider**: App not wrapped in ThemeProvider
3. **Plain HTML Usage**: Any use of div, h1, p, button, etc. instead of MUI components
4. **No CssBaseline**: Missing CSS normalization
5. **Basic Appearance**: Unprofessional or plain design
6. **No Theme Integration**: Styling doesn't use theme values
7. **Non-Responsive**: No responsive breakpoints implemented

## Quality Standards

**Generated projects MUST achieve:**

- Professional, modern appearance
- Consistent color scheme using theme
- Responsive design across all screen sizes
- Accessible components (built into MUI)
- Fast loading and performance
- Clean, maintainable code structure

## Common MUI Patterns to Use

### Hero Section

```typescript
<Box sx={{
  background: 'linear-gradient(135deg, primary.main, secondary.main)',
  color: 'white',
  py: { xs: 8, md: 12 },
  textAlign: 'center'
}}>
  <Container maxWidth="md">
    <Typography variant="h1" gutterBottom>Hero Title</Typography>
    <Typography variant="h5" paragraph>Subtitle</Typography>
    <Button variant="contained" size="large">CTA</Button>
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

### Navigation

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

## Enforcement Actions

### For Non-Compliant Projects:

1. **Immediate Rejection**: Project marked as failed
2. **Regeneration Required**: Must be rebuilt with proper MUI implementation
3. **Quality Review**: Additional validation before deployment
4. **Documentation**: Failure logged for system improvement

### For Agents:

1. **Performance Tracking**: MUI compliance rates monitored
2. **Feedback Loop**: Non-compliant outputs trigger prompt updates
3. **Quality Gates**: Deployment blocked for non-MUI projects

## Success Metrics

**Projects are successful when they achieve:**

- 100% MUI component usage (zero plain HTML)
- Professional appearance rating
- Responsive design across all breakpoints
- Accessibility compliance (built into MUI)
- Fast build and deployment times
- User satisfaction with visual design

**Remember: This is production code that real users will interact with. Material-UI ensures professional quality, accessibility, and maintainability.**
