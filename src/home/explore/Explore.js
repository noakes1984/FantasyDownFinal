// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import moment from "moment";
import {
    StyleSheet,
    View,
    Animated,
    SafeAreaView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform
} from "react-native";
import { inject, observer } from "mobx-react/native";
import { ModalBetView } from "./ModalBetView";
import Modal from "react-native-modal"; // 2.4.0

import ProfileStore from "../ProfileStore";

import { Text, Theme, Avatar, Feed, FeedStore } from "../../components";
import type { ScreenProps } from "../../components/Types";

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

type ExploreState = {
    scrollAnimation: Animated.Value
};

type InjectedProps = {
    feedStore: FeedStore,
    profileStore: ProfileStore
};

@inject("feedStore", "profileStore")
@observer
export default class Explore extends React.Component<ScreenProps<> & InjectedProps, ExploreState> {
    state = {
        scrollAnimation: new Animated.Value(0)
    };
    _renderButton = (text, onPress) => (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>
    );

    _renderModalContent = () => (
        <View style={styles.modalContent}>
            <ModalBetView />
            //{this._renderButton("Close", () => this.setState({ visibleModal: null }))}
        </View>
    );
    @autobind
    profile() {
        this.props.navigation.navigate("Profile");
    }

    componentDidMount() {
        this.props.feedStore.checkForNewEntriesInFeed();
    }

    render(): React.Node {
        const { feedStore, profileStore, navigation } = this.props;
        const { scrollAnimation } = this.state;
        const { profile } = profileStore;
        const opacity = scrollAnimation.interpolate({
            inputRange: [0, 60],
            outputRange: [1, 0],
            extrapolate: "clamp"
        });
        const translateY = scrollAnimation.interpolate({
            inputRange: [0, 60],
            outputRange: [0, -60],
            extrapolate: "clamp"
        });
        const fontSize = scrollAnimation.interpolate({
            inputRange: [0, 60],
            outputRange: [36, 24],
            extrapolate: "clamp"
        });
        const height = scrollAnimation.interpolate({
            inputRange: [0, 60],
            outputRange: Platform.OS === "android" ? [70, 70] : [100, 60],
            extrapolate: "clamp"
        });
        const marginTop = scrollAnimation.interpolate({
            inputRange: [0, 60],
            outputRange: [24, 0],
            extrapolate: "clamp"
        });
        const shadowOpacity = scrollAnimation.interpolate({
            inputRange: [0, 60],
            outputRange: [0, 0.25],
            extrapolate: "clamp"
        });
        return (
            <View style={styles.container}>
                <Modal
                    isVisible={this.state.visibleModal === 1}
                    animationInTiming={2000}
                    animationOutTiming={2000}
                    backdropTransitionInTiming={2000}
                    backdropTransitionOutTiming={2000}
                >
                    {this._renderModalContent()}
                </Modal>

                <AnimatedSafeAreaView style={[styles.header, { shadowOpacity }]}>
                    <Animated.View style={[styles.innerHeader, { height }]}>
                        <View>
                            /*New */
                            <AnimatedText
                                type="large"
                                style={[styles.newPosts, { opacity, transform: [{ translateY }] }]}
                            >
                                New posts
                            </AnimatedText>
                            /*Day of the week*/
                            <AnimatedText type="header2" style={{ fontSize, marginTop }}>
                                {moment().format("dddd")}
                            </AnimatedText>
                        </View>

                        {profile && (
                            <TouchableWithoutFeedback onPress={this.profile}>
                                <View>
                                    <Avatar {...profile.picture} />
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    </Animated.View>
                </AnimatedSafeAreaView>
                <Feed
                    store={feedStore}
                    onScroll={Animated.event([
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollAnimation
                                }
                            }
                        }
                    ])}
                    {...{ navigation }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
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
        alignItems: "center"
    },
    newPosts: {
        position: "absolute",
        top: 0
    }
});
