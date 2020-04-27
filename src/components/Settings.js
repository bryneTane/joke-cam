import React, { useState } from 'react';
import {Redirect} from 'react-router-dom';
import '../css/Home.css';
import Skeleton from './Skeleton';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { purple, green } from '@material-ui/core/colors';
import Source from '../tools/data';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import ExifOrientationImg from 'react-exif-orientation-img';
import Alert from '@material-ui/lab/Alert';
import Loader from 'react-loader-spinner';

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
  publish : {
    marginTop : 30,
    backgroundColor : green[500],
    width : '70%',
  },
  avatar : {
    width : '60vw',
    height : '60vw',
    // marginBottom : 30,
    fontSize: 60,
    backgroundColor: purple[500],
  },
  speedDial: {
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "center",
    position: 'relative',
    bottom: '10vw',
},
composite: {
  display:  'flex',
  flexDirection: 'column',
  alignItems: 'center',
},
label : {
    lineHeight: 0,
},
image : {
    minHeight: '100%',
    width : "100%",
},
logout: {
  marginTop: 40,
  width: '70%',
},
}));

const actions = [
    { icon: <EditIcon />, name: 'Change' },
    { icon: <DeleteIcon />, name: 'Delete' },
  ];

function OpenIconSpeedDial(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [hidden, setHidden] = React.useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
        <SpeedDial
          ariaLabel="SpeedDial openIcon example"
          className={classes.speedDial}
          hidden={hidden}
          icon={<SpeedDialIcon openIcon={<WallpaperIcon />} />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction='left'
        > 
          {actions.map((action) => (
            (action.name === "Change") ?
                
                <SpeedDialAction
                    key={action.name}
                    icon={<label className={classes.label} htmlFor={"contained-button-file"}>{action.icon}</label>}
                    tooltipTitle={action.name}
                    // className={classes.label}
                    />
            : 
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={props.deletePhoto}
                    />
          ))}
        </SpeedDial>
    );
  }

export default function Settings(props){
  
    let fileReader;
    const classes = useStyles();
    // const storeDef = Source.getDefs();
    const [connected, setConnected] = useState(JSON.parse(localStorage.getItem('joke-cam-user')))
    // const [content, setContent] = useState(null);
    const [name, setName] = useState(connected.name);
    const [fail, setFail] = useState(false);
    const [logout, setlogout] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const textChange = (e) => {
        setName(e.target.value);
      }

      const deletePhoto = () => {
          // setContent(null);
          // console.log(content)
          handleSend("none");
      }

      const handleSend = (p) => {
        // console.log(content)
        const timestamp = Date.now();
        setIsLoading(true);
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              name: name,
              pp: p,
              timestamp: timestamp,
           })
        };
        fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/user/${connected.id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.error) {
                throw data.error;
              }else{
                console.log(data);
                localStorage.setItem('joke-cam-user', JSON.stringify({
                    id: connected.id,
                    name: name,
                    date: connected.date,
                    pp: (p && p !== "none") ? (connected.id + '-' + timestamp+'.jpg') : "",
                    liked: data.liked,
                  })
                );
                setConnected(JSON.parse(localStorage.getItem('joke-cam-user')));
                setFail(false);
              }
              setIsLoading(false);
            })
            .catch(err => {
                setFail(true);
                setIsLoading(false);
                console.log(err);
            })
      }

      const handleFileRead = (e) => {
        // setContent(fileReader.result);
        handleSend(fileReader.result);
      }
  
      const handleFileChosen = (file) => {
        // setContent(null);
        console.log(file.type);
        // setType(file.type);
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsDataURL(file);
      }

      const disconnect = () => {
        localStorage.removeItem('joke-cam-user');
        setlogout(true);
      }

    if(logout) return <Redirect to={'/signin'} />

    if (isLoading) return (
      <Loader
        type="Puff"
        color={green[500]}
        height={100}
        width={100}
        className='loader'
      //   timeout={3000} //3 secs

      />
    );

    return (
        <div>
            <Skeleton>
                <Typography
                className={classes.dividerFullWidth}
                color="textSecondary"
                display="block"
                variant="caption"
                >
                Your Profile
                </Typography>
                <Divider className={classes.trait} />
                <div className={classes.upload}>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        type="file"
                        // capture="camera"
                        onChange={e => handleFileChosen(e.target.files[0])}
                    />
                    <div className={classes.composite}>
                        { (connected.pp && connected.pp !== "none") ?
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                <img src={`${Source.server}/img/${connected.pp}`} alt="publish" className={classes.image} />
                            </Avatar> 
                            :
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                {connected.name.split(" ").map((item, index) => {
                                    if (index < 2) return item.charAt(0);
                                })}
                            </Avatar> 
                        }
                        <OpenIconSpeedDial deletePhoto={deletePhoto} />
                    </div>
                    <CssTextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Your name"
                        fullWidth
                        type='text'
                        value={name}
                        //   className={classes.field}
                        onChange={textChange}
                        />
                    {name && <Button variant="contained" color="primary" onClick={() => handleSend(null)} className={classes.publish}>
                                                Save
                                            </Button>}
                    {fail && <Alert severity="error">Oops !!! The request unfortunately failed !</Alert>}
                    <Button onClick={disconnect} className={classes.logout} variant="outlined" color="secondary">
                      Log Out
                    </Button>
                </div>
            </Skeleton>
        </div>
    ); 
    
}