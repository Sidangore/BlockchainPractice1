# Project 1 : Astronomy 

## What will the app do:-
    1. will create the Genesis block on running the application
    2. the user will request the application to send a message to be signed using Wallet and this way verify the ownership of the Wallet Address.
        - Message format : <WALLET_ADDRESS>:${new Date().getTime().toString().slice(0, -3)}:starRegistry;
    3. Once the user has the message they can use ELectrum or Bitcoin core to sign the message.
    4. The user will try to submit the star object.
        - Submission will consist:-
            - wallet address
            - signature
            - message
            - star object 
                - "star" {
                    "dec": "<coordinates>",
                    "ra": "<time>",
                    "story": "This is a test"
                }
    5. The Application will verify the time elapsed from the request of the ownership and the time when you submit the star is < 5 mins.
    6. If everything is okay the star will be stored in the block and added in the chain, encoding the start information.
    7. The application will allow us to retrieve Star Object belong to an owner(Wallet Address). Decoded to human readable format.
    