import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import Skeleton from './Skeleton';
import { makeStyles } from '@material-ui/core/styles';
// import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import Fab from '@material-ui/core/Fab';
import Divider from '@material-ui/core/Divider';
import { purple, green } from '@material-ui/core/colors';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Source from '../tools/data';
import Loader from 'react-loader-spinner';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import Button from '@material-ui/core/Button';
import ExifOrientationImg from 'react-exif-orientation-img'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginBottom: 25,
  },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(1)}px`,
  },
  trait : {
    marginBottom: 40,
  },
  upload : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  input : {
    display : "none",
  },
  picButton : {
    width : (window.screen.width*20)/100,
    height : (window.screen.width*20)/100,  
    position : "relative",
    left: '50%',
    transform: 'translate(-50%, 0%)',
    background: 'none',
    border: '5px solid ' + green[500],
    color: green[500],
    marginBottom: 30,
    animation: `$shadow-pulse 1s infinite`,
  },
  "@keyframes shadow-pulse": {
    "0%": {
      boxShadow: "0 0 0 0px " + green[200],
    },
    "100%": {
      boxShadow: "0 0 0 35px rgba(0, 0, 0, 0)",
    }
  },
  textArea : {
    backgroundColor : 'inherit',
    width : "90%",
    fontSize : 17,
    border : 'none',
    borderBottom : "0.1px solid black",
    transition: '0.3s',
    '&:focus' : {
      borderBottom : "2px solid " + green[500],
    },
    marginTop: 20,
  },
  preview : {
    width : '100%',
    marginTop : 30,
    // height : 50
    // imageOrientation: 'from-image',
  },
  loader : {
    marginTop : 30,
  },
  publish : {
    marginTop : 30,
    backgroundColor : green[500],
    width : '70%',
  },
}));

export default function Media(props){
  
    let fileReader;
    
    const classes = useStyles();
    const storeDef = Source.getDefs();
    const [content, setContent] = useState(null);
    const [type, setType] = useState("");
    const [ready, setReady] = useState(false);
    
    const handleFileRead = (e) => {
      setContent(fileReader.result);
      // console.log(content);
    }

    const handleFileChosen = (file) => {
      setContent(null);
      console.log(file.type);
      setType(file.type);
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsDataURL(file);
    }

    const textChange = (e) => {
      if(e.target.value) setReady(true);
      else setReady(false);
    }

    const Preview = (props) => {
      if (type.startsWith('image')) return <ExifOrientationImg src={props.content} alt="publish" className={classes.preview} />;
      else if (type.startsWith('video')) return <Player
                                                  playsInline
                                                  // poster="/assets/poster.png"
                                                  src={props.content}
                                                  className={classes.preview}
                                                  />;
      else return <ReactAudioPlayer
                    src={props.content}
                    autoPlay
                    controls
                    className={classes.preview}
                  />;                                            
    }

    return (
        <div>
            <Skeleton>
                <Typography
                className={classes.dividerFullWidth}
                color="textSecondary"
                display="block"
                variant="caption"
                >
                Let's play !
                </Typography>
                <Divider className={classes.trait} />
                <div className={classes.upload}>
                    <input
                        accept="image/*,video/*,audio/*"
                        className={classes.input}
                        id="contained-button-file"
                        type="file"
                        // capture="camera"
                        onChange={e => handleFileChosen(e.target.files[0])}
                    />
                    <label htmlFor="contained-button-file">
                        <Fab className={classes.picButton} aria-label="add" component='span' >
                            <CameraAltOutlinedIcon />
                        </Fab>
                    </label>
                    <TextareaAutosize 
                      aria-label="empty textarea" 
                      placeholder="Your comment"
                      // rowsMin={3} 
                      className={classes.textArea}
                      onChange={textChange} />
                    {(type && !content) && <Loader type="Puff" color={green[500]} height={100} width={100} className={classes.loader} />}
                    {(content && ready) && <Button variant="contained" color="primary" className={classes.publish}>
                                                Publish
                                            </Button>}
                    {content && <Preview content={content} type={type} /> }
                </div>
            </Skeleton>
        </div>
    ); 
    
}