// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {
    StyleSheet, TextInput, Image, Dimensions, KeyboardAvoidingView, ScrollView, ImageEditor, ImageStore, View
} from "react-native";

import {
    Container, NavHeader, Button, Theme, APIStore, RefreshIndicator, Firebase, NavigationHelpers
} from "../../components";

import type {Picture} from "./Picture";
import type {ScreenParams} from "../../components/Types";
import type {Post} from "../../components/APIStore";

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
        try {
            const body = new FormData();
            const name = `${id}.jpg`;
            body.append("picture", {
                uri: picture.uri,
                name,
                type: "image/jpg"
            });
            await fetch(`${Firebase.endpoint}/picture`, {
                method: "POST",
                body,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data"
                }
            });
            const url = await Firebase.storage.ref(name).getDownloadURL();
            const {uid} = Firebase.auth.currentUser;
            const post: Post = {
                id,
                uid,
                timestamp: parseInt(moment().format("X"), 10),
                name: "John Doe",
                profilePicture: APIStore.profile().picture,
                text: caption,
                picture: {
                    uri: url,
                    preview
                }
            };
            await Firebase.firestore.collection("feed").doc(id).set(post);
            NavigationHelpers.reset(navigation, "Home");
        } catch(e) {
            console.log(e);
            alert(e);
        }
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
