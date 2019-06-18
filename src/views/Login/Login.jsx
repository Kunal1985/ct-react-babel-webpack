import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

// import { withRouter } from "react-router-dom";
import rp from 'request-promise';
import { signIn, signUp } from '../../utils/CommonUtils';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLogin: true};
    this.handleChange = this.handleChange.bind(this);
    this.submitSignIn = this.submitSignIn.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleChange(event) {
    let credentials = this.state.credentials ? this.state.credentials: {};
    credentials[event.target.name] = event.target.value;
    this.setState({credentials});
  }

  toggle(){
    let {isLogin} = this.state;
    this.setState({isLogin: !isLogin});
  }

  async submitSignIn() {
    let thisVar = this;
    let {isLogin, credentials} = this.state;
    let response = {};
    if(isLogin){
      response = await signIn(credentials);
    } else {
      if(credentials.password === credentials.confirmPassword){
        delete credentials.confirmPassword;
        response = await signUp(credentials);
      } else {
        this.setState({errMessage: "Passwords do not match, please correct and retry!"});
        return;
      }
    }
    if(response.body){
      this.props.history.push({
        pathname: 'user',
        state: { currUser: response.body.customer }
      });
    }
    if(response.err){
      let error = response.err.error;
      let message = `Error Occured with status code[${error.statusCode}]: ${error.message}`
      this.setState({errMessage: message});
    }
  }

  render(){
    const { classes } = this.props;
    const { isLogin, errMessage, email, password, confirmPassword } = this.state;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin? "Sign in": "Sign Up"}
          </Typography>
          {errMessage && (
            <Typography gutterBottom variant="body1" color="error">
              {errMessage}
            </Typography>
          )}
          <form className={classes.form}>
            {isLogin ? (
              <div>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <Input id="email" name="email" autoComplete="email" autoFocus value={email} onChange={this.handleChange}/>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input name="password" type="password" id="password" autoComplete="current-password" value={password} onChange={this.handleChange}/>
                </FormControl>
              </div>
            ):(
              <div>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <Input id="email" name="email" autoComplete="email" autoFocus value={email} onChange={this.handleChange}/>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input name="password" type="password" id="password" autoComplete="current-password" value={password} onChange={this.handleChange}/>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <Input name="confirmPassword" type="password" id="confirmPassword" autoComplete="current-password" value={confirmPassword} onChange={this.handleChange}/>
                </FormControl>
              </div>
            )}

            <FormControl margin="normal" required fullWidth>
              <Button className={classes.button} onClick={this.toggle}>{isLogin? "Register Now": "Login with Credentials"}</Button>
            </FormControl>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.submitSignIn}
            >
              {isLogin ? "Sign in": "Register"}
            </Button>
          </form>
        </Paper>
      </main>
    );
  }  
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);