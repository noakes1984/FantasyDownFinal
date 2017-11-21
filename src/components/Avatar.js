// @flow
import * as React from "react";
import {StyleSheet, Image} from "react-native";

import type {BaseProps} from "./Types";

type AvatarProps = BaseProps & {
    uri: string
};

export default class Avatar extends React.Component<AvatarProps> {

    static SIZE = 50;

    render(): React.Node {
        const {uri, style} = this.props;
        return <Image source={{ uri }} style={[style, styles.image]} />;
    }
}

const styles = StyleSheet.create({
    image: {
        height: Avatar.SIZE,
        width: Avatar.SIZE,
        borderRadius: Avatar.SIZE / 2
    }
});
