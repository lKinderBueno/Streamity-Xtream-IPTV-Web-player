import React from 'react';
import {isEqual} from 'lodash';
import Item from './item';

export default class InfiniteGrid extends React.Component {

	initialState() {
		return {
			initiatedLazyload: false,
			minHeight: window.innerHeight * 2,
			minItemIndex: 0,
			maxItemIndex: 100,
			itemDimensions: {
				height: this._itemHeight(),
				width: this._itemHeight(),
				gridWidth: 0,
				itemsPerRow: 2,
			},
		};
	}

	constructor(props) {
		super(props);
		this.state = this.initialState();
		// bind the functions
		this._scrollListener = this._scrollListener.bind(this);
		this._updateItemDimensions = this._updateItemDimensions.bind(this);
		this._resizeListener = this._resizeListener.bind(this);
		this._visibleIndexes = this._visibleIndexes.bind(this);
	}

		// METHODS

	_wrapperStyle() {
		return {
			maxHeight: this._getGridHeight(),
			overflowY: 'scroll',
			width: '100%',
			height: this.props.wrapperHeight,
			WebkitOverflowScrolling: true,
		};
	}

	_gridStyle() {
		return {
			position: 'relative',
			marginTop: this.props.padding,
			marginLeft: this.props.padding,
			minHeight: this._getGridHeight(),
		};
	}

	_getGridRect() {
		return this.refs.grid.getBoundingClientRect();
	}

	_getGridHeight() {
		return (this.props.entries.length < this.state.itemDimensions.itemsPerRow) ?
			this.state.itemDimensions.height :
			Math.floor(this.props.entries.length / this.state.itemDimensions.itemsPerRow) * this.state.itemDimensions.height;
	}

	_getWrapperRect() {
		return this.refs.wrapper.getBoundingClientRect();
	}

	_visibleIndexes() {
		var itemsPerRow = this._itemsPerRow();

		// The number of rows that the user has scrolled past
		var scrolledPast = (this._scrolledPastRows() * itemsPerRow);
		if (scrolledPast < 0) scrolledPast = 0;

		// If i have scrolled past 20 items, but 60 are visible on screen,
		// we do not want to change the minimum
		var min = scrolledPast - itemsPerRow;
		if (min < 0) min = 0;

		// the maximum should be the number of items scrolled past, plus some
		// buffer
		var bufferRows = this._numVisibleRows() + this.props.buffer;
		var max = scrolledPast + (itemsPerRow * bufferRows);
		if (max > this.props.entries.length) max = this.props.entries.length;

		this.setState({
			minItemIndex: min,
			maxItemIndex: max,
		}, function() {
			this._lazyCallback();
		});
	}

	_updateItemDimensions() {
		this.setState({
			itemDimensions: {
				height: this._itemHeight(),
				width: this._itemHeight(),
				gridWidth: this._getGridRect().width,
				itemsPerRow: this._itemsPerRow(),
			},
			minHeight: this._totalRows(),
		});
	}

	_itemsPerRow() {
		return Math.floor(this._getGridRect().width / this._itemWidth());
	}

	_totalRows() {
		const scrolledPastHeight = (this.props.entries.length / this._itemsPerRow()) * this._itemHeight();
		if (scrolledPastHeight < 0) return 0;
		return scrolledPastHeight;
	}

	_scrolledPastRows() {
		const rect = this._getGridRect();
		const topScrollOffset = rect.height - rect.bottom;
		return Math.floor(topScrollOffset / this._itemHeight());
	}

	_itemHeight() {
		return this.props.height + (2 * this.props.padding);
	}

	_itemWidth() {
		return this.props.width + (2 * this.props.padding);
	}

	_numVisibleRows() {
		return Math.ceil(this._getWrapperRect().height / this._itemHeight());
	}

	_lazyCallback() {
		if (!this.state.initiatedLazyload && (this.state.maxItemIndex === this.props.entries.length) && this.props.lazyCallback) {
			this.setState({initiatedLazyload: true });
			this.props.lazyCallback(this.state.maxItemIndex);
		}
	}

	// LIFECYCLE

	componentWillMount() {
		window.addEventListener('resize', this._resizeListener);
	}

	componentDidMount() {
		this._updateItemDimensions();
		this._visibleIndexes();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.entries.length > this.props.entries.length) {
			this.setState({
				initiatedLazyload: false,
			});
		}
		// Update these all the time because entries may change on the fly.
		// this._updateItemDimensions();
		this._visibleIndexes();
	}

	componentDidUpdate(prevProps, prevState) {
		if (typeof this.props.renderRangeCallback === 'function') {
			this.props.renderRangeCallback(this.state.minItemIndex, this.state.maxItemIndex);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(this.state, nextState);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this._resizeListener);
	}

	// LISTENERS

	_scrollListener(event) {
		clearTimeout(this.scrollOffset);
		this.scrollOffset = setTimeout(() => {
			this._visibleIndexes();
		}, 10);
	}

	_resizeListener(event) {
			if (!this.props.wrapperHeight) {
					this.setState({
							wrapperHeight: window.innerHeight,
					});
			}
			this._updateItemDimensions();
			this._visibleIndexes();
	}

	// RENDER

	render() {
		var entries = [];

		// if no entries exist, there's nothing left to do
		if (!this.props.entries.length) {
			return null;
		}

		for (let i = this.state.minItemIndex; i <= this.state.maxItemIndex; i++) {
			let entry = this.props.entries[i];
			if (!entry) {
				continue;
			}
			const itemProps = {
				key: 'item-' + i,
				index: i,
				padding: this.props.padding,
				dimensions: this.state.itemDimensions,
				data: entry
			};
			entries.push(<Item {...itemProps} />);
		}
		return (
			<div className='infinite-grid-wrapper' ref='wrapper' onScroll={this._scrollListener} style={this._wrapperStyle()}>
				<div ref='grid' className='infinite-grid' style={this._gridStyle()}>
					{entries}
				</div>
			</div>
		);

	}

};

InfiniteGrid.defaultProps = {
	buffer: 10,
	padding: 10,
	entries: [],
	height: 250,
	width: 250
}