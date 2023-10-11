import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 180,
    paddingHorizontal: 8,
    paddingVertical: 8,
    margin: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  btnIcon: {
    height: 8,
    width: 8,
  },
});

export default styles;
