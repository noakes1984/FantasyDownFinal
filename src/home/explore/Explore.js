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

import { Text, Theme, Avatar, Feed, FeedStore, ImageUpload } from "../../components";
import type { ScreenProps } from "../../components/Types";
//import type { ScreenParams } from "../../components/Types";
import type { Post } from "../../components/Model";
import type { Picture } from "../../components/ImageUpload";

import { Feather as Icon } from "@expo/vector-icons";

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
    componentWillMount() {
        //this.saveImageMessage(Pic);
        // const images = {
        //     profile: {
        //         profile: require("./Artboard.jpg")
        //     },
        //
        //     image1: require("./View.jpg")
        // };
        // console.log(images.image1.uri);
        // const final = images.image1;
    }

    onChooseImagePress = async () => {
        let result = await ImagePicker.launchImageLibrary();

        if (!result.cancelled) {
            this.uploadImage(result.uri, "test-image")
                .then(() => {
                    Alert.alert("success");
                })
                .catch(error => {
                    Alert.alert(error);
                });
        }
    };

    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase
            .storage()
            .ref()
            .child("images/", imageName);
        return ref.put(blob);
    };

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

    //
    // async saveImageMessage(file) {
    //     // 1 - We add a message with a loading icon that will get updated with the shared image.
    //     console.log(file);
    //     firebase
    //         .database()
    //         .ref("DisShit")
    //         .push({
    //             name: "firebase.auth().currentUser"
    //         })
    //         .then(function() {
    //             // 2 - Upload the image to Cloud Storage.
    //             var filePath = "firebase.auth().currentUser.uid/" + file.name;
    //             return firebase
    //                 .storage()
    //                 .ref(filePath)
    //                 .put(file)
    //                 .then(function(fileSnapshot) {
    //                     // 3 - Generate a public URL for the file.
    //                     return fileSnapshot.ref.getDownloadURL().then(url => {
    //                         // 4 - Update the chat message placeholder with the image's URL.
    //                         return messageRef.update({
    //                             imageUrl: url,
    //                             storageUri: fileSnapshot.metadata.fullPath
    //                         });
    //                     });
    //                 });
    //         })
    //         .catch(function(error) {
    //             console.error("There was an error uploading a file to Cloud Storage: ", error);
    //         });
    // }
    //
    // handleFileUploadSubmit(selectedFile) {
    //     const storageService = firebase.storage();
    //     const storageRef = storageService.ref();
    //     const uploadTask = storageRef.child(`images/`).put(selectedFile); //create a child directory called images, and place the file inside this directory
    //     uploadTask.on(
    //         "state_changed",
    //         snapshot => {
    //             // Observe state change events such as progress, pause, and resume
    //         },
    //         error => {
    //             // Handle unsuccessful uploads
    //             console.log(error);
    //         },
    //         () => {
    //             // Do something once upload is complete
    //             console.log("success");
    //         }
    //     );
    // }
    componentDidMount() {
        this.props.feedStore.checkForNewEntriesInFeed();
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
                    <BetView />
                </Modal>
                <AnimatedSafeAreaView style={[styles.header, { shadowOpacity }]}>
                    <Animated.View style={[styles.innerHeader, { height }]}>
                        <View>
                            <Button title="Hello" onPress={this.onChooseImagePress()} />
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
