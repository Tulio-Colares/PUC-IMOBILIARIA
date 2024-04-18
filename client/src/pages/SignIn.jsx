import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
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
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/');
    } catch (error) {
      setLoading(false);
      setError(error.message);
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
          </form>
        </div>
      </div>
    </div>
  )
}