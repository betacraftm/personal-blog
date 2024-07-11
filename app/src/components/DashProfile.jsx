import { useSelector, useDispatch } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import axios from "../api/axios";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          setFormData({ ...formData, profilePicture: imageUrl });
        });
      },
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }

    try {
      dispatch(updateStart());
      const res = await axios.put(
        `api/user/update/${currentUser._id}`,
        formData,
      );
      console.log(res.data);
      dispatch(updateSuccess(res.data));
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(updateFailure(error.response.data.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(`api/user/delete/${currentUser._id}`);
      console.log(res);
      if (res.data.status === 200) {
        dispatch(deleteUserFailure(res.data.message));
      } else {
        dispatch(deleteUserSuccess());
        localStorage.removeItem("persist:root");
        navigate("/");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  return (
    <div className="mx-auto w-full max-w-lg p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="mt-5 flex justify-between text-red-500">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
