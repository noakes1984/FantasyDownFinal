// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {
    StyleSheet, TextInput, Image, Dimensions, KeyboardAvoidingView, ScrollView, ImageEditor, ImageStore, View
} from "react-native";
import {FileSystem} from "expo";

import {Container, NavHeader, Button, Theme, APIStore, RefreshIndicator, NavigationHelpers, Firebase} from "../../components";
import SHA1 from "crypto-js/sha1";

import type {Picture} from "./Picture";
import type {ScreenParams} from "../../components/Types";

const id = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
const uid = () => id() + id() + "-" + id() + "-" + id() + "-" + id() + "-" + id() + id() + id();

type SharePictureState = {
    loading: boolean,
    caption: string
};

const previewParams = (width: number, height: number) => ({
    offset: {
        x: 0,
        y: 0
    },
    size: {
        width,
        height
    },
    displaySize: {
        width: 50,
        height: 50
    },
    resizeMode: "cover"
});

export default class SharePicture extends React.Component<ScreenParams<Picture>, SharePictureState> {

    componentWillMount() {
        this.setState({ loading: false, caption: "" });
    }

    static buildPreview({ uri, width, height }: Picture): Promise<string> {
        return new Promise((resolve, reject) =>
            ImageEditor.cropImage(
                uri,
                previewParams(width, height),
                uri => ImageStore.getBase64ForTag(
                    uri, data => resolve(`data:image/jpeg;base64,${data}`), err => reject(err)
                ),
                err => reject(err)
            )
        );
    }

    @autobind
    async onPress(): Promise<void> {
        const {navigation} = this.props;
        const {caption} = this.state;
        const picture = navigation.state.params;
        this.setState({ loading: true });
        const preview = await SharePicture.buildPreview(picture);
        const id = uid();
        APIStore.addPost({
            id,
            timestamp: parseInt(moment().format("X"), 10),
            name: "John Doe",
            profilePicture: APIStore.profile().picture,
            text: caption,
            picture: {
                uri: picture.uri,
                preview
            }
        });
        try {
            const body = new FormData();
            const name = `${id}.jpg`;
            body.append("picture", {
                uri: picture.uri,
                name,
                type: "image/jpg"
            });
            await fetch("http://localhost:5000/react-native-fiber/us-central1/api/picture", {
                method: "POST",
                body,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data"
                }
            });
            const url = await Firebase.storage.ref(name).getDownloadURL();
            console.log(url);
        } catch(e) {
            alert(e);
        }
        // NavigationHelpers.reset(navigation, "Home");
    }

    @autobind
    onChangeText(caption: string) {
        this.setState({ caption });
    }

    render(): React.Node {
        const {onPress, onChangeText} = this;
        const {navigation} = this.props;
        const {loading} = this.state;
        const source = navigation.state.params;
        if (loading) {
            return (
                <View style={styles.loading}>
                    <RefreshIndicator />
                </View>
            )
        }
        return (
            <Container>
                <ScrollView>
                    <KeyboardAvoidingView behavior="position">
                        <NavHeader back={true} title="Share" {...{navigation}} />
                        <Image {...{ source }} style={styles.picture} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Write Caption"
                            underlineColorAndroid="transparent"
                            onSubmitEditing={onPress}
                            {...{ onChangeText }}
                        />
                        <Button primary={true} full={true} label="Share Picture" {...{onPress}} style={styles.btn} />
                    </KeyboardAvoidingView>
                </ScrollView>
            </Container>
        );
    }
}

const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    loading: {
        flexGrow: 1,
        justifyContent: "center"
    },
    container: {
        flexGrow: 1
    },
    picture: {
        width,
        height: width
    },
    textInput: {
        flexGrow: 1,
        padding: Theme.spacing.base,
        ...Theme.typography.regular
    },
    btn: {
        margin: Theme.spacing.base
    }
});
