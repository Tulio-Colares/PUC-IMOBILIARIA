import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

  return (
    <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary ">
            <div className="container">
                <a className="navbar-brand" href="#">PUC IMÓVEIS</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Sobre</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Logar</a>
                    </li>
                </ul>
                    <form className="d-flex" role="search" onSubmit={handleSubmit}>
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                            className="form-control me-2" type="search" placeholder="Pesquisa" aria-label="Search"></input>
                        <button className="btn btn-outline-success" type="submit">Pesquisar</button>
                    </form>
                </div>
                <Link to='/profile'>
                    {currentUser ? (
                    <img className='rounded ms-3' width="38" height="38" src={currentUser.avatar} alt='profile' />
                    ) : (<li className='nav-link ms-3'>Logar</li>)}
                </Link>
            </div>
        </nav>
    </header>
  )
}
