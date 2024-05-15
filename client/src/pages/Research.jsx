import React from 'react';

export default function Research() {
  return (
    <div className=''>
      <div className=''>
        <form className=''>
          <div className=''>
            <label className=''>Termo de busca</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className=''
            />
          </div>
          <div className=''>
            <label className=''>Type:</label>
            <div className=''>
              <input type='checkbox' id='all' className='' />
              <span>Vendas e Aluguéis</span>
            </div>
            <div className=''>
              <input type='checkbox' id='rent' className='' />
              <span>Aluguel</span>
            </div>
            <div className=''>
              <input type='checkbox' id='sale' className='' />
              <span>Venda</span>
            </div>
            <div className=''>
              <input type='checkbox' id='offer' className='' />
              <span>Oferta</span>
            </div>
          </div>
          <div className=''>
            <label className=''>Amenidades:</label>
            <div className=''>
              <input type='checkbox' id='parking' className='' />
              <span>Estacionamento</span>
            </div>
            <div className=''>
              <input type='checkbox' id='furnished' className='' />
              <span>Mobiliado</span>
            </div>
          </div>
          <div className=''>
            <label className=''>Organizar</label>
            <select id='sort_order' className=''>
              <option>Preço decrescente</option>
              <option>Preço crescente</option>
              <option>Mais recente</option>
              <option>Mais antigo</option>
            </select>
          </div>
          <button className=''>
            Buscar
          </button>
        </form>
      </div>
      <div className=''>
        <h1 className=''>Resultados:</h1>
      </div>
    </div>
  );
}