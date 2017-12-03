// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, Dimensions, TouchableWithoutFeedback} from "react-native";
import {Camera, Permissions} from "expo";
import { Feather as Icon } from "@expo/vector-icons";

import EnableCameraPermission from "./EnableCameraPermission";
import FlashIcon from "./FlashIcon";

import {RefreshIndicator, Theme, NavHeader} from "../../components";
import type {ScreenProps} from "../../components/Types";

type ShareState = {
    hasCameraPermission: boolean | null,
    type: number,
    flashMode: number
};

export default class Share extends React.Component<ScreenProps<>, ShareState> {

    camera: Camera;

    async componentWillMount(): Promise<void> {
        this.setState({ hasCameraPermission: null });
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === "granted",
            type: Camera.Constants.Type.back,
            flashMode: Camera.Constants.FlashMode.off
        });
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
        const picture = await this.camera.takePictureAsync();
        navigation.navigate("SharePicture", picture);
    }

    @autobind
    setCamera(camera?: Camera | null) {
        if (camera) {
            this.camera = camera;
        }
    }

    render(): React.Node {
        const {navigation} = this.props;
        const {hasCameraPermission, type, flashMode} = this.state;
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
                        <TouchableWithoutFeedback onPress={this.snap}>
                            <View style={styles.btn} />
                        </TouchableWithoutFeedback>
                    </View>
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
    }
});
