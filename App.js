import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [counter, setCounter] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [isCounting, setIsCounting] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(true);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setCounter(0);
    setMilliseconds(0);
    setMessage('');
    setIsCounting(true);
    setStartTime(Date.now());
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    let timer;
    if (gameStarted && counter < 3) {
      timer = setInterval(() => {
        setCounter((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, counter]);

  useEffect(() => {
    let startMillis = Date.now(); 

    const updateMilliseconds = () => {
      if (isCounting && gameStarted) {
        let elapsedMillis = Date.now() - startMillis;
        setMilliseconds(elapsedMillis % 1000);
        requestAnimationFrame(updateMilliseconds);
      }
    };

    if (isCounting && gameStarted) {
      requestAnimationFrame(updateMilliseconds);
    }

    return () => cancelAnimationFrame(updateMilliseconds);
  }, [isCounting, gameStarted]);

  const stopTimer = () => {
    if (isCounting) {
      const elapsedTime = (Date.now() - startTime) / 1000;
      const targetTime = 10;

      if (Math.abs(elapsedTime - targetTime) <= 0.5) {
        setMessage('¡Ganaste!');
      } else {
        setMessage(`Perdiste. El tiempo fue: ${elapsedTime.toFixed(2)} segundos.`);
      }
      setGameOver(true);
      setIsCounting(false);
    }
  };

  const retryGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setCounter(0);
    setMilliseconds(0);
    setMessage('');
    setShowModal(true); 
  };

  return (
    <View style={styles.container}>
      {/* Modal explicando las reglas */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showModal}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reglas del juego</Text>
            <Text style={styles.modalText}>
              El objetivo del juego es detener el cronómetro exactamente a los 10 segundos.
            </Text>
            <Text style={styles.modalText}>
              El cronómetro comenzará contando desde 0, y después desaparecerá cuando llegue a 3 segundos.
              Luego, tendrás que presionar el botón "Detener" en el momento que creas que han pasado 10 segundos.
            </Text>
            <Button title="Aceptar" onPress={closeModal} />
          </View>
        </View>
      </Modal>

      {/* Botón de iniciar juego */}
      {!gameStarted && !showModal && !gameOver && (
        <TouchableOpacity style={styles.largeButton} onPress={startGame}>
          <Text style={styles.buttonText}>Iniciar Juego</Text>
        </TouchableOpacity>
      )}

      {/* Contador y cronómetro */}
      {gameStarted && counter < 3 && (
        <Text style={styles.counter}>{`${counter}:${Math.floor(milliseconds / 100)}.${milliseconds % 100}`}</Text>
      )}

      {/* Después de 3 segundos, quitar el contador de pantalla */}
      {gameStarted && counter >= 3 && !gameOver && (
        <Text style={styles.infoText}>¡Haz clic para detener el cronómetro!</Text>
      )}

      {/* Botón para detener el cronómetro */}
      {gameStarted && counter >= 3 && !gameOver && (
        <TouchableOpacity style={[styles.largeButton, styles.stopButton]} onPress={stopTimer}>
          <Text style={styles.buttonText}>Detener</Text>
        </TouchableOpacity>
      )}

      {/* Mensaje final */}
      {gameOver && (
        <Text
          style={[styles.result, { color: message.includes('Perdiste') ? 'red' : '#00b300' }]}
        >
          {message}
        </Text>
      )}

      {/* Botón para reiniciar el juego */}
      {gameOver && (
        <TouchableOpacity style={styles.largeButton} onPress={retryGame}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  counter: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#000',
  },
  infoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
  result: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  acceptButton: {
    width: 200,
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginVertical: 10,
  },
  largeButton: {
    width: 300,
    height: 70,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    marginVertical: 15,
    elevation: 5,
  },
  stopButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
