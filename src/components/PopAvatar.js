import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { purple } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import "video-react/dist/video-react.css";
import Source from '../tools/data';
import Popover from '@material-ui/core/Popover';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        marginBottom: 10,
        paddingBottom: 20,
    },
    avatar: {
        backgroundColor: purple[500],
    },
    preview: {
        width: '100%',
        // marginTop : 30,
        // maxWidth : 450,
    },
    popover: {
        // width: '60%',
    },
    closeppicon: {
        float: "right",
    },
    namepp:{
        fontSize: 20,
        marginLeft: 20,
        marginTop: 8,
        display: 'inline-block',
    },
}));

export default function PopAvatar(props){
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClickPP = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePP = () => {
        setAnchorEl(null);
    };

    const openpp = Boolean(anchorEl);
    const id = openpp ? 'simple-popover' : undefined;

    return(
        <div>
            {props.person.pp ?
                <Avatar aria-label="recipe" className={classes.avatar}
                    src={`${Source.server}/img/${props.person.pp}`} onClick={handleClickPP} />
                :
                <Avatar aria-label="recipe" className={classes.avatar}>
                    {props.person.name.split(" ").map((item, index) => {
                        if (index < 2) return item.charAt(0);
                    })}
                </Avatar>}
                <Popover
                id={id}
                open={openpp}
                anchorEl={anchorEl}
                onClose={handleClosePP}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                className={classes.popover}
            >
                {<Typography variant="body2" color="textPrimary" component="span" className={classes.namepp}>{props.person.name}</Typography>}
                <IconButton onClick={handleClosePP} className={classes.closeppicon}>
                    <CloseIcon />
                </IconButton>
                <img src={`${Source.server}/img/${props.person.pp}`} alt="publish" className={classes.preview} />
            </Popover>
        </div>
    );

}