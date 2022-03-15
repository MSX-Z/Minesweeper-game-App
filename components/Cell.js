import { memo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Assets } from '../assets';

function Cell({ data, x, y, onCheckBombAround, onYouLose, onToggleFlag }) {
    const { isBomb, isOpen, isFlag, bombAround } = data;

    if (isOpen) {
        return (
            <View style={styles.CellUnActive}>
                {isBomb ?
                    <Image style={{ width: 16, height: 16 }} resizeMode={'cover'} source={Assets.Images.MINE} />
                    : (bombAround) ?
                        <Text style={styles.text}>{bombAround}</Text>
                        : null
                }
            </View>
        );
    }

    const onPress = () => {
        if (!isFlag) {
            if (isBomb)
                onYouLose();
            else
                onCheckBombAround(x, y);
        }
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={() => onToggleFlag(x, y)}>
            <View style={styles.CellActive}>
                {(isFlag) ?
                    <Image style={{ width: 16, height: 16 }} resizeMode={'cover'} source={Assets.Images.FLAG} />
                    : null}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    CellActive: {
        width: 30,
        height: 30,
        borderWidth: 2,
        borderTopColor: '#fff',
        borderLeftColor: '#fff',
        borderBottomColor: '#6d6d6d',
        borderRightColor: '#6d6d6d',
        backgroundColor: '#c6c6c6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    CellUnActive: {
        width: 30,
        height: 30,
        borderWidth: 0.5,
        borderColor: '#fff',
        backgroundColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 'normal',
        color: '#000',
        fontFamily: 'LT_REGULAR'
    }
});

export default memo(Cell);