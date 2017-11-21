// @flow
import * as React from "react";
import moment from "moment"
import {FlatList, StyleSheet, View} from "react-native";

import Post from "./Post";

import {Text, APIStore, Theme, Container} from "../../components";
import type {ScreenProps} from "../../components/Types";

export default class Explore extends React.Component<ScreenProps<>> {

    render(): React.Node {
        const posts = APIStore.posts();
        return (
            <Container style={styles.container}>
                <View style={styles.gutter}>
                    <Text type="large">3 new posts</Text>
                    <Text type="header1" gutterBottom={true}>{moment().format("dddd")}</Text>
                </View>
                <FlatList
                    style={styles.gutter}
                    data={posts}
                    keyExtractor={post => post.id}
                    renderItem={({ item }) => <Post post={item} />}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Theme.spacing.small
    },
    gutter: {
        paddingHorizontal: Theme.spacing.tiny
    }
})
