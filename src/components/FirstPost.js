// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import Text from "./Text";
import { Theme } from "./Theme";
import { ModalBetView } from "./../home/explore/ModalBetView";

import type { NavigationProps } from "./Types";
import Modal from "react-native-modal"; // 2.4.0

import BetView from "../home/BetView";

export default class FirstPost extends React.Component<NavigationProps<>> {
    state = {
        visibleModal: 1,
        modalVisible: false
    };
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    //Found it
    _renderButton = (text, onPress) => (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>
    );
    componentDidMount() {
        console.log("FirstPost.js");
    }
    _renderButton() {
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>;
    }

    //    <Image source={require('../../../assets/img/button.png')} />

    _renderModalContent = () => (
        <View style={styles.modalContent}>{(console.log("Button pushed"), <Text>hello</Text>)}</View>
    );

    @autobind
    share() {
        this.props.navigation.navigate("Share");
    }
    /*
() => this.function1()
() => this.setState({ visibleModal: 1 })*/
    render(): React.Node {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this._renderModalContent()}>
                    <Icon name="plus-circle" color={Theme.palette.primary} size={25} />
                </TouchableOpacity>
                <Text style={styles.text}>Create a Bet!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
    text: {
        textAlign: "center",
        marginTop: Theme.spacing.base
    }
});
