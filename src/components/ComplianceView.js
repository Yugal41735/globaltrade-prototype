import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  Chip,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CheckCircle,
  Recommend,
  MonetizationOn,
  ExpandMore,
  Link as LinkIcon
} from '@mui/icons-material';

const ComplianceView = ({ data }) => {
  if (!data) return null;

  return (
    <Grid container spacing={3}>
      {/* Requirements Section */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Mandatory Requirements
            </Typography>
            {data.requirements.mandatory.map((req, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {req.requirement}
                  </Typography>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {req.description}
                </Typography>
                <Typography variant="body2">
                  {req.details}
                </Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
              Recommended Requirements
            </Typography>
            {data.requirements.recommended.map((req, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Recommend color="info" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    {req.requirement}
                  </Typography>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {req.description}
                </Typography>
                <Typography variant="body2">
                  {req.details}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Incentives Section */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Available Incentives
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {data.incentives.map((incentive, index) => (
                <Chip
                  key={index}
                  icon={<MonetizationOn />}
                  label={incentive}
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* FAQs Section */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Frequently Asked Questions
            </Typography>
            {data.faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="medium">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Reference Links Section */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Useful Resources
            </Typography>
            <List>
              {data.referenceLinks.map((link, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <LinkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link href={link.url} target="_blank" rel="noopener">
                        {link.title}
                      </Link>
                    }
                    secondary={link.description}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ComplianceView;