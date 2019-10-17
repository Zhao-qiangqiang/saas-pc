import React from 'react';
import {
    Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {iconMap,sizeMap} from '../resource';

class Icon extends React.Component {
    constructor(props) {
        super(props);
    }

    setNativeProps(...args) {
        this.image.setNativeProps(...args);
    }

    render() {
        let { type, size, color } = this.props;
        const tintStyle = {};
        if (color) {
            tintStyle.tintColor = color;
        }
        if (typeof size === 'string') {
            size = sizeMap[size];
        }

        return (
            <Image
                ref={(c) => { this.image = c; }}
                source={iconMap[type]}
                style={[
                    tintStyle,
                    { height: size, width: size },
                    this.props.style,
                ]}
            />
        );
    }
}

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    color: PropTypes.string,
    style: Image.propTypes.style,
};

Icon.defaultProps = {
    size: 'md'
};

for (let name in iconMap) {
    if (iconMap.hasOwnProperty(name)) {
        // 定义图标类型常量，并禁止修改
        Object.defineProperty(Icon, name, {
            value: name, writable: false, configurable: false
        });
    }
}

export {Icon};