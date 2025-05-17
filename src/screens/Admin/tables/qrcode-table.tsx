import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import tw from "src/utils/tw";
import { getTableLink } from "src/utils/utils";
export default function QRCodeTable({
  token,
  tableNumber,
  size = 250,
}: {
  token: string;
  tableNumber: number;
  size?: number;
}) {
  const qrValue = getTableLink({
    token,
    tableNumber,
  });
  return (
    <View>
      <View>
        <QRCode
          size={size}
          value={qrValue}
          backgroundColor="#fff"
          color="#000"
        />
      </View>
      <Text style={[tw`text-center mt-2`, styles.text]}>
        Bàn số {tableNumber}
      </Text>
      <Text style={[tw`text-center mt-1`, styles.subText]}>
        Quét mã QR để gọi món
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  subText: {
    fontSize: 12,
    color: "black",
  },
});
