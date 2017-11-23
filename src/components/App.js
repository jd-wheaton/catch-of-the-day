import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {
  constructor() {
    super();
    // bind methods to App class
    this.addFish = this.addFish.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);

    // set initial state
    this.state = {
      fishes: {},
      order: {}
    };
  }

  componentWillMount() {
    // executes just before App is rendered
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`
      , {
        context: this,
        state: 'fishes'
      });

    // check for order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if(localStorageRef) {
      // update App order state
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    // make copy of fishes state
    const fishes = { ...this.state.fishes };
    // add in new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    // set fishes state
    this.setState({ fishes })
  }

  updateFish(key, updatedFish) {
    const fishes = { ...this.state.fishes };
    fishes[key] = updatedFish;
    this.setState({ fishes });
  }

  removeFish(key) {
    const fishes = { ...this.state.fishes };
    fishes[key] = null;
    this.setState({ fishes });
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder(key) {
    // make copy of order state
    const order = { ...this.state.order };
    // update or add new number of fish ordered
    order[key] = order[key] + 1 || 1;
    // update order state
    this.setState({ order });
  }

  removeFromOrder(key) {
    const order = { ...this.state.order };
    delete order[key];
    this.setState({ order });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fish">
            {
              Object
                .keys(this.state.fishes)
                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
            } 
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.params}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          addFish={ this.addFish }
          loadSamples={ this.loadSamples }
          fishes={ this.state.fishes }
          updateFish={ this.updateFish }
          removeFish={ this.removeFish }
        />
      </div>
    )
  }
}

export default App;
