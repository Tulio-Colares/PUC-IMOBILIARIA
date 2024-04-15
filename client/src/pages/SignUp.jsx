import React from 'react'

export default function SignUp() {
  return (
    <div>
      <form className='container'>
        <div className='row justify-content-center'>
          <div className='col-6'>
            <div className='col text-center'>
              <h1>Conectar</h1>
            </div>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Email</label>
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
              <div id="emailHelp" class="form-text">Nós nunca iremos compartilhar o seu email com ninguém! </div>
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">Senha</label>
              <input type="password" class="form-control" id="exampleInputPassword1"/>
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="exampleCheck1" />
              <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <div className='col text-center'>
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}