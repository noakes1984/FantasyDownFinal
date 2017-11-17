// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, TouchableWithoutFeedback, ImageBackground} from "react-native";

import {Theme, Text, IconButton, APIStore} from "../../components";
import type {Home} from "../../components/Model";

type HomeCardProps = {
    home: Home,
    onPress: (string) => void
};

type HomeCardState = {
    saved: boolean
};

export default class HomeCard extends React.Component<HomeCardProps, HomeCardState> {

    listener: Home[] => void;

    @autobind
    toggleSaved() {
        const {id} = this.props.home;
        APIStore.toggleSaved(id);
    }

    componentWillMount() {
        const {id} = this.props.home;
        this.listener = (homes: Home[]) => {
            this.setState({ saved: homes.filter(home => home.id === id).length === 1 });
        };
        APIStore.savedHomes(this.listener);
    }

    componentWillUnmount() {
        APIStore.dispose(this.listener);
    }

    render(): React.Node {
        const {home, onPress} = this.props;
        const {saved} = this.state;
        return (
            <TouchableWithoutFeedback onPress={() => onPress(home.id)}>
                <View style={styles.container}>
                    <ImageBackground source={{ uri: home.pictures[0] }} style={styles.image}>
                        <IconButton
                            name={saved ? "ios-heart" : "md-heart-outline"}
                            contrast={true}
                            onPress={this.toggleSaved}
                            style={styles.heartBtn}
                        />
                    </ImageBackground>
                    <Text type="micro" gutterBottom={true}>
                    {`${home.category1.toUpperCase()} - ${home.category2.toUpperCase()}`}
                    </Text>
                    <Text type="large" numberOfLines={2} gutterBottom={true}>{home.title}</Text>
                    <Text type="small" gutterBottom={true}>
                    {`${home.price.amount} ${home.price.currency} per person`}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 158,
        marginRight: Theme.spacing.small
    },
    image: {
        width: 158,
        height: 103,
        borderRadius: 2,
        marginBottom: Theme.spacing.small,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    heartBtn: {
        justifyContent: "center",
        alignItems: "center"
    }
});
