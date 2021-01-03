import './App.css';
import React from 'react';
import { Container,
        Grid} from '@material-ui/core';
import WeatherCard from './WeatherCard';
import ZipCard from './ZipCard';
import UserCard from './User/User.js';
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

function zipcodeIsValid(zipcode, cb) {
  const params = new URLSearchParams({ zipcode });
  fetch(process.env.REACT_APP_API_ENDPOINT + '/weather?' + params)
  .then(res => res.json())  
  .then(data => {
      if (data.error) {
        throw Error(data.error);
      } else {
        return cb(true);
      }
      })
    .catch(err => cb(false))
}

function setLocations(locations) {
  const token = localStorage.getItem('weather-app-token');
  fetch(process.env.REACT_APP_API_ENDPOINT + "/user/setLocations", {
    method: "POST",
    headers: {
    "Content-Type": 'application/json', 
    'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      locations
    })
})
  .then(res => res.json())
  .then(data => {
      console.log(data);
  })
}

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    cards: [],
    logged: false, 
    zipcode: "",
    zipError: false,
    zipHelperText: ""};

    this.submitZip = this.submitZip.bind(this);
    this.handleZipcodeChange = this.handleZipcodeChange.bind(this);
    this.removeZip = this.removeZip.bind(this);
    this.handleMergeCards = this.handleMergeCards.bind(this);
    this.handleLogoutCardUpdate = this.handleLogoutCardUpdate.bind(this);
  }

  handleMergeCards(cards) {
    const newCards = []
    this.state.cards.forEach(card => {
      if (!newCards.includes(card)) {
        newCards.push(card);
      }
    })
    cards.forEach(card => {
      if (!newCards.includes(card)) {
        newCards.push(card);
      }
    })
    this.setState(
      {
        cards: newCards
      }
    )
  }

  handleLogoutCardUpdate() {
    this.setState(
      {
        cards: []
      }
    )
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.cards !== this.state.cards) {
      setLocations(this.state.cards);
    }
  }
  

  render() {
    const {classes} = this.props;
    return (
      <Container>
        {/* User container */}
        <Container className={classes.login}>
        <Grid className={classes.centered}>
          <Grid item xs={12} md={9}>
          <UserCard
            handleMergeCards={this.handleMergeCards}
            handleLogoutCardUpdate={this.handleLogoutCardUpdate}/>
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

export default withStyles(useStyles)(Home);
