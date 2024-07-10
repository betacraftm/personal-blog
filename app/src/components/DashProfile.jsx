import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
  const handleImmageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };
  const uploadImage = () => {
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        (error) => {
          setImageFileUploadError("Could not upload image");
          setImageFile(null);
          setImageUrl(null);
        };
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((dowloadURL) => {
          setImageUrl(dowloadURL);
        });
      },
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  return (
    <div className="mx-auto w-full max-w-lg p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImmageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="h-32 w-32 cursor-pointer self-center overflow-hidden rounded-full shadow-md"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageUrl || currentUser.profilePicture}
            alt="user"
            className="h-full w-full rounded-full border-8 border-[lightgray] object-cover"
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="Password" />

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="mt-5 flex justify-between text-red-500">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
