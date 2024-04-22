import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/server/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setError(data.message)
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-6'>
          <div className='col text-center'>
            <h1>Conectar</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="Email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" onChange={handleChange} aria-describedby="email"/>
            </div>
            <div className="mb-3">
              <label htmlFor="Password" className="form-label">Senha</label>
              <input type="password" className="form-control" id="password" onChange={handleChange}/>
            </div>
            <div className='col text-center'>
              <button disabled={loading} className='btn btn-primary'>
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </div>
            <div className='col text-center  mt-2'>
              <OAuth />
            </div>
            <div className='mt-5 text-center'>
              <p>Ainda não tem uma conta?</p>
              <Link to={'/sign-up'}>
                <span>Sign up</span>
              </Link>
            </div>
            {error && <p className='bg-danger-subtle text-danger p-2 rounded text-center'>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}