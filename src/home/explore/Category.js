// @flow
import * as React from "react";
import {View, Image, StyleSheet} from "react-native";

import {Theme, Text} from "../../components";

type CategoryProps = {
    label: string,
    image: number
};

export default class Category extends React.Component<CategoryProps> {

    render(): React.Node {
        const {label, image} = this.props;
        return (
            <View style={styles.container}>
                <Image source={image} style={styles.image} />
                <Text type="large" gutterBottom={true} style={styles.text}>{label}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 121,
        height: 115,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: "#b3b3b3",
        marginRight: Theme.spacing.small
    },
    image: {
        width: 121,
        height: 68,
        borderRadius: 2
    },
    text: {
        marginTop: Theme.spacing.tiny,
        marginLeft: Theme.spacing.tiny
    }
});
