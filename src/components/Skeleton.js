import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import '../css/Skeleton.css';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Loader from 'react-loader-spinner';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import VideocamIcon from '@material-ui/icons/Videocam';
import EditIcon from '@material-ui/icons/Edit';
// import Brightness4Icon from '@material-ui/icons/Brightness4';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import Avatar from '@material-ui/core/Avatar';
import { purple, green } from '@material-ui/core/colors';

import Source from '../tools/data';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  avatar: {
    backgroundColor: purple[500],
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: green[500],
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const renderIcon = (text) => {
    if (text === "Home") return <HomeIcon />
    else if (text === 'Jokes') return <EmojiEmotionsIcon />;
    else if(text === 'Quotes') return <FormatQuoteIcon />
    else if(text === 'Record something') return <VideocamIcon />;
    else if(text === 'Write something') return <EditIcon />;
    else return <SettingsIcon />
}

export default function Skeleton(props){
    const classes = useStyles();
  const theme = useTheme();
  // const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  // const [person, setPerson] = useState([]);

  const person = JSON.parse(localStorage.getItem('joke-cam-user'));
  // useEffect(() => {
  //   fetch(`${process.env.PUBLIC_URL}/store.json`)
  //     .then(resp => resp.json())
  //     .then(resp => {
  //       setPerson(resp.connected);
  //       // console.log(elts)
  //       setIsLoading(false);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const storeDef = Source.getDefs();

  // if (isLoading) return (
  //   <Loader
  //     type="Puff"
  //     color={green[500]}
  //     height={100}
  //     width={100}
  //     className='loader'
  //   //   timeout={3000} //3 secs

  //   />
  // );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Promo X Joke-Cam
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          { person.pp ?
            <Avatar aria-label="recipe" className={classes.avatar} 
                src={`${Source.server}/img/${person.pp}`} /> 
                :
            <Avatar aria-label="recipe" className={classes.avatar}>
                {person.name.split(" ").map((item, index) => {
                    if (index < 2) return item.charAt(0);
                })}
            </Avatar> 
          }
          {person.name}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {storeDef.menu.map((item, index) => (
            <ListItem button key={item.title}>
              <ListItemIcon>{renderIcon(item.title)}</ListItemIcon>
              <Link to={item.link}><ListItemText primary={item.title} /></Link>
            </ListItem>
          ))}
        </List>
        {/* <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {props.children}
      </main>
    </div>
  );
}