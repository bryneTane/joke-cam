import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExifOrientationImg from 'react-exif-orientation-img';
import "video-react/dist/video-react.css";
import Source from '../tools/data';
import MediaCard from './MediaCard';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        boxShadow: 'none',
        // marginBottom: 10,
    },
    media: {
        // height: 140,
        // paddingTop: '56.25%', // 16:9
        textAlign: "center",
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
    trait: {
        marginBottom: 10,
    },
    preview: {
        width: '100%',
        // marginTop : 30,
        // maxWidth : 450,
    },
    image: {
        width: '100%',
    },
    card: {
        maxWidth: 345,
        margin: theme.spacing(2),
    },
    media2: {
        height: 190,
    },
    commentContent: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 20,
    },
    header: {
        paddingTop: 0,
    },
}));

let dateDisplay = (date) => {
    date = Number(date);
    if (moment(date).isSame(moment(Date.now()), 'day')) return 'Today, ' + moment(date).format('HH:mm');
    else if (((moment(Date.now()).dayOfYear() - moment(date).dayOfYear()) === 1)
        && moment(date).isSame(moment(Date.now()), 'year')) return 'Yesterday, ' + moment(date).format('HH:mm');
    else return moment(date).format('MMMM DD, HH:MM');
}

export default function CommentCard(props) {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const [visible, setVisible] = useState(false);
    const people = Source.getPeople();
    let person = people[props.idPerson];

    const removeComment = () => { 
        props.delComment(); 
        setVisible(false); 
    }

    useEffect(() => {
        if (!person) {
            fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/user/${props.idPerson}`)
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.data) {
                        person = resp.data;
                        Source.addPerson(resp.data);
                        setIsLoading(false);
                    }
                    // console.log(elts)
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    // if (redirect) return <Redirect to={'/quotes'} />;

    if (isLoading) return (
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

            <CardContent>
                <React.Fragment>
                    <Skel animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skel animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skel animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skel animation="wave" height={10} width="80%" />
                </React.Fragment>
            </CardContent>
        </Card>
    );

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={person.pp ?
                    <Avatar aria-label="recipe" className={classes.avatar}
                        src={`${Source.server}/img/${person.pp}`} />
                    :
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {person.name.split(" ").map((item, index) => {
                            if (index < 2) return item.charAt(0);
                        })}
                    </Avatar>
                }
                action={
                    person.id === JSON.parse(localStorage.getItem('joke-cam-user')).id &&
                    <IconButton aria-label="settings" onClick={() => setVisible(!visible)}>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={person.name}
                subheader={dateDisplay(props.item.date)}
                className={classes.header}
            />
            {visible && person.id === JSON.parse(localStorage.getItem('joke-cam-user')).id && <List className={classes.list}>
                <ListItem button onClick={removeComment} key="del">
                    <ListItemIcon><DeleteIcon /></ListItemIcon>
                    <ListItemText primary={'Delete'} />
                </ListItem>
            </List>}
            <CardContent className={classes.commentContent} >

                <Typography variant="body1" color="textPrimary" component="p">
                    {props.item.body}
                </Typography>
            </CardContent>
        </Card>
    );
}
