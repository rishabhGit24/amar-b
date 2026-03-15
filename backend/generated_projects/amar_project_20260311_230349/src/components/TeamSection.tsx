import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  useTheme,
} from '@mui/material';

/**
 * Defines the structure for a single team member's data.
 */
interface TeamMember {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
}

/**
 * Defines the props for the TeamSection component.
 * All props are optional.
 */
interface TeamSectionProps {
  members?: TeamMember[];
}

/**
 * Default team members to display if no custom members are provided.
 * Provides professional placeholder data for a polished look.
 */
const defaultMembers: TeamMember[] = [
  {
    name: 'Dr. Evelyn Reed',
    title: 'Chief Executive Officer',
    bio: 'Dr. Reed leads our strategic vision, driving innovation and fostering a culture of excellence. With over two decades in tech leadership, she is passionate about leveraging technology for social good.',
    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
  },
  {
    name: 'Marcus Chen',
    title: 'Chief Technology Officer',
    bio: 'Marcus is the architect behind our robust platforms, ensuring scalability and security. His expertise in full-stack development and cloud infrastructure is pivotal to our product success.',
    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
  },
  {
    name: 'Sophia Rodriguez',
    title: 'Head of Product',
    bio: 'Sophia translates user needs into compelling product features. Her user-centric approach and agile methodologies ensure we deliver intuitive and impactful solutions.',
    avatarUrl: 'https://mui.com/static/images/avatar/3.jpg',
  },
  {
    name: 'David Kim',
    title: 'Lead UX/UI Designer',
    bio: 'David crafts seamless and engaging user experiences. His keen eye for aesthetics and deep understanding of human-computer interaction define the look and feel of our applications.',
    avatarUrl: 'https://mui.com/static/images/avatar/4.jpg',
  },
];

/**
 * TeamSection component displays a list of key staff members with their photos and bios.
 * It is designed to be production-ready, visually polished, and fully responsive using Material UI.
 *
 * @param {TeamSectionProps} props - The props for the component.
 * @param {TeamMember[]} [props.members] - An optional array of team members to display.
 *                                         If not provided, a default set of members will be used.
 * @returns {JSX.Element} A Material UI Box containing the team section.
 */
const TeamSection: React.FC<TeamSectionProps> = ({ members }) => {
  const theme = useTheme();

  // Determine which members to render: provided members or default members.
  const teamMembersToRender = members && members.length > 0 ? members : defaultMembers;

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 }, // Responsive vertical padding
        backgroundColor: theme.palette.background.default, // Use theme's default background color
        color: theme.palette.text.primary, // Use theme's primary text color
        textAlign: 'center',
        overflow: 'hidden', // Prevents potential scrollbars from card shadows on hover
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2" // Semantic HTML for the main heading
          sx={{
            mb: { xs: 6, md: 8 }, // Responsive margin-bottom
            fontWeight: 700,
            color: theme.palette.primary.dark, // Distinct heading color for emphasis
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }, // Responsive font size
            letterSpacing: '-0.02em', // Slightly tighter letter spacing for modern look
          }}
        >
          Meet Our Visionary Team
        </Typography>

        <Grid
          container
          spacing={{ xs: 4, md: 6 }} // Responsive spacing between grid items
          justifyContent="center" // Center the grid items horizontally
        >
          {teamMembersToRender.map((member, index) => (
            <Grid
              item
              xs={12} // Full width on extra-small screens
              sm={6} // Two columns on small screens
              md={4} // Three columns on medium screens
              lg={3} // Four columns on large screens
              key={member.name + index} // Unique key for list rendering
            >
              <Card
                sx={{
                  height: '100%', // Ensures all cards in a row have equal height
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center', // Center content horizontally within the card
                  p: { xs: 3, sm: 4 }, // Responsive padding inside the card
                  borderRadius: theme.shape.borderRadius * 2, // More rounded corners for a softer look
                  boxShadow: theme.shadows[6], // Distinct elevation for cards
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth transition for hover effects
                  '&:hover': {
                    transform: 'translateY(-8px)', // Subtle lift effect on hover
                    boxShadow: theme.shadows[12], // Enhanced shadow on hover
                  },
                  backgroundColor: theme.palette.background.paper, // Card background color
                }}
              >
                <Avatar
                  alt={member.name} // Accessible alt text for the avatar image
                  src={member.avatarUrl}
                  sx={{
                    width: { xs: 100, sm: 120 }, // Responsive avatar size
                    height: { xs: 100, sm: 120 },
                    mb: { xs: 3, sm: 4 }, // Responsive margin-bottom below avatar
                    border: `4px solid ${theme.palette.primary.light}`, // Decorative border around avatar
                    boxShadow: theme.shadows[3], // Subtle shadow for the avatar
                  }}
                />
                <Stack spacing={1.5} sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    component="h3" // Semantic HTML for member name
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: { xs: '1.3rem', sm: '1.5rem' }, // Responsive font size
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="p" // Semantic HTML for member title
                    sx={{
                      color: theme.palette.primary.main, // Title in primary brand color
                      fontWeight: 500,
                      fontSize: { xs: '0.95rem', sm: '1.05rem' }, // Responsive font size
                    }}
                  >
                    {member.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p" // Semantic HTML for member bio
                    sx={{
                      color: theme.palette.text.secondary,
                      mt: 2, // Margin-top for separation from title
                      lineHeight: 1.6, // Improved readability for body text
                      fontSize: { xs: '0.85rem', sm: '0.9rem' }, // Responsive font size
                    }}
                  >
                    {member.bio}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;