import './App.css';
import React from 'react';
import { Container,
        Grid} from '@material-ui/core';
import WeatherCard from './WeatherCard';
import ZipCard from './ZipCard';
import {LoginCard, GreetingCard} from './Login';
import { withStyles } from '@material-ui/core/styles';

const useStyles = (theme) => ({
  login: {
    padding: theme.spacing(2, 0, 2),
  },
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

// const cards = [1,2,3];

function zipcodeIsValid(zipcode, cb) {
  const params = new URLSearchParams({ zipcode });
  fetch(process.env.REACT_APP_API_ENDPOINT + '/weather?' + params)
    .then(res => cb(res.status === 200))
    .catch(err => console.error(err))
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cards: [],
    logged: false, 
    zipcode: "",
    zipError: false,
    zipHelperText: ""};
    this.submitZip = this.submitZip.bind(this);
    this.handleZipcodeChange = this.handleZipcodeChange.bind(this);
    this.removeZip = this.removeZip.bind(this);
  }

  handleZipcodeChange(event) {
    this.setState({zipcode: event.target.value})
  }

  submitZip() {
    if (!this.state.zipcode) return;
    if (this.state.cards.includes(this.state.zipcode)) return;
    // check if valid zipcode
    zipcodeIsValid(this.state.zipcode, (valid) => {
      if (valid) {
        this.setState({
          cards: this.state.cards.concat([this.state.zipcode]),
          zipcode:"",
          zipError: false,
          zipHelperText: ""
        })
      } else {
        this.setState({
          zipError: true,
          zipHelperText: "Invalid Zipcode"
        });
      }
    })
  }

  removeZip(zipcode) {
    const cards = this.state.cards.filter(zip => zip !== zipcode);
    this.setState({ cards: cards });
  }

  render() {
    const {classes} = this.props;
    return (
      <Container>
        {/* Login container */}
        <Container className={classes.login}>
        <Grid className={classes.centered}>
          <Grid item xs={12} md={9}>
          <LoginCard />
          </Grid>
        </Grid>
        </Container>
        {/* WeatherCards grid */}
        <Grid container spacing={2}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {this.state.cards.map((zipcode) => (
                <Grid item xs={12} sm={6} md={3}>
                  <WeatherCard zipcode={zipcode} removeZip={this.removeZip} />
                </Grid>
              ))}
          <Grid item xs={12} sm={6} md={3}>
            <ZipCard 
            submitZip={this.submitZip} 
            zipcode={this.state.zipcode} 
            handleZipcodeChange={this.handleZipcodeChange}
            error={this.state.zipError}
            errorText={this.state.zipHelperText}/>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(useStyles)(App);
