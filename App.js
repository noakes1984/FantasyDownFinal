// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleProvider} from "native-base";
import {StackNavigator, TabNavigator} from "react-navigation";
import {Font, AppLoading} from "expo";

import {Images} from "./src/components";
import {Welcome} from "./src/welcome";
import {Walkthrough} from "./src/walkthrough";
import {SignUpName, SignUpEmail, SignUpPassword, Login} from "./src/sign-up";
import {Profile, Explore, Share, SharePicture, HomeTab, Comments} from "./src/home";

import getTheme from "./native-base-theme/components";
import variables from "./native-base-theme/variables/commonColor";

interface AppState {
    ready: boolean
}

export default class App extends React.Component<{}, AppState> {

    state: AppState = {
        ready: false,
    };

    componentWillMount() {
        this.loadStaticResources();
    }

    async loadStaticResources(): Promise<void> {
        try {
            await Font.loadAsync({
                "SFProText-Medium": require("./fonts/SF-Pro-Text-Medium.otf"),
                "SFProText-Heavy": require("./fonts/SF-Pro-Text-Heavy.otf"),
                "SFProText-Bold": require("./fonts/SF-Pro-Text-Bold.otf"),
                "SFProText-Semibold": require("./fonts/SF-Pro-Text-Semibold.otf"),
                "SFProText-Regular": require("./fonts/SF-Pro-Text-Regular.otf"),
                "SFProText-Light": require("./fonts/SF-Pro-Text-Light.otf")
            });
            await Images.downloadAsync();
            this.setState({ ready: true });
        } catch(error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    render(): React.Node {
        const {onNavigationStateChange} = this;
        const {ready} = this.state;
        return <StyleProvider style={getTheme(variables)}>
            {
                ready ?
                    <AppNavigator {...{onNavigationStateChange}} />
                :
                    <AppLoading />
            }
        </StyleProvider>;
    }

    @autobind
    onNavigationStateChange() {
        return undefined;
    }
}

const StackNavigatorOptions = {
    headerMode: "none",
    cardStyle: {
        backgroundColor: "white"
    }
};

const ExploreNavigator = StackNavigator({
    Explore: { screen: Explore },
    Comments: { screen: Comments }
}, StackNavigatorOptions);

const ProfileNavigator =  StackNavigator({
    Profile: { screen: Profile }
}, StackNavigatorOptions);

const ShareNavigator = StackNavigator({
    Share: { screen: Share },
    SharePicture: { screen: SharePicture }
}, StackNavigatorOptions);

const Home = TabNavigator({
    Explore: { screen: ExploreNavigator },
    Share: { screen: ShareNavigator },
    Profile: { screen: ProfileNavigator }
}, {
    animationEnabled: false,
    tabBarComponent: HomeTab,
    tabBarPosition: "bottom"
});

const AppNavigator = StackNavigator({
    Welcome: { screen: Welcome },
    Walkthrough: { screen: Walkthrough },
    Login: { screen: Login },
    SignUp: { screen: SignUpName },
    SignUpEmail: { screen: SignUpEmail },
    SignUpPassword: { screen: SignUpPassword },
    Home: { screen: Home }
}, StackNavigatorOptions);

export {AppNavigator};
