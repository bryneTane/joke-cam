import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import Skeleton from './Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { purple, green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Webcam from "react-webcam";
import Source from '../tools/data';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginBottom: 25,
  },
  content : {
    color: green[800],
  },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(1)}px`,
  },
  trait : {
    marginBottom: 10,
  },
  picButton : {
    width : '20%',
    height : (window.screen.width*20)/100,  
    position : "fixed",
    top : '100%',
    left: '50%',
    zIndex: 1000000000,
    transform: 'translate(-50%, -150%)',
    background: 'none',
    border: '5px solid ' + green[500],
    color: green[500],
  },
  goBack : {
    position: "fixed",
    top : '3%',
    left : '5%',
    // color: green[500],
  },
}));


export default function Camera(props){
    
    const classes = useStyles();
    const storeDef = Source.getDefs();

    const webcamRef = React.useRef(null);
    
    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
      },
      [webcamRef]
    );

    return (
        <div className={classes.content}>
            <Webcam 
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                mirrored={true}
                width={'100%'} />
            <ArrowBackIcon className={classes.goBack} />
            <Fab className={classes.picButton} aria-label="add" onClick={capture} >
                <CameraAltOutlinedIcon />
            </Fab>
        </div>
    ); 
    
}