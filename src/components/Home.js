import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import settings from "../../settings";
const { API_ROOT } = settings[process.env.NODE_ENV];

import Favourite from "./Favourite";
import AddToCollection from "./AddToCollection";
import Nav from "./Nav";

class Home extends React.Component {
  state = {
    selectedFavourite: null,
    modalIsOpen: false,
    favourites: [],
    user: {}
  };

  openModal = favourite => {
    this.setState({ modalIsOpen: true, selectedFavourite: favourite._id });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false, selectedFavourite: null });
  };

  afterOpenModal = () => {};

  componentDidMount = () => {
    this.fetchFavourites();
    this.fetchUserData();
  };

  fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/api/profile`, {
        withCredentials: true
      });
      this.setState({
        user: res.data.profile
      });
    } catch (err) {
      if (!err.response) throw err;
    }
  };

  removeFavouriteFromList = favouriteId => {
    const filtered = this.state.favourites.filter(f => f._id !== favouriteId);
    this.setState({
      favourites: filtered
    });
  };

  fetchFavourites = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/api/favorites`, {
        withCredentials: true
      });
      this.setState({
        favourites: res.data.favorites
      });
    } catch (err) {
      if (!err.response) throw err;
    }
  };

  render() {
    return (
      <div>
        <AddToCollection
          isOpen={this.state.modalIsOpen}
          closeModal={this.closeModal}
          afterOpenModal={this.afterOpenModal}
          collections={this.props.collections}
          selectedFavouriteId={this.state.selectedFavourite}
          removeFavouriteFromList={this.removeFavouriteFromList}
        />

        <Nav path={this.props.location.pathname} />
        <div className="container">
          <h1 style={{ textAlign: "center" }}>Recent Favourites to Process</h1>

          <div>
            {this.state.favourites.map((f, i) => {
              return (
                <Favourite key={f.id_str} data={f} openModal={this.openModal} />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    collections: PropTypes.array.isRequired
  };
}

export default Home;
