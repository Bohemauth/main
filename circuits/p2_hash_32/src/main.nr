use dep::std::hash::poseidon2;

/**
* @notice Poseidon2 Hash used in most of the current circuit with 32 inputs
*/
fn main(inputs: [Field; 32]) -> pub Field {
    let hash = poseidon2::Poseidon2::hash(inputs, 32);

    hash
}
