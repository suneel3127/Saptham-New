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
    height: 20,
  },
  cartItemCount: {
    position: "absolute",
    top: -10, // Adjust this value to position the count properly
    right: -10, // Adjust this value to position the count properly
    backgroundColor: "red",
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  cartItemCountText: {
    color: "white",
    fontSize: 12,
  },
});

export default styles;
