// @flow
import * as React from "react";
import {StyleProvider} from "native-base";
import {StackNavigator, TabNavigator} from "react-navigation";
import {Font, AppLoading} from "expo";

import {Images, APIStore} from "./src/components";
import {Welcome} from "./src/welcome";
import {SignUpName, SignUpEmail, SignUpBirthday, SignUpPassword, Login} from "./src/sign-up";
import {
    Profile, Explore, HomeTab
} from "./src/home";

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
                "SFProDisplay-Heavy": require("./fonts/SF-Pro-Display-Heavy.otf"),
                "SFProDisplay-Bold": require("./fonts/SF-Pro-Display-Bold.otf"),
                "SFProDisplay-Semibold": require("./fonts/SF-Pro-Display-Semibold.otf"),
                "SFProDisplay-Regular": require("./fonts/SF-Pro-Display-Regular.otf"),
                "SFProDisplay-Light": require("./fonts/SF-Pro-Display-Light.otf"),
            });
            await Images.downloadAsync();
            await APIStore.load();
            this.setState({ ready: true });
        } catch(error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    render(): React.Node {
        const {ready} = this.state;
        return <StyleProvider style={getTheme(variables)}>
            {
                ready ?
                    <AppNavigator onNavigationStateChange={() => undefined} />
                :
                    <AppLoading />
            }
        </StyleProvider>;
    }
}

const StackNavigatorOptions = {
    headerMode: "none",
    cardStyle: {
        backgroundColor: "white"
    }
};

const ExploreNavigator = StackNavigator({
    Explore: { screen: Explore }
}, StackNavigatorOptions);

const ProfileNavigator =  StackNavigator({
    Profile: { screen: Profile }
}, StackNavigatorOptions);

const Home = TabNavigator({
    Explore: { screen: ExploreNavigator },
    Profile: { screen: ProfileNavigator }
}, {
    animationEnabled: false,
    tabBarComponent: HomeTab,
    tabBarPosition: "bottom"
});

const AppNavigator = StackNavigator({
    Welcome: { screen: Welcome },
    Login: { screen: Login },
    SignUp: { screen: SignUpName },
    SignUpEmail: { screen: SignUpEmail },
    SignUpBirthday: { screen: SignUpBirthday },
    SignUpPassword: { screen: SignUpPassword },
    Home: { screen: Home }
}, StackNavigatorOptions);

export {AppNavigator};
