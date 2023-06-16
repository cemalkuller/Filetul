import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  useEffect(() => {
    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        constraints: {
          width: { min: 640 },
          height: { min: 480 },
          facingMode: 'environment', // Kamera seçeneğini ayarlayın (arka kamera için 'environment')
        },
      },
      locator: {
        patchSize: 'medium',
        halfSample: true,
      },
      numOfWorkers: navigator.hardwareConcurrency || 4,
      decoder: {
        readers: ['ean_reader'], // Okunabilir barkod türlerini ayarlayın (örneğin 'ean_reader', 'code_128_reader' vb.)
      },
      locate: true,
    }, (err) => {
      if (err) {
        console.error('Error initializing barcode scanner', err);
        return;
      }
      Quagga.start();
    });
  
    // Component unmounted olduğunda Quagga'yı durdurun
    return () => {
      Quagga.stop();
    };
  }, []);

  const handleBarcodeScan = result => {
    console.log('Barcode scanned:', result.codeResult.code);
  };

  return (
    <div>
      <video ref={videoRef} />
    </div>
  );
};

export default BarcodeScanner;
