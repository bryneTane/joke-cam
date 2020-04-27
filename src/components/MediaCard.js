import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Skeleton from './Skeleton';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
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
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import ExifOrientationImg from 'react-exif-orientation-img';
import "video-react/dist/video-react.css";
import Source from '../tools/data';
import CommentCard from './CommentCard';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        marginBottom: 10,
        paddingBottom: 20,
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
    list: {

    },
    textArea: {
        backgroundColor: 'inherit',
        width: "100%",
        marginRight: '5%',
        fontSize: 15,
        border: 'none',
        borderBottom: "0.5px solid black",
        transition: '0.3s',
        '&:focus': {
            borderBottom: "2px solid " + green[500],
        },
        marginTop: 10,
        // display: 'inline-block',
    },
    button: {
        // display: 'inline-block',
        backgroundColor: green[500],
        width: '40%',
        float: 'right',
        // marginBottom: '3vh',
    },
    buttonLoad: {
        // backgroundColor: green[500],
        // width: '30%',
        height: '30px',
        float: 'right',
    },
}));

let dateDisplay = (date) => {
    date = Number(date);
    if (moment(date).isSame(moment(Date.now()), 'day')) return 'Today, ' + moment(date).format('HH:mm');
    else if (((moment(Date.now()).dayOfYear() - moment(date).dayOfYear()) === 1)
        && moment(date).isSame(moment(Date.now()), 'year')) return 'Yesterday, ' + moment(date).format('HH:mm');
    else return moment(date).format('MMMM DD, HH:MM');
}

export default function MediaCard(props) {

    const connected = JSON.parse(localStorage.getItem('joke-cam-user'));

    const classes = useStyles();
    props.item.type = props.item.type.split('/')[0];

    const [isLoading, setIsLoading] = useState(true);
    // const [redirect, setRedirect] = useState(false);
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [comment, setComment] = useState("");
    const [cFail, setCFail] = useState(false);
    const [ready, setReady] = useState(false);
    const [count, setCount] = useState(1);
    const [textRef, setTextRef] = useState(null);
    const [lFail, setLFail] = useState(false);
    const [like, setLike] = useState(connected.liked.indexOf(props.item.id) > -1);

    const people = Source.getPeople();
    let person = people[props.idPerson];

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleLikeOrDislike = () => {
        const temp = like;
        setLike(!temp);
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                like: connected.id,
            })
        };
        fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/joke/like/${props.item.id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw data.error;
                }else{
                    console.log(data);
                    const requestOptions = {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            like: props.item.id,
                        })
                    };
                    fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/user/like/${connected.id}`, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                throw data.error;
                            }else{
                                console.log(data);
                                setLFail(false);
                                props.reload();
                                localStorage.setItem('joke-cam-user', JSON.stringify({
                                    date: connected.date,
                                    id: connected.id,
                                    name: connected.name,
                                    pp: connected.pp,
                                    liked: data.liked,
                                }));
                            }
                        })
                        .catch(err => {
                            setLike(temp);
                            setLFail(true);
                            console.log(err);
                        })
                }
            })
            .catch(err => {
                setLike(temp);
                setLFail(true);
                console.log(err);
            })
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

    const deleteItem = () => {
        console.log('delete')
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
                if (data.error) {
                    throw data.error;
                }else{
                    console.log(data);
                    props.reload();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleComment = () => {
        let com = comment;
        com.id = Date.now();
        const data = [...props.item.comments, com];
        setReady(false);
        textRef.value = "";
        handleSendReq(data);
    }

    const handleDelComment = (id) => {
        const data = props.item.comments.filter((elt) => (elt.id !== id));
        handleSendReq(data);
    }

    const handleSendReq = (data) => {
        // console.log(data, props.item.comments);
        // setIsLoading(true);
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comments: data,
            })
        };
        fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/joke/comment/${props.item.id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw data.error;
                }else{
                    console.log(data);
                    setCFail(false);
                    setVisible(false);
                    props.reload();
                }
            })
            .catch(err => {
                setCFail(true);
                setVisible(false);
                console.log(err);
            })
    }

    const commentChange = (e) => {
        setTextRef(e.target);
        setComment({
            body: e.target.value.trim(),
            date: Date.now(),
            idPerson: connected.id,
        });
        setReady(e.target.value.trim() ? true : false);
    }

    // if (redirect) return <Redirect to={'/jokes'} />;

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
            {cFail && <Alert severity="error">Oops !!! Could not be commented !</Alert>}
            {lFail && <Alert severity="error">Oops !!! Could not be liked/disliked !</Alert>}
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
                    person.id === connected.id &&
                    <IconButton aria-label="settings" onClick={() => setVisible(!visible)}>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={person.name}
                subheader={dateDisplay(props.item.date)}
            />
            {visible && person.id === connected.id && <List className={classes.list}>
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
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" onClick={handleLikeOrDislike}>
                    <FavoriteIcon color={like ? "secondary" : "action"} />
                </IconButton>
                {(person.id === connected.id) && <span>{props.item.likes.length}</span>}
                    {/* <IconButton aria-label="share">
            <ShareIcon />
          </IconButton> */}
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {props.item.comments && (
                        props.item.comments.length ?
                            <div>
                                {props.item.comments.sort((a, b) => Number(b.date) - Number(a.date)).map((item, index) => (count >= index) && <CommentCard item={item} key={index} delComment={() => handleDelComment(item.id)} idPerson={item.idPerson} />)}
                                {(count < (props.item.comments.length-1)) && <Button className={classes.buttonLoad} onClick={() => setCount(count+2)}>Load More...</Button>}
                            </div>
                            :
                            <Typography variant="body1" color="textPrimary" align='center' component="p">
                                No comments
                        </Typography>
                    )
                    }
                    <TextareaAutosize
                        aria-label="empty textarea"
                        placeholder="Your comment"
                        // rowsMin={3}
                        className={classes.textArea}
                        onChange={commentChange} />
                    {ready && <Button variant="contained" color="primary" className={classes.button} onClick={handleComment} >send</Button>}
                </CardContent>
            </Collapse>
        </Card>
    );
}
