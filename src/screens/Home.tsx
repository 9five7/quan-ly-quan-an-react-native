import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import dishesApiRequest from "src/apiRequests/dishes";

import { DishListResType } from "src/schemaValidations/dish.schema";
import tw from "src/utils/tw";
import { formatCurrency, getValidImageUrl } from "src/utils/utils";

export default function HomeScreen() {
  const [dishList, setDishList] = useState<DishListResType['data']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const result = await dishesApiRequest.list();
        setDishList(result.payload.data);
        console.log(result)
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDishes();
    
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={tw`pb-8`}>
      <View style={tw`relative h-48 w-full mb-6`}>
        <Image
          source={require("../assets/images/banner.png")}
          style={tw`absolute w-full h-full rounded`}
          resizeMode="cover"
        />
        <View style={tw`absolute inset-0 bg-black opacity-50`} />
        <View style={tw`absolute inset-0 justify-center items-center px-4`}>
          <Text style={tw`text-white text-3xl font-bold`}>Nhà hàng 957</Text>
          <Text style={tw`text-white mt-2`}>Vị ngon, trọn khoảnh khắc</Text>
        </View>
      </View>

      <Text style={tw`text-center text-xl font-bold mb-4`}>
        Đa dạng các món ăn
      </Text>

      <View style={tw`px-4 gap-y-6`}>
        {dishList.map((dish) => (
          <View key={dish.id} style={tw`flex-row gap-4`}>
            <Image
              source={{ uri: getValidImageUrl(dish.image)}}
              style={tw`w-32 h-32 rounded-md`}
              resizeMode="cover"
            />
            <View style={tw`flex-1 justify-center`}>
              <Text style={tw`text-lg font-semibold`}>{dish.name}</Text>
              <Text style={tw`text-sm text-gray-600 mt-1`}>
                {dish.description}
              </Text>
              <Text style={tw`text-base font-bold text-blue-500 mt-1`}>
                {formatCurrency(dish.price)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
