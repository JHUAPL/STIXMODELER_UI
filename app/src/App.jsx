import { Provider } from 'mobx-react';
import Canvas from './components/Canvas';
import { store } from './stores/Stores';

import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <Canvas />
    </Provider>
  );
}

export default App;
