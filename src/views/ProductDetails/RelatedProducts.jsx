import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import NumberFormat from 'react-number-format';

const styles = theme => ({
	root: {
		width: '100%',
		backgroundColor: "#F5F2EA"
	},
	headerGrid: {
		padding: theme.spacing.unit * 3
	},
	grid: {
		padding: theme.spacing.unit * 2,
	},
	card: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	cardMedia: {
		paddingTop: '100%', // 16:9
	},
	cardContent: {
		flexGrow: 1,
	},
	button: {
		margin: theme.spacing.unit,
	},
	media: {
		height: 300
	}
});

class RelatedProducts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { classes, productList, productToNotShow, parent } = this.props;
		const thisVar = parent;
		return (
			<div className={classes.root}>
				<Divider />
				<Grid container justify="center" className={classes.headerGrid}>
					<Typography variant="h4" color="textPrimary">
						You may also like
					</Typography>
				</Grid>
				<Grid container justify="center" alignItems="center">
					{productList && productList.map(function (currProduct) {
						if (productToNotShow && productToNotShow.id === currProduct.id) {
							return ""
						}
						let displayImage = currProduct.masterVariant && currProduct.masterVariant.images && currProduct.masterVariant.images.length > 0 ? currProduct.masterVariant.images[0].url : "assets/img/no-image.jpg";
						let lowerPrice = 0;
						let higherPrice = 0;
						currProduct.masterVariant.prices.map(function (price) {
							lowerPrice = lowerPrice === 0 && price.value.centAmount;
							higherPrice = higherPrice === 0 && price.value.centAmount;
							lowerPrice = lowerPrice < price.value.centAmount ? lowerPrice : price.value.centAmount;
							higherPrice = higherPrice > price.value.centAmount ? higherPrice : price.value.centAmount;
						})
						currProduct.variants.map(currVariant => currVariant.prices.map(function (price) {
							lowerPrice = lowerPrice < price.value.centAmount ? lowerPrice : price.value.centAmount;
							higherPrice = higherPrice > price.value.centAmount ? higherPrice : price.value.centAmount;
						}))
						lowerPrice = lowerPrice / 100;
						higherPrice = higherPrice / 100;
						return (
							<Grid item container key={currProduct.id} sm={6} md={3} lg={2} className={classes.grid} justify="center">
								<Card className={classes.card}>
									<CardMedia
										className={classes.cardMedia}
										image={displayImage}
										title="Image title"
									/>
									<CardContent className={classes.cardContent}>
										<Typography gutterBottom variant="h5" component="h2">
											{currProduct.name.en}
										</Typography>
										<Typography>
											Retail Price:
										</Typography>
										{lowerPrice === higherPrice ? (
											<NumberFormat value={lowerPrice} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
										) : (
												<div>
													<NumberFormat value={lowerPrice} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} /> to <NumberFormat value={higherPrice} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
												</div>
											)}
									</CardContent>
									<CardActions>
										<Button variant="contained" size="small" color="primary" className={classes.button} onClick={() => thisVar.props.history.replace({ pathname: `/product/${currProduct.id}`, productList })}>
											Product Details
                      </Button>
									</CardActions>
								</Card>
							</Grid>
						)
					})}
				</Grid>
			</div>
		);
	}
}

RelatedProducts.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RelatedProducts);