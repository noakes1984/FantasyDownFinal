// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import moment from "moment"
import {FlatList, StyleSheet, View, Animated, SafeAreaView, TouchableWithoutFeedback} from "react-native";
import {inject, observer} from "mobx-react/native";

import HomeStore from "../HomeStore";

import {Text, Theme, Avatar, RefreshIndicator, Post} from "../../components";
import type {ScreenProps} from "../../components/Types";
import type {FeedEntry} from "../../components/Model";

type FlatListItem<T> = {
    item: T
};

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

type ExploreState = {
    scrollAnimation: Animated.Value
};

@inject("store") @observer
export default class Explore extends React.Component<ScreenProps<> & { store: HomeStore }, ExploreState> {

    @autobind
    profile() {
        this.props.navigation.navigate("Profile");
    }

    @autobind
    loadMore() {
        this.props.store.loadFeed();
    }

    @autobind
    renderItem({ item }: FlatListItem<FeedEntry>): React.Node {
        const {navigation} = this.props;
        return (
            <Post post={item.post} profile={item.profile} {...{navigation}} />
        );
    }

    @autobind
    keyExtractor(item: FeedEntry): string {
        return item.post.id;
    }

    async componentWillMount(): Promise<void> {
        this.props.store.checkForNewEntriesInFeed();
        this.setState({
            scrollAnimation: new Animated.Value(0)
        });
    }

    render(): React.Node {
        const {store} = this.props;
        const {scrollAnimation} = this.state;
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
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={feed}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    scrollEventThrottle={1}
                    onEndReached={this.loadMore}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollAnimation
                                }
                            }
                        }]
                    )}
                    {...{ ListEmptyComponent }}
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
    },
    list: {
        paddingHorizontal: Theme.spacing.small
    }
});

const ListEmptyComponent = <RefreshIndicator refreshing={true} />;
