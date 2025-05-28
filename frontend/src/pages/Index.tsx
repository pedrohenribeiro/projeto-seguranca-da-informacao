import '../pages/style.css';

export default function Index() {

  return (
    <div className='background'> 
      <h2 className='text'>Venha conhecer nossas deliciosas receitas</h2>

      <div className='container'>

        <div className='card'>
          <div className='card-top'>
            <img src='cooknow.png' alt='Bolo de Cenoura' className='food-top-icon '/>
          </div>
          
          <div className='card-bottom'>
            <h3 className='card-title'>Bolo de Cenoura</h3>
            <p className='card-description'>Uma deliciosa receita de bolo de cenoura com cobertura de chocolate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
