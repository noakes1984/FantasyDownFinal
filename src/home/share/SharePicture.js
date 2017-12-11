// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {
    StyleSheet, TextInput, Image, Dimensions, KeyboardAvoidingView, ScrollView, View
} from "react-native";

import {
    Container, NavHeader, Button, Theme, RefreshIndicator, Firebase, NavigationHelpers, ImageUpload
} from "../../components";

import type {ScreenParams} from "../../components/Types";
import type {Post} from "../../components/Model";
import type {Picture} from "../../components/ImageUpload";

type SharePictureState = {
    loading: boolean,
    caption: string
};

export default class SharePicture extends React.Component<ScreenParams<Picture>, SharePictureState> {

    componentWillMount() {
        this.setState({ loading: false, caption: "" });
    }

    @autobind
    async onPress(): Promise<void> {
        const {navigation} = this.props;
        const {caption} = this.state;
        const picture = navigation.state.params;
        this.setState({ loading: true });
        const id = ImageUpload.uid();
        const name = `${id}.jpg`;
        try {
            const preview = await ImageUpload.preview(picture);
            await ImageUpload.upload(picture, name);
            const url = await Firebase.storage.ref(name).getDownloadURL();
            const {uid} = Firebase.auth.currentUser;
            const post: Post = {
                id,
                uid,
                comments: 0,
                likes: [],
                timestamp: parseInt(moment().format("X"), 10),
                text: caption,
                picture: {
                    uri: url,
                    preview
                }
            };
            await Firebase.firestore.collection("feed").doc(id).set(post);
            NavigationHelpers.reset(navigation, "Home");
        } catch(e) {
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
