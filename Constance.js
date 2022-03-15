import { Dimensions } from "react-native";

export default Constants = {
    MAX_WIDTH: Dimensions.get('screen').width,
    MAX_HEIGHT: Dimensions.get('screen').height,
    BOARD_SIZE: 10,
    CELL_SIZE: 30,
    DOCUMENT: "The game starts with a bomb field that explodes in random fields. The countdown begins when the player begins to open a field on the minefield. The size of the minefield depends on the player who chooses to play. Large fields tend to have more bombs. and resulting in more difficult playing When a player opens a slot that does not contain bombs A number will appear to indicate the number of bombs in the adjacent boxes (typically 8 cells around it). Players can use this information to determine if any of the boxes have bombs or not. and open an unexploded space"
}