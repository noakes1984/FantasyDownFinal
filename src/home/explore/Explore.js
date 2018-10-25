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
    Platform,
    Button,
    Image,
    Alert
} from "react-native";
import { inject, observer } from "mobx-react/native";
import { ModalBetView } from "./ModalBetView";
import Modal from "react-native-modal"; // 2.4.0

import ProfileStore from "../ProfileStore";
import Pic from "./View.jpg";

import Artboard from "./Artboard.jpg";

import * as firebase from "firebase";

import ImagePicker from "expo";

import { Text, Theme, Avatar, Feed, FeedStore, ImageUpload, Firebase } from "../../components";
import type { ScreenProps } from "../../components/Types";
//import type { ScreenParams } from "../../components/Types";
import type { Post } from "../../components/Model";
import type { Picture } from "../../components/ImageUpload";

import { Feather as Icon } from "@expo/vector-icons";

import BetView from '../BetView';

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
export default class Explore extends React.Component<ScreenProps<Picture> & InjectedProps, ExploreState> {
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
    //picture: image;

    constructor(props) {
        super(props);
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
    /*
    @autobind
    async upload(): Promise<void> {
        try {
            // const { navigation } = this.props;
            // const picture = navigation.state.params;
            this.id = ImageUpload.uid();
            // this.preview = await ImageUpload.preview(picture);
            // this.url = await ImageUpload.upload(picture);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            Alert.alert(e);
        }
    }
    async onPress(): Promise<void> {
        // const { navigation } = this.props;
        // const { caption } = this.state;
        // this.setState({ loading: true });
        try {
            //await this.upload();
            const { uid } = Firebase.auth.currentUser;
            const post: Post = {
                id: this.id,
                uid,
                comments: 0,
                likes: [],
                timestamp: parseInt(moment().format("X"), 10),
                text: "caption"
            };
            await Firebase.firestore
                .collection("feed")
                .doc(this.id)
                .set(post);
            navigation.pop(1);
            //navigation.navigate("Explore");
        } catch (e) {
            const message = serializeException(e);
            Alert.alert(message);
            this.setState({ loading: false });
        }
    }
*/
    @autobind
    profile() {
        this.props.navigation.navigate("Profile");
    }
    async upload(): Promise<void> {
        try {
            this.id = await ImageUpload.uid();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            Alert.alert(e);
        }
    }

    async saveImageMessage(): Promise<void> {
        try {
            await this.upload();
            const { uid } = Firebase.auth.currentUser;
            const post: Post = {
                id: this.id,
                uid,
                comments: 0,
                likes: [],
                timestamp: parseInt(moment().format("X"), 10),
                text: ""
            };
            firebase
                .firestore()
                .collection("feed")
                .doc(uid)
                .set(post)
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
        } catch (e) {
            console.log(e);
        }
    }
    updateFeed() {
        this.props.feedStore.checkForNewEntriesInFeed();
    }

    componentDidMount() {
        // todo: simulating deep link
        // let bundle = {
        //     params: {
        //         betId: '9d910130-d4c2-11e8-a113-c57bb73eac6f',
        //     }
        // };
        // this.betFromDeepLink(bundle.params.betId);

        Expo.DangerZone.Branch.subscribe(async (bundle) => {
            if (bundle && bundle.params && !bundle.error) {
                const { betId } = bundle.params;

                const betRef = await firebase.firestore().collection('feed').doc(betId).get();
                const bet = betRef.data();

                const choice = bet.bettor.choice !== bet.event.h ? bet.event.h : bet.event.v;

                // retrieve bettor
                const bettorRef = await firebase.firestore().collection('users').doc(bet.bettor.id).get();
                const bettor = bettorRef.data();

                Alert.alert(
                    'Confirm Bet',
                    `Would you like to bet ${bet.amount} coins on ${choice} against ${bet.bettor.choice} with ${bettor.name}`,
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => this.acceptBet(betRef.id) },
                    ],
                    { cancelable: false }
                );
            }
        });

        this.props.feedStore.checkForNewEntriesInFeed();
    }

    async acceptBet(betId): Promise<void> {
        try {
            const acceptBet = Firebase.functions.httpsCallable('acceptBet');
            await acceptBet({betId});

            this.updateFeed();
        } catch (e) {
            console.log('Error accepting bet', e);
        }
    }

    render(): React.Node {
        //const { onPress, onChangeText } = this;
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
                    <TouchableOpacity onPress={() => updateFeed()} topPadding={100}>
                        <Icon name="x-circle" color={Theme.palette.primary} backgroundColor={"white"} size={25} />
                    </TouchableOpacity>
                    <BetView />
                </Modal>
                <AnimatedSafeAreaView style={[styles.header, { shadowOpacity }]}>
                    <Animated.View style={[styles.innerHeader, { height }]}>
                        <View>
                            <Button title="Update" onPress={() => this.updateFeed()} />
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
                    style={{ backgroundColor: "red" }}
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
                <View style={{ position: "absolute", bottom: 30, right: 30 }}>
                    <TouchableOpacity onPress={() => this._renderModalContent()}>
                        <Icon name="plus-circle" color={Theme.palette.primary} size={60} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
//() => this._renderModalContent()
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
    }
});
