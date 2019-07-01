import React from 'react';
import { connect } from 'react-redux';
import { fetchCartFromSession } from '../../actions/cartActions';

class MiniCartTrigger extends React.Component {
	constructor(props){
		super(props);
	}

	componentWillMount() {
		this.props.fetchCartFromSession();
	}

	componentWillReceiveProps(nextProps) {
		let { cartFromReducer, parent } = nextProps;
		let showOnPage = window.location.hash.indexOf('product') != -1;
		if (cartFromReducer.id && showOnPage) {
			parent.setState({ open: true, anchorEl: document.getElementById('miniCart') });
			setTimeout(function () {
				parent.setState({ open: false, anchorEl: null });
			}, 3000);
		}
	}

	render() {
		return ""
	}
}

const mapStatesToProps = state => ({
	cartFromReducer: state.cart.currCart,
	cartErrorFromReducer: state.cart.error
})

export default connect(mapStatesToProps, { fetchCartFromSession })(MiniCartTrigger);