import React, { useRef, useEffect, useState, useCallback } from 'react';
import Quagga from 'quagga';

const WebcamStart = () => {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [lastDetectedCode, setLastDetectedCode] = useState(null);

  const handleDetected = useCallback((result) => {
    if (result.codeResult.code) {
      setLastDetectedCode(result.codeResult.code);
      // We're not stopping the scanner automatically anymore
    }
  }, []);

  useEffect(() => {
    let quaggaInstance = null;

    if (scanning) {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              width: 640,
              height: 480,
              facingMode: 'environment', // or 'user' for front camera
            },
            target: videoRef.current,
          },
          decoder: {
            readers: ['upc_reader'],
          },
        },
        (err) => {
          if (err) {
            console.error('Error initializing Quagga:', err);
            return;
          }
          quaggaInstance = Quagga.start();
        }
      );

      Quagga.onDetected(handleDetected);
    }

    return () => {
      if (quaggaInstance) {
        Quagga.offDetected(handleDetected);
        Quagga.stop();
      }
    };
  }, [scanning, handleDetected]);

  const startScanning = () => {
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
    setLastDetectedCode(null);  // Reset the last detected code when stopping
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Barcode Scanner</h2>
      <div ref={videoRef} className="bg-gray-200 mb-4 overflow-hidden" style={{ width: '640px', height: '480px' }} />
      {!scanning ? (
        <button 
          onClick={startScanning}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start Scanning
        </button>
      ) : (
        <button 
          onClick={stopScanning}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Stop Scanning
        </button>
      )}
      {lastDetectedCode && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Last Detected Code:</h3>
          <p className="text-lg">{lastDetectedCode}</p>
        </div>
      )}
    </div>
  );
};

export default WebcamStart;