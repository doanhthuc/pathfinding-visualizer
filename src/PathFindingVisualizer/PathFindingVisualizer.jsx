import React, { useState, useEffect } from 'react';
import './PathFindingVisualizer.css';
import { Node } from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../Algorithm/dijkstra';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export const PathFindingVisualizer = () => {
    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    useEffect(() => {
        setGrid(getInitialGrid());
    }, []);

    const handleMouseDown = (row, col) => {
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
        setMouseIsPressed(true);
    };

    const handleMouseUp = (row, col) => {
        setMouseIsPressed(false);
    };

    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
    };

    const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 1; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            if (i === visitedNodesInOrder.length - 1) continue;
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (node.isWeight) {
                    document.getElementById(
                        `node-${node.row}-${node.col}`
                    ).className = 'node node-visitedWeight';
                } else {
                    document.getElementById(
                        `node-${node.row}-${node.col}`
                    ).className = 'node node-visited';
                }
            }, 10 * i);
        }
    };

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = 'node node-shortest-path';
            }, 50 * i);
        }
    };

    const visualizeDijkstra = () => {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    return (
        <>
            <button onClick={() => visualizeDijkstra()}>
                Visualize Dijkstra's Algorithm
            </button>
            <div className='pathfindingVisualizer'>
                <div className='container'>
                    {/* <div className='heading'>
                        <h2 onClick={showPopUp}>Search Visualizer</h2>
                        <h2>{topMessage}</h2>
                    </div> */}

                    {/* Show the header */}
                    {/* {textBox} */}

                    <p>
                        Dijkstra's Algorithm is weighted and guarantees the
                        shortest path! <span className='ref'></span>
                    </p>
                </div>

                <div className='visualGridContainer'>
                    <div className='gridBox'>
                        <div className='grid'>
                                {grid.map((row, rowIndex) => {
                                    return (
                                        <div key={rowIndex} className='gridRow'>
                                            {row.map((node, nodeIndex) => {
                                                const {
                                                    isStart,
                                                    isFinish,
                                                    isWall,
                                                    isWeight,
                                                } = node; //Extracting from the node
                                                return (
                                                    <Node
                                                        row={rowIndex}
                                                        col={nodeIndex}
                                                        key={
                                                            rowIndex +
                                                            '-' +
                                                            nodeIndex
                                                        }
                                                        isStart={isStart}
                                                        isFinish={isFinish}
                                                        isWall={isWall}
                                                        isWeight={isWeight}
                                                        mouseIsPressed={
                                                            mouseIsPressed
                                                        }
                                                        onMouseDown={(
                                                            row,
                                                            col
                                                        ) =>
                                                            handleMouseDown(
                                                                row,
                                                                col
                                                            )
                                                        }
                                                        onMouseEnter={(
                                                            row,
                                                            col
                                                        ) =>
                                                            handleMouseEnter(
                                                                row,
                                                                col
                                                            )
                                                        }
                                                        onMouseUp={() =>
                                                            handleMouseUp()
                                                        }
                                                    ></Node>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
        isWeight: false,
        weight: 0,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};
