import { useParams } from 'react-router-dom';
import ProductGrid from './components/product_grid.jsx';

const App = ({ api, productsCount }) => {
  return (
    <>
        <ProductGrid productsCount={productsCount} api={api}  productId={useParams()}/>
    </>
  );
};

export default App;
