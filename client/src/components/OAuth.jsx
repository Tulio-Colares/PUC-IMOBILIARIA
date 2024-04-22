import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      console.log(result)

      // const res = await fetch('/server/auth/google', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name: result.user.displayName,
      //     email: result.user.email,
      //     photo: result.user.photoURL,
      //   }),
      // });
      // const data = await res.json();
      // dispatch(signInSuccess(data));
      // navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='btn btn-danger w-50 text-lg'
    >
      GOOGLE
    </button>
  );
}