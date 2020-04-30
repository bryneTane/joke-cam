import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { green } from '@material-ui/core/colors';
import Alert from '@material-ui/lab/Alert';
import md5 from 'md5';
import Loader from 'react-loader-spinner';
import Source from '../tools/data';

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
        borderColor: 'green',
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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        Friedrich TANE{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: green[500],
  },
  link: {
    marginTop: 20,
  },
}));

export default function SignUp(props) {
  const classes = useStyles();

  const [userName, setUserName] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [ready, setReady] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [fail, setFail] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.id === 'username') setUserName(e.target.value.toLowerCase().trim());
    if (e.target.id === 'password') setPassword(e.target.value);
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/users`)
      .then(resp2 => resp2.json())
      .then(resp2 => {
        if (resp2.data) Source.setPeople(resp2.data);
        // console.log(elts)
      })
      .catch(err => {
        console.log(err);
      });
  }, [])

  useEffect(() => {
    if (localStorage.getItem("joke-cam-user")) setRedirect(true);
    if (userName.trim() && password.trim()) setReady(true);
    else setReady(false);
  }, [userName, password]);

  const handleSubmit = () => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/api/user/${userName}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setNotFound(true);
          throw new Error("User not found");
        } else {
          data = data.data;
          if (data.password === md5(password)) {
            // console.log(data);
            localStorage.setItem('joke-cam-user', JSON.stringify({
              date: data.date,
              id: data.id,
              name: data.name,
              pp: data.pp,
              liked: data.liked,
            }));
            fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}/notifications/subscribe`, {
              method: 'POST',
              body: JSON.stringify({idPerson: data.id, subs: JSON.parse(localStorage.getItem('joke-cam-subscription'))}),
              headers: {
                'Content-Type': 'application/json',
              },
              // mode: 'no-cors'
            })
            setFail(false);
            setNotFound(false);
            setRedirect(true);
            setIsLoading(false);
          } else {
            if (props.location.state) props.location.state.alert = false;
            setFail(true);
            setIsLoading(false);
          }
        }
      })
      .catch(err => {
        if (props.location.state) props.location.state.alert = false;
        setFail(true);
        console.log(err);
        setIsLoading(false);
      })
  }

  if (redirect) return <Redirect to={'/home'} />

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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {/* {fail && !notFound && <Alert severity="error">Oops !!! Incorrect login or password !</Alert>} */}
        {/*notFound*/fail && <Alert severity="error">Oops !!! Incorrect login or password !</Alert>}
        {props.location.state && props.location.state.alert && <Alert severity="success">You were successfully registered ! :)</Alert>}
        <div className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CssTextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="User Id"
                name="username"
                // autoComplete="username"
                onChange={handleChange}
                error={userName ? false : true}
              />
            </Grid>
            <Grid item xs={12}>
              <CssTextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                // autoComplete="current-password"
                onChange={handleChange}
                error={password ? false : true}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
          </Grid>
          {ready && <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign In
          </Button>}
          <Grid container justify="flex-end" className={classes.link}>
            <Grid item>
              <Link to={"/signup"} variant="body2">
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}