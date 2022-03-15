import { StyleSheet, View, TouchableOpacity, Modal, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';

function CModel({ children, isVisible, toggleVisible, ...rest }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={toggleVisible}
        >
            <View style={{ ...styles.container, backgroundColor: 'transparent' }}>
                <View style={(rest.style) ? { ...rest.style } : styles.model}>
                    <View style={{ alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={toggleVisible}>
                            <Ionicons name="close-circle-outline" size={32} color="black" />
                        </TouchableOpacity>
                    </View>
                    {children}
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    model: {
        width: 350,
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        padding: 15,
    }
});
export default CModel;