// @flow
import {NavigationActions, type NavigationScreenProp} from "react-navigation";

export default class NavigationHelpers {
    static reset(navigation: NavigationScreenProp<*>, routeName: string, key: string | null = null) {
        const action = NavigationActions.reset({
            index: 0,
            key,
            actions: [
                NavigationActions.navigate({ routeName })
            ]
        });
        navigation.dispatch(action);
    }
}
