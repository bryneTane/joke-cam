import React, { useState, useEffect } from 'react';
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
    marginBottom : 30,
    fontSize: 60,
    backgroundColor: purple[500],
  },
  speedDial: {
    position: 'relative',
    bottom : '15vw',
    left : '16vw',
},
label : {
    lineHeight: 0,
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
      <div>
        <SpeedDial
          ariaLabel="SpeedDial openIcon example"
          className={classes.speedDial}
          hidden={hidden}
          icon={<SpeedDialIcon openIcon={<WallpaperIcon />} />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction='right'
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
      </div>
    );
  }

export default function Settings(props){
  
    let fileReader;
    
    const classes = useStyles();
    const storeDef = Source.getDefs();
    const [content, setContent] = useState(`${process.env.PUBLIC_URL}/img/${storeDef.connected.pp}`);
    const [name, setName] = useState(storeDef.connected.name);

    const textChange = (e) => {
        setName(e.target.value);
      }

      const deletePhoto = () => {
          setContent(null);
      }

      const handleFileRead = (e) => {
        setContent(fileReader.result);
        // console.log(content);
      }
  
      const handleFileChosen = (file) => {
        setContent(null);
        console.log(file.type);
        // setType(file.type);
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsDataURL(file);
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
                        { content ?
                            <Avatar aria-label="recipe" className={classes.avatar} 
                            src={content} /> 
                            :
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                {storeDef.connected.name.split(" ").map((item, index) => {
                                    if (index < 2) return item.charAt(0);
                                })}
                            </Avatar> 
                        }
                        <OpenIconSpeedDial deletePhoto={deletePhoto} />
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
                    {name && <Button variant="contained" color="primary" className={classes.publish}>
                                                Save
                                            </Button>}
                </div>
            </Skeleton>
        </div>
    ); 
    
}