// @flow
import * as React from "react";
import {StyleSheet, TouchableWithoutFeedback} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import {SafeAreaView} from "react-navigation";

import {Theme} from "../components";

import type {NavigationProps} from "../components/Types";

type Tab = { label: string, icon: string };

export class HomeTab extends React.Component<NavigationProps<*>> {

    static tabs: Tab[] = [
        { label: "Explore", icon: "home" },
        { label: "Profile", icon: "user" }
    ];

    render(): React.Node {
        const {navigation} = this.props;
        const navState = navigation.state;
        const currentIndex = navState.index;
        return (
            <SafeAreaView style={tabStyles.tabs} forceInset={{ bottom: "always", top: "never" }}>
            {
                HomeTab.tabs.map((info, index) => {
                    const color = index === currentIndex ? Theme.palette.primary : Theme.palette.lightGray;
                    return (
                        <TouchableWithoutFeedback
                            key={info.label}
                            onPress={() => index !== currentIndex ? this.props.navigation.navigate(info.label): null}
                        >
                            <Icon name={info.icon} size={25} {...{ color }} />
                        </TouchableWithoutFeedback>
                    );
                })
            }
            </SafeAreaView>
        );
    }
}

const tabStyles = StyleSheet.create({
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 57,
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5
    },
    label: {
        ...Theme.typography.micro
    }
});
