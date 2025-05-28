import '../pages/style.css';

export default function Index() {

  return (
    <div className='background'> 
      <h2 className='text'>Venha conhecer nossas deliciosas receitas</h2>

      <div className='contain'>

        <div className='card'>
            <div className='card-top'>
                <img src='bolo.jpg' alt='Bolo de Cenoura' className='image-card'/>
            </div>
            
            <div className='card-bottom'>
                <h3 className='card-title'>Bolo de Cenoura</h3>
                <p className='card-description'>Uma deliciosa receita de bolo de cenoura com cobertura de chocolate.</p>
            </div>
        </div>


        <div className='card'>
            <div className='card-top'>
                <img src='lanche.jpg' alt='Lanche' className='image-card'/>
            </div>
            
            <div className='card-bottom'>
                <h3 className='card-title'>Lanche</h3>
                <p className='card-description'>Um delicioso lanche com hamburguer e queijo.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
