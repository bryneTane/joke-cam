import React, { useState, useEffect } from 'react';
// import VideoRecorder from 'react-video-recorder';
import Home from './components/Home';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import Source from './tools/data';
import './App.css';

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [store, setStore] = useState([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/store.json`)
      .then(resp => resp.json())
      .then(resp => {
        Source.setDefs(resp);
        // console.log(resp);
        setStore(resp);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

    if (isLoading) return (
      <Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={3000} //3 secs

      />
    );

    return (
      <BrowserRouter basename={`${process.env.PUBLIC_URL}/`}>
        <Switch>
          <Route exact path='/' render={() => <Redirect to={'/home'} />} />
          {/* <Route exact path='/connexion' component={Connexion} />
        <Route exact path='/inscription' component={Inscription} /> */}
          <Route exact path='/home' component={Home} />
          {/* <Route exact path='/deconnexion' component={Deconnexion} /> */}
          {/* <Route exact path='/index.html' render={() => <Home stores={this.state.items}/>} /> */}
          {/* <Route component={ModalSwitch}/> */}
        </Switch>
      </BrowserRouter>
    );
  }

  export default App;
