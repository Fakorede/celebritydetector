import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Celebrity from "./components/Celebrity/Celebrity";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import "./App.css";

import Particles from "react-particles-js";

import Clarifai from "clarifai";

// initialize with your api key. This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
  apiKey: "74da170c6d834437bb625c343bdeb726"
});

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enabled: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: "",
      stats: "",
      route: "signin",
      isSignedIn: "false"
    };
  }

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  detectCelebrity = data => {
    let celebrityName =
      data.outputs[0].data.regions[0].data.face.identity.concepts[0].name;
    celebrityName =
      celebrityName.charAt(0).toUpperCase() +
      celebrityName.substring(1).toUpperCase();
    let celebrityProbability =
      data.outputs[0].data.regions[0].data.face.identity.concepts[0].value;

    return {
      name: celebrityName,
      value: celebrityProbability * 100
    };
  };

  displayCelebrityStats = stats => {
    this.setState({ stats: stats });
  };

  displayFaceBox = box => {
    this.setState({ box: box });
  };

  onInputChange = e => {
    this.setState({ input: e.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict("e466caa0619f444ab97497640cefc4dc", this.state.input)
      .then(response => {
        this.displayFaceBox(this.calculateFaceLocation(response));
        this.displayCelebrityStats(this.detectCelebrity(response));
      })
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box, stats } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <Celebrity stats={stats} />
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </div>
        ) : route === "signin" ? (
          <Signin onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
