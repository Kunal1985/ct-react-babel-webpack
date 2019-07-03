import React from 'react';
import { connect } from 'react-redux';
// Importing custom redux-actions
import { fetchCartFromSession } from '../../actions/cartActions';

class MiniCartTrigger extends React.Component {
	componentWillMount() {
		this.props.fetchCartFromSession();
	}

	componentWillReceiveProps(nextProps) {
		let appComponent = this.props.parent;
		let { cartFromReducer, parent } = nextProps;
		let showOnPage = window.location.hash.indexOf('product') != -1;
		if (cartFromReducer.id && showOnPage) {
			appComponent.setState({ open: true, anchorEl: document.getElementById('miniCart') });
			setTimeout(function () {
				appComponent.setState({ open: false, anchorEl: null });
			}, 2000);
		}
	}

	render(){
		return ""
	}
}

const mapStatesToProps = state => ({
	cartFromReducer: state.cart.currCart,
	cartErrorFromReducer: state.cart.error
})

export default connect(mapStatesToProps, { fetchCartFromSession })(MiniCartTrigger);