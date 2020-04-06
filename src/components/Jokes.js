import React, {useState, useEffect} from 'react';
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
import "video-react/dist/video-react.css";

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
}));

let dateDisplay = (date) => {
    if (moment(date).isSame(moment(Date.now()), 'day')) return 'Today, ' + moment(date).format('HH:mm');
    else if(((moment(Date.now()).dayOfYear() - moment(date).dayOfYear()) === 1) 
                && moment(date).isSame(moment(Date.now()), 'year')) return 'Yesterday, ' + moment(date).format('HH:mm');
    else return moment(date).format('MMMM DD, HH:MM');
}

function MediaCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={ props.person.pp ?
            <Avatar aria-label="recipe" className={classes.avatar} 
                src={`${process.env.PUBLIC_URL}/img/${props.person.pp}`} /> 
                :
            <Avatar aria-label="recipe" className={classes.avatar}>
                {props.person.name.split(" ").map((item, index) => {
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
        title={props.person.name}
        subheader={dateDisplay(props.item.id)}
      />
      <CardMedia
        component="div"
        className={classes.media}
        // src={`${process.env.PUBLIC_URL}/videos/${props.item.filename}`}
        // height="140"
        title={props.item.Title}
      >
          {(props.item.type === 'video') && <Player
            playsInline
            // poster="/assets/poster.png"
            src={`${process.env.PUBLIC_URL}/videos/${props.item.filename}`}
            className={classes.preview}
            />}
          {(props.item.type === 'image') && <img src={`${process.env.PUBLIC_URL}/img/${props.item.filename}`} alt="publish" className={classes.preview} />}
          {(props.item.type === 'audio') && <ReactAudioPlayer
                                          src={`${process.env.PUBLIC_URL}/audios/${props.item.filename}`}
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

    const [isLoading, setIsLoading] = useState(true);
    const [elts, setElts] = useState([]);
    const [people, setPeople] = useState([]);
    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/store.json`)
          .then(resp => resp.json())
          .then(resp => {
            setElts(resp.jokes);
            setPeople(resp.people);
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
                {elts.map((item, index) => {
                    console.log(`${process.env.PUBLIC_URL}/videos/${item.filename}`)
                    return <MediaCard item={item} key={index} person={people[item.idPerson]} />
                })}
            </Skeleton>
        </div>
    ); 
    
}