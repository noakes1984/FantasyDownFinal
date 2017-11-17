// @flow
import * as React from "react";
// import {StyleSheet} from "react-native";
import {Button as NBButton, Text} from "native-base";

// import { Theme } from "./Theme";

import type {BaseProps} from "./Types";

type ButtonProps = BaseProps & {
    label: string,
    primary?: boolean,
    full?: boolean,
    onPress: () => void
};

export default class Button extends React.Component<ButtonProps> {
    render(): React.Node {
        const {label, full, primary, onPress, style} = this.props;
        return (
            <NBButton {...{ full, primary, onPress, style }}>
                <Text>{label}</Text>
            </NBButton>
        );
    }
}
