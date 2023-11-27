import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useDrag, useDrop } from "react-dnd";
import { Typography } from "@mui/material";
import { useGameContext } from "../../utils/GameContext";

function GameBoard() {
  //   const navigate = useNavigate();
  const { state, dispatch } = useGameContext();

  const row = 10;
  const colors = ["blue", "green", "yellow", "purple", "red", "orange"];
  const [currentColorOrder, setCurrentColorOrder] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [remainingMoves, setRemainingMoves] = useState(25);

  useEffect(() => {
    // Check for win/loss when the state changes
    if (state.winStatus) {
      if (state.winStatus === "won") {
        dispatch({ type: "GAME_WON" });
      } else if (state.winStatus === "lost") {
        dispatch({ type: "GAME_LOST" });
      }
    }
  }, [state.winStatus, dispatch]);

  const gameBoard = () => {
    const randomColorOrder = [];
    for (let i = 0; i < row * row; i++) {
      const randomNumber = Math.floor(Math.random() * colors.length);
      const colorPicker = colors[randomNumber];
      randomColorOrder.push(colorPicker);
    }
    setCurrentColorOrder(randomColorOrder);
  };

  useEffect(() => {
    gameBoard();
  }, []);

  useEffect(() => {
    const findRowOfThree = () => {
      for (let i = 0; i < row * row; i++) {
        const rowOfThree = [i, i + 1, i + 2];
        const currentColor = currentColorOrder[i];
        const skipIndex = [
          8, 9, 18, 19, 28, 29, 38, 39, 48, 49, 58, 59, 68, 69, 78, 79, 88, 89,
          98, 99,
        ];
        if (skipIndex.includes(i)) continue;
        if (
          rowOfThree.every((item) => currentColorOrder[item] === currentColor)
        ) {
          rowOfThree.forEach((item) => (currentColorOrder[item] = " "));
          dispatch({ type: "INCREMENT_SCORE", points: 5 });
        }
      }
    };

    const findColumnOfFour = () => {
      for (let i = 0; i <= 76; i++) {
        const columnOfFour = [i, i + row, i + row * 2, i + row * 3];
        const currentColor = currentColorOrder[i];
        if (
          columnOfFour.every((item) => currentColorOrder[item] === currentColor)
        ) {
          columnOfFour.forEach((item) => (currentColorOrder[item] = " "));
        }
      }
    };

    const findColumnOfThree = () => {
      for (let i = 0; i <= 83; i++) {
        const columnOfThree = [i, i + row, i + row * 2];
        const currentColor = currentColorOrder[i];
        if (
          columnOfThree.every(
            (item) => currentColorOrder[item] === currentColor,
          )
        ) {
          columnOfThree.forEach((item) => (currentColorOrder[item] = " "));
          dispatch({ type: "INCREMENT_SCORE", points: 5 });
        }
      }
    };

    const findRowOfFour = () => {
      for (let i = 0; i < row * row; i++) {
        const rowOfFour = [i, i + 1, i + 2, i + 3];
        const currentColor = currentColorOrder[i];
        const skipIndex = [
          7, 8, 9, 17, 18, 19, 27, 28, 29, 37, 38, 39, 47, 48, 49, 57, 58, 59,
          67, 68, 69, 77, 78, 79, 87, 88, 89, 97, 98, 99,
        ];
        if (skipIndex.includes(i)) continue;
        if (
          rowOfFour.every((item) => currentColorOrder[item] === currentColor)
        ) {
          rowOfFour.forEach((item) => (currentColorOrder[item] = " "));
          dispatch({ type: "INCREMENT_SCORE", points: 10 });
        }
      }
    };

    const moveDownwards = () => {
      for (let i = 0; i <= row * row - row; i++) {
        const firstRowIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (firstRowIndex.includes(i) && currentColorOrder[i] === " ") {
          const randomNumber = Math.floor(Math.random() * colors.length);
          currentColorOrder[i] = colors[randomNumber];
          if (remainingMoves > 15) {
            setRemainingMoves((prevMoves) => prevMoves - 1);
          }
        }

        if (currentColorOrder[i + row] === " ") {
          currentColorOrder[i + row] = currentColorOrder[i];
          currentColorOrder[i] = " ";
        }
      }
    };

    const timer = setInterval(() => {
      findRowOfFour();
      findColumnOfFour();
      findRowOfThree();
      findColumnOfThree();
      moveDownwards();
      setCurrentColorOrder([...currentColorOrder]);

    }, 0);

    return () => clearInterval(timer);
  }, [row, currentColorOrder]);

  const isValidMove = (fromRowIndex, fromColIndex, toRowIndex, toColIndex) => {
    const isAdjacent =
      Math.abs(fromRowIndex - toRowIndex) +
        Math.abs(fromColIndex - toColIndex) ===
      1;
    return isAdjacent;
  };

  const moveBox = (fromRowIndex, fromColIndex, toRowIndex, toColIndex) => {
    if (isValidMove(fromRowIndex, fromColIndex, toRowIndex, toColIndex)) {
      const newColorOrder = [...currentColorOrder];
      const fromIndex = fromRowIndex * row + fromColIndex;
      const toIndex = toRowIndex * row + toColIndex;

      newColorOrder[toIndex] = currentColorOrder[fromIndex];
      newColorOrder[fromIndex] = currentColorOrder[toIndex];

      setCurrentColorOrder(newColorOrder);
      setRemainingMoves((prevMoves) => prevMoves - 1);
    }
    setDraggedItem(null);
  };

  const DraggableBox = ({ color, rowIndex, colIndex }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "box",
      item: { rowIndex, colIndex },
      canDrag: () => !draggedItem,
    }));

    const [, drop] = useDrop(() => ({
      accept: "box",
      drop: (item) => {
        moveBox(item.rowIndex, item.colIndex, rowIndex, colIndex);
      },
    }));

    return (
      <div
        ref={(node) => drag(drop(node))}
        onClick={() => setDraggedItem({ rowIndex, colIndex })}>
        <Item
          sx={{
            backgroundColor: color,
            borderColor: isDragging ? "white" : "transparent",
          }}
        />
      </div>
    );
  };

  const Item = styled(Box)(({ theme, color }) => ({
    backgroundColor: color,

    ...theme.typography.body2,

    padding: theme.spacing(1),
    textAlign: "center",
    // width: "auto",
    // height: "auto",
    width: "60px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <Box sx={{ flexGrow: 1, width: '50%', pt: '50px' }}>
      <Typography variant="h4" align="center">
        Score: {state.score}
      </Typography>
      <Typography variant="h4" align="center">Remaining Moves: {remainingMoves}</Typography>
      {state.winStatus && (
        <Typography variant="h4" align="center">
          {state.winStatus === 'won' ? 'You Win!' : 'You Lose!'}
        </Typography>
      )}
      <Grid container spacing={0} justifyContent="center" alignItems="center">
        {Array.from({ length: row }).map((_, rowIndex) => (
          <Grid container item spacing={0} key={rowIndex}>
            {currentColorOrder
              .slice(rowIndex * row, (rowIndex + 1) * row)
              .map((color, colIndex) => (
                <Grid item xs={1} key={rowIndex * row + colIndex}>
                  <DraggableBox
                    color={color}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                  />
                </Grid>
              ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
  
  
  );
}

export default GameBoard;
