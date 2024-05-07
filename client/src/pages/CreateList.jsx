import React from 'react'

export default function CreateList() {
  return (
    <section className='container text-center mt-3'>
        <div className="row ">
            <h1 className='mb-3'>Criando uma listagem</h1>
            <div className='col' >

                {/* Dados básicos */}
                <input className='w-100 mb-2 rounded' type="text" placeholder='Nome' id='name' maxLength='10' minLength='50' required/>
                <textarea className='w-100 mb-2 rounded' type="text" placeholder='Description' rows='5' id="description" required/>
                <input className='w-100 rounded' type="text" placeholder='Endereço' id='address' required/>

                {/* Dados do Imóvel */}
                <div className='d-flex'>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-check-input" type="checkbox" role="switch" id="rent"/>
                        <label className="form-check-label" htmlFor="rent">Alugar</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-check-input" type="checkbox" role="switch" id="sell"/>
                        <label className="form-check-label" htmlFor="sell">Vender</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-check-input" type="checkbox" role="switch" id="parkingSpots"/>
                        <label className="form-check-label" htmlFor="parkingSpots">Vaga de garagem</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-check-input" type="checkbox" role="switch" id="furnished"/>
                        <label className="form-check-label" htmlFor="furnished">Mobiliado</label>
                    </div>
                </div>
                <div class="form-check form-switch text-start m-4">
                    <input className="form-check-input" type="checkbox" role="switch" id="Offer"/>
                    <label className="form-check-label" htmlFor="Offer">Oferta</label>
                </div>

                {/* Dados a serem preenchidos */}
                <div className='d-flex '>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-input mx-1" type="number" id="Bedrooms" style={{ width: "50px" }}/>
                        <label className="form-label" htmlFor="CheckDefault">Quartos</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-input mx-1" type="number" id="bathrooms" style={{ width: "50px" }}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Banheiros</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-input mx-1" type="number" id="rentValue" style={{ width: "50px" }}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Preço Padrão (R$/mês)</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-input mx-1" type="number" id="rentDiscounted" style={{ width: "50px" }}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Desconto (R$/mês)</label>
                    </div>
                </div>

            </div>
            <div className="col">
                <p className=''>Imagens: 
                <span className=''>A primeira imagem será a capa (max 6)</span>
                </p>
                <div className="">
                    <input className='' type="file" id='images' accept='image/*' multiple />
                    <button className=''>Upload</button>
                </div>
                <button className=''>Criar Lista</button>
            </div>
        </div>
    </section>
  )
}
