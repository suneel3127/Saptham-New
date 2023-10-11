import React from "react";
import { TouchableHighlight, Image, Button, View, } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';

export default function AccountButton(props) {
  return (
    <TouchableHighlight onPress={props.onPress} >
    <FontAwesomeIcon icon={faUser} style={styles.btnIcon}/>
    </TouchableHighlight>
  );
}

AccountButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string,
};
