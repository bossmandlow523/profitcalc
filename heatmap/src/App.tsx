import * as React from 'react';
import Box from '@mui/material/Box';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';
import { red, green, orange } from '@mui/material/colors';

function CustomHexagonCell(props: any) {
  const { x, y, width, height, ownerState, ...other } = props;

  const padding = 0;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const innerWidth = width - 2 * padding;
  const innerHeight = height - 2 * padding;

  const R = Math.min(innerHeight / 2, innerWidth / Math.sqrt(3));

  const points = [
    `${cx + R * Math.cos(Math.PI / 6)},${cy - R * Math.sin(Math.PI / 6)}`,
    `${cx + R * Math.cos(Math.PI / 6)},${cy + R * Math.sin(Math.PI / 6)}`,
    `${cx},${cy + R}`,
    `${cx - R * Math.cos(Math.PI / 6)},${cy + R * Math.sin(Math.PI / 6)}`,
    `${cx - R * Math.cos(Math.PI / 6)},${cy - R * Math.sin(Math.PI / 6)}`,
    `${cx},${cy - R}`,
  ].join(' ');

  return (
    <React.Fragment>
      <polygon
        {...other}
        points={points}
        fill={ownerState.color}
        stroke={ownerState.isHighlighted ? ownerState.color : 'none'}
        strokeWidth={ownerState.isHighlighted ? 2 : 0}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        pointerEvents="none"
        fill={ownerState.value > 50 ? 'white' : 'black'}
        fontSize="0.8em"
      >
        {ownerState.value}
      </text>
    </React.Fragment>
  );
}

export default function HeatmapLegend() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        slots={{ cell: CustomHexagonCell }}
        xAxis={[{ data: ['1', '2', '3', '4'], position: 'top', scaleType: 'band' }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'], scaleType: 'band' }]}
        series={[
          {
            data,
            highlightScope: { highlight: 'item' },
            colorMap: {
              type: 'continuous',
              min: 10,
              max: 90,
              changePoint: [
                { value: 10, color: red[700] },
                { value: 50, color: orange[500] },
                { value: 90, color: green[700] },
              ],
            },
          },
        ]}
        height={300}
        hideLegend={false}
        slotProps={{
          legend: {
            direction: 'vertical',
            position: { vertical: 'middle' },
            sx: { height: 200 },
          },
        }}
      />
    </Box>
  );
}