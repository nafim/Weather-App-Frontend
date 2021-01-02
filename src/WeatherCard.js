import { Container,
    Card,
    CardContent,
    Typography,
    Divider,
    Button} from '@material-ui/core';
    
import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const useStyles = (theme) => ({
  card: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    'background-image': 'linear-gradient(to top left, #62bfed, #def7ff)'
  },
  buttons: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(0)
  },
  info: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
  },
  button: {
    paddingRight: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
  }
  });

class WeatherCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: null,
      condition: null,
      temperature: null,
      humidity: null,
      windSpeed: null,
      windDegree: null,
      imgURL: null
    };
    this.fetchWeather = this.fetchWeather.bind(this)
  }

  fetchWeather() {
    const params = new URLSearchParams({ zipcode: this.props.zipcode});
    fetch(process.env.REACT_APP_API_ENDPOINT + '/weather?' + params)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw Error(data.error);
        this.setState({
          city: data.city,
          condition: data.condition,
          temperature: data.temperature,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
          windDegree: data.windDegree,
          imgURL: data.imgURL
        })
      })
      .catch(err => console.error(err))
  }

  componentDidMount() {
    this.fetchWeather();
  }

  render() {
    const {classes} = this.props;
    return(
    <Card className={classes.card}>
            <CardContent>
            <Typography className={classes.title} variant="h6" align="center" color="textSecondary" gutterBottom>
                Weather in {this.state.city}
            </Typography>
            <Divider variant="middle" />
            <img src={this.state.imgURL} alt=""/>
            {/* Weather info container */}
            <Container className={classes.info}>
            <Typography align="center" variant="h3" color="textPrimary">
              {this.state.temperature}°F
            </Typography>
            <Typography align="center" variant="h5" color="textPrimary">
              {this.state.condition}
            </Typography>
            <Typography align="center" color="textPrimary">
                Humidity: <b> {this.state.humidity}% </b> <br />
                Wind: <b> {this.state.windSpeed} m/s </b>, <b> {this.state.windDegree}° </b> <br />
            </Typography>
            </Container>
            {/* Buttons */}
            <Container className={classes.buttons}>
              <Container className={classes.button}>
              <Button variant="contained" size="small" color="default" onClick={e => this.fetchWeather()}>
                  Refresh
              </Button>
              </Container>
              <Container className={classes.button} >
              <Button size="small" color="secondary" onClick={e => this.props.removeZip(this.props.zipcode)}>
                  Remove
              </Button>
              </Container>
            </Container>
            </CardContent>
        </Card>
    );
  }
  }

WeatherCard.propTypes = {
  zipcode: PropTypes.string.isRequired,
  removeZip: PropTypes.func.isRequired
}

export default withStyles(useStyles)(WeatherCard);