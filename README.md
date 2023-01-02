# JWT Attack

This is a simple tool to test JWT tokens. It can be used to test JWT tokens for vulnerabilities.

JSON Web Tokens (JWTs) provide a way to securely exchange data using JSON objects. They are often used in authorization because they can be signed, verified, and therefore trusted. According to the RFC 7519[1], JWT is a JSON object that consists of three parts: a header, a payload, and a signature.

![JWT](images/jwt_format.webp)

## ATTACK 1: Failing to Verify the Signature: Verify/Decode Confusion
JWT can be modified and still be valid.

Many JWT libraries provide one method to decode the token and another to verify it:
    
```javascript 
    jwt.decode(token, {complete: true});
    jwt.verify(token, secret);
```

Sometimes programmers may combine these techniques. In such an instance, the program will accept any token and the signature won't ever be validated (in a valid format). Additionally, developers may forget to re-enable signature verification after disabling it for testing. Such errors may cause vulnerabilities or unauthorized account access.

## ATTACK 2: JWT Secret Key Brute Forcing
Shorter keys can be brute forced.

Brute forcing a JSON Web Token (JWT) secret is the process of attempting to guess the secret used to sign the JWT through a process of trial and error. This can be done by generating a large number of potential secrets and using them to try and verify the JWT.
RFC 7518 (JSON Web Algorithms)[4] states that “A key of the same size as the hash output (for instance, 256 bits for "HS256") or larger MUST be used with this algorithm.”

*  Example Secure and Unsecure Keys
```javascript
const SECRET_KEY = "verysecretkey";
const SECURE_SECRET_KEY = "6b21c17bec069571d2abbd2a2d9abd22eb0105c4bcfb2393b93cfc217b5160ef"; // sha256 hash of "y0ucann0tcrackth1spassw0rd"
```


# References

1. 2015, RFC 7515: JSON Web Signature (JWS),
https://www.rfc-editor.org/rfc/rfc7515
2. Attacking and Securing JWT,
https://owasp.org/www-chapter-vancouver/assets/presentations/2020-01_Attac
king_and_Securing_JWT.pdf
3. https://jwt.io
4. 2015, RFC 7518: JSON Web Algorithms (JWA),
https://www.rfc-editor.org/rfc/rfc7518#section-3.2
5. https://github.com/wallarm/jwt-secrets/blob/master/jwt.secrets.lis