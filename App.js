import { useState, useLayoutEffect, useCallback, useRef, useEffect } from "react";
import { useFonts } from "expo-font";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import AppLoading from "expo-app-loading";
import Cell from "./components/Cell";
import TextButton from "./components/TextButton";
import CModel from "./components/CModel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import Constance from "./Constance";
import { Assets } from "./assets";

const generateBoard = () => {
  return new Array(Constance.BOARD_SIZE).fill(null).map((e, idxR) => {
    return new Array(Constance.BOARD_SIZE).fill(null).map((e, idxC) => ({
      isBomb: Math.random() < 0.2,
      isOpen: false,
      isFlag: false,
      bombAround: null,
    }));
  });
};

function App() {
  const [isFont] = useFonts(Assets.Fonts);
  const [board, setBoard] = useState(() => generateBoard());
  const tempBoardRef = useRef(board);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLose, setIsLose] = useState(0);

  useEffect(() => {
    let isAllOpen = false;
    if (isLose === 1)
      isAllOpen = board.every(row => row.every(col => (col.isBomb && !col.isOpen) || (!col.isBomb && col.isOpen)))
    if (isAllOpen)
      setIsLose(2);
  }, [board])

  useLayoutEffect(() => {
    if (isLose === -1 || isLose === 2)
      setModalVisible(prev => !prev);

  }, [isLose]);

  const onToggleFlag = useCallback((x, y) => {
    const tempBoard = tempBoardRef.current;
    tempBoard[x][y] = { ...tempBoard[x][y], isFlag: !tempBoard[x][y].isFlag };

    setBoard(() => tempBoard.map(e => e.slice()));
  }, [board]);

  const onYouLose = useCallback(() => {
    const tempBoard = tempBoardRef.current;
    const openAllBoard = tempBoard.map(r => r.map(c => ({ ...c, isOpen: true })))
    setBoard(openAllBoard);
    setIsLose(-1);
  }, [board]);

  const onCheckBombAround = useCallback((x, y) => {
    const tempNxNy = [];
    const tempBoard = tempBoardRef.current;
    let bombAround = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let nX = x + i;
        let nY = y + j;
        if ((nX === x && nY === y))
          continue;
        if ((nX > -1 && nX < Constance.BOARD_SIZE) && (nY > -1 && nY < Constance.BOARD_SIZE)) {
          if (tempBoard[nX][nY].isOpen || (tempBoard[nX][nY].isFlag && !tempBoard[nX][nY].isBomb))
            continue;
          tempNxNy.push([nX, nY]);
          if (tempBoard[nX][nY].isBomb)
            bombAround++;
        }
      }
    }

    if (bombAround === 0) {
      tempBoard[x][y] = { ...tempBoard[x][y], isOpen: true };
      if (tempNxNy.length) {
        tempNxNy.map(e => {
          onCheckBombAround(e[0], e[1]);
        });
        return;
      }
    } else {
      tempBoard[x][y] = { ...tempBoard[x][y], isOpen: true, bombAround };
    }

    setBoard(() => tempBoard.map(e => e.slice()));

    if (isLose === 0)
      setIsLose(1);
  }, [board]);

  const onRestart = () => {
    tempBoardRef.current = generateBoard();
    setBoard(() => tempBoardRef.current.map(e => e.slice()));
    setIsLose(0);
  };

  const renderRowCell = () => {
    const ROW = board.map((row, i) => {
      const COL = row.map((e, j) => (
        <Cell
          key={j}
          x={i}
          y={j}
          data={e}
          onCheckBombAround={onCheckBombAround}
          onYouLose={onYouLose}
          onToggleFlag={onToggleFlag}
        />
      ));
      return (
        <View key={i} style={{ width: 300, height: 30, flexDirection: "row" }}>
          {COL}
        </View>
      );
    });
    return ROW;
  };

  if (!isFont) return (<AppLoading />);

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, fontSize: 30, marginBottom: 45, fontFamily: "LT_BOLD" }}>
        Minesweeper
      </Text>

      <View style={styles.board}>{renderRowCell()}</View>

      <View style={{ width: 300, height: 40, alignItems: "center" }}>
        {(isLose === -1 || isLose === 2) ? (
          <TextButton onPress={onRestart}>
            <MaterialCommunityIcons name="restart" size={24} color="#fff" />
            <Text style={{ ...styles.text, marginLeft: 5, fontFamily: "LT_BOLD" }}>
              Restart
            </Text>
          </TextButton>
        ) : (isLose === 0) ? (
          <TextButton onPress={() => setModalVisible(!modalVisible)}>
            <Entypo name="documents" size={24} color="#fff" />
            <Text style={{ ...styles.text, marginLeft: 5, fontFamily: "LT_BOLD" }}>
              Doc
            </Text>
          </TextButton>
        ) : null}
      </View>

      <Text style={{ ...styles.text, position: "absolute", bottom: 0, marginBottom: 20 }}>
        Copyright © Creat by MSXZ
      </Text>

      <CModel
        isVisible={modalVisible}
        toggleVisible={() => setModalVisible(prev => !prev)}
        style={styles.model}>
        {(isLose === 0) ?
          <View style={{ flex: 1 }}>
            <Image source={Assets.Images.MINE} style={{ width: 70, height: 70, alignSelf: 'center', marginBottom: 15 }} resizeMode="cover" />
            <Text style={{ ...styles.text, flex: 1, color: '#000', textAlign: 'justify' }}>
              {Constance.DOCUMENT}
            </Text>
          </View>
          :
          <View style={{ flex: 1 }}>
            <Image source={(isLose === 2) ? Assets.Images.WINNER : Assets.Images.LOSER} style={{ width: 200, height: 200, alignSelf: 'center', marginBottom: 15 }} resizeMode="cover" />
            <Text style={{ ...styles.text, flex: 1, color: '#000', fontSize: 30, fontFamily: 'LT_BOLD', alignSelf: 'center' }}>
              {(isLose === 2) ? "You Win" : "You Lose"}
            </Text>
          </View>
        }
      </CModel>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e2f44",
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    width: 300,
    height: 300,
    backgroundColor: "#d6d6d6",
    borderColor: "#000",
    elevation: 3,
    marginBottom: 20,
    borderWidth: 0.3,
    borderColor: "rgba(187, 187, 187, 0.5)",
    borderRadius: 10,
    overflow: "hidden",
  },
  text: {
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "normal",
    color: "#fff",
    fontFamily: "LT_REGULAR",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#409cb3",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  model: {
    width: 350,
    height: 350,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    padding: 15,
  }
});

export default App;
