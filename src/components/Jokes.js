import React, {useState, useEffect} from 'react';
import Skeleton from './Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { purple, green } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Loader from 'react-loader-spinner';
import Alert from '@material-ui/lab/Alert';
import "video-react/dist/video-react.css";
import Source from '../tools/data';
import MediaCard from './MediaCard';

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
    width : '100%',
    // marginTop : 30,
    // maxWidth : 450,
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

// let dateDisplay = (date) => {
//     date = Number(date);
//     if (moment(date).isSame(moment(Date.now()), 'day')) return 'Today, ' + moment(date).format('HH:mm');
//     else if(((moment(Date.now()).dayOfYear() - moment(date).dayOfYear()) === 1) 
//                 && moment(date).isSame(moment(Date.now()), 'year')) return 'Yesterday, ' + moment(date).format('HH:mm');
//     else return moment(date).format('MMMM DD, HH:MM');
// }

export default function Jokes(props){

    const classes = useStyles();
    const people = Source.getPeople();
    const [isLoading, setIsLoading] = useState(true);
    const [elts, setElts] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [fail, setFail] = useState(false);

    const handleReload = () => {
      console.log(toggle);
      setToggle(!toggle);
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/jokes`)
          .then(resp => resp.json())
          .then(resp => {
            if (resp.error) {
              throw resp.error;
          }else{
            setElts(resp.data);
            setFail(false);
            // console.log(elts)
            setIsLoading(false);
          }
          })
          .catch(err => {
            console.log(err);
            setFail(true);
            setIsLoading(false);
          });
      }, [toggle]);

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
                {fail && <Alert severity="error">Oops !!! Could not load the jokes !</Alert>}
                {elts && elts.sort((a, b) => Number(b.date) - Number(a.date)).map((item, index) => <MediaCard item={item} key={index} reload={handleReload} idPerson={item.idPerson} />)}
            </Skeleton>
        </div>
    ); 
    
}