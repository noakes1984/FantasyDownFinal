// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {Switch as RNSwitch} from "react-native";

type SwitchProps = {
    defaultValue?: boolean,
    onToggle?: boolean => void,
    onTintColor?: string
};

type SwitchState = {
    value: boolean
};

export default class Switch extends React.Component<SwitchProps, SwitchState> {

    static defaultProps = {
        onTintColor: "rgba(255, 255, 255, .5)"
    };

    componentWillMount() {
        const {defaultValue} = this.props;
        this.setState({ value: !!defaultValue });
    }

    @autobind
    toggle() {
        const {onToggle} = this.props;
        const {value} = this.state;
        this.setState({ value: !value })
        if (onToggle) {
            onToggle(!value);
        }
    }

    render(): React.Node {
        const {onTintColor} = this.props;
        const {value} = this.state;
        return (
            <RNSwitch
                {...{onTintColor, value}}
                onValueChange={this.toggle}
            />
        );
    }
}
