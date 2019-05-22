import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { addShippingToCart } from '../../utils/CommonUtils';

class AddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }
  async componentDidUpdate(){
    console.log("AddressForm componentDidUpdate", this.props, this.state);
    if(this.props.submit){
      let response = await addShippingToCart(this.state.address);
      if(response.body){
        this.props.parent.handleFormSubmit();
      }
      if(response.err){
        // Display some error
      }
      // this.props.parent.handleFormSubmit();
    }
  }
  handleChange(event) {
    let address = this.state && this.state.address ? this.state.address: {};
    address[event.target.name] = event.target.value;
    this.setState({address});
  }
  componentDidMount(){
    console.log("AddressForm componentDidMount", this.props);
  }
  render() {
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Shipping address
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="First name"
              fullWidth
              autoComplete="fname"
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last name"
              fullWidth
              autoComplete="lname"
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="streetNumber"
              name="streetNumber"
              label="Address line 1"
              fullWidth
              autoComplete="billing address-line1"
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="streetName"
              name="streetName"
              label="Address line 2"
              fullWidth
              autoComplete="billing address-line2"
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="city"
              name="city"
              label="City"
              fullWidth
              autoComplete="billing address-level2"
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="state" name="state" label="State/Province/Region" fullWidth/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="postalCode"
              name="postalCode"
              label="Zip / Postal code"
              fullWidth
              autoComplete="billing postal-code"
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="country"
              name="country"
              label="Country"
              fullWidth
              autoComplete="billing country"
              onChange={this.handleChange}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default AddressForm;