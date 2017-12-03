// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, TouchableWithoutFeedback, View, Animated, Easing} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";

import Odometer from "./Odometer";

import {Theme} from "../../components";

type LikesProps = {
    color: string
};

type LikesState = {
    liked: boolean,
    animation: Animated.Value
};

export default class Likes extends React.Component<LikesProps, LikesState> {

    counter: Odometer;

    componentWillMount() {
        this.setState({ liked: false });
    }

    @autobind
    toggle() {
        const liked = !this.state.liked;
        this.setState({ liked });
        if (liked) {
            this.counter.increment();
            const animation = new Animated.Value(0);
            this.setState({ animation });
            Animated.timing(
                animation,
                {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.ease
                }
            ).start();
        } else {
            this.counter.decrement();
        }
    }

    render(): React.Node {
        const {color} = this.props;
        const {liked, animation} = this.state;
        const computedStyle = [styles.icon];
        if (animation) {
            const fontSize = animation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [iconSize, bigIconSize, iconSize]
            });
            computedStyle.push({ fontSize });
        }
        if (liked) {
            computedStyle.push(styles.likedIcon);
        }
        return (
            <TouchableWithoutFeedback onPress={this.toggle}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <AnimatedIcon name="thumbs-up" color={color} style={computedStyle} />
                    </View>
                    <Odometer ref={ref => ref ? this.counter = ref : undefined} count={18} {...{ color }} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const iconSize = 18;
const bigIconSize = 24;
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    iconContainer: {
        width: bigIconSize,
        height: bigIconSize,
        justifyContent: "center"
    },
    icon: {
        fontSize: iconSize
    },
    likedIcon: {
        color: Theme.palette.primary
    }
});
