import * as shape from "d3-shape";
import { format, parse } from "date-fns";
import React from "react";
import { Text, View } from "react-native";
import { Grid, LineChart, XAxis } from "react-native-svg-charts";
import tw from "src/utils/tw";

interface RevenueData {
  date?: string;  // Optional
  revenue?: number; // Optional
}


export function RevenueLineChart({
  revenueByDate,
}: {
  revenueByDate: RevenueData[];
}) {
  // Format data for the chart
  const formattedData = revenueByDate.map((item) => ({
    ...item,
    parsedDate: parse(item.date, "dd/MM/yyyy", new Date()),
  }));

  // Format X-axis labels based on data length
  const formatXLabel = (value: string, index: number) => {
    if (revenueByDate.length < 8) {
      return value;
    }
    if (revenueByDate.length < 33) {
      const date = parse(value, "dd/MM/yyyy", new Date());
      return format(date, "dd");
    }
    return "";
  };

  return (
    <View
      style={tw`bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4`}
    >
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-bold`}>Doanh thu</Text>
      </View>

      <View style={{ height: 300, padding: 20 }}>
        <LineChart
          style={{ flex: 1 }}
          data={formattedData}
          yAccessor={({ item }) => item.revenue}
          xAccessor={({ item }) => item.parsedDate.getTime()} // Convert date to number
          contentInset={{ top: 20, bottom: 20 }}
          curve={shape.curveLinear}
          svg={{
            stroke: "#4285F4", // Blue color
            strokeWidth: 2,
          }}
        >
           <Grid 
          direction={Grid.Direction.HORIZONTAL}
          svg={{ 
            stroke: 'rgba(0, 0, 0, 0.1)',
            strokeWidth: 1,
            strokeDasharray: [4, 4] // Thêm nếu muốn đường kẻ đứt nét
          }}
        />
        </LineChart>

        <XAxis
          style={{ marginTop: 10 }}
          data={formattedData}
          xAccessor={({ item }) => item.parsedDate.getTime()}
          contentInset={{ left: 10, right: 10 }}
          formatLabel={(value, index) =>
            formatXLabel(formattedData[index].date, index)
          }
          svg={{
            fontSize: 10,
            fill: "black",
          }}
          numberOfTicks={5}
        />
      </View>
    </View>
  );
}
