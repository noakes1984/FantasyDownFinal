// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {Spinner} from "native-base";

export default class SpinningIndicator extends React.Component<{}> {

    render(): React.Node {
        return (
            <View style={styles.container}>
                <Spinner color="gray" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        width: 80,
        borderRadius: 8
    }
});
