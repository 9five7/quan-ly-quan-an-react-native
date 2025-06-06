import React from 'react';
import { View, Text } from 'react-native';
import { BarChart, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import tw from 'src/utils/tw';
import { Grid, XAxis } from 'src/components/CustomChartComponents';


const colors = [
  '#4285F4', // Chrome blue
  '#FF9500', // Safari orange
  '#FF2D55', // Firefox red
  '#007AFF', // Edge blue
  '#34C759'  // Other green
];

const DishBarChart = ({ chartData }: { chartData: any[] }) => {
  const preparedData = chartData
    .slice()
    .sort((a, b) => b.successOrders - a.successOrders)
    .map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
      svg: { fill: colors[index % colors.length] }
    }));

  return (
    <View style={tw`bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4`}>
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-bold`}>Xếp hạng món ăn</Text>
        <Text style={tw`text-sm text-gray-500`}>Được gọi nhiều nhất</Text>
      </View>

      <View style={{ height: 300, padding: 20, flexDirection: 'row' }}>
        <YAxis
          data={preparedData}
          yAccessor={({ index }) => index}
          contentInset={{ top: 10, bottom: 10 }}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={preparedData.length}
          formatLabel={(_, index) => preparedData[index].name}
        />
        
        <View style={{ flex: 1, marginLeft: 10 }}>
          <BarChart
            style={{ flex: 1 }}
            data={preparedData}
            horizontal={true}
            yAccessor={({ item }) => item.successOrders}
            svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
            contentInset={{ top: 10, bottom: 10 }}
            spacingInner={0.4}
            shape={shape.bar}
          >
            <Grid direction="VERTICAL" />
          </BarChart>
          
          <XAxis
            style={{ marginTop: 10 }}
            data={preparedData}
            xAccessor={({ item }) => item.successOrders}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 10, fill: 'black' }}
          />
        </View>
      </View>
    </View>
  );
};

export default DishBarChart;