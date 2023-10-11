import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 180,
    paddingHorizontal: 2,
    paddingVertical: 4,
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
    fontSize:20,
    height: 20
  },
});

export default styles;
