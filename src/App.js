import './App.css';
import React from 'react';
import { Container,
        Grid} from '@material-ui/core';
import {ZipCard, WeatherCard} from './Weather';
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cards: [],
    logged: false, zipcode: ""};
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
    this.setState({
        cards: this.state.cards.concat([this.state.zipcode]),
        zipcode:""
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
                  <WeatherCard city="Buffalo" weather={{temp: 30, humidity: 50, condition: "Cloudy"}} zipcode={zipcode} removeZip={this.removeZip} />
                </Grid>
              ))}
          <Grid item xs={12} sm={6} md={3}>
            <ZipCard submitZip={this.submitZip} zipcode={this.state.zipcode} handleZipcodeChange={this.handleZipcodeChange}/>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(useStyles)(App);
