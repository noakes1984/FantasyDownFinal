// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import moment from "moment"
import {StyleSheet, View, Animated, SafeAreaView, TouchableWithoutFeedback} from "react-native";
import {inject, observer} from "mobx-react/native";

import Feed from "../Feed";
import FeedStore from "../FeedStore";
import ProfileStore from "../ProfileStore";

import {Text, Theme, Avatar} from "../../components";
import type {ScreenProps} from "../../components/Types";

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

type ExploreState = {
    scrollAnimation: Animated.Value
};

type InjectedProps = {
    feedStore: FeedStore,
    profileStore: ProfileStore
};

@inject("feedStore", "profileStore") @observer
export default class Explore extends React.Component<ScreenProps<> & InjectedProps, ExploreState> {

    @autobind
    profile() {
        this.props.navigation.navigate("Profile");
    }

    async componentWillMount(): Promise<void> {
        this.props.feedStore.checkForNewEntriesInFeed();
        this.setState({
            scrollAnimation: new Animated.Value(0)
        });
    }

    render(): React.Node {
        const {feedStore, profileStore, navigation} = this.props;
        const {scrollAnimation} = this.state;
        const {profile} = profileStore;
        const opacity = scrollAnimation.interpolate({
            inputRange: [0, 60],
            outputRange: [1, 0]
        });
        const translateY = scrollAnimation.interpolate({
            inputRange: [0, 0, 60],
            outputRange: [0, 0, -60]
        });
        const fontSize = scrollAnimation.interpolate({
            inputRange: [0, 0, 60, 60],
            outputRange: [36, 36, 24, 24]
        });
        const height = scrollAnimation.interpolate({
            inputRange: [0, 0, 60, 60],
            outputRange: [100, 100, 60, 60]
        });
        const marginTop = scrollAnimation.interpolate({
            inputRange: [0, 0, 60, 60],
            outputRange: [24, 24, 0, 0]
        });
        const shadowOpacity = scrollAnimation.interpolate({
            inputRange: [0, 0, 60, 60],
            outputRange: [0, 0, 0.25, 0.25]
        });
        return (
            <View style={styles.container}>
                <AnimatedSafeAreaView style={[styles.header, { shadowOpacity }]}>
                    <Animated.View style={[styles.innerHeader, { height }]}>
                        <View>
                            <AnimatedText
                                type="large"
                                style={{ position: "absolute", top: 0, opacity, transform: [{ translateY }] }}
                            >
                            New posts
                            </AnimatedText>
                            <AnimatedText
                                type="header2"
                                style={{ fontSize, marginTop }}
                            >
                            {moment().format("dddd")}
                            </AnimatedText>
                        </View>
                        { profile && (
                            <TouchableWithoutFeedback onPress={this.profile}>
                                <View>
                                    <Avatar {...profile.picture} />
                                </View>
                            </TouchableWithoutFeedback>
                        ) }
                    </Animated.View>
                </AnimatedSafeAreaView>
                <Feed
                    store={feedStore}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollAnimation
                                }
                            }
                        }]
                    )}
                    {...{navigation}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 8,
        zIndex: 10000
    },
    innerHeader: {
        marginHorizontal: Theme.spacing.base,
        marginVertical: Theme.spacing.tiny,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    }
});
