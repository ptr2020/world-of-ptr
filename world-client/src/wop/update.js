import features from "../features";

export default function update(wop) {
  return function() {

    // Game frame update logic

    for (var featureName in features) {
      features[featureName].update(wop);
    }

  }
}
