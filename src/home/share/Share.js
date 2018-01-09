// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Modal, Platform} from "react-native";
import {Camera, Permissions} from "expo";
import { Feather as Icon } from "@expo/vector-icons";

import EnableCameraPermission from "./EnableCameraPermission";
import FlashIcon from "./FlashIcon";

import {RefreshIndicator, Theme, NavHeader, SpinningIndicator, serializeException} from "../../components";
import type {ScreenProps} from "../../components/Types";

type ShareState = {
    hasCameraPermission: boolean | null,
    type: number,
    flashMode: number,
    loading: boolean
};

export default class Share extends React.Component<ScreenProps<>, ShareState> {

    camera: Camera;

    async componentWillMount(): Promise<void> {
        this.setState({ hasCameraPermission: null, loading: false });
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === "granted",
            type: Camera.Constants.Type.back,
            flashMode: Camera.Constants.FlashMode.off
        });
    }

    @autobind
    toggle() {
        this.setState({ loading: false });
    }

    @autobind
    toggleFlash() {
        const {flashMode} = this.state;
        const {on, off} = Camera.Constants.FlashMode;
        this.setState({ flashMode: flashMode ===  on ? off : on });
    }

    @autobind
    toggleCamera() {
        const {type} = this.state;
        const {front, back} = Camera.Constants.Type;
        this.setState({ type: type === back ? front : back });
    }

    @autobind
    async snap(): Promise<void> {
        const {navigation} = this.props;
        try {
            this.setState({ loading: true });
            const picture = await this.camera.takePictureAsync({ base64: false });
            this.setState({ loading: false });
            navigation.navigate("SharePicture", picture);
        } catch (e) {
            alert(serializeException(e));
        }
    }

    @autobind
    setCamera(camera?: Camera | null) {
        if (camera) {
            this.camera = camera;
        }
    }

    render(): React.Node {
        const {navigation} = this.props;
        const {hasCameraPermission, type, flashMode, loading} = this.state;
        const isAndroid = Platform.OS === "android";
        if (hasCameraPermission === null) {
            return (
                <View style={styles.refreshContainer}>
                    <RefreshIndicator refreshing={true} />
                </View>
            );
        } else if (hasCameraPermission === false) {
            return <EnableCameraPermission />;
        } else {
            return (
                <View style={styles.container}>
                    <NavHeader title="Share" {...{navigation}} />
                    <Camera ref={this.setCamera} style={styles.camera} {...{type, flashMode}}>
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
                    <Modal transparent={true} visible={loading && isAndroid} onRequestClose={this.toggle}>
                        <View style={styles.modal}>
                            <SpinningIndicator />
                        </View>
                    </Modal>
                </View>
            );
        }
    }
}

const {width} = Dimensions.get("window");
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
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 20,
        borderColor: Theme.palette.lightGray
    },
    modal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center"
    }
});
