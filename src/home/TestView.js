import React, { Component } from "react";
import {
    // Alert,
    // TouchableOpacity,
    // Platform,
    // StyleSheet,
    View
    // AppRegistry
    // TextInput
} from "react-native";
import {
    // Container,
    // Button,
    // Header,
    // Content,
    // Accordion,
    Text
    // StyleProvider
    // Item,
    // Input,
    // Footer,
    // FooterTab,
    // Textarea,
    // Spinner
} from "native-base";
//import getTheme from "../../../native-base-theme/components";
//import branch, { BranchEvent } from 'react-native-branch';

// type Props = {};

export default class TestView extends Component {
    state = {};

    constructor(props) {
        super(props);

        this.state = {};

        return;

        this.state = {
            screen: "bet",
            isGeneratingBet: false,
            visibleModal: 1,

            //wallet: null,

            events: [
                {
                    id: 1,
                    title: "Falcons vs Eagles",
                    content: {
                        id: 1,
                        title: "Falcons vs Eagles",
                        teamHome: "Falcons",
                        teamAway: "Eagles"
                    }
                },
                {
                    id: 2,
                    title: "Bengals vs Colts",
                    content: {
                        id: 2,
                        title: "Bengals vs Colts",
                        teamHome: "Bengals",
                        teamAway: "Colts"
                    }
                },
                {
                    id: 3,
                    title: "Bills vs Ravens",
                    content: {
                        id: 3,
                        title: "Bills vs Ravens",
                        teamHome: "Bills",
                        teamAway: "Ravens"
                    }
                },
                {
                    id: 4,
                    title: "Bears vs Packers",
                    content: {
                        id: 4,
                        title: "Bears vs Packers",
                        teamHome: "Bears",
                        teamAway: "Packers"
                    }
                }
            ]
        };

        this.selectTeam = this.selectTeam.bind(this);
        this.generateBet = this.generateBet.bind(this);
        this._renderSectionTitle = this._renderSectionTitle.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    render() {
        return (
            <View>
                <Text>Niggaz be niggin</Text>
            </View>
        );
    }
}

module.exports = TestView;
