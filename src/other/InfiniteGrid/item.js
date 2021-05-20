import React from 'react';
import {isEqual} from 'lodash';

export default class Item extends React.Component {

	constructor(props) {
		super(props);
	}

	_itemWidth() {
		return this.props.dimensions.gridWidth / this.props.dimensions.itemsPerRow;
	}

	_itemLeft() {
		var column = this.props.index % this.props.dimensions.itemsPerRow;
		return column * (this.props.dimensions.gridWidth / this.props.dimensions.itemsPerRow);
	}

	_itemTop() {
		return Math.floor(this.props.index / this.props.dimensions.itemsPerRow) * this.props.dimensions.height;
	}

	// LIFECYCLE

	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(this.props, nextProps);
	}

	// RENDER

	render() {
		const _style = {
			width: this._itemWidth() - this.props.padding,
			height: this.props.dimensions.height - this.props.padding,
			left: this._itemLeft(),
			top: this._itemTop(),
			position: 'absolute'
		};

		var props = {
			className: 'item',
			style: _style
		};

		return (
			<div {...props}>
				<div>{this.props.data}</div>
			</div>
		);

	}
}