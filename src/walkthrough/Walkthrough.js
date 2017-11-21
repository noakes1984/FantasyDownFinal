// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet} from "react-native";
import Swiper from "react-native-swiper";

import Slide from "./Slide";
import Connect from "./Connect";
import Chat from "./Chat";
import Share from "./Share";

import {Button, NavigationHelpers} from "../components";
import type {ScreenProps} from "../components/Types";

export default class Walkthrough extends React.Component<ScreenProps<>> {

    home() {
        const {navigation} = this.props;
        NavigationHelpers.reset(navigation, "Home");
    }

    @autobind
    renderPagination(index: number, total: number, context: Swiper): React.Node {
        const isFirst = index === 0;
        const isLast = index === total - 1;
        const back = () => context.scrollBy(-1);
        const next = () => isLast ? this.home() : context.scrollBy(1);
        return (
            <View style={styles.footer}>
                <Button label="Back" onPress={back} disabled={isFirst} />
                <Button label={isLast ? "Start" : "Next"} onPress={next} primary={true} transparent={true} />
            </View>
        );
    }

    @autobind
    onIndexChanged(index: number) {
        slides[index].makeVisible();
    }

    render(): React.Node {
        const {renderPagination, onIndexChanged} = this;
        return (
            <Swiper loop={false} {...{ renderPagination, onIndexChanged }}>
            {
                slides.map(slide => (
                    <View key={slide.title}>
                        <Slide {...slide} />
                    </View>
                ))
            }
            </Swiper>
        );
    }
}

/*
*/
let chat: Chat;
let share: Share;

const slides = [
    {
        title: "Connect",
        description: "Bring your friends closer by building a network of the people you love.",
        icon: <Connect />,
        makeVisible: () => true
    },
    {
        title: "Chat",
        description: "Send messages and stay up to date with friends whenever you need to.",
        icon: <Chat ref={ref => ref ? chat = ref : undefined} />,
        makeVisible: () => chat.makeVisible()
    },
    {
        title: "Share",
        description: "Send your best selfies and show friends what you’re up to.",
        icon: <Share ref={ref => ref ? share = ref : undefined} />,
        makeVisible: () => share.makeVisible()
    }
];
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
});
