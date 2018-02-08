// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, TextInput, Image, Dimensions, View} from "react-native";
import {Content} from "native-base";

import {
    NavHeader, Button, Theme, RefreshIndicator, Firebase, NavigationHelpers, ImageUpload, serializeException, Text
} from "../../components";

import type {ScreenParams} from "../../components/Types";
import type {Post} from "../../components/Model";
import type {Picture} from "../../components/ImageUpload";

type SharePictureState = {
    loadingLabel: string,
    loading: boolean,
    caption: string,
    uploadDone: boolean,
    retry: boolean
};

export default class SharePicture extends React.Component<ScreenParams<Picture>, SharePictureState> {

    id: string;
    name: string;
    preview: string;
    url: string;

    @autobind
    async upload(): Promise<void> {
        const {navigation} = this.props;
        const picture = navigation.state.params;
        try {
            this.setState({ retry: false });
            await ImageUpload.upload(picture, this.name);
            this.url = await Firebase.storage.ref(this.name).getDownloadURL();
            this.setState({ uploadDone: true });
        } catch (e) {
            const message = serializeException(e);
            alert(message);
            this.setState({ retry: true });
        }
    }

    async componentWillMount(): Promise<void> {
        const {navigation} = this.props;
        const picture = navigation.state.params;
        this.setState({ loading: false, loadingLabel: "", caption: "", uploadDone: false, retry: false });
        this.id = ImageUpload.uid();
        this.name = `${this.id}.jpg`;
        this.preview = await ImageUpload.preview(picture);
        await this.upload();
    }

    @autobind
    async onPress(): Promise<void> {
        const {navigation} = this.props;
        const {caption, uploadDone} = this.state;
        if (!uploadDone) {
            return;
        }
        this.setState({ loading: true });
        try {
            this.setState({ loadingLabel: "Saving Post..." });
            const {uid} = Firebase.auth.currentUser;
            const post: Post = {
                id: this.id,
                uid,
                comments: 0,
                likes: [],
                timestamp: parseInt(moment().format("X"), 10),
                text: caption,
                picture: {
                    uri: this.url,
                    preview: this.preview
                }
            };
            await Firebase.firestore.collection("feed").doc(this.id).set(post);
            NavigationHelpers.reset(navigation, "Home");
        } catch(e) {
            const message = serializeException(e);
            alert(message);
            this.setState({ loading: false });
        }
    }

    @autobind
    onChangeText(caption: string) {
        this.setState({ caption });
    }

    render(): React.Node {
        const {onPress, onChangeText} = this;
        const {navigation} = this.props;
        const {loading, loadingLabel, uploadDone, retry} = this.state;
        const source = navigation.state.params;
        if (loading) {
            return (
                <View style={styles.loading}>
                    <RefreshIndicator />
                    <Text>{loadingLabel}</Text>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <NavHeader back={true} title="Share" {...{navigation}} />
                <Content>
                    <Image {...{ source }} style={styles.picture} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write Caption"
                        underlineColorAndroid="transparent"
                        onSubmitEditing={onPress}
                        {...{onChangeText}}
                    />
                    {
                        retry && (
                            <Button
                                primary={true}
                                full={true}
                                label="Retry processing"
                                style={styles.btn}
                                onPress={this.upload}
                            />
                        )
                    }
                    {
                        !retry && (
                            <Button
                                primary={true}
                                full={true}
                                label={!uploadDone ? "Uploading Picture..." : "Share Picture"}
                                style={styles.btn}
                                {...{onPress}}
                            />

                        )
                    }
                </Content>
            </View>
        );
    }
}

const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    loading: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center"
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
