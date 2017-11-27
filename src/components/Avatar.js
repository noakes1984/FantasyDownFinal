// @flow
import * as React from "react";

import SmartImage from "./SmartImage";
import type {BaseProps} from "./Types";

type AvatarProps = BaseProps & {
    preview: string,
    uri: string,
    size: number
};

export default class Avatar extends React.Component<AvatarProps> {

    static defaultProps = {
        size: 50
    };

    render(): React.Node {
        const {preview, uri, style, size} = this.props;
        const computedStyle = {
            height: size,
            width: size,
            borderRadius: size / 2
        };
        return <SmartImage {...{ preview, uri }} style={[style, computedStyle]} />;
    }
}
