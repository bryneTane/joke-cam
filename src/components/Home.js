import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import Skeleton from './Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
// import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { purple } from '@material-ui/core/colors';
import Source from '../tools/data';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginBottom: 25,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
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
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(1)}px`,
  },
  trait : {
    marginBottom: 10,
  },
}));

const LinkCard = (props) => {
  const classes = useStyles();
//   const preventDefault = (event) => event.preventDefault();
  // console.log(props.link)

  return (
    <a href={props.link} color="inherit" target='_blank' >
        <Card className={classes.root}>
        <CardHeader
            avatar={ props.icon ?
            <Avatar aria-label="recipe" className={classes.avatar} 
                src={`${Source.server}/img/${props.icon}`} /> 
                :
            <Avatar aria-label="recipe" className={classes.avatar}>
                {props.title.charAt(0)}
            </Avatar> 
            }
            title={props.title}
            subheader={props.description}
        />
        </Card>
    </a>
  );
}
export default function Home(props){

    const classes = useStyles();
    const storeDef = Source.getDefs();

    return (
        <div>
            <Skeleton>
                <Typography
                className={classes.dividerFullWidth}
                color="textSecondary"
                display="block"
                variant="caption"
                >
                Let's play !
                </Typography>
                <Divider className={classes.trait} />
                {storeDef.homepage.map((item, index) =>
                    <LinkCard title={item.title} description={item.description} icon={item.icon} key={index} link={item.link} />
                )}
            </Skeleton>
        </div>
    ); 
    
}