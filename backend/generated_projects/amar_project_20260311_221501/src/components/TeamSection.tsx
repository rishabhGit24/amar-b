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
  SxProps,
} from '@mui/material';
import { Theme } from '@mui/material/styles';

/**
 * Represents a single team member's data.
 */
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
}

/**
 * Props for the TeamSection component.
 */
interface TeamSectionProps {
  /**
   * An array of team members to display.
   * Each member should have a name, role, bio, and an optional avatar URL.
   * If not provided, a default set of members will be displayed.
   */
  teamMembers?: TeamMember[];
  /**
   * The main title for the team section.
   * Defaults to "Meet Our Visionaries".
   */
  title?: string;
  /**
   * A brief description or introductory text for the team section.
   * Defaults to "The dedicated minds driving innovation and excellence."
   */
  description?: string;
}

// Default team members to display if no `teamMembers` prop is provided.
const defaultTeamMembers: TeamMember[] = [
  {
    name: 'Alice Johnson',
    role: 'Chief Executive Officer',
    bio: 'Alice leads with a clear vision, fostering a culture of innovation and strategic growth. Her passion for technology and leadership drives our success.',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Bob Williams',
    role: 'Chief Technology Officer',
    bio: 'Bob is the architect of our technical strategy, ensuring our solutions are robust, scalable, and cutting-edge. He thrives on solving complex challenges.',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Carol Davis',
    role: 'Head of Product Development',
    bio: 'Carol translates user needs into impactful products, guiding our development teams with a user-centric approach and a keen eye for market trends.',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'David Miller',
    role: 'Lead UX/UI Designer',
    bio: 'David crafts intuitive and beautiful user experiences, ensuring our products are not only functional but also delightful to interact with.',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
  },
  {
    name: 'Eve Brown',
    role: 'Marketing Director',
    bio: 'Eve drives our brand forward, connecting with our audience through compelling stories and strategic campaigns that resonate and inspire.',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'Frank White',
    role: 'Senior Software Engineer',
    bio: 'Frank is a core contributor to our codebase, building high-quality, efficient software solutions and mentoring junior engineers.',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
  },
];

/**
 * A reusable component to showcase key team members, their roles, and a brief bio.
 * It is visually polished, responsive, and accessible, using only Material UI primitives.
 */
const TeamSection: React.FC<TeamSectionProps> = ({
  teamMembers = defaultTeamMembers,
  title = 'Meet Our Visionaries',
  description = 'The dedicated minds driving innovation and excellence.',
}) => {
  const theme = useTheme();

  const sectionSx: SxProps<Theme> = {
    py: { xs: 6, md: 10 },
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.text.primary,
  };

  const titleSx: SxProps<Theme> = {
    textAlign: 'center',
    mb: { xs: 2, md: 3 },
    fontWeight: 700,
    color: theme.palette.primary.dark,
  };

  const descriptionSx: SxProps<Theme> = {
    textAlign: 'center',
    mb: { xs: 6, md: 8 },
    maxWidth: 700,
    mx: 'auto',
    color: theme.palette.text.secondary,
  };

  const cardSx: SxProps<Theme> = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: { xs: 3, sm: 4 },
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.shadows[8],
    },
    backgroundColor: theme.palette.background.paper,
  };

  const avatarSx: SxProps<Theme> = {
    width: 120,
    height: 120,
    mb: 3,
    border: `4px solid ${theme.palette.primary.light}`,
    boxShadow: theme.shadows[4],
  };

  const nameSx: SxProps<Theme> = {
    fontWeight: 600,
    color: theme.palette.primary.main,
    mb: 0.5,
  };

  const roleSx: SxProps<Theme> = {
    color: theme.palette.text.secondary,
    mb: 2,
    fontStyle: 'italic',
  };

  const bioSx: SxProps<Theme> = {
    textAlign: 'center',
    color: theme.palette.text.primary,
    lineHeight: 1.6,
  };

  return (
    <Box component="section" sx={sectionSx} aria-labelledby="team-section-title">
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" sx={titleSx} id="team-section-title">
          {title}
        </Typography>
        <Typography variant="h6" component="p" sx={descriptionSx}>
          {description}
        </Typography>

        <Grid container spacing={{ xs: 4, md: 6 }} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={cardSx}>
                <Avatar
                  alt={member.name}
                  src={member.avatarUrl}
                  sx={avatarSx}
                  aria-label={`Avatar of ${member.name}`}
                >
                  {!member.avatarUrl && member.name.charAt(0)}
                </Avatar>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h5" component="h3" sx={nameSx}>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" component="p" sx={roleSx}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" component="p" sx={bioSx}>
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;