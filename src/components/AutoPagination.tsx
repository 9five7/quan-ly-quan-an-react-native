// src/components/AutoPagination.tsx
import { Text, View, Pressable } from "react-native";
import tw from "src/utils/tw";

interface Props {
  page: number;
  pageSize: number;
  onPageChange: (pageNumber: number) => void;
}

const RANGE = 2;

export default function AutoPagination({ page, pageSize, onPageChange }: Props) {
  let dotAfter = false;
  let dotBefore = false;

  const renderPagination = () => {
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1;

        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          if (!dotAfter) {
            dotAfter = true;
            return <Text key={`dot-a-${index}`}>...</Text>;
          }
          return null;
        }

        if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            if (!dotBefore) {
              dotBefore = true;
              return <Text key={`dot-b-${index}`}>...</Text>;
            }
            return null;
          }
          if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            if (!dotAfter) {
              dotAfter = true;
              return <Text key={`dot-a-${index}`}>...</Text>;
            }
            return null;
          }
        }

        if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          if (!dotBefore) {
            dotBefore = true;
            return <Text key={`dot-b-${index}`}>...</Text>;
          }
          return null;
        }

        return (
          <Pressable
            key={index}
            onPress={() => onPageChange(pageNumber)}
            style={tw.style(
              "px-3 py-1 mx-1 rounded",
              page === pageNumber ? "bg-blue-500" : "bg-gray-200"
            )}
          >
            <Text style={tw.style(page === pageNumber ? "text-white" : "text-black")}>
              {pageNumber}
            </Text>
          </Pressable>
        );
      });
  };

  return (
    <View style={tw`flex-row justify-center items-center mt-4 flex-wrap`}>
      <Pressable
        onPress={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={tw.style(
          "px-3 py-1 mx-1 rounded",
          page === 1 ? "bg-gray-300" : "bg-gray-200"
        )}
      >
        <Text>{`<`}</Text>
      </Pressable>

      {renderPagination()}

      <Pressable
        onPress={() => onPageChange(page + 1)}
        disabled={page === pageSize}
        style={tw.style(
          "px-3 py-1 mx-1 rounded",
          page === pageSize ? "bg-gray-300" : "bg-gray-200"
        )}
      >
        <Text>{`>`}</Text>
      </Pressable>
    </View>
  );
}
// cách sử dụng
{/* <AutoPagination
  page={page}
  pageSize={totalPage}
  onPageChange={(newPage) => {
    setPage(newPage); // Trigger refetch hoặc mutation
  }}
/> */}
