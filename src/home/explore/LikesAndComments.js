// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, TouchableWithoutFeedback} from "react-native";

import Likes from "./Likes";
import {Feather as Icon} from "@expo/vector-icons";

import {Text, Theme, APIStore} from "../../components";
import type {NavigationProps} from "../../components/Types";

type LikesAndCommentsProps = NavigationProps<> & {
    id: string,
    color: string
};

export default class LikesAndComments extends React.Component<LikesAndCommentsProps> {

    @autobind
    goToComments() {
        const post = this.props.id;
        this.props.navigation.navigate("Comments", { post });
    }

    render(): React.Node {
        const {id, color} = this.props;
        const comments = APIStore.comments(id);
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Likes {...{color}} />
                    <TouchableWithoutFeedback onPress={this.goToComments}>
                        <View style={styles.comments}>
                            <Icon name="message-circle" size={18} {...{color}} />
                            <Text style={[styles.commentCount, { color }]}>{`${comments.length}`}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end"
    },
    content: {
        flexDirection: "row",
        alignItems: "center"
    },
    comments: {
        marginLeft: Theme.spacing.tiny,
        flexDirection: "row"
    },
    commentCount: {
        marginLeft: Theme.spacing.tiny
    }
});
