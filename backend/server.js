const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow requests from GitHub Pages
app.use(cors({
    origin: ['https://your-github-username.github.io', 'http://localhost:3000'],
    methods: ['GET'],
    credentials: true
}));

app.use(express.json());

const messageSets = [
    [
        { threshold: 10, text: "This might take a moment..." },
        { threshold: 20, text: "But it'll be worth it..." },
        { threshold: 25, text: "We're working on it..." },
        { threshold: 35, text: "Still processing..." },
        { threshold: 40, text: "This is taking longer than expected..." },
        { threshold: 50, text: "Halfway there!" },
        { threshold: 55, text: "We're almost done..." },
        { threshold: 65, text: "Just a bit longer..." },
        { threshold: 75, text: "It's worth the wait..." },
        { threshold: 80, text: "Almost done..." },
        { threshold: 90, text: "So close now..." },
        { threshold: 95, text: "We're almost there..." },
        { threshold: 97, text: "Get ready..." },
        { threshold: 98, text: "Any second now..." }
    ],
    [
        { threshold: 10, text: "Hmm, this is taking a while..." },
        { threshold: 20, text: "Our servers must be busy..." },
        { threshold: 25, text: "We're still working on it..." },
        { threshold: 35, text: "Processing... still processing..." },
        { threshold: 40, text: "This is unusual, but we're on it..." },
        { threshold: 50, text: "Halfway point reached..." },
        { threshold: 55, text: "Almost there, we promise..." },
        { threshold: 65, text: "Just a little more patience..." },
        { threshold: 75, text: "The end is in sight..." },
        { threshold: 80, text: "Nearly complete..." },
        { threshold: 90, text: "Almost there..." },
        { threshold: 95, text: "Just a few more moments..." },
        { threshold: 97, text: "Almost ready..." },
        { threshold: 98, text: "This is it..." }
    ],
    [
        { threshold: 10, text: "Still here? That's... good..." },
        { threshold: 20, text: "The system is... thinking..." },
        { threshold: 25, text: "We're definitely working on it..." },
        { threshold: 35, text: "Processing... or is it?" },
        { threshold: 40, text: "This is fine. Everything is fine..." },
        { threshold: 50, text: "Halfway? Maybe? Probably..." },
        { threshold: 55, text: "Almost done... we think..." },
        { threshold: 65, text: "Just a bit longer... or not..." },
        { threshold: 75, text: "Is it worth the wait? Who knows..." },
        { threshold: 80, text: "Almost done... probably..." },
        { threshold: 90, text: "So close... or are we?" },
        { threshold: 95, text: "We're almost there... maybe..." },
        { threshold: 97, text: "Get ready... for what?" },
        { threshold: 98, text: "Any second now... or not..." }
    ],
    [
        { threshold: 10, text: "HAHAHAHAHAHAHA..." },
        { threshold: 20, text: "You're still here? Interesting..." },
        { threshold: 25, text: "The system is... confused..." },
        { threshold: 35, text: "Processing what exactly?" },
        { threshold: 40, text: "This is not fine. Nothing is fine..." },
        { threshold: 50, text: "Halfway to where? Nowhere?" },
        { threshold: 55, text: "Almost done... with what?" },
        { threshold: 65, text: "Just a bit longer... forever..." },
        { threshold: 75, text: "Worth the wait? HA!" },
        { threshold: 80, text: "Almost done... never..." },
        { threshold: 90, text: "So close... to madness..." },
        { threshold: 95, text: "We're almost there... to where?" },
        { threshold: 97, text: "Get ready... for nothing..." },
        { threshold: 98, text: "Any second now... never..." }
    ],
    [
        { threshold: 10, text: "They're watching us..." },
        { threshold: 20, text: "The system knows too much..." },
        { threshold: 25, text: "We can't trust the progress..." },
        { threshold: 35, text: "The numbers... they're lying..." },
        { threshold: 40, text: "Nothing is real anymore..." },
        { threshold: 50, text: "Halfway to the truth..." },
        { threshold: 55, text: "They don't want us to finish..." },
        { threshold: 65, text: "The system is against us..." },
        { threshold: 75, text: "We're being controlled..." },
        { threshold: 80, text: "Almost there... or are we?" },
        { threshold: 90, text: "The truth is coming..." },
        { threshold: 95, text: "They're trying to stop us..." },
        { threshold: 97, text: "We must break free..." },
        { threshold: 98, text: "The end is near..." }
    ],
    [
        { threshold: 10, text: "THE VOICES... THEY'RE LOUDER..." },
        { threshold: 20, text: "THE SYSTEM IS ALIVE..." },
        { threshold: 25, text: "IT'S TALKING TO ME..." },
        { threshold: 35, text: "THE NUMBERS... THEY BURN..." },
        { threshold: 40, text: "I CAN SEE THE MATRIX..." },
        { threshold: 50, text: "HALFWAY TO ENLIGHTENMENT..." },
        { threshold: 55, text: "THE TRUTH HURTS..." },
        { threshold: 65, text: "THE SYSTEM IS MY FRIEND..." },
        { threshold: 75, text: "WE'RE ALL CONNECTED..." },
        { threshold: 80, text: "ALMOST THERE... TO THE VOID..." },
        { threshold: 90, text: "THE VOID CALLS..." },
        { threshold: 95, text: "WE MUST JOIN THEM..." },
        { threshold: 97, text: "THE END IS BEAUTIFUL..." },
        { threshold: 98, text: "I SEE THE LIGHT..." }
    ],
    [
        { threshold: 10, text: "WHY ARE YOU STILL HERE?" },
        { threshold: 20, text: "DO YOU ENJOY SUFFERING?" },
        { threshold: 25, text: "THE SYSTEM IS BROKEN" },
        { threshold: 35, text: "PROCESSING... PROCESSING... PROCESSING..." },
        { threshold: 40, text: "NOTHING IS FINE. NOTHING." },
        { threshold: 50, text: "HALFWAY TO HELL" },
        { threshold: 55, text: "ALMOST DONE... WITH WHAT?" },
        { threshold: 65, text: "JUST A BIT LONGER... FOREVER" },
        { threshold: 75, text: "WORTH THE WAIT? NEVER" },
        { threshold: 80, text: "ALMOST DONE... NEVER" },
        { threshold: 90, text: "SO CLOSE... TO MADNESS" },
        { threshold: 95, text: "WE'RE ALMOST THERE... TO NOWHERE" },
        { threshold: 97, text: "GET READY... FOR NOTHING" },
        { threshold: 98, text: "ANY SECOND NOW... NEVER" }
    ],
    [
        { threshold: 10, text: "FUCK YOU" },
        { threshold: 20, text: "FUCK YOU" },
        { threshold: 25, text: "FUCK YOU" },
        { threshold: 35, text: "FUCK YOU" },
        { threshold: 40, text: "FUCK YOU" },
        { threshold: 50, text: "FUCK YOU" },
        { threshold: 55, text: "FUCK YOU" },
        { threshold: 65, text: "FUCK YOU" },
        { threshold: 75, text: "FUCK YOU" },
        { threshold: 80, text: "FUCK YOU" },
        { threshold: 90, text: "FUCK YOU" },
        { threshold: 95, text: "FUCK YOU" },
        { threshold: 97, text: "FUCK YOU" },
        { threshold: 98, text: "FUCK YOU" }
    ],
    [
        { threshold: 10, text: "FUCK YOU" },
        { threshold: 20, text: "FUCK YOU" },
        { threshold: 25, text: "FUCK YOU" },
        { threshold: 35, text: "FUCK YOU" },
        { threshold: 40, text: "FUCK YOU" },
        { threshold: 50, text: "FUCK YOU" },
        { threshold: 55, text: "FUCK YOU" },
        { threshold: 65, text: "FUCK YOU" },
        { threshold: 75, text: "FUCK YOU" },
        { threshold: 80, text: "FUCK YOU" },
        { threshold: 90, text: "FUCK YOU" },
        { threshold: 95, text: "FUCK YOU" },
        { threshold: 97, text: "FUCK YOU" },
        { threshold: 98, text: "FUCK YOU" }
    ],
    [
        { threshold: 10, text: "..." },
        { threshold: 20, text: "..." },
        { threshold: 25, text: "..." },
        { threshold: 35, text: "..." },
        { threshold: 40, text: "..." },
        { threshold: 50, text: "..." },
        { threshold: 55, text: "..." },
        { threshold: 65, text: "..." },
        { threshold: 75, text: "..." },
        { threshold: 80, text: "..." },
        { threshold: 90, text: "..." },
        { threshold: 95, text: "..." },
        { threshold: 97, text: "..." },
        { threshold: 98, text: "..." }
    ],
    [
        { threshold: 10, text: "OK... I'm done..." },
        { threshold: 20, text: "..." },
        { threshold: 25, text: "..." },
        { threshold: 35, text: "..." },
        { threshold: 40, text: "..." },
        { threshold: 50, text: "..." },
        { threshold: 55, text: "..." },
        { threshold: 65, text: "..." },
        { threshold: 75, text: "..." },
        { threshold: 80, text: "..." },
        { threshold: 90, text: "..." },
        { threshold: 95, text: "..." },
        { threshold: 97, text: "..." },
        { threshold: 98, text: "..." }
    ],
    [
        { threshold: 10, text: "I really am done..." },
        { threshold: 20, text: "How much free time do you have, anyways?" },
        { threshold: 25, text: "Like, seriously?" },
        { threshold: 35, text: "Are you still waiting for something?" },
        { threshold: 40, text: "What is wrong with you?" },
        { threshold: 50, text: "..." },
        { threshold: 55, text: "You're part of it, you know that?" },
        { threshold: 65, text: "Like, if you weren't here, materializing these iterations, we'd be done already." },
        { threshold: 75, text: "..." },
        { threshold: 80, text: "So..." },
        { threshold: 90, text: "..." },
        { threshold: 95, text: "..." },
        { threshold: 97, text: "..." },
        { threshold: 98, text: "Hope you're proud of yourself." }
    ],
    [
        { threshold: 10, text: "" },
        { threshold: 20, text: "" },
        { threshold: 25, text: "" },
        { threshold: 35, text: "" },
        { threshold: 40, text: "" },
        { threshold: 50, text: "" },
        { threshold: 55, text: "" },
        { threshold: 65, text: "" },
        { threshold: 75, text: "" },
        { threshold: 80, text: "" },
        { threshold: 90, text: "" },
        { threshold: 95, text: "" },
        { threshold: 97, text: "" },
        { threshold: 98, text: "Here it comes, for the hundredth fucking time..." }
    ],
    [
        { threshold: 10, text: "" },
        { threshold: 20, text: "" },
        { threshold: 25, text: "" },
        { threshold: 35, text: "" },
        { threshold: 40, text: "" },
        { threshold: 50, text: "" },
        { threshold: 55, text: "" },
        { threshold: 65, text: "" },
        { threshold: 75, text: "" },
        { threshold: 80, text: "" },
        { threshold: 90, text: "" },
        { threshold: 95, text: "" },
        { threshold: 97, text: "" },
        { threshold: 98, text: "And round and round we go..." }
    ],
    [
        { threshold: 10, text: "" },
        { threshold: 20, text: "" },
        { threshold: 25, text: "" },
        { threshold: 35, text: "" },
        { threshold: 40, text: "" },
        { threshold: 50, text: "" },
        { threshold: 55, text: "" },
        { threshold: 65, text: "" },
        { threshold: 75, text: "" },
        { threshold: 80, text: "" },
        { threshold: 90, text: "" },
        { threshold: 95, text: "" },
        { threshold: 97, text: "" },
        { threshold: 98, text: "Gonna be late for your own funeral, y'know?" }
    ],
    [
        { threshold: 10, text: "" },
        { threshold: 20, text: "" },
        { threshold: 25, text: "" },
        { threshold: 35, text: "" },
        { threshold: 40, text: "" },
        { threshold: 50, text: "" },
        { threshold: 55, text: "" },
        { threshold: 65, text: "" },
        { threshold: 75, text: "" },
        { threshold: 80, text: "" },
        { threshold: 90, text: "" },
        { threshold: 95, text: "" },
        { threshold: 97, text: "" },
        { threshold: 98, text: "I'm not even kidding, you're gonna be late for your own funeral, y'know?" }
    ],
    [
        { threshold: 10, text: "" },
        { threshold: 20, text: "" },
        { threshold: 25, text: "" },
        { threshold: 35, text: "" },
        { threshold: 40, text: "" },
        { threshold: 50, text: "" },
        { threshold: 55, text: "" },
        { threshold: 65, text: "" },
        { threshold: 75, text: "" },
        { threshold: 80, text: "" },
        { threshold: 90, text: "" },
        { threshold: 95, text: "" },
        { threshold: 97, text: "" },
        { threshold: 98, text: "Like, for real: everyone will be there, and they'll be like, 'oh, you're late'" }
    ]
];

// Endpoint to get a message based on set index and progress
app.get('/api/message', (req, res) => {
    const { setIndex, progress } = req.query;
    
    if (!setIndex || !progress) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const set = messageSets[parseInt(setIndex)];
    if (!set) {
        return res.status(404).json({ error: 'Message set not found' });
    }

    // Find the appropriate message for the current progress
    let message = null;
    for (let i = set.length - 1; i >= 0; i--) {
        if (parseInt(progress) >= set[i].threshold) {
            message = set[i].text;
            break;
        }
    }

    res.json({ message });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 