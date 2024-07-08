import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      const res = await axios.post("/api/auth/google", {
        name: result.user.displayName,
        email: result.user.email,
        googlePhotoUrl: result.user.photoURL,
      });
      console.log(res);
      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="mr-2 h-6 w-6" />
      Continue with Google
    </Button>
  );
}
