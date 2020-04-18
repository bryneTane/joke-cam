import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import Skeleton from './Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { purple, green } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Loader from 'react-loader-spinner';
import moment from 'moment';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import { Skeleton as Skel } from '@material-ui/lab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import "video-react/dist/video-react.css";
import Source from '../tools/data';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginBottom: 10
  },
  media: {
    // height: 140,
    // paddingTop: '56.25%', // 16:9
    textAlign : "center",
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: purple[500],
  },
  trait : {
    marginBottom: 10,
  },
  preview : {
    minWidth : '100%',
    // marginTop : 30,
    // maxHeight : 450,
  },
  image: {
    width : '100%',
  },
  card: {
    maxWidth: 345,
    margin: theme.spacing(2),
  },
  media2: {
    height: 190,
  },
  list: {
    
  },
}));

let dateDisplay = (date) => {
    date = Number(date);
    if (moment(date).isSame(moment(Date.now()), 'day')) return 'Today, ' + moment(date).format('HH:mm');
    else if(((moment(Date.now()).dayOfYear() - moment(date).dayOfYear()) === 1) 
                && moment(date).isSame(moment(Date.now()), 'year')) return 'Yesterday, ' + moment(date).format('HH:mm');
    else return moment(date).format('MMMM DD, HH:MM');
}

function MediaCard(props) {
  const classes = useStyles();
  props.item.type = props.item.type.split('/')[0];

  const [isLoading, setIsLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [visible, setVisible] = useState(false);
  const people = Source.getPeople();
  let person = people[props.idPerson];

  useEffect(() => {
    if(!person){
      fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/user/${props.idPerson}`)
      .then(resp => resp.json())
      .then(resp => {
        if(resp.data){
          person = resp.data;
          Source.addPerson(resp.data);
        }
        // console.log(elts)
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
    }else{
      setIsLoading(false);
    }
  }, []);

  const deleteItem = () => {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            filename: props.item.filename,
            type: props.item.type,
         })
      };
      fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/joke/${props.item.id}`, requestOptions)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              setRedirect(true);
          })
          .catch(err => {
              console.log(err);
          })
  }

  if(redirect) return <Redirect to={'/jokes'} />;

  if(isLoading) return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Skel animation="wave" variant="circle" width={40} height={40} />
        }
        title={
            <Skel animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
        }
        subheader={<Skel animation="wave" height={10} width="40%" />}
      />
        <Skel animation="wave" variant="rect" className={classes.media2} />
        

      <CardContent>
          <React.Fragment>
            <Skel animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skel animation="wave" height={10} width="80%" />
          </React.Fragment>
      </CardContent>
    </Card>
  );

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={ person.pp ?
            <Avatar aria-label="recipe" className={classes.avatar} 
                src={`${Source.server}/img/${person.pp}`} /> 
                :
            <Avatar aria-label="recipe" className={classes.avatar}>
                {person.name.split(" ").map((item, index) => {
                    if (index < 2) return item.charAt(0);
                })}
            </Avatar> 
            }
        // avatar={
        //   <Avatar aria-label="recipe" className={classes.avatar}>
        //       MC
        //   </Avatar>
        // }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        action={ 
          person.id === JSON.parse(localStorage.getItem('joke-cam-user')).id &&
          <IconButton aria-label="settings" onClick={() => setVisible(!visible)}>
            <MoreVertIcon />
          </IconButton>
        }
        title={person.name}
        subheader={dateDisplay(props.item.date)}
      />
      {visible && <List className={classes.list}>
        <ListItem button onClick={deleteItem} key='del'>
          <ListItemIcon><DeleteIcon /></ListItemIcon>
          <ListItemText primary={'Delete'} />
        </ListItem>
      </List>}
      <CardMedia
        component="div"
        className={classes.media}
        // src={`${Source.server}/videos/${props.item.filename}`}
        // height="140"
        // title={props.item.title}
      >
          {(props.item.type === 'video') && <Player
            playsInline
            // poster="/assets/poster.png"
            src={`${Source.server}/videos/${props.item.filename}`}
            className={classes.preview}
            />}
          {(props.item.type === 'image') && <img src={`${Source.server}/img/${props.item.filename}`} alt="publish" className={classes.preview} />}
          {(props.item.type === 'audio') && <ReactAudioPlayer
                                          src={`${Source.server}/audios/${props.item.filename}`}
                                          controls
                                          className={classes.preview}
                                        />}
      </CardMedia>
      <CardContent>
         
        <Typography variant="body2" color="textSecondary" component="p">
          {props.item.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Jokes(props){

    const classes = useStyles();
    const people = Source.getPeople();
    const [isLoading, setIsLoading] = useState(true);
    const [elts, setElts] = useState([]);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/jokes`)
          .then(resp => resp.json())
          .then(resp => {
            setElts(resp.data);
            // console.log(elts)
            setIsLoading(false);
          })
          .catch(err => {
            console.log(err);
          });
      }, []);

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
                Let's Joke !
                </Typography>
                <Divider className={classes.trait} />
                {elts && elts.sort((a, b) => Number(b.date) - Number(a.date)).map((item, index) => <MediaCard item={item} key={index} idPerson={item.idPerson} />)}
            </Skeleton>
        </div>
    ); 
    
}