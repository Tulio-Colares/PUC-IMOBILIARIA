import React from 'react'

export default function Header() {
  return (
    <header>
        <nav class="navbar navbar-expand-lg bg-body-tertiary ">
            <div class="container">
                <a class="navbar-brand" href="#">PUC IMÓVEIS</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="#">Sobre</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="#">Logar</a>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Pesquisa" aria-label="Search"></input>
                    <button class="btn btn-outline-success" type="submit">Pesquisar</button>
                </form>
                </div>
            </div>
        </nav>
    </header>
  )
}