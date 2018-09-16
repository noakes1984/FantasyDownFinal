// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import Text from "./Text";
import { Theme } from "./Theme";
import { ModalBetView } from "./../home/explore/ModalBetView";

import type { NavigationProps } from "./Types";
import Modal from "react-native-modal"; // 2.4.0

export default class FirstPost extends React.Component<NavigationProps<>> {
    state = {
        visibleModal: 1
    };

    //Found it
    _renderButton = (text, onPress) => (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>
    );
    _renderButton() {
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>;
    }

    _renderModalContent = () => (
        <View style={styles.modalContent}>
            <Text>Hello how are you doing this morning!</Text>
            {this._renderButton("Close", () => this.setState({ visibleModal: null }))}
        </View>
    );
    @autobind
    share() {
        this.props.navigation.navigate("Share");
    }

    render(): React.Node {
        return (
            <View style={styles.container}>
                <Modal
                    isVisible={this.state.visibleModal === 1}
                    animationInTiming={2000}
                    animationOutTiming={2000}
                    backdropTransitionInTiming={2000}
                    backdropTransitionOutTiming={2000}
                >
                    {this._renderModalContent()}
                </Modal>
                <TouchableWithoutFeedback
                    onPress={this._renderButton("A slower modal", () => this.setState({ visibleModal: 1 }))}
                >
                    <Icon name="plus-circle" color={Theme.palette.primary} size={25} />
                </TouchableWithoutFeedback>
                <Text style={styles.text}>Make your first bet!</Text>
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
