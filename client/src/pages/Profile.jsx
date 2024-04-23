import React from 'react'
import {useSelector} from 'react-redux'

export default function Profile() {

  const {currentUser} = useSelector((state) => state.user)

  return (
    <form className='container mt-3'>
      <div className='row justify-content-center'>
        <div className='col-6 '>
          <h1 className='text-center'>Perfil</h1>
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">Novo Nome de usuário</label>
            <input type="text" className="form-control" id="exampleUserName" aria-describedby="userNameHelp"/>
          </div>
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">Novo Email</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
            <div id="emailHelp" className="form-text">Nós nunca iremos compartilhar o seu email com ninguém!</div>
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">Nova Senha</label>
            <input type="password" className="form-control" id="exampleInputPassword1"/>
          </div>
          <div className='text-center'>
            <button type="submit" className="btn btn-primary mt-3 w-25">Atualizar</button>
          </div>
        </div>
      </div>
</form>
  )
}