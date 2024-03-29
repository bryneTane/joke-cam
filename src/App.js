import React, { useState, useEffect } from 'react';
// import VideoRecorder from 'react-video-recorder';
import Home from './components/Home';
import Jokes from './components/Jokes';
import Quotes from './components/Quotes';
import Write from './components/Write';
// import Camera from './components/Camera';
import Media from './components/Media';
import Settings from './components/Settings';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import {green} from '@material-ui/core/colors';
import Loader from 'react-loader-spinner';
import Source from './tools/data';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import './App.css';

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [store, setStore] = useState([]);
  const [pc, setPc] = useState(false);

  useEffect(() => {
    if(window.screen.width < 950){
      fetch(`${process.env.PUBLIC_URL}/store.json`)
        .then(resp => resp.json())
        .then(resp => {
          Source.setDefs(resp);
          fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/users`)
                .then(resp2 => {
                  if(resp2.error){
                    throw resp2.error;
                  }else{
                    if(resp2.data) Source.setPeople(resp2.data);
                    // console.log(elts)
                    if(localStorage.getItem('joke-cam-user')){
                      fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/user/${JSON.parse(localStorage.getItem('joke-cam-user')).id}`)
                      .then(response => response.json())
                      .then(data => {
                          data = data.data;
                          localStorage.setItem('joke-cam-user', JSON.stringify({
                              date: data.date,
                              id: data.id,
                              name: data.name,
                              pp: data.pp,
                              liked: data.liked,
                          }));
                          setIsLoading(false);
                      })
                      .catch(err => {
                          console.log(err);
                      })
                    }else{
                      setIsLoading(false);
                    }
                  }
                })
                .catch(err => {
                  console.log(err);
                  setIsLoading(false);
                });
          // console.log(resp);
  
          setStore(resp);
        })
        .catch(err => {
          console.log(err);
        });
    }else{
      setPc(true);
    }
  }, []);

    if(pc) return <div className="pc">
      <PhoneAndroidIcon className="pcIcon" />
      <div className="pcText">
        Please use a mobile phone !!! The PC version is coming soon !
      </div>
    </div>

    if (isLoading) return (
      <Loader
        type="Puff"
        color={green[500]}
        height={100}
        width={100}
        className='loader'
        // timeout={3000} //3 secs

      />
    );

    return (
      <BrowserRouter basename={`${process.env.PUBLIC_URL}/`}>
        <Switch>
          <Route exact path='/' render={() => <Redirect to={'/signin'} />} />
          {/* <Route exact path='/connexion' component={Connexion} />
        <Route exact path='/inscription' component={Inscription} /> */}
          <Route exact path='/home' component={Home} />
          <Route exact path='/jokes' component={Jokes} />
          <Route exact path='/quotes' component={Quotes} />
          <Route exact path='/record' component={Media} />
          <Route exact path='/write' component={Write} />
          <Route exact path='/settings' component={Settings} />
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/signin' component={SignIn} />
          {/* <Route exact path='/deconnexion' component={Deconnexion} /> */}
          {/* <Route exact path='/index.html' render={() => <Home stores={this.state.items}/>} /> */}
          {/* <Route component={ModalSwitch}/> */}
        </Switch>
      </BrowserRouter>
    );
  }

  export default App;
