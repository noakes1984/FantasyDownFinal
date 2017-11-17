// @flow
import * as React from "react";
import {StyleSheet} from "react-native";
import {Button} from "native-base";
import { Ionicons as Icon } from "@expo/vector-icons";

import { Theme } from "./Theme";
import type {BaseProps} from "./Types";

type IconButtonProps = BaseProps & {
    name: string,
    contrast?: boolean,
    onPress: () => void,
    withBackground?: boolean
};

export default class IconButton extends React.Component<IconButtonProps> {

    render(): React.Node {
        const {name, onPress, withBackground, contrast, style} = this.props;
        const btnStyle = [style, styles.btnBase];
        if (withBackground) {
            btnStyle.push(styles.btnWithBackground);
        }
        return (
            <Button {...{ onPress }} style={btnStyle} transparent={true}>
                <Icon
                    {...{ name }}
                    size={25}
                    color={withBackground ? Theme.palette.primary : (contrast ? "white": Theme.typography.color)}
                />
            </Button>
        );
    }
}

const styles= StyleSheet.create({
    btnBase: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        height: 50,
        width: 50,
        borderRadius: 25
    },
    btnWithBackground: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    }
});
