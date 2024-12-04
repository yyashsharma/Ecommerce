import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { app } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  //every time it'll be asked for email account otherwise,direct logged in on second time
  provider.setCustomParameters({ prompt: "select_account" });

  const handleGoogleClick = async () => {
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure());
        return toast.error(data.message);
      }
      toast.success(data.message);
      navigate("/");
      dispatch(signInSuccess(data.rest));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      onClick={handleGoogleClick}
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
