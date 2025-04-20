// Define the data structures
struct Share {
    x: u64,
    y: [u64; 32],
}

fn main(
    secret: [u64; 32], // Array of 32 secret integers
    a1: [u64; 32] // Array of first coefficients for each secret
) -> pub [Share; 3] {
    // Verify each secret value is in valid range
    for i in 0..32 {
        assert(secret[i] < 7919);
    }

    // Create array to store all shares
    let mut shares: [Share; 3] = [
        Share { x: 0, y: [0; 32] },
        Share { x: 0, y: [0; 32] },
        Share { x: 0, y: [0; 32] }
    ];

    // Generate shares for each x value
    shares[0] = create_share_array(1, secret, a1);
    shares[1] = create_share_array(2, secret, a1);
    shares[2] = create_share_array(3, secret, a1);

    shares
}

fn create_share_array(x: u64, secret: [u64; 32], a1: [u64; 32]) -> Share {
    let x_field = x;

    let mut y_values: [u64; 32] = [0; 32];

    // Create share for each secret value
    for i in 0..32 {
        // Evaluate polynomial f(x) = secret + a1*x for each secret
        y_values[i] = secret[i] + 
                      (a1[i] * x_field); // 2 threshold
    }

    Share { x: x_field, y: y_values }
}
