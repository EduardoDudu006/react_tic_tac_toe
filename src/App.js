import React, { useState } from "react";
import "./App.css";
// Importe o CSS do Bootstrap no index.js ou aqui:
import "bootstrap/dist/css/bootstrap.min.css";

// Função auxiliar para calcular o vencedor (movida para fora dos componentes)
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}

// Componente Square (Botão individual)
function Square({ value, onClick }) {
    return (
        <button className="square" onClick={onClick}>
            {value}
        </button>
    );
}

// Componente Board (O tabuleiro 3x3)
function Board({ squares, onPlay, xIsNext }) {
    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) return;
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? "X" : "O";
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    const isDraw = !winner && squares.every((square) => square !== null); // Verifica empate
    let status;
    if (winner) {
        status = "Vencedor: " + winner;
    } else if (isDraw) {
        status = "Fim de Jogo: Empate!";
    } else {
        status = "Próximo jogador: " + (xIsNext ? "X" : "O");
    }

    return (
        <>
            {/* Usando classes do Bootstrap para o status */}
            <div
                className={`status alert ${
                    winner || isDraw ? "alert-success" : "alert-info"
                }`}
            >
                {status}
            </div>
            <div className="board-row">
                {[0, 1, 2].map((i) => (
                    <Square
                        key={i}
                        value={squares[i]}
                        onClick={() => handleClick(i)}
                    />
                ))}
            </div>
            <div className="board-row">
                {[3, 4, 5].map((i) => (
                    <Square
                        key={i}
                        value={squares[i]}
                        onClick={() => handleClick(i)}
                    />
                ))}
            </div>
            <div className="board-row">
                {[6, 7, 8].map((i) => (
                    <Square
                        key={i}
                        value={squares[i]}
                        onClick={() => handleClick(8)}
                    />
                ))}
            </div>
        </>
    );
}

// Componente Game (Gerencia o estado e o histórico)
function Game() {
    // Usando o useState do React importado
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(move) {
        setCurrentMove(move);
    }

    const moves = history.map((_, move) => {
        const description =
            move > 0 ? `Ir para jogada #${move}` : "Início do Jogo";

        return (
            <li key={move}>
                {/* Usando classes do Bootstrap para os botões */}
                <button
                    className={`btn ${
                        move === 0 ? "btn-success" : "btn-info"
                    } btn-sm m-1`}
                    onClick={() => jumpTo(move)}
                >
                    {description}
                </button>
            </li>
        );
    });

    return (
        <div className="game-container">
            <header className="text-center mb-4">
                <h1>Exercício React: Jogo da Velha</h1>
            </header>
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={currentSquares}
                        onPlay={handlePlay}
                        xIsNext={xIsNext}
                    />
                </div>
                <div className="game-info">
                    <ol>{moves}</ol>
                </div>
            </div>
            <footer className="site-footer bg-dark text-white text-center">
                <div className="container">
                    <p className="m-0">
                        &copy; 2025 Meu Site React - Todos os direitos
                        reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Exporta o componente principal para src/index.js renderizá-lo
export default Game;
