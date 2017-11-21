// @flow
import * as React from "react";
import {View, StyleSheet} from "react-native";
import {Constants} from "expo";

import { Theme } from "./Theme";

import type {BaseProps} from "./Types";

type ContainerProps = BaseProps & {
    children: React.ChildrenArray<React.Element<*>>,
    gutter: number
};

export default class Container extends React.Component<ContainerProps> {

    static defaultProps = {
        gutter: 0
    }

    render(): React.Node {
        const {gutter, children, style} = this.props;
        const containerStyle = [style, styles.base, { padding: gutter * Theme.spacing.base }];
        return <View style={containerStyle}>{children}</View>;
    }
}

const styles = StyleSheet.create({
    base: {
        flex: 1,
        marginTop: Constants.statusBarHeight
    }
});
