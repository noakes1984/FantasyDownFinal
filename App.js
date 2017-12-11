// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleProvider} from "native-base";
import {StackNavigator, TabNavigator} from "react-navigation";
import {Font, AppLoading} from "expo";

import {Images, Firebase} from "./src/components";
import {Welcome} from "./src/welcome";
import {Walkthrough} from "./src/walkthrough";
import {SignUpName, SignUpEmail, SignUpPassword, Login} from "./src/sign-up";
import {Profile, Explore, Share, SharePicture, HomeTab, Comments, Settings} from "./src/home";

import getTheme from "./native-base-theme/components";
import variables from "./native-base-theme/variables/commonColor";

interface AppState {
    staticAssetsLoaded: boolean,
    authStatusReported: boolean,
    isUserAuthenticated: boolean
}

export default class App extends React.Component<{}, AppState> {

    state: AppState = {
        staticAssetsLoaded: false,
        authStatusReported: false,
        isUserAuthenticated: false
    };

    componentWillMount() {
        this.loadStaticResources();
        Firebase.init();
        Firebase.auth.onAuthStateChanged(user => {
            this.setState({
                authStatusReported: true,
                isUserAuthenticated: !!user
            });
        });
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
            this.setState({ staticAssetsLoaded: true });
        } catch(error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    render(): React.Node {
        const {onNavigationStateChange} = this;
        const {staticAssetsLoaded, authStatusReported, isUserAuthenticated} = this.state;
        return <StyleProvider style={getTheme(variables)}>
            {
                (staticAssetsLoaded && authStatusReported) ?
                    (
                        isUserAuthenticated
                            ?
                                <Home {...{onNavigationStateChange}} />
                            :
                                <AppNavigator {...{onNavigationStateChange}} />
                    )
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
    Profile: { screen: Profile },
    Settings: { screen: Settings }
}, StackNavigatorOptions);

const ShareNavigator = StackNavigator({
    Share: { screen: Share },
    SharePicture: { screen: SharePicture }
}, StackNavigatorOptions);

const HomeTabs = TabNavigator({
    Explore: { screen: ExploreNavigator },
    Share: { screen: ShareNavigator },
    Profile: { screen: ProfileNavigator }
}, {
    animationEnabled: false,
    tabBarComponent: HomeTab,
    tabBarPosition: "bottom"
});

const Home = StackNavigator({
    Walkthrough: { screen: Walkthrough },
    Home: { screen: HomeTabs }
}, StackNavigatorOptions);

const AppNavigator = StackNavigator({
    Welcome: { screen: Welcome },
    Login: { screen: Login },
    SignUp: { screen: SignUpName },
    SignUpEmail: { screen: SignUpEmail },
    SignUpPassword: { screen: SignUpPassword }
}, StackNavigatorOptions);

export {AppNavigator};
