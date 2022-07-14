import React, { useEffect, useState } from 'react';
import 'modules/component/InputCreateComponent/InputImage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Image } from 'models/product';
import { number } from 'yup';

interface Props {
  setImages(images: any[]): void;
  images: File[];
  oldImages: Image[];
  setImagesName(nameImages: any): void;
  setImageDelete(id: any): void | undefined;
}

const InputImage = (props: Props) => {
  const { setImages, images, setImagesName, oldImages, setImageDelete } = props;
  const [previewURL, setPreviewURL] = useState<string[] | null>([]);
  const [arrOldImages, setArrOldImages] = useState<any[]>();
  const [numberImageDelete, setNumberImageDelete] = useState<number[]>([]);

  useEffect(() => {
    setArrOldImages(oldImages);
  }, []);

  const handleWhenImagesChange = () => {
    console.log('check images: ', images);
    const arrURL = new Array();
    const arrName = new Array();
    for (let i = 0; i < images.length; i++) {
      console.log(URL.createObjectURL(images[i]));
      arrURL.push(URL.createObjectURL(images[i]));
      arrName.push(images[i].name);
    }
    setImagesName(arrName);
    setPreviewURL(arrURL);
  };

  useEffect(() => {
    handleWhenImagesChange();
  }, [images]);

  const handleDeleteImage = (index: number) => {
    console.log('delete');
    const newImages = images;
    newImages?.splice(index, 1);
    setImages([...newImages]);
  };

  const hanldeDeleteOldImage = (index: number, id: string) => {
    console.log(index);
    const newOldImages = oldImages;
    newOldImages?.splice(index, 1);
    setNumberImageDelete([...numberImageDelete, Number(id)]);
    setArrOldImages([...newOldImages]);
  };

  useEffect(() => {
    setImageDelete(numberImageDelete);
  }, [numberImageDelete]);

  console.log(previewURL);

  return (
    <div className="wrapper-input-image">
      {arrOldImages?.map((item: Image, index) => {
        return (
          <div className="wrapper-image" key={index}>
            <img src={item.thumbs[2]} alt="selected photo" />
            <span
              className="delete-image"
              onClick={() => {
                hanldeDeleteOldImage(index, item.id);
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </span>
          </div>
        );
      })}
      {previewURL &&
        previewURL?.map((item, index) => {
          return (
            <div className="wrapper-image" key={index}>
              <img src={item} alt="selected photo" />
              <span
                className="delete-image"
                onClick={() => {
                  handleDeleteImage(index);
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </span>
            </div>
          );
        })}
      <div className="label-select-image">
        <label htmlFor="imageInput">
          <FontAwesomeIcon icon={faCamera} style={{ width: '100px', height: '100px' }} />
        </label>
      </div>
      <input
        id="imageInput"
        multiple
        type="file"
        onChange={(e) => {
          let newImages = new Array();
          newImages = images.concat(Array.prototype.slice.call(e.target.files));
          setImages(newImages);
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default InputImage;
