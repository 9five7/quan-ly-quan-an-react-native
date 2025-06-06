// src/components/CustomChartComponents.tsx
import { Grid as OriginalGrid, XAxis as OriginalXAxis } from 'react-native-svg-charts';
import React from 'react';

// Wrapper cho Grid để bỏ qua cảnh báo defaultProps
export const Grid = (props: any) => {
  return <OriginalGrid {...props} />;
};

// Wrapper cho XAxis để bỏ qua cảnh báo defaultProps
export const XAxis = (props: any) => {
  return <OriginalXAxis {...props} />;
};