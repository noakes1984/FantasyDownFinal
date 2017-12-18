// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import moment from "moment"
import {FlatList, StyleSheet, View, Animated, SafeAreaView, RefreshControl, Platform} from "react-native";
import {Constants} from "expo";
import {inject, observer} from "mobx-react/native";

import HomeStore from "../HomeStore";

import {Text, Theme, Avatar, RefreshIndicator, Post} from "../../components";
import type {ScreenProps} from "../../components/Types";

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

type ExploreState = {
    scrollAnimation: Animated.Value,
    refreshing: boolean
};

@inject("store") @observer
export default class Explore extends React.Component<ScreenProps<> & { store: HomeStore }, ExploreState> {

    @autobind
    onRefresh() {
        this.setState({ refreshing: true });
        setTimeout(() => this.setState({ refreshing: false }), 3000);
    }

    async componentWillMount(): Promise<void> {
        this.setState({
            scrollAnimation: new Animated.Value(0),
            refreshing: false
        });
    }

    render(): React.Node {
        const {onRefresh} = this;
        const {navigation, store} = this.props;
        const {scrollAnimation, refreshing} = this.state;
        const {feed, profile} = store;
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
                <RefreshIndicator
                    style={styles.RefreshIndicator} {...{refreshing}}
                />
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
                        { profile && <Avatar {...profile.picture} /> }
                    </Animated.View>
                </AnimatedSafeAreaView>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={feed}
                    keyExtractor={item => item.post.id}
                    renderItem={({ item }) => <Post post={item.post} profile={item.profile} {...{navigation}} />}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollAnimation
                                }
                            }
                        }]
                    )}
                    refreshControl={(Platform.OS === "ios" && (
                        <RefreshControl
                            tintColor="transparent"
                            colors={["transparent"]}
                            style={{ backgroundColor: "transparent" }}
                            {...{onRefresh, refreshing}}
                        />
                    ) || undefined)}
                    ListEmptyComponent={<RefreshIndicator refreshing={true} />}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    RefreshIndicator: {
        ...StyleSheet.absoluteFillObject,
        paddingTop: Constants.statusBarHeight + 100 + Theme.spacing.base
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
    },
    list: {
        paddingHorizontal: Theme.spacing.small
    }
})