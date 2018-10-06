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
import {Feather as Icon} from "@expo/vector-icons";

import BetView from "../BetView";

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
        scrollAnimation: new Animated.Value(0),
        isModalVisible: false,
        loading: false,
        caption: ""
    };
    /////

    id: string;
    preview: string;
    url: string;

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    _renderModalContent = () => {
        this.setState({
            isModalVisible: true
        });
    };

    _hideBetView = () => {
        this.setState({
            isModalVisible: false
        });
    };

    @autobind
    profile() {
        this.props.navigation.navigate("Profile");
    }
    // runThis() {
    //     const { navigation } = this.props;
    //     const { caption } = this.state;
    //     this.setState({ loading: true });
    //     try {
    //         const { uid } = Firebase.auth.currentUser;
    //         const post: Post = {
    //             id: this.id,
    //             uid,
    //             comments: 0,
    //             likes: [],
    //             timestamp: parseInt(moment().format("X"), 10),
    //             text: caption,
    //             picture: {
    //                 uri: this.url,
    //                 preview: this.preview
    //             }
    //         };
    //         Firebase.firestore
    //             .collection("feed")
    //             .doc(this.id)
    //             .set(post);
    //         navigation.pop(1);
    //         //    navigation.navigate("Explore");
    //     } catch (e) {
    //         const message = serializeException(e);
    //         Alert.alert(message);
    //         this.setState({ loading: false });
    //     }
    // }

    async upload(): Promise<void> {
        try {
            const { navigation } = this.props;
            const picture = navigation.state.params;
            this.id = ImageUpload.uid();
            this.preview = await ImageUpload.preview(picture);
            this.url = await ImageUpload.upload(picture);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            Alert.alert(e);
        }
    }

    async onPress(): Promise<void> {
        const { navigation } = this.props;
        const { caption } = this.state;
        this.setState({ loading: true });
        try {
            await this.upload();
            const { uid } = Firebase.auth.currentUser;
            const post: Post = {
                id: this.id,
                uid,
                comments: 0,
                likes: [],
                timestamp: parseInt(moment().format("X"), 10),
                text: caption,
                picture: {
                    uri: require("./Artboard.png"),
                    preview: require("./Artboard.png")
                }
            };
            await Firebase.firestore
                .collection("feed")
                .doc(this.id)
                .set(post);
            navigation.pop(1);
            //    navigation.navigate("Explore");
        } catch (e) {
            const message = serializeException(e);
            Alert.alert(message);
            this.setState({ loading: false });
        }
    }

    componentDidMount() {
        this.props.feedStore.checkForNewEntriesInFeed();
        console.log("Explore.js");

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
                    isVisible={this.state.isModalVisible === true}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={500}
                    backdropTransitionOutTiming={500}
                    onBackdropPress={() => this._hideBetView()}
                >
                    <BetView />
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
                    style={{backgroundColor: "red"}}
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
                <View style={{position: "absolute", bottom: 30, right: 30}}>
                    <TouchableOpacity onPress={() => this._renderModalContent()}>
                        <Icon name="plus-circle" color={Theme.palette.primary} size={60} />
                    </TouchableOpacity>
                </View>
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
        borderColor: "gray"
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
    },
});
