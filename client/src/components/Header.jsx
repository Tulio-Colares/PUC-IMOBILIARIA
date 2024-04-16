import React from 'react'

export default function Header() {
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
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Pesquisa" aria-label="Search"></input>
                    <button className="btn btn-outline-success" type="submit">Pesquisar</button>
                </form>
                </div>
            </div>
        </nav>
    </header>
  )
}
