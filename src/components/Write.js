import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import Skeleton from './Skeleton';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { purple, green } from '@material-ui/core/colors';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Source from '../tools/data';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
    marginBottom: 20,
  },
  upload : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  textArea : {
    backgroundColor : 'inherit',
    width : "100%",
    fontSize : 17,
    border : 'none',
    borderBottom : "0.1px solid black",
    transition: '0.3s',
    '&:focus' : {
      borderBottom : "2px solid " + green[500],
    },
    marginTop: 20,
  },
  publish : {
    marginTop : 30,
    backgroundColor : green[500],
    width : '70%',
  },
}));

export default function Settings(props){
    
    const classes = useStyles();
    const storeDef = Source.getDefs();
    const [ready, setReady] = useState(false);
    const [author, setAuthor] = useState("");
    const [quote, setQuote] = useState("");

    const authorChange = (e) => {
        setAuthor(e.target.value);
      }
    const quoteChange = (e) => {
        setQuote(e.target.value);
      }
    
    useEffect(() => {
        if(quote && author && quote.trim() && author.trim()) setReady(true);
        else setReady(false);
    }, [author, quote])
    
    return (
        <div>
            <Skeleton>
                <Typography
                className={classes.dividerFullWidth}
                color="textSecondary"
                display="block"
                variant="caption"
                >
                Write a quote !
                </Typography>
                <Divider className={classes.trait} />
                <div className={classes.upload}>
                    <CssTextField
                        autoFocus
                        margin="dense"
                        id="author"
                        label="Author"
                        fullWidth
                        type='text'
                        //   className={classes.field}
                        onChange={authorChange}
                        />
                    <TextareaAutosize 
                      aria-label="empty textarea" 
                      placeholder="Quote"
                      // rowsMin={3} 
                      className={classes.textArea}
                      onChange={quoteChange} />
                    {ready && <Button variant="contained" color="primary" className={classes.publish}>
                        Publish
                    </Button>}
                </div>
            </Skeleton>
        </div>
    ); 
    
}