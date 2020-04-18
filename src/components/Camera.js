import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import '../css/Home.css';
// import Skeleton from './Skeleton';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import Webcam from "react-webcam";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Source from '../tools/data';

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'green',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'red',
        },
        '&:hover fieldset': {
          borderColor: 'yellow',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'green',
        },
      },
    },
  })(TextField);

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
publishButton : {
    width: '40%',
    position : "fixed",
    top : '50%',
    left: '50%',
    zIndex: 1000000000,
    transform: 'translate(-50%, -50%)',
    backgroundColor: green[500],
    color: '#ffffff',
  },
  goBack : {
    position: "fixed",
    top : '3%',
    left : '5%',
    filter: 'drop-shadow(1px 1px 1px black)',
    // color: green[500],
  },
  settings : {
    position: "fixed",
    top : '3%',
    right : '5%',
    filter: 'drop-shadow(1px 1px 1px black)',
    // color: green[500],
  },
  file : {
    position: "fixed",
    bottom : (window.screen.width*16)/100+'px',
    left : '65%',
    filter: 'drop-shadow(1px 1px 1px black)',
    // color: green[500],
  },
  publish : {
    color : green[500],
  },
  cancel : {
    color : 'red',
  },
//   field : {
//     borderColor : green[500],
//     color: green[500],
//   },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


function FormDialog(props) {
    
    const classes = useStyles();

    return (
      <div>
        <Dialog 
            open={props.open} 
            onClose={props.handleClose} 
            aria-labelledby="form-dialog-title"
            TransitionComponent={Transition}
            aria-describedby="alert-dialog-slide-description">
          <DialogTitle id="form-dialog-title">Publish</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Say something funny about this content ! :) 
            </DialogContentText>
            <CssTextField
              autoFocus
              margin="dense"
              id="comment"
              label="Your comment"
              fullWidth
              type='text'
            //   className={classes.field}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose} className={classes.cancel} >
              Cancel
            </Button>
            <Button onClick={props.handleClose} className={classes.publish} >
              Publish
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

export default function Camera(props){
    
    const [screened, setScreened] = useState(false);
    const [src, setSrc] = useState(null);
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const classes = useStyles();
    const storeDef = Source.getDefs();

    const webcamRef = React.useRef(null);
    
    const capture = React.useCallback(
      () => {
        setSrc(webcamRef.current.getScreenshot());
        setScreened(true);
      },
      [webcamRef]
    );

    return (
        <div className={classes.content}>
            { screened ?
                <div>
                    <FormDialog open={open} handleClose={handleClose} />
                    <img src={src} alt="token" width='100%' />
                    <ArrowBackIcon className={classes.goBack} onClick={() => setScreened(false)} />
                    {/* <SettingsOutlinedIcon className={classes.settings} /> */}
                    {!open && <Fab className={classes.publishButton} variant='extend' onClick={handleClickOpen} >
                        Publish ?
                    </Fab>}
                    {/* <AttachFileOutlinedIcon className={classes.file} /> */}
                </div> 
                :
                <div>
                    <Webcam 
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        mirrored={true}
                        width={'100%'} />
                    <Link to='/home' ><ArrowBackIcon className={classes.goBack} /></Link>
                    <SettingsOutlinedIcon className={classes.settings} />
                    <Fab className={classes.picButton} aria-label="add" onClick={capture} >
                        <CameraAltOutlinedIcon />
                    </Fab>
                    <AttachFileOutlinedIcon className={classes.file} />
                </div>
            }
        </div>
    ); 
    
}