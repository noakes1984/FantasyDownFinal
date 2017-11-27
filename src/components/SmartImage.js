// @flow
import * as _ from "lodash";
import * as React from "react";
import {Image, Animated, StyleSheet, View} from "react-native";
import {BlurView} from "expo";

import type { StyleObj as Style } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import type {BaseProps} from "./Types";

type SmartImageProps = BaseProps & {
    preview: string,
    uri: string
};

type SmartImageState = {
    uri: string,
    intensity: Animated.Value
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
export default class SmartImage extends React.Component<SmartImageProps, SmartImageState> {

    static propsToCopy = [
        "borderRadius", "borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius",
        "borderTopRightRadius"
    ];

    computedStyle: Style;

    computeStyle(style?: Style) {
        this.computedStyle = [
            StyleSheet.absoluteFill,
            _.pickBy(StyleSheet.flatten(style), (value, key) => SmartImage.propsToCopy.indexOf(key) !== -1)
        ];
    }

    async componentWillMount(): Promise<void> {
        const {preview, uri, style} = this.props;
        const intensity = new Animated.Value(100);
        this.computeStyle(style);
        this.setState({
            uri: preview,
            intensity
        });
        await Image.prefetch(uri);
        this.setState({ uri });
        Animated
            .timing(intensity, { duration: 300, toValue: 0 })
            .start();
    }

    componentWillReceiveProps(props: SmartImageProps) {
        this.computeStyle(props.style);
    }

    render(): React.Node {
        const {style} = this.props;
        const {uri, intensity} = this.state;
        return (
            <View {...{style}}>
                <Image source={{ uri }} resizeMode="cover" style={this.computedStyle} />
                <AnimatedBlurView tint="default" style={this.computedStyle} {...{intensity}} />
            </View>
        );
    }
}
