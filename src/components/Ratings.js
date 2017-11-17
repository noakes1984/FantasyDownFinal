// @flow
import * as React from "react";
import {View, StyleSheet} from "react-native";
import {Ionicons as Icon} from "@expo/vector-icons";

import {Theme} from "./Theme";
import Text from "./Text";

type RatingsProps = {
    value: number,
    votes: number
};

export default class Ratings extends React.Component<RatingsProps> {
    render(): React.Node {
        const {votes, value} = this.props;
        const filledStars = value - value % 1;
        const halfStar = value % 1 !== 0;
        const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);
        const size = 25;
        const color = Theme.palette.primary;
        return (
            <View style={styles.container}>
                {
                    to(filledStars)
                        .map(key => <Icon name="ios-star" {...{ key, size, color }} />)
                }
                { halfStar && <Icon name="ios-star-half" {...{ size, color }} /> }
                {
                    to(emptyStars)
                        .map(key => <Icon name="ios-star-outline" {...{ key, size, color }} />)
                }
                <Text style={styles.text}>{`${votes} votes`}</Text>
            </View>
        );
    }
}

const to = (index: number): number[] => {
    const numbers: number[] = [];
    for(let i=0; i<index; i++) {
        numbers.push(i);
    }
    return numbers
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Theme.palette.lightGray,
        borderBottomWidth: 1,
        paddingBottom: Theme.spacing.small,
        marginBottom: Theme.spacing.small,
    },
    text: {
        marginLeft: Theme.spacing.tiny,
        color: Theme.palette.primary
    }
});
