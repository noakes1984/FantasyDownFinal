// @flow
import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";
import {ScrollView, View, StyleSheet} from "react-native";

import Category from "./Category";
import HomeCard from "./HomeCard";
import CityCard from "./CityCard";

import {HomeContainer} from "../Home";

import {Images, Theme, Text, APIStore} from "../../components";

import type {ScreenProps} from "../../components/Types";

export default class Explore extends React.Component<ScreenProps<>> {

    @autobind
    homeDetails(id: string) {
        this.props.navigation.navigate("HomeOverview", { id });
    }

    render(): React.Node {
        return (
            <HomeContainer>
                    <Text type="header1" gutterBottom={true} style={styles.text}>Explore</Text>
                    <ScrollView horizontal={true} style={styles.scrollView}>
                        <Category label="Homes" image={Images.homes} />
                        <Category label="Experiences" image={Images.experiences} />
                        <Category label="Restaurants" image={Images.restaurants} />
                    </ScrollView>
                    {
                        _.map(APIStore.homesByCities(), (homes, city) => (
                            <View key={city}>
                                <Text type="header2" gutterBottom={true} style={styles.text}>{city}</Text>
                                <ScrollView horizontal={true} style={styles.scrollView}>
                                {homes.map(home => (
                                    <HomeCard
                                        key={home.id}
                                        onPress={this.homeDetails}
                                        {...{ home }}
                                    />
                                ))}
                                </ScrollView>
                            </View>
                        ))
                    }
                    <ScrollView horizontal={true} style={styles.scrollView}>
                        <CityCard label="Cape Town" image={Images.CapeTown} />
                        <CityCard label="London" image={Images.London} />
                        <CityCard label="Los Angeles" image={Images.LosAngeles} />
                        <CityCard label="Miami" image={Images.Miami} />
                        <CityCard label="Nairobi" image={Images.Nairobi} />
                        <CityCard label="Paris" image={Images.Paris} />
                        <CityCard label="San Francisco" image={Images.SanFrancisco} />
                        <CityCard label="Tokyo" image={Images.Tokyo} />
                    </ScrollView>
            </HomeContainer>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        paddingLeft: Theme.spacing.base
    },
    scrollView: {
        paddingHorizontal: Theme.spacing.base,
        marginBottom: Theme.spacing.base
    }
});
