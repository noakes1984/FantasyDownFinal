// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {
    StyleSheet, FlatList, KeyboardAvoidingView, TextInput, View, Platform, TouchableOpacity
} from "react-native";

import CommentComp from "./Comment";

import {Text, NavHeader, Theme, NavigationHelpers, Firebase} from "../../components";
import type {ScreenParams} from "../../components/Types";
import type {Comment, Profile} from "../../components/Model";

type Comments = { comment: Comment, profile: Profile }[];

type CommentsState = {
    profile: Profile,
    comments: Comments,
    text: string,
    loading: boolean
};

export default class CommentsComp extends React.Component<ScreenParams<{ post: string }>, CommentsState> {

    async componentWillMount(): Promise<void> {
        const {post} = this.props.navigation.state.params;
        this.setState({ loading: true, text: "" });
        const {uid} = Firebase.auth.currentUser;
        const profileDoc = await Firebase.firestore.collection("users").doc(uid).get();
        const profile = profileDoc.data();
        const query = await Firebase.firestore.collection("feed").doc(post).collection("comments").get();
        const comments: Comments = [];
        query.forEach(async commentDoc => {
            const comment = commentDoc.data();
            const profileDoc = await Firebase.firestore.collection("users").doc(comment.uid).get();
            const profile = profileDoc.data();
            comments.push({ comment, profile });
        });
        this.setState({ comments, loading: false, profile });
    }

    @autobind
    async send(): Promise<void> {
        const {post} = this.props.navigation.state.params;
        const {text, profile} = this.state;
        const comments =  this.state.comments.slice();
        const {uid} = Firebase.auth.currentUser;
        const comment = {
            text,
            id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1),
            uid,
            timestamp: parseInt(moment().format("X"), 10)
        };
        if (text.trim() === "") {
            return;
        }
        comments.unshift({ comment, profile });
        this.setState({ comments, text: "" });
        const postRef = Firebase.firestore.collection("feed").doc(post);
        await postRef.collection("comments").add(comment);
        await Firebase.firestore.runTransaction(async transaction => {
            const postDoc = await transaction.get(postRef);
            const comments = postDoc.data().comments + 1;
            transaction.update(postRef, { comments });
        });
    }

    @autobind
    onChangeText(text: string) {
        this.setState({ text });
    }

    @autobind
    backFn() {
        NavigationHelpers.reset(this.props.navigation, "Home");
    }

    render(): React.Node {
        const {onChangeText, backFn} = this;
        const {navigation} = this.props;
        const {comments, text} = this.state
        return (
            <View style={styles.container}>
                <NavHeader title="Comments" back={true} {...{navigation, backFn}} />
                <FlatList
                    inverted={true}
                    data={comments}
                    keyExtractor={item => item.comment.id}
                    renderItem={({ item }) => <CommentComp comment={item.comment} profile={item.profile} />}
                />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={styles.footer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Write a comment"
                            value={text}
                            autoFocus={true}
                            returnKeyType="send"
                            onSubmitEditing={this.send}
                            underlineColorAndroid="transparent"
                            {...{onChangeText}}
                        />
                        <TouchableOpacity primary={true} transparent={true} onPress={this.send}>
                            <Text style={styles.btnText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    footer: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.14,
        shadowRadius: 6,
        borderTopWidth: Platform.OS === "ios" ? 0 : 1,
        borderColor: Theme.palette.borderColor,
        paddingLeft: Theme.spacing.small,
        paddingRight: Theme.spacing.small,
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        height: Theme.typography.regular.lineHeight + Theme.spacing.base * 2,
        flex: 1
    },
    btnText: {
        color: Theme.palette.primary
    }
});
