import features from "../features";

/**
 * Tale funkcija se izvaja večkrat na sekundo.
 * Tukaj naj se vpiše vse kar se mora vedno izvajati.
 */

export default function update(wop) {
  return function() {

    // Game frame update logic

    for (var featureName in features) {
      features[featureName].update(wop);
    }

  }
}
