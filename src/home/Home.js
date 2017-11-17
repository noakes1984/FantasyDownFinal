// @flow
import * as React from "react";
import {StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import {SafeAreaView} from "react-navigation";

import {Theme, Container} from "../components";

import type {BaseProps, NavigationProps} from "../components/Types";

type Tab = { label: string, icon: string };

export class HomeTab extends React.Component<NavigationProps<*>> {

    static tabs: Tab[] = [
        { label: "Explore", icon: "ios-search-outline" },
        { label: "Saved", icon: "ios-heart-outline" },
        { label: "Trips", icon: "ios-plane-outline" },
        { label: "Inbox", icon: "ios-chatbubbles-outline" },
        { label: "Profile", icon: "ios-person-outline" }
    ];

    render(): React.Node {
        const {navigation} = this.props;
        const navState = navigation.state;
        const currentIndex = navState.index;
        return (
            <SafeAreaView style={tabStyles.tabs} forceInset={{ bottom: "always", top: "never" }}>
            {
                HomeTab.tabs.map((info, index) => {
                    const color = index === currentIndex ? Theme.palette.secondary : "#444444";
                    return (
                        <TouchableWithoutFeedback
                            key={info.label}
                            onPress={() => this.props.navigation.navigate(info.label)}
                        >
                            <View style={tabStyles.tab}>
                                <Icon name={info.icon} size={25} {...{ color }} />
                                <Text style={[tabStyles.label, { color }]}>
                                {info.label.toUpperCase()}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })
            }
            </SafeAreaView>
        );
    }
}

type HomeContainerProps = BaseProps & {
    withGutter?: boolean,
    children: React.ChildrenArray<React.Element<*>>
};

export class HomeContainer extends React.Component<HomeContainerProps> {
    render(): React.Node {
        const {withGutter, style, children} = this.props;
        return (
            <Container {...{ withGutter }}>
                <ScrollView {...{ style }}>
                    {children}
                </ScrollView>
            </Container>
        );
    }
}

const tabStyles = StyleSheet.create({
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 57,
        borderTopWidth: 1,
        borderColor: "#d6d6d6"
    },
    tab: {
        alignItems: "center"
    },
    label: {
        ...Theme.typography.micro
    }
});
