import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SRNPage } from '@souche-f2e/srn-framework';

class List extends SRNPage {
    static navigation = {
        title: '列表'
    }

    constructor (props) {
        super(props);
    }

    componentWillMount () {

    }

    render () {
        return (
            <View style={styles.container}>
                <Text>列表</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default List;
