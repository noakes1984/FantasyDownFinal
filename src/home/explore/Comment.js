// @flow
import * as React from "react";
import {StyleSheet, View, Platform} from "react-native";

import {Text, Avatar, Theme} from "../../components";
import type {Comment} from "../../components/APIStore";

type CommentProps = {
    comment: Comment
};

export default class CommentComp extends React.Component<CommentProps> {

    render(): React.Node {
        const {name, text, picture} = this.props.comment;
        return (
            <View style={styles.container}>
                <Avatar {...picture} />
                <View style={styles.comment}>
                    <Text style={styles.author}>{name}</Text>
                    <Text>{text}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: Theme.spacing.small,
        margin: Theme.spacing.small,
        borderRadius: 5,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.14,
        shadowRadius: 6,
        borderColor: Theme.palette.borderColor,
        borderWidth: Platform.OS === "ios" ? 0 : 1
    },
    author: {
        color: "black",
        fontFamily: Theme.typography.semibold
    },
    comment: {
        flex: 1,
        paddingHorizontal: Theme.spacing.small
    }
});
