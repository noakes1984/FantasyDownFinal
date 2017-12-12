// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, TouchableWithoutFeedback, View, Animated, Easing} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";

import Odometer from "./Odometer";

import {Theme} from "../Theme";
import Firebase from "../Firebase";

type LikesProps = {
    color: string,
    likes: string[],
    post: string
};

type LikesState = {
    animation: Animated.Value,
    isLiked: boolean
};

export default class Likes extends React.Component<LikesProps, LikesState> {

    counter: Odometer;

    componentWillMount() {
        const {likes} = this.props;
        const {uid} = Firebase.auth.currentUser;
        const isLiked = likes.indexOf(uid) !== -1;
        this.setState({ isLiked });
    }

    @autobind
    toggle() {
        const {post} = this.props;
        const {isLiked} = this.state;
        const {uid} = Firebase.auth.currentUser;
        if (!isLiked) {
            this.counter.increment();
            const animation = new Animated.Value(0);
            this.setState({ animation, isLiked: !isLiked });
            Animated.timing(
                animation,
                {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.ease
                }
            ).start();
        } else {
            this.setState({ isLiked: !isLiked });
            this.counter.decrement();
        }
        const postRef = Firebase.firestore.collection("feed").doc(post);
        Firebase.firestore.runTransaction(async transaction => {
            const postDoc = await transaction.get(postRef);
            const likes = postDoc.data().likes;
            if (!isLiked) {
                likes.push(uid);
            } else {
                likes.splice(uid, 1);
            }
            transaction.update(postRef, { likes });
        });
    }

    render(): React.Node {
        const {color, likes} = this.props;
        const {animation, isLiked} = this.state;
        const computedStyle = [styles.icon];
        if (animation) {
            const fontSize = animation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [iconSize, bigIconSize, iconSize]
            });
            computedStyle.push({ fontSize });
        }
        if (isLiked) {
            computedStyle.push(styles.likedIcon);
        }
        return (
            <TouchableWithoutFeedback onPress={this.toggle}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <AnimatedIcon name="thumbs-up" color={color} style={computedStyle} />
                    </View>
                    <Odometer ref={ref => ref ? this.counter = ref : undefined} count={likes.length} {...{ color }} />
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
