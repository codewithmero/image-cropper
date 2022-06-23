import React, { useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import getCroppedImg from './utils/cropImage';
import './App.css';

const App = () => {
  const [image, setImage] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const inputRef = useRef();

  const triggerFileSelectPopup = () => inputRef.current.click(); 

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    console.log(croppedAreaPixels, croppedAreaPercentage);
    setCroppedArea(croppedAreaPixels);
  };

  const onSelectFile = event => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader(); 
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener('load', () => {
        setImage(reader.result);
      });
    }
  };

  const convertCanvasToImg = (canvas) => {
    let img = new Image();
    img.src = canvas.toDataURL();
    return img;
  };

  const onImageCrop = async () => {
    let croppedImageCanvas = await getCroppedImg(image, croppedArea);
    let croppedImage = convertCanvasToImg(croppedImageCanvas);

    setCroppedImage(croppedImage);
  }

  console.log('CROPPED IMAGE:', croppedImage);

  return (
    <div className="container">
      <div className="container-cropper">
        {
          image ? 
          <>
            <div className="cropper">
              <Cropper 
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete} />
            </div>

            <div className="slider">
              <Slider 
                min={1} 
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e, zoom) => setZoom(zoom)} />
            </div>
          </> : null
        }
      </div>

      <div className="container-buttons">
        <input 
          type="file" 
          accept="image/*" 
          ref={inputRef} 
          style={{ display: "none" }} 
          onChange={onSelectFile} />
        <Button variant="contained" color="primary" onClick={triggerFileSelectPopup}>
          Choose
        </Button>
        <Button variant="contained" color="secondary" onClick={onImageCrop} style={{ marginLeft: "20px" }}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default App;