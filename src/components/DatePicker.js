// @flow
import * as React from "react";
import {StyleSheet} from "react-native";
import {default as RNDatePicker} from "react-native-datepicker";

import { Theme } from "./Theme";

export default class DatePicker extends React.Component<{}> {

    render(): React.Node {
        return <RNDatePicker
            mode="date"
            style={styles.datePicker}
            customStyles={styles}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
        />
    }
}

const styles = StyleSheet.create({
    datePicker: {
        height: Theme.typography.regular.lineHeight
    },
    dateInput: {
        borderWidth: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    dateText: {
        ...Theme.typography.regular,
        color: "white",
    },
    dateTouchBody: {
        flex: 1
    },
    btnTextConfirm: {
        color: Theme.palette.primary
    }
});
