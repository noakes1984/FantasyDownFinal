// @flow
import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";
import {TextInput} from "react-native";
import {View, Text, StyleSheet} from "react-native";
import {Button} from "native-base";

import { Theme } from "./Theme";

interface BaseFieldProps {
    label: string,
    contrast?: boolean
}

interface FieldProps extends BaseFieldProps {
    right?: { label: string, onPress: () => void },
    children?: React.Element<*>
}

export class Field extends React.Component<FieldProps> {

    render(): React.Node {
        const {label, contrast, right, children} = this.props;
        const containerStyle = [styles.container];
        const labelStyle = [styles.label];
        if (contrast) {
            containerStyle.push(styles.containerContrast);
            labelStyle.push(styles.labelContrast);
        }
        return (
            <View style={containerStyle}>
                <View style={styles.labelContainer}>
                <Text style={labelStyle}>{label.toUpperCase()}</Text>
                {
                    right && (
                        <Button onPress={right.onPress} transparent={true}>
                            <Text style={labelStyle}>{right.label.toUpperCase()}</Text>
                        </Button>
                    )
                }
                </View>
                {children}
            </View>
        );
    }
}

interface TextFieldProps extends BaseFieldProps {
    textInputRef?: (TextInput) => void,
    toggleSecureEntry?: boolean
}

type TextFieldState = {
    secureTextEntry: boolean
};

export class TextField extends React.Component<TextFieldProps, TextFieldState> {

    @autobind
    toggleSecureTextEntry() {
        const {secureTextEntry} = this.state;
        this.setState({ secureTextEntry: !secureTextEntry });
    }

    componentWillMount() {
        this.setState({ secureTextEntry: !!this.props.toggleSecureEntry });
    }

    render(): React.Node {
        const {label, contrast, textInputRef, toggleSecureEntry} = this.props;
        const {secureTextEntry} = this.state;
        const right = { label: "Show", onPress: this.toggleSecureTextEntry };
        const keysToFilter = ["contrast", "label", "textInputRef", "toggleSecureEntry"];
        const props = _.pickBy(this.props, (value, key) => keysToFilter.indexOf(key) === -1);
        const inputStyle = [styles.textInput];
        if (contrast) {
            inputStyle.push(styles.textInputContrast);
        }
        return (
            <Field {...{ label, contrast, right: toggleSecureEntry ? right : undefined }}>
                <TextInput
                    secureTextEntry={secureTextEntry}
                    ref={textInputRef}
                    style={inputStyle}
                    {...props}
                    selectionColor={contrast ? "white" : "black"}
                    underlineColorAndroid="transparent"
                />
            </Field>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingBottom: Theme.spacing.tiny,
        marginBottom: Theme.spacing.small
    },
    containerContrast: {
        borderColor: "white"
    },
    labelContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    label: {
        ...Theme.typography.small,
        marginBottom: Theme.spacing.small
    },
    labelContrast: {
        color: "white"
    },
    textInput: {
        ...Theme.typography.regular
    },
    textInputContrast: {
        color: "white"
    }
});
