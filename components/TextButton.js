import { StyleSheet, View, TouchableOpacity } from "react-native";
function TextButton({ children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
          {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#409cb3",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});

export default TextButton;
