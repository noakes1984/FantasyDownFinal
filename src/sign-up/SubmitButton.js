// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";

import {IconButton} from "../components";

interface SubmitButtonProps {
    onPress: () => void
}

export default class SubmitButton extends React.Component<SubmitButtonProps> {
    render(): React.Node {
        const {onPress} = this.props;
        return (
            <View style={styles.submit}>
                <IconButton
                    name="ios-arrow-forward-outline"
                    contrast={true}
                    withBackground={true}
                    {...{ onPress }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    submit: {
        flexDirection: "row",
        justifyContent: "flex-end"
    }
});
