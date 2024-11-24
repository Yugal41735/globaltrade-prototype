import React from 'react';
import { Skeleton, Card, CardContent, Grid } from '@mui/material';

export const LoadingSkeleton = () => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);