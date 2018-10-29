// @flow
import * as React from "react";
import { Image, StyleSheet, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Modal } from "react-native";
import { Camera, Permissions } from "expo";
import { Feather as Icon } from "@expo/vector-icons";

import FlashIcon from "./FlashIcon";

import { RefreshIndicator, Theme, NavHeader, SpinningIndicator, serializeException } from "../../components";
import type { ScreenProps } from "../../components/Types";

type ShareState = {
    hasCameraPermission: boolean | null,
    type: number,
    flashMode: number,
    loading: boolean
};

export default class Share extends React.Component<ScreenProps<>, ShareState> {
    camera: Camera;

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        flashMode: Camera.Constants.FlashMode.off,
        loading: false,
        caption: ""
    };
    /////

    id: string;
    preview: string;
    url: string;

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
                    uri: "require(./Artboard.png)",
                    preview: "require(./Artboard.png)"
                }
            };
            await Firebase.firestore
                .collection('bets')
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

    ////

    async componentDidMount(): Promise<void> {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        upload();
        this.setState({
            hasCameraPermission: status === "granted"
        });
    }

    toggle() {
        this.setState({ loading: false });
    }

    render(): React.Node {
        const { navigation } = this.props;
        const { hasCameraPermission, type, flashMode, loading } = this.state;
        if (hasCameraPermission === null) {
            return (
                <View style={styles.refreshContainer}>
                    <RefreshIndicator refreshing />
                </View>
            );
        } else if (hasCameraPermission === false) {
            return <EnableCameraPermission />;
        }
        return (
            <View style={styles.container}>
                <NavHeader title="Share" {...{ navigation }} />
                <Camera ref={this.setCamera} style={styles.camera} {...{ type, flashMode }}>
                    <View style={styles.cameraBtns}>
                        <TouchableWithoutFeedback onPress={this.toggleCamera}>
                            <View>
                                <Icon name="rotate-ccw" style={styles.rotate} size={25} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.toggleFlash}>
                            <View>
                                <FlashIcon on={flashMode === Camera.Constants.FlashMode.on} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Camera>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={this.snap}>
                        <View style={styles.btn} />
                    </TouchableOpacity>
                </View>
                <Modal transparent visible={loading} onRequestClose={this.toggle}>
                    <View style={styles.modal}>
                        <SpinningIndicator />
                    </View>
                </Modal>
            </View>
        );
    }
}

const { width, height } = Dimensions.get("window");
const ratio = width / height;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    refreshContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    camera: {
        width,
        height: width
    },
    cameraBtns: {
        position: "absolute",
        bottom: 0,
        width,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: Theme.spacing.base
    },
    rotate: {
        backgroundColor: "transparent",
        color: "white"
    },
    footer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    btn: {
        height: ratio < 0.75 ? 100 : 60,
        width: ratio < 0.75 ? 100 : 60,
        borderRadius: ratio < 0.75 ? 50 : 30,
        borderWidth: ratio < 0.75 ? 20 : 10,
        borderColor: Theme.palette.lightGray
    },
    modal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center"
    }
});
